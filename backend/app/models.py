import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Program(Base):
    __tablename__ = "programs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False, index=True)
    duration_years = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    branches = relationship("Branch", back_populates="program", lazy="selectin")
    courses = relationship("Course", back_populates="program", lazy="selectin")
    curriculum_documents = relationship("CurriculumDocument", back_populates="program", lazy="selectin")


class Branch(Base):
    __tablename__ = "branches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=False)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (UniqueConstraint("program_id", "code", name="uq_branch_program_code"),)

    program = relationship("Program", back_populates="branches", lazy="selectin")
    courses = relationship("Course", back_populates="branch", lazy="selectin")
    curriculum_documents = relationship("CurriculumDocument", back_populates="branch", lazy="selectin")


class CurriculumDocument(Base):
    __tablename__ = "curriculum_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id"), nullable=False)
    batch_year = Column(Integer, nullable=False, index=True)
    source_url = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("program_id", "branch_id", "batch_year", name="uq_curriculum_doc"),
    )

    program = relationship("Program", back_populates="curriculum_documents", lazy="selectin")
    branch = relationship("Branch", back_populates="curriculum_documents", lazy="selectin")
    courses = relationship("Course", back_populates="curriculum_document", lazy="selectin")


class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_code = Column(String(50), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    l = Column(Integer, default=0)
    t = Column(Integer, default=0)
    p = Column(Integer, default=0)
    credits = Column(Numeric(3, 1), nullable=False)
    category = Column(String(20), nullable=False)
    description = Column(Text, nullable=True)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id"), nullable=False)
    batch_year = Column(Integer, nullable=False, index=True)
    semester = Column(Integer, nullable=False, index=True)
    curriculum_document_id = Column(UUID(as_uuid=True), ForeignKey("curriculum_documents.id"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        CheckConstraint("category IN ('Core', 'Elective', 'Lab', 'Audit')", name="ck_course_category"),
        UniqueConstraint("course_code", "program_id", "batch_year", "semester", name="uq_course_unique"),
    )

    program = relationship("Program", back_populates="courses", lazy="selectin")
    branch = relationship("Branch", back_populates="courses", lazy="selectin")
    curriculum_document = relationship("CurriculumDocument", back_populates="courses", lazy="selectin")
    aliases = relationship("CourseAlias", back_populates="course", lazy="selectin", cascade="all, delete-orphan")
    prerequisites = relationship(
        "Prerequisite",
        foreign_keys="Prerequisite.course_id",
        back_populates="course",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    prerequisite_for = relationship(
        "Prerequisite",
        foreign_keys="Prerequisite.prerequisite_course_id",
        back_populates="prerequisite_course",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    lab_companions_theory = relationship(
        "LabCompanion",
        foreign_keys="LabCompanion.theory_course_id",
        back_populates="theory_course",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    lab_companions_lab = relationship(
        "LabCompanion",
        foreign_keys="LabCompanion.lab_course_id",
        back_populates="lab_course",
        lazy="selectin",
        cascade="all, delete-orphan",
    )


class CourseAlias(Base):
    __tablename__ = "course_aliases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    alias = Column(String(255), nullable=False, index=True)
    alias_type = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint("alias_type IN ('legacy', 'cross_listed', 'abbreviation')", name="ck_alias_type"),
    )

    course = relationship("Course", back_populates="aliases", lazy="selectin")


class Prerequisite(Base):
    __tablename__ = "prerequisites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    prerequisite_course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("course_id", "prerequisite_course_id", name="uq_prerequisite"),
        CheckConstraint("course_id != prerequisite_course_id", name="ck_no_self_prerequisite"),
    )

    course = relationship("Course", foreign_keys=[course_id], back_populates="prerequisites", lazy="selectin")
    prerequisite_course = relationship(
        "Course", foreign_keys=[prerequisite_course_id], back_populates="prerequisite_for", lazy="selectin"
    )


class LabCompanion(Base):
    __tablename__ = "lab_companions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    theory_course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    lab_course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (UniqueConstraint("theory_course_id", "lab_course_id", name="uq_lab_companion"),)

    theory_course = relationship("Course", foreign_keys=[theory_course_id], back_populates="lab_companions_theory", lazy="selectin")
    lab_course = relationship("Course", foreign_keys=[lab_course_id], back_populates="lab_companions_lab", lazy="selectin")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
