import json
import re
from typing import Any, Optional

import anthropic

from app.config import settings

SYSTEM_PROMPT = """You are a SQL query generator for a university curriculum database.

Given a natural language question about courses, credits, programs, or curricula,
generate a PostgreSQL query that answers it.

Database schema:
- programs(id UUID, name VARCHAR, code VARCHAR UNIQUE, duration_years INT)
- branches(id UUID, program_id UUID FK, name VARCHAR, code VARCHAR)
- curriculum_documents(id UUID, program_id UUID FK, branch_id UUID FK, batch_year INT, source_url TEXT)
- courses(id UUID, course_code VARCHAR, title VARCHAR, l INT, t INT, p INT, credits NUMERIC(3,1), category VARCHAR CHECK('Core','Elective','Lab','Audit'), description TEXT, program_id UUID FK, branch_id UUID FK, batch_year INT, semester INT, curriculum_document_id UUID FK, is_active BOOLEAN)
- course_aliases(id UUID, course_id UUID FK, alias VARCHAR, alias_type VARCHAR CHECK('legacy','cross_listed','abbreviation'))
- prerequisites(id UUID, course_id UUID FK, prerequisite_course_id UUID FK)
- lab_companions(id UUID, theory_course_id UUID FK, lab_course_id UUID FK)

Rules:
1. Only return the raw SQL query, nothing else — no markdown, no explanation.
2. Always filter "WHERE is_active = true" for courses.
3. Program codes are uppercase (CSE, ECE, etc.). Branch codes are also uppercase.
4. Use ILIKE for fuzzy text matching.
5. Use to_tsvector/to_tsquery for full-text search when appropriate.
6. Use proper JOINs. Prefer program.code and branch.code for lookups.
7. For credit questions, use SUM(credits) and GROUP BY as needed.
8. Return columns with readable aliases.
9. If you cannot generate a safe query (e.g., the question is unrelated), return: -- UNANSWERABLE: <reason>"""


def _extract_sql(text: str) -> str:
    """Extract SQL from Claude response, stripping markdown fences if present."""
    cleaned = text.strip()
    # Remove markdown code fences
    cleaned = re.sub(r"^```(?:sql)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    return cleaned.strip()


def question_to_sql(question: str) -> Optional[str]:
    """Send a natural-language question to Claude and return the generated SQL."""
    if not settings.claude_api_key:
        return None

    client = anthropic.Anthropic(api_key=settings.claude_api_key)
    response = client.messages.create(
        model=settings.claude_model,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": question}],
    )
    text = response.content[0].text
    sql = _extract_sql(text)
    if sql.startswith("-- UNANSWERABLE"):
        return None
    return sql


def validate_sql_result(sql: str, columns: list, rows: list) -> dict:
    """BE-16: Validate Claude-generated SQL results before returning to frontend.

    Returns a dict with 'valid' bool and 'sanitized_data' containing
    the result if valid, or an error message.
    """
    if not rows:
        return {"valid": True, "sanitized_data": []}

    allowed_keywords = [
        "SELECT", "FROM", "WHERE", "JOIN", "LEFT", "INNER", "ON", "AND", "OR",
        "NOT", "IN", "LIKE", "ILIKE", "BETWEEN", "IS", "NULL", "AS", "ORDER",
        "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "COUNT", "SUM", "AVG",
        "MIN", "MAX", "DISTINCT", "TRUE", "FALSE", "CAST", "::",
    ]
    sql_upper = sql.upper()
    dangerous = ["DELETE", "DROP", "INSERT", "UPDATE", "TRUNCATE", "ALTER", "CREATE"]
    for kw in dangerous:
        if kw in sql_upper:
            return {"valid": False, "error": f"Query contains unsafe keyword: {kw}"}

    # Sanitize: ensure all values are JSON-serializable primitives
    sanitized = []
    for row in rows:
        cleaned = {}
        for key, val in zip(columns, row):
            if isinstance(val, (str, int, float, bool)):
                cleaned[key] = val
            elif val is None:
                cleaned[key] = None
            else:
                cleaned[key] = str(val)
        sanitized.append(cleaned)

    return {"valid": True, "sanitized_data": sanitized}
