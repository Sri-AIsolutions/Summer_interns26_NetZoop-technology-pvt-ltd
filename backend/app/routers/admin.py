from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import AdminUser, Course
from app.schemas import CourseCreate, CourseResponse, CourseUpdate, LoginRequest, TokenResponse
from app.services.auth_service import (
    create_access_token,
    verify_admin,
    verify_password,
    verify_token,
)
from app.services.search_service import _course_to_dict

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    # Check env-var admin first (fast path)
    if verify_admin(body.username, body.password):
        token = create_access_token(body.username)
        return TokenResponse(access_token=token)

    # Fallback: check DB admin_users table
    admin_user = db.query(AdminUser).filter(AdminUser.email == body.username).first()
    if not admin_user or not verify_password(body.password, admin_user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(body.username)
    return TokenResponse(access_token=token)


@router.post("/courses", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    body: CourseCreate,
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    """BE-13: Add a new course with duplicate detection."""
    existing = (
        db.query(Course)
        .filter(
            Course.course_code == body.course_code,
            Course.program_id == body.program_id,
            Course.batch_year == body.batch_year,
            Course.semester == body.semester,
            Course.is_active.is_(True),
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Course with same code, program, batch_year, and semester already exists",
        )

    course = Course(**body.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return CourseResponse(**_course_to_dict(course))


@router.put("/courses/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: UUID,
    body: CourseUpdate,
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    """BE-12: Update any course field. Only provided fields are changed."""
    course = db.query(Course).filter(Course.id == course_id, Course.is_active.is_(True)).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return CourseResponse(**_course_to_dict(course))


@router.delete("/courses/{course_id}")
def soft_delete_course(
    course_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(verify_token),
):
    """BE-14: Soft delete a course by setting is_active=false."""
    course = db.query(Course).filter(Course.id == course_id, Course.is_active.is_(True)).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

    course.is_active = False
    db.commit()
    return {"message": "Course deleted", "status": "success"}
