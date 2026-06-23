from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Course, CourseAlias
from app.schemas import (
    CourseFrontendResponse,
    PaginatedResponse,
    PaginationMeta,
    map_course_to_frontend,
)
from app.services.search_service import search_courses

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("")
def search(
    q: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """BE-01 / BE-06: 3-layer search — exact → alias → full-text."""
    results, total = search_courses(db, q, page, limit)
    return {
        "data": [map_course_to_frontend(r) for r in results],
        "pagination": {"page": page, "limit": limit, "total": total},
        "message": "Success",
        "status": "success",
    }


@router.get("/suggestions")
def suggestions(
    q: str = Query(..., min_length=1, description="Query for suggestions"),
    db: Session = Depends(get_db),
):
    """FIX 3B: Return up to 5 suggestion strings (course codes + titles) matching query."""
    query = q.strip()

    # Match from courses table
    course_matches = (
        db.query(Course.course_code, Course.title)
        .filter(
            Course.is_active.is_(True),
            (Course.course_code.ilike(f"%{query}%")) | (Course.title.ilike(f"%{query}%")),
        )
        .limit(5)
        .all()
    )

    suggestions_set: set = set()
    for code, title in course_matches:
        suggestions_set.add(code)
        suggestions_set.add(title)

    # If fewer than 5, also match from aliases
    if len(suggestions_set) < 5:
        alias_matches = (
            db.query(CourseAlias.alias)
            .filter(CourseAlias.alias.ilike(f"%{query}%"))
            .limit(5 - len(suggestions_set))
            .all()
        )
        for (alias,) in alias_matches:
            suggestions_set.add(alias)

    return {"suggestions": list(suggestions_set)[:5]}
