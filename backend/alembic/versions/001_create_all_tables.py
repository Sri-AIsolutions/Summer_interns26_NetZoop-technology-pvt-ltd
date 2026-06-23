"""create all tables

Revision ID: 001
Revises:
Create Date: 2026-06-23
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "programs",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("code", sa.String(50), unique=True, nullable=False, index=True),
        sa.Column("duration_years", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    op.create_table(
        "branches",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("program_id", UUID(as_uuid=True), sa.ForeignKey("programs.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("code", sa.String(50), nullable=False, index=True),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.UniqueConstraint("program_id", "code", name="uq_branch_program_code"),
    )

    op.create_table(
        "curriculum_documents",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("program_id", UUID(as_uuid=True), sa.ForeignKey("programs.id"), nullable=False),
        sa.Column("branch_id", UUID(as_uuid=True), sa.ForeignKey("branches.id"), nullable=False),
        sa.Column("batch_year", sa.Integer(), nullable=False, index=True),
        sa.Column("source_url", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.UniqueConstraint("program_id", "branch_id", "batch_year", name="uq_curriculum_doc"),
    )

    op.create_table(
        "courses",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("course_code", sa.String(50), nullable=False, index=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("l", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("t", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("p", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("credits", sa.Numeric(3, 1), nullable=False),
        sa.Column("category", sa.String(20), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("program_id", UUID(as_uuid=True), sa.ForeignKey("programs.id"), nullable=False),
        sa.Column("branch_id", UUID(as_uuid=True), sa.ForeignKey("branches.id"), nullable=False),
        sa.Column("batch_year", sa.Integer(), nullable=False, index=True),
        sa.Column("semester", sa.Integer(), nullable=False, index=True),
        sa.Column("curriculum_document_id", UUID(as_uuid=True), sa.ForeignKey("curriculum_documents.id"), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.CheckConstraint("category IN ('Core', 'Elective', 'Lab', 'Audit')", name="ck_course_category"),
        sa.UniqueConstraint("course_code", "program_id", "batch_year", "semester", name="uq_course_unique"),
    )

    op.create_table(
        "course_aliases",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("alias", sa.String(255), nullable=False, index=True),
        sa.Column("alias_type", sa.String(50), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("alias_type IN ('legacy', 'cross_listed', 'abbreviation')", name="ck_alias_type"),
    )

    op.create_table(
        "prerequisites",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("course_id", UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("prerequisite_course_id", UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("course_id", "prerequisite_course_id", name="uq_prerequisite"),
        sa.CheckConstraint("course_id != prerequisite_course_id", name="ck_no_self_prerequisite"),
    )

    op.create_table(
        "lab_companions",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("theory_course_id", UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("lab_course_id", UUID(as_uuid=True), sa.ForeignKey("courses.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint("theory_course_id", "lab_course_id", name="uq_lab_companion"),
    )

    # GIN index for full-text search (BE-06)
    op.execute(
        "CREATE INDEX idx_courses_fulltext ON courses "
        "USING GIN (to_tsvector('english', title || ' ' || course_code))"
    )


def downgrade() -> None:
    op.drop_table("lab_companions")
    op.drop_table("prerequisites")
    op.drop_table("course_aliases")
    op.drop_table("courses")
    op.drop_table("curriculum_documents")
    op.drop_table("branches")
    op.drop_table("programs")
