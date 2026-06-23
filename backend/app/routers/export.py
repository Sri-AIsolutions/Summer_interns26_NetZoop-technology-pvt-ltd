from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Branch, Course, Program
from app.schemas import (
    BranchResponse,
    CourseResponse,
    ExportResponse,
    ProgramResponse,
    SemesterCurriculumResponse,
)

router = APIRouter(prefix="/api/export", tags=["export"])


@router.get("")
def export_curriculum(
    program: str = Query(...),
    branch: str = Query(...),
    batch_year: int = Query(...),
    db: Session = Depends(get_db),
):
    """BE-10: Return full curriculum data as structured JSON for accreditation reports."""
    prog = db.query(Program).filter(Program.code == program).first()
    br = db.query(Branch).filter(Branch.code == branch, Branch.program_id == prog.id).first() if prog else None
    if not prog or not br:
        raise HTTPException(status_code=404, detail="Program or branch not found")

    semesters = []
    for sem_num in range(1, prog.duration_years * 2 + 1):
        courses = (
            db.query(Course)
            .filter(
                Course.program_id == prog.id,
                Course.branch_id == br.id,
                Course.batch_year == batch_year,
                Course.semester == sem_num,
                Course.is_active.is_(True),
            )
            .order_by(Course.course_code)
            .all()
        )
        if courses:
            semesters.append(
                SemesterCurriculumResponse(
                    semester=sem_num,
                    courses=[CourseResponse(
                        id=str(c.id),
                        course_code=c.course_code,
                        title=c.title,
                        l=c.l,
                        t=c.t,
                        p=c.p,
                        credits=float(c.credits),
                        category=c.category,
                        description=c.description,
                        program_id=str(c.program_id),
                        branch_id=str(c.branch_id),
                        batch_year=c.batch_year,
                        semester=c.semester,
                        curriculum_document_id=str(c.curriculum_document_id),
                        is_active=c.is_active,
                        created_at=c.created_at.isoformat(),
                        updated_at=c.updated_at.isoformat(),
                        provenance={
                            "batch_year": c.batch_year,
                            "program_code": prog.code,
                            "program_name": prog.name,
                            "branch_code": br.code,
                            "branch_name": br.name,
                            "source_url": c.curriculum_document.source_url,
                        },
                    ) for c in courses],
                )
            )

    return ExportResponse(
        program=ProgramResponse.model_validate(prog),
        branch=BranchResponse.model_validate(br),
        batch_year=batch_year,
        semesters=semesters,
    )
