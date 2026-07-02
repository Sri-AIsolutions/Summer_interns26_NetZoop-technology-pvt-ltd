"""add composite indexes on courses table for semester/distribution lookups

Revision ID: 003
Revises: 002
Create Date: 2026-07-02
"""
from typing import Sequence, Union

from alembic import op

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_index(
        "ix_courses_semester_lookup",
        "courses",
        ["program_id", "branch_id", "batch_year", "semester"],
        postgresql_using="btree",
    )
    op.create_index(
        "ix_courses_program_branch_year",
        "courses",
        ["program_id", "branch_id", "batch_year"],
        postgresql_using="btree",
    )


def downgrade() -> None:
    op.drop_index("ix_courses_semester_lookup", table_name="courses")
    op.drop_index("ix_courses_program_branch_year", table_name="courses")
