from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import (
    CategorySplitResponse,
    CategorySplitItem,
    CourseResponse,
    DistributionResponse,
    DistributionItem,
    GraduationCreditsResponse,
    MultiProgramCreditsResponse,
    SemesterCurriculumResponse,
)
from app.services.search_service import (
    get_all_program_credits,
    get_category_split,
    get_courses_by_category,
    get_distribution,
    get_graduation_credits,
    get_semester_courses,
)

router = APIRouter(prefix="/api/curriculum", tags=["curriculum"])


@router.get("/semester")
def semester_curriculum(
    program: str = Query(..., description="Program code, e.g. CSE"),
    branch: str = Query(..., description="Branch code, e.g. CSE"),
    batch_year: int = Query(..., alias="batch_year"),
    semester: int = Query(..., ge=1, le=12),
    db: Session = Depends(get_db),
):
    """BE-04: Return all courses for a given program+branch+batch_year+semester."""
    courses = get_semester_courses(db, program, branch, batch_year, semester)
    return SemesterCurriculumResponse(
        semester=semester,
        courses=[CourseResponse(**c) for c in courses],
    )


@router.get("/semester/category")
def semester_by_category(
    program: str = Query(...),
    branch: str = Query(...),
    batch_year: int = Query(...),
    semester: int = Query(...),
    category: str = Query(..., pattern=r"^(Core|Elective|Lab|Audit)$"),
    db: Session = Depends(get_db),
):
    """BE-03: Filter courses by category for a given semester."""
    courses = get_courses_by_category(db, program, branch, batch_year, semester, category)
    return SemesterCurriculumResponse(
        semester=semester,
        courses=[CourseResponse(**c) for c in courses],
    )


@router.get("/credits")
def graduation_credits(
    program: str = Query(..., description="Program code"),
    db: Session = Depends(get_db),
):
    """BE-05: Total graduation credits required for a program."""
    result = get_graduation_credits(db, program)
    return GraduationCreditsResponse(**result)


@router.get("/credits/all")
def all_program_credits(db: Session = Depends(get_db)):
    """BE-09: Total credits across all programs."""
    result = get_all_program_credits(db)
    return MultiProgramCreditsResponse(programs=[GraduationCreditsResponse(**r) for r in result])


@router.get("/distribution")
def distribution(
    program: str = Query(...),
    branch: str = Query(...),
    batch_year: int = Query(...),
    db: Session = Depends(get_db),
):
    """BE-08: Course counts and credit totals grouped by category and semester."""
    rows = get_distribution(db, program, branch, batch_year)
    return DistributionResponse(
        program_code=program,
        branch_code=branch,
        batch_year=batch_year,
        distribution=[DistributionItem(**r) for r in rows],
    )


@router.get("/category-split")
def category_split(
    program: str = Query(...),
    branch: str = Query(...),
    batch_year: int = Query(...),
    db: Session = Depends(get_db),
):
    """BE-11: Core vs elective vs lab vs audit breakdown per semester."""
    rows = get_category_split(db, program, branch, batch_year)
    return CategorySplitResponse(
        program_code=program,
        branch_code=branch,
        batch_year=batch_year,
        semesters=[CategorySplitItem(**r) for r in rows],
    )
