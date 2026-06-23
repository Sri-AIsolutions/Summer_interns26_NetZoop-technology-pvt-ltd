# AGENTS.md — Amrita Curriculum Chatbot

## Quick start

### Frontend
```bash
cd frontend
npm install
npm run dev          # dev server at http://localhost:3000
npm run build        # production build
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
```

### Backend
```bash
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # fill in DATABASE_URL, CLAUDE_API_KEY, JWT_SECRET
uvicorn app.main:app --reload  # dev server at http://localhost:8000
```

No test, typecheck, or format commands are configured for either side.

## Structure

```
frontend/
  src/
    app/                  # Next.js 15 App Router
      layout.tsx          # root layout (Navbar + globals.css)
      page.tsx            # homepage "/"
      not-found.tsx       # 404
      (app)/              # route group — all share <PageContainer>
        admin/page.tsx    # "/admin" — CRUD courses (in-memory mock)
        chat/page.tsx     # "/chat"  — conversational assistant
        compare/page.tsx  # "/compare" — placeholder
        courses/page.tsx  # "/courses" — browse by program/semester
        search/page.tsx   # "/search" — type-ahead with suggestions
    components/
      common/             # Navbar, PageContainer, Button, Card, etc.
      home/               # HeroSection, SearchBar, SuggestedSearches, CoursePreviewGrid
      courses/            # SemesterFilterBar, CourseTable, CourseCardMobile, etc.
      course/             # CourseMeta (shared by courses + search)
      search/             # SearchBar, SearchResults, SearchSuggestions
      chat/               # ChatMessage (inline rendering of courses, summaries)
    services/
      api.ts              # ApiClient with get/post/put/del — calls backend at localhost:8000
      courseService.ts    # getPrograms, getCoursesBySemester — calls real API
      searchService.ts    # searchCourses, getSuggestions — calls real API
    data/mockCourses.ts   # 40+ mock courses (no longer used by pages, kept as reference)
    types/                # Course, Program, ChatRole, ApiResponse<T>, etc.
    hooks/useDebounce.ts  # generic debounce (default 300ms)
    lib/
      constants.ts        # ROUTES, API_BASE_URL, PAGINATION defaults
      utils.ts            # cn() (clsx + tailwind-merge), formatCredits, formatCourseCode
      mock-data.ts        # legacy/simpler mock subset (likely redundant)

backend/
  app/
    main.py               # FastAPI app, CORS, router registration, /health
    config.py             # pydantic-settings (reads .env)
    database.py           # SQLAlchemy engine + SessionLocal + get_db()
    models.py             # 7 tables: programs, branches, curriculum_documents, courses, course_aliases, prerequisites, lab_companions
    schemas.py            # Pydantic v2 request/response models (ApiResponse<T>, CourseResponse, ChatResponse, etc.)
    routers/
      search.py           # GET /api/search?q=&page=&limit=  (BE-01/BE-06)
      curriculum.py       # GET /api/curriculum/* — semester, credits, distribution, category-split (BE-03/04/05/08/09/11)
      compare.py          # GET /api/compare/diff? (BE-02)
      courses.py          # GET /api/courses/{code}/relationships (BE-07)
      admin.py            # POST /api/admin/login, POST/PUT/DELETE /api/admin/courses (BE-12/13/14)
      chat.py             # POST /api/chat — fast-path intent routing + Claude Text-to-SQL fallback (BE-15/16)
      export.py           # GET /api/export? (BE-10)
      programs.py         # GET /api/programs, GET /api/programs/{code}/branches
    services/
      auth_service.py     # JWT create/verify, bcrypt password hash, admin credential check
      search_service.py   # 3-layer search, semester queries, distribution, relationships
      claude_service.py   # Claude Text-to-SQL (BE-15), SQL result validation (BE-16)
  alembic/                # Alembic migrations
    versions/001_create_all_tables.py
  requirements.txt
  .env.example
  render.yaml
```

## Architecture notes

- **Backend (FastAPI + PostgreSQL on Neon) serves all data.** Frontend services call the real API at `http://localhost:8000` via `apiClient` in `api.ts`. `API_BASE_URL` in `constants.ts` points to `http://localhost:8000` and can be overridden with `NEXT_PUBLIC_API_URL`.
- **Course-per-program model.** Each `courses` row is tied to a single (program_id, branch_id, batch_year, semester). Cross-listed courses get separate rows linked via `course_aliases` with `alias_type='cross_listed'`.
- **3-layer search** (BE-01): exact course_code match → alias match (legacy codes, abbreviations, cross-listed) → PostgreSQL full-text search (tsvector GIN index).
- **Fast-path chat** (BE-15): `/api/chat` tries regex-based intent detection first (e.g. "semester 3 CSE"). If no structured intent matches, it falls through to Claude Text-to-SQL.
- **JWT auth** on admin routes (BE-12/13/14). Hardcoded single admin from `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars.
- **Source provenance** (BE-17) attached to every `CourseResponse` via the `provenance` field (batch_year, program, branch, source_url from the curriculum_documents table).

## Key conventions

### Frontend
- Path alias `@/*` maps to `src/*`
- Brand color: `brand-500` = `#b50346` (Amrita maroon). Full palette `brand-50` through `brand-900`.
- Use `cn(...)` from `@/lib/utils` for Tailwind class merging (wraps `clsx` + `tailwind-merge`).
- Use `ROUTES` object from `@/lib/constants` for route strings.

### Backend
- UUID primary keys on all tables.
- Soft deletes on courses via `is_active` boolean (BE-14).
- Unique constraint on `(course_code, program_id, batch_year, semester)` for duplicate detection (BE-13).
- GIN index on `to_tsvector('english', title || ' ' || course_code)` for full-text search (BE-06).
- Claude Text-to-SQL uses `claude-sonnet-4-20250514` model. SQL is validated (read-only check) before returning to frontend (BE-16).

## What's missing / not ready

- No test infrastructure or test files (frontend or backend)
- No CI workflows
- `/compare` page is a placeholder
- `components/charts/` and `components/admin/` are stubs
- `lib/mock-data.ts` overlaps with `data/mockCourses.ts` (lean toward the latter)
- Admin panel has no frontend form — only backend endpoints exist
- No database seed data — curriculum data must be loaded manually or via a future seed script
