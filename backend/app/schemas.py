from datetime import datetime
from typing import Any, Generic, List, Optional, TypeVar
from uuid import UUID

from pydantic import BaseModel, Field

T = TypeVar("T")


# ── Generic wrappers ──────────────────────────────────────────

class ApiResponse(BaseModel, Generic[T]):
    data: T
    message: str = "Success"
    status: str = "success"


class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    message: str = "Success"
    status: str = "success"
    pagination: "PaginationMeta"


class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int


# ── Source provenance (BE-17) ─────────────────────────────────

class SourceProvenance(BaseModel):
    batch_year: int
    program_code: str
    program_name: str
    branch_code: str
    branch_name: str
    source_url: str


# ── Course ────────────────────────────────────────────────────

class CourseBase(BaseModel):
    course_code: str
    title: str
    l: Optional[int] = 0
    t: Optional[int] = 0
    p: Optional[int] = 0
    credits: float
    category: str = Field(pattern=r"^(Core|Elective|Lab|Audit)$")
    description: Optional[str] = None
    program_id: UUID
    branch_id: UUID
    batch_year: int
    semester: int
    curriculum_document_id: UUID


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    course_code: Optional[str] = None
    title: Optional[str] = None
    l: Optional[int] = None
    t: Optional[int] = None
    p: Optional[int] = None
    credits: Optional[float] = None
    category: Optional[str] = Field(default=None, pattern=r"^(Core|Elective|Lab|Audit)$")
    description: Optional[str] = None
    semester: Optional[int] = None


class CourseResponse(CourseBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    provenance: SourceProvenance

    model_config = {"from_attributes": True}


# ── Frontend-mapped Course (FIX 1) ──────────────────────────────

class CourseFrontendResponse(BaseModel):
    id: str
    code: str
    title: str
    lectureHours: int = 0
    tutorialHours: int = 0
    practicalHours: int = 0
    credits: float
    description: str = ""
    department: str
    program: str
    semester: int
    category: str
    batchYear: int
    isActive: bool


def map_course_to_frontend(backend_dict: dict) -> dict:
    """Map a backend CourseResponse dict to frontend field names."""
    provenance = backend_dict.get("provenance", {})
    return {
        "id": backend_dict["id"],
        "code": backend_dict["course_code"],
        "title": backend_dict["title"],
        "lectureHours": backend_dict.get("l", 0),
        "tutorialHours": backend_dict.get("t", 0),
        "practicalHours": backend_dict.get("p", 0),
        "credits": float(backend_dict["credits"]),
        "description": backend_dict.get("description") or "",
        "department": provenance.get("branch_name", ""),
        "program": provenance.get("program_name", ""),
        "semester": backend_dict["semester"],
        "category": backend_dict["category"],
        "batchYear": backend_dict["batch_year"],
        "isActive": backend_dict.get("is_active", True),
    }


class CourseRelationshipResponse(BaseModel):
    prerequisites: List[CourseResponse]
    lab_companions: List[CourseResponse]


# ── Aliases ───────────────────────────────────────────────────

class CourseAliasResponse(BaseModel):
    id: UUID
    alias: str
    alias_type: str

    model_config = {"from_attributes": True}


# ── Program / Branch ──────────────────────────────────────────

class ProgramResponse(BaseModel):
    id: UUID
    name: str
    code: str
    duration_years: int

    model_config = {"from_attributes": True}


class BranchResponse(BaseModel):
    id: UUID
    program_id: UUID
    name: str
    code: str

    model_config = {"from_attributes": True}


# ── Curriculum ────────────────────────────────────────────────

class SemesterCurriculumResponse(BaseModel):
    semester: int
    courses: List[CourseResponse]


class GraduationCreditsResponse(BaseModel):
    program_code: str
    program_name: str
    total_credits: float


class MultiProgramCreditsResponse(BaseModel):
    programs: List[GraduationCreditsResponse]


class DistributionItem(BaseModel):
    category: str
    semester: int
    course_count: int
    total_credits: float


class DistributionResponse(BaseModel):
    program_code: str
    branch_code: str
    batch_year: int
    distribution: List[DistributionItem]


class CategorySplitItem(BaseModel):
    semester: int
    core: int
    elective: int
    lab: int
    audit: int
    core_credits: float
    elective_credits: float
    lab_credits: float
    audit_credits: float


class CategorySplitResponse(BaseModel):
    program_code: str
    branch_code: str
    batch_year: int
    semesters: List[CategorySplitItem]


# ── Compare (BE-02) ───────────────────────────────────────────

class DiffCurriculumResponse(BaseModel):
    program_code: str
    branch_code: str
    batch_old: int
    batch_new: int
    added: List[CourseResponse]
    removed: List[CourseResponse]
    changed: List[CourseResponse]


# ── Export (BE-10) ────────────────────────────────────────────

class ExportResponse(BaseModel):
    program: ProgramResponse
    branch: BranchResponse
    batch_year: int
    semesters: List[SemesterCurriculumResponse]


# ── Auth ──────────────────────────────────────────────────────

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    username: str
    password: str


# ── Chat (BE-15) ──────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str
    sql_query: Optional[str] = None
    source: str  # "structured_api" or "claude_text_to_sql"
    courses: List[CourseFrontendResponse] = []
    summary: Optional[dict] = None
    provenance: Optional[dict] = None
    raw_data: Optional[Any] = None
