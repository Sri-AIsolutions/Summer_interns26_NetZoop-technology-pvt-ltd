"""Seed sample curriculum data: programs, branches, curriculum documents, and courses.

Usage:
    python scripts/seed_sample_data.py
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv

load_dotenv()

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models import Branch, Course, CurriculumDocument, Program

engine = create_engine(os.environ["DATABASE_URL"])
Session = sessionmaker(bind=engine)
session = Session()

BATCH = 2023
CURRICULUM_URL = "https://www.amrita.edu/academics/curriculum/"


def get_or_create(model, defaults: dict, **filters):
    """Look up by filters, return existing or create new."""
    obj = session.query(model).filter_by(**filters).first()
    if obj:
        return obj
    obj = model(**filters, **defaults)
    session.add(obj)
    session.flush()
    return obj


# ── Programs ──────────────────────────────────────────────────────

btech = get_or_create(Program, {"name": "B.Tech", "duration_years": 4}, code="BTECH")
mtech = get_or_create(Program, {"name": "M.Tech", "duration_years": 2}, code="MTECH")
mca = get_or_create(Program, {"name": "MCA", "duration_years": 2}, code="MCA")

# ── Branches ──────────────────────────────────────────────────────

cse = get_or_create(Branch, {"name": "Computer Science and Engineering"}, program_id=btech.id, code="CSE")
cse_ai = get_or_create(Branch, {"name": "CSE (Artificial Intelligence)"}, program_id=btech.id, code="CSE_AI")
ece = get_or_create(Branch, {"name": "Electronics and Communication Engineering"}, program_id=btech.id, code="ECE")
cse_cs = get_or_create(Branch, {"name": "CSE (Cyber Security)"}, program_id=btech.id, code="CSE_CS")

vlsi = get_or_create(Branch, {"name": "VLSI Design"}, program_id=mtech.id, code="VLSI")
mtech_cs = get_or_create(Branch, {"name": "Computer Science"}, program_id=mtech.id, code="CS")

mca_branch = get_or_create(Branch, {"name": "Master of Computer Applications"}, program_id=mca.id, code="MCA")

# ── Curriculum documents (one per program+branch) ─────────────────

def doc(program, branch):
    return get_or_create(
        CurriculumDocument,
        {"source_url": CURRICULUM_URL},
        program_id=program.id, branch_id=branch.id, batch_year=BATCH,
    )

documents = {
    "btech_cse": doc(btech, cse),
    "btech_cse_ai": doc(btech, cse_ai),
    "btech_ece": doc(btech, ece),
    "btech_cse_cs": doc(btech, cse_cs),
    "mtech_vlsi": doc(mtech, vlsi),
    "mtech_cs": doc(mtech, mtech_cs),
    "mca": doc(mca, mca_branch),
}

# ── Courses for B.Tech CSE batch 2023 ─────────────────────────────

def add_course(code, title, l, t, p, credits, category, program, branch, semester, doc_key):
    existing = (
        session.query(Course)
        .filter(
            Course.course_code == code,
            Course.program_id == program.id,
            Course.batch_year == BATCH,
            Course.semester == semester,
        )
        .first()
    )
    if existing:
        return existing
    course = Course(
        course_code=code,
        title=title,
        l=l, t=t, p=p,
        credits=credits,
        category=category,
        program_id=program.id,
        branch_id=branch.id,
        batch_year=BATCH,
        semester=semester,
        curriculum_document_id=documents[doc_key].id,
        description="",
    )
    session.add(course)
    return course


# Semester 1 — B.Tech CSE
add_course("CS101", "Problem Solving and Programming", 3, 0, 2, 4, "Core", btech, cse, 1, "btech_cse")
add_course("MA101", "Calculus and Linear Algebra", 3, 1, 0, 4, "Core", btech, cse, 1, "btech_cse")
add_course("PH101", "Engineering Physics", 3, 0, 2, 4, "Core", btech, cse, 1, "btech_cse")
add_course("EN101", "Communicative English", 2, 0, 2, 3, "Core", btech, cse, 1, "btech_cse")
add_course("ME101", "Engineering Graphics", 1, 0, 3, 3, "Core", btech, cse, 1, "btech_cse")

# Semester 2 — B.Tech CSE
add_course("CS102", "Data Structures", 3, 0, 2, 4, "Core", btech, cse, 2, "btech_cse")
add_course("MA102", "Discrete Mathematics", 3, 1, 0, 4, "Core", btech, cse, 2, "btech_cse")
add_course("CH101", "Engineering Chemistry", 3, 0, 2, 4, "Core", btech, cse, 2, "btech_cse")
add_course("EE101", "Basic Electrical Engineering", 3, 0, 2, 4, "Core", btech, cse, 2, "btech_cse")
add_course("CS103", "Digital Logic Design", 3, 0, 2, 4, "Core", btech, cse, 2, "btech_cse")

session.commit()
total = session.query(Course).count()
print(f"Sample data seeded successfully: {total} courses, {session.query(Program).count()} programs, {session.query(Branch).count()} branches")
