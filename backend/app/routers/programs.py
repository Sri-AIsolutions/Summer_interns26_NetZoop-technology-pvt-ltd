from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.cache import program_cache
from app.database import get_db
from app.models import Branch, Program
from app.schemas import BranchResponse, ProgramResponse

router = APIRouter(prefix="/api/programs", tags=["programs"])


@router.get("")
def list_programs(db: Session = Depends(get_db)):
    cached = program_cache.get("list")
    if cached is not None:
        return cached
    programs = db.query(Program).order_by(Program.code).all()
    result = [ProgramResponse.model_validate(p) for p in programs]
    program_cache.set("list", result)
    return result


@router.get("/{program_code}/branches")
def list_branches(program_code: str, db: Session = Depends(get_db)):
    cache_key = f"branches:{program_code}"
    cached = program_cache.get(cache_key)
    if cached is not None:
        return cached
    branches = (
        db.query(Branch)
        .join(Program)
        .filter(Program.code == program_code)
        .order_by(Branch.code)
        .all()
    )
    result = [BranchResponse.model_validate(b) for b in branches]
    program_cache.set(cache_key, result)
    return result
