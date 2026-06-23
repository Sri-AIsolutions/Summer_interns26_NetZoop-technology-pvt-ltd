from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Branch, Program
from app.schemas import BranchResponse, ProgramResponse

router = APIRouter(prefix="/api/programs", tags=["programs"])


@router.get("")
def list_programs(db: Session = Depends(get_db)):
    programs = db.query(Program).order_by(Program.code).all()
    return [ProgramResponse.model_validate(p) for p in programs]


@router.get("/{program_code}/branches")
def list_branches(program_code: str, db: Session = Depends(get_db)):
    branches = (
        db.query(Branch)
        .join(Program)
        .filter(Program.code == program_code)
        .order_by(Branch.code)
        .all()
    )
    return [BranchResponse.model_validate(b) for b in branches]
