import logging

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import ChatRequest, ChatResponse, map_course_to_frontend
from app.services.claude_service import question_to_sql, validate_sql_result
from app.services.search_service import detect_semester_intent, get_semester_courses

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("")
def chat(body: ChatRequest, db: Session = Depends(get_db)):
    """BE-15: Accept natural language, fast-path first, then Claude Text-to-SQL fallback."""

    # ── Fast path: structured intent routing ──────────────────
    intent = detect_semester_intent(body.message)

    if intent and intent["intent"] == "semester_curriculum":
        prog_code = intent.get("program_code")
        sem = intent["semester"]
        if prog_code:
            try:
                courses = get_semester_courses(db, prog_code, prog_code, 2024, sem)
                frontend_courses = [map_course_to_frontend(c) for c in courses]
                total_credits = sum(c["credits"] for c in frontend_courses)
                return ChatResponse(
                    answer=f"Found {len(courses)} courses in semester {sem}.",
                    source="structured_api",
                    courses=frontend_courses,
                    summary={"totalCourses": len(courses), "totalCredits": total_credits},
                    provenance=frontend_courses[0].get("provenance") if frontend_courses else None,
                    raw_data=courses,
                )
            except Exception:
                logger.warning("Fast-path failed, falling back to Claude", exc_info=True)
        else:
            return ChatResponse(
                answer=f"Which program for semester {sem}?",
                source="structured_api",
                courses=[],
                summary=None,
            )

    # ── Fallback: Claude Text-to-SQL (BE-15) ──────────────────
    sql = question_to_sql(body.message)
    if not sql:
        return ChatResponse(
            answer="I couldn't understand that question. Try asking about courses, credits, or programs.",
            source="claude_text_to_sql",
            sql_query=None,
            courses=[],
            summary=None,
        )

    try:
        result = db.execute(text(sql))
        columns = result.keys()
        rows = result.fetchall()

        # BE-16: Validate and sanitize Claude output
        validation = validate_sql_result(sql, columns, rows)
        if not validation["valid"]:
            return ChatResponse(
                answer="I generated a query but it failed validation.",
                source="claude_text_to_sql",
                sql_query=sql,
                courses=[],
                summary=None,
                raw_data={"error": validation.get("error")},
            )

        sanitized = validation["sanitized_data"]
        answer = f"Query returned {len(sanitized)} result(s)."
        return ChatResponse(
            answer=answer,
            sql_query=sql,
            source="claude_text_to_sql",
            courses=[],
            summary=None,
            raw_data=sanitized,
        )
    except Exception as exc:
        logger.error("SQL execution failed: %s", exc)
        return ChatResponse(
            answer="I found a possible query but it couldn't run. Try rephrasing.",
            source="claude_text_to_sql",
            sql_query=sql,
            courses=[],
            summary=None,
            raw_data={"error": str(exc)},
        )
