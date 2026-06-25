import Link from "next/link";
import type { Course } from "@/types";
import { Card } from "@/components/common";
import { CourseCategoryBadge } from "@/components/courses/CourseCategoryBadge";

interface SearchResultCardProps {
  course: Course;
  query?: string;
}

function highlight(text: string, query?: string) {
  if (!query || query.length < 2) return text;
  const lower = text.toLowerCase();
  const qLower = query.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-brand-100 text-brand-800">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function getProgramId(program: string): string {
  return program.toLowerCase().includes("computer") ? "cse" : "ece";
}

export function SearchResultCard({ course, query }: SearchResultCardProps) {
  return (
    <Link
      href={`/courses/${course.code}?program=${getProgramId(course.program)}`}
      className="block group"
    >
      <Card className="relative space-y-3 overflow-hidden border-t-4 border-t-brand-500 transition-all group-hover:border-brand-400 group-hover:shadow-elevated">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-block rounded-md bg-brand-50 px-2 py-0.5 font-mono text-xs font-bold text-brand-600">
            {course.code}
          </span>
          <CourseCategoryBadge category={course.category} />
        </div>
        <div>
          <p className="text-base font-bold text-slate-900">
            {highlight(course.title, query)}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {course.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
            L-T-P: {course.lectureHours}-{course.tutorialHours}-{course.practicalHours}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {course.credits} credits
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            Semester {course.semester}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-400">
          {course.program}
        </p>
      </Card>
    </Link>
  );
}
