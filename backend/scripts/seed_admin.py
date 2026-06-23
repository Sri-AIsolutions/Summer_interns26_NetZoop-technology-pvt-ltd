"""Seed one admin user with email admin@amrita.edu.

Usage:
    python scripts/seed_admin.py <password>
"""
import argparse
import sys
from pathlib import Path

# Ensure backend/ is on sys.path so "from app import ..." works
sys.path.append(str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv

load_dotenv()

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models import AdminUser
from app.services.auth_service import hash_password


def seed(password: str) -> None:
    engine = create_engine(os.environ["DATABASE_URL"])
    Session = sessionmaker(bind=engine)
    session = Session()

    existing = session.query(AdminUser).filter(AdminUser.email == "admin@amrita.edu").first()
    if existing:
        print("Admin user already exists")
        return

    session.add(AdminUser(email="admin@amrita.edu", password_hash=hash_password(password)))
    session.commit()
    print("Admin user created successfully")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed admin user")
    parser.add_argument("password", help="Password for admin@amrita.edu")
    args = parser.parse_args()
    seed(args.password)
