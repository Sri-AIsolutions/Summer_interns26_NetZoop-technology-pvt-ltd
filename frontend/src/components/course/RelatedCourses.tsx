import Link from "next/link";
import type { Course } from "@/types";
import { CourseCategoryBadge } from "@/components/courses/CourseCategoryBadge";

interface RelatedCoursesProps {
  courses: Course[];
}

export function RelatedCourses({ courses }: RelatedCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-slate-900">Related Courses</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.code}?program=${
              course.program.includes("Computer") ? "cse" : "ece"
            }`}
            className="min-w-[240px] shrink-0 snap-start rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className="h-1 w-full rounded-t-xl bg-brand-500" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-brand-600">
                  {course.code}
                </span>
                <CourseCategoryBadge category={course.category} />
              </div>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {course.title}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {course.credits} Cr
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  Sem {course.semester}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
