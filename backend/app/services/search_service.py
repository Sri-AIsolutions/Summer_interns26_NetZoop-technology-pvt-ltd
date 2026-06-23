from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import func, text
from sqlalchemy.orm import Session

from app.models import Branch, Course, CourseAlias, CurriculumDocument, LabCompanion, Prerequisite, Program


def _build_provenance(course: Course) -> dict:
    return {
        "batch_year": course.batch_year,
        "program_code": course.program.code,
        "program_name": course.program.name,
        "branch_code": course.branch.code,
        "branch_name": course.branch.name,
        "source_url": course.curriculum_document.source_url,
    }


def _course_to_dict(course: Course) -> dict:
    return {
        "id": str(course.id),
        "course_code": course.course_code,
        "title": course.title,
        "l": course.l,
        "t": course.t,
        "p": course.p,
        "credits": float(course.credits),
        "category": course.category,
        "description": course.description,
        "program_id": str(course.program_id),
        "branch_id": str(course.branch_id),
        "batch_year": course.batch_year,
        "semester": course.semester,
        "curriculum_document_id": str(course.curriculum_document_id),
        "is_active": course.is_active,
        "created_at": course.created_at.isoformat(),
        "updated_at": course.updated_at.isoformat(),
        "provenance": _build_provenance(course),
    }


# ── BE-01 / BE-06: 3-layer search ──────────────────────────────

def search_courses(db: Session, query: str, page: int = 1, limit: int = 20) -> Tuple[List[dict], int]:
    q = query.strip()
    seen_ids: set = set()
    results: List[dict] = []

    # Layer 1: exact course_code match
    exact = (
        db.query(Course)
        .filter(Course.course_code == q, Course.is_active.is_(True))
        .order_by(Course.semester)
        .all()
    )
    for c in exact:
        if c.id not in seen_ids:
            results.append(_course_to_dict(c))
            seen_ids.add(c.id)

    # Layer 2: alias match (legacy, cross_listed, abbreviation)
    alias_courses = (
        db.query(Course)
        .join(CourseAlias)
        .filter(CourseAlias.alias.ilike(q), Course.is_active.is_(True))
        .order_by(Course.semester)
        .all()
    )
    for c in alias_courses:
        if c.id not in seen_ids:
            results.append(_course_to_dict(c))
            seen_ids.add(c.id)

    # Layer 3: PostgreSQL full-text search
    tsquery = func.plainto_tsquery("english", q)
    tsvector = func.to_tsvector("english", Course.title + " " + Course.course_code)
    fts = (
        db.query(Course, func.ts_rank(tsvector, tsquery).label("rank"))
        .filter(tsvector.op("@@")(tsquery), Course.is_active.is_(True))
        .order_by(text("rank DESC"))
        .all()
    )
    for c, _ in fts:
        if c.id not in seen_ids:
            results.append(_course_to_dict(c))
            seen_ids.add(c.id)

    total = len(results)
    offset = (page - 1) * limit
    paged = results[offset : offset + limit]
    return paged, total


# ── BE-04: Semester curriculum ────────────────────────────────

def get_semester_courses(
    db: Session, program_code: str, branch_code: str, batch_year: int, semester: int
) -> List[dict]:
    courses = (
        db.query(Course)
        .join(Program)
        .join(Branch)
        .filter(
            Program.code == program_code,
            Branch.code == branch_code,
            Course.batch_year == batch_year,
            Course.semester == semester,
            Course.is_active.is_(True),
        )
        .order_by(Course.course_code)
        .all()
    )
    return [_course_to_dict(c) for c in courses]


# ── BE-03: Category-filtered query ───────────────────────────

def get_courses_by_category(
    db: Session, program_code: str, branch_code: str, batch_year: int,
    semester: int, category: str,
) -> List[dict]:
    courses = (
        db.query(Course)
        .join(Program)
        .join(Branch)
        .filter(
            Program.code == program_code,
            Branch.code == branch_code,
            Course.batch_year == batch_year,
            Course.semester == semester,
            Course.category == category,
            Course.is_active.is_(True),
        )
        .order_by(Course.course_code)
        .all()
    )
    return [_course_to_dict(c) for c in courses]


# ── BE-05: Graduation credits ─────────────────────────────────

