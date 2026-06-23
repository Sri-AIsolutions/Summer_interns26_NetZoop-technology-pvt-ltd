from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import CourseResponse, PaginatedResponse, PaginationMeta
from app.services.search_service import search_courses

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("")
def search(
    q: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    results, total = search_courses(db, q, page, limit)
    return PaginatedResponse[CourseResponse](
        data=[CourseResponse(**r) for r in results],
        pagination=PaginationMeta(page=page, limit=limit, total=total),
    )
