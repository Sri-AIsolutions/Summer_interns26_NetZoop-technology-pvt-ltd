from fastapi import APIRouter, Depends, HTTPException, Query
<<<<<<< HEAD
from sqlalchemy.orm import Session, joinedload
=======
from sqlalchemy.orm import Session
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c

from app.database import get_db
from app.models import Branch, Course, Program
from app.schemas import CourseRelationshipResponse, CourseResponse, map_course_to_frontend
from app.services.search_service import get_course_relationships

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("/{course_code}/relationships")
def course_relationships(
    course_code: str,
    db: Session = Depends(get_db),
):
    """BE-07: Given a course code, return prerequisites and lab companions."""
    result = get_course_relationships(db, course_code)
    return CourseRelationshipResponse(
        prerequisites=[CourseResponse(**c) for c in result["prerequisites"]],
        lab_companions=[CourseResponse(**c) for c in result["lab_companions"]],
    )


@router.get("/preview")
def course_preview(
    program: str = Query(..., description="Program code, e.g. CSE"),
    branch: str = Query(..., description="Branch code, e.g. CSE"),
    batch_year: int = Query(..., alias="batch_year"),
    limit: int = Query(6, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """FIX 3A: Return the first N courses across all semesters — for home page preview."""
    courses = (
        db.query(Course)
<<<<<<< HEAD
        .options(joinedload(Course.program), joinedload(Course.branch), joinedload(Course.curriculum_document))
        .join(Program)
        .join(Branch, Course.branch_id == Branch.id)
=======
        .join(Program)
        .join(Branch)
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c
        .filter(
            Program.code == program,
            Branch.code == branch,
            Course.batch_year == batch_year,
            Course.is_active.is_(True),
        )
        .order_by(Course.semester, Course.course_code)
        .limit(limit)
        .all()
    )
    return {
        "courses": [
            map_course_to_frontend({
                "id": str(c.id),
                "course_code": c.course_code,
                "title": c.title,
                "l": c.l,
                "t": c.t,
                "p": c.p,
                "credits": float(c.credits),
                "category": c.category,
                "description": c.description or "",
                "program_id": str(c.program_id),
                "branch_id": str(c.branch_id),
                "batch_year": c.batch_year,
                "semester": c.semester,
                "curriculum_document_id": str(c.curriculum_document_id),
                "is_active": c.is_active,
                "created_at": c.created_at.isoformat() if c.created_at else None,
                "updated_at": c.updated_at.isoformat() if c.updated_at else None,
                "provenance": {
                    "batch_year": c.batch_year,
                    "program_code": c.program.code,
                    "program_name": c.program.name,
                    "branch_code": c.branch.code,
                    "branch_name": c.branch.name,
                    "source_url": c.curriculum_document.source_url,
                },
            })
            for c in courses
        ],
    }
