from fastapi import APIRouter, Depends, HTTPException, Query
<<<<<<< HEAD
from sqlalchemy.orm import Session, joinedload
=======
from sqlalchemy.orm import Session
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c

from app.database import get_db
from app.models import Branch, Course, Program
from app.schemas import CourseResponse, DiffCurriculumResponse

router = APIRouter(prefix="/api/compare", tags=["compare"])


def _course_key(c: Course) -> tuple:
    return (c.course_code, c.semester)


@router.get("/diff")
def curriculum_diff(
    program: str = Query(...),
    branch: str = Query(...),
    batch_old: int = Query(..., alias="batch_old"),
    batch_new: int = Query(..., alias="batch_new"),
    db: Session = Depends(get_db),
):
    """BE-02: Compare two batch years for the same program+branch."""
    prog = db.query(Program).filter(Program.code == program).first()
    br = db.query(Branch).filter(Branch.code == branch, Branch.program_id == prog.id).first() if prog else None
    if not prog or not br:
        raise HTTPException(status_code=404, detail="Program or branch not found")

    old_courses = (
        db.query(Course)
<<<<<<< HEAD
        .options(joinedload(Course.program), joinedload(Course.branch), joinedload(Course.curriculum_document))
=======
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c
        .filter(
            Course.program_id == prog.id,
            Course.branch_id == br.id,
            Course.batch_year == batch_old,
            Course.is_active.is_(True),
        )
        .all()
    )
    new_courses = (
        db.query(Course)
<<<<<<< HEAD
        .options(joinedload(Course.program), joinedload(Course.branch), joinedload(Course.curriculum_document))
=======
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c
        .filter(
            Course.program_id == prog.id,
            Course.branch_id == br.id,
            Course.batch_year == batch_new,
            Course.is_active.is_(True),
        )
        .all()
    )

    old_map = {_course_key(c): c for c in old_courses}
    new_map = {_course_key(c): c for c in new_courses}

    old_keys = set(old_map.keys())
    new_keys = set(new_map.keys())

    added_keys = new_keys - old_keys
    removed_keys = old_keys - new_keys
    changed = []
    for key in old_keys & new_keys:
        oc = old_map[key]
        nc = new_map[key]
        if (oc.title != nc.title or oc.credits != nc.credits or oc.category != nc.category
                or oc.l != nc.l or oc.t != nc.t or oc.p != nc.p):
            changed.append(nc)

    def _provenance(c: Course) -> dict:
        return {
            "batch_year": c.batch_year,
            "program_code": prog.code,
            "program_name": prog.name,
            "branch_code": br.code,
            "branch_name": br.name,
            "source_url": c.curriculum_document.source_url,
        }

    def _to_dict(c: Course) -> dict:
        return {
            "id": str(c.id),
            "course_code": c.course_code,
            "title": c.title,
            "l": c.l,
            "t": c.t,
            "p": c.p,
            "credits": float(c.credits),
            "category": c.category,
            "description": c.description,
            "program_id": str(c.program_id),
            "branch_id": str(c.branch_id),
            "batch_year": c.batch_year,
            "semester": c.semester,
            "curriculum_document_id": str(c.curriculum_document_id),
            "is_active": c.is_active,
            "created_at": c.created_at.isoformat(),
            "updated_at": c.updated_at.isoformat(),
            "provenance": _provenance(c),
        }

    return DiffCurriculumResponse(
        program_code=program,
        branch_code=branch,
        batch_old=batch_old,
        batch_new=batch_new,
        added=[CourseResponse(**(_to_dict(new_map[k]))) for k in sorted(added_keys)],
        removed=[CourseResponse(**(_to_dict(old_map[k]))) for k in sorted(removed_keys)],
        changed=[CourseResponse(**(_to_dict(c))) for c in changed],
    )