def get_graduation_credits(db: Session, program_code: str) -> dict:
    total = (
        db.query(func.sum(Course.credits))
        .join(Program)
        .filter(Program.code == program_code, Course.is_active.is_(True))
        .scalar()
        or 0
    )
    program = db.query(Program).filter(Program.code == program_code).first()
    return {
        "program_code": program_code,
        "program_name": program.name if program else "",
        "total_credits": float(total),
    }


# ── BE-09: Multi-program credits ──────────────────────────────

def get_all_program_credits(db: Session) -> List[dict]:
    programs = db.query(Program).all()
    result = []
    for p in programs:
        total = (
            db.query(func.sum(Course.credits))
            .filter(Course.program_id == p.id, Course.is_active.is_(True))
            .scalar()
            or 0
        )
        result.append({
            "program_code": p.code,
            "program_name": p.name,
            "total_credits": float(total),
        })
    return result


# ── BE-08: Distribution aggregation ───────────────────────────

def get_distribution(
    db: Session, program_code: str, branch_code: str, batch_year: int
) -> List[dict]:
    rows = (
        db.query(
            Course.category,
            Course.semester,
            func.count(Course.id).label("course_count"),
            func.sum(Course.credits).label("total_credits"),
        )
        .join(Program)
        .join(Branch)
        .filter(
            Program.code == program_code,
            Branch.code == branch_code,
            Course.batch_year == batch_year,
            Course.is_active.is_(True),
        )
        .group_by(Course.category, Course.semester)
        .order_by(Course.semester, Course.category)
        .all()
    )
    return [
        {
            "category": r.category,
            "semester": r.semester,
            "course_count": r.course_count,
            "total_credits": float(r.total_credits),
        }
        for r in rows
    ]


# ── BE-11: Category split per semester ────────────────────────

def get_category_split(
    db: Session, program_code: str, branch_code: str, batch_year: int
) -> List[dict]:
    rows = (
        db.query(
            Course.semester,
            Course.category,
            func.count(Course.id).label("count"),
            func.sum(Course.credits).label("credits"),
        )
        .join(Program)
        .join(Branch)
        .filter(
            Program.code == program_code,
            Branch.code == branch_code,
            Course.batch_year == batch_year,
            Course.is_active.is_(True),
        )
        .group_by(Course.semester, Course.category)
        .order_by(Course.semester, Course.category)
        .all()
    )

    sem_map: dict = {}
    for r in rows:
        if r.semester not in sem_map:
            sem_map[r.semester] = {
                "semester": r.semester,
                "core": 0, "elective": 0, "lab": 0, "audit": 0,
                "core_credits": 0.0, "elective_credits": 0.0,
                "lab_credits": 0.0, "audit_credits": 0.0,
            }
        cat = r.category.lower()
        sem_map[r.semester][cat] = r.count
        sem_map[r.semester][f"{cat}_credits"] = float(r.credits)

    return sorted(sem_map.values(), key=lambda x: x["semester"])


# ── BE-07: Course relationships ───────────────────────────────

def get_course_relationships(db: Session, course_code: str) -> dict:
    course = db.query(Course).filter(Course.course_code == course_code, Course.is_active.is_(True)).first()
    if not course:
        return {"prerequisites": [], "lab_companions": []}

    prereqs = (
        db.query(Course)
        .join(
            Course.prerequisite_for,
            Course.id == Prerequisite.prerequisite_course_id,
        )
        .filter(Prerequisite.course_id == course.id, Course.is_active.is_(True))
        .all()
    )
    lab_comps = (
        db.query(Course)
        .join(
            Course.lab_companions_theory,
            Course.id == LabCompanion.lab_course_id,
        )
        .filter(LabCompanion.theory_course_id == course.id, Course.is_active.is_(True))
        .all()
    )

    return {
        "prerequisites": [_course_to_dict(c) for c in prereqs],
        "lab_companions": [_course_to_dict(c) for c in lab_comps],
    }


# ── Helpers for chat intent routing ───────────────────────────

def detect_semester_intent(message: str) -> Optional[dict]:
    """Return structured params if message matches a semester curriculum query."""
    import re

    m = re.search(r"(?:semester|sem|year)\s*(\d+)", message, re.IGNORECASE)
    if not m:
        return None
    semester = int(m.group(1))
    # Try to extract program code
    prog = None
    for code in re.findall(r"\b(CSE|ECE|EEE|ME|CE|BTECH|B\.Tech)\b", message, re.IGNORECASE):
        prog = code.upper()
        break
    return {"intent": "semester_curriculum", "program_code": prog, "semester": semester}
