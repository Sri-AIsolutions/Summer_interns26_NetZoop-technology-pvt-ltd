from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Course
from app.schemas import CourseRelationshipResponse, CourseResponse
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
