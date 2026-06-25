"use client";

import { forwardRef } from "react";
import Link from "next/link";
import type { Course } from "@/types";
import { CourseCategoryBadge } from "@/components/courses/CourseCategoryBadge";
import { cn } from "@/lib/utils";

interface SummaryData {
  type: "info" | "credits";
  message: string;
}

interface CoursePreviewGridProps {
  courses: Course[];
  hasSearched: boolean;
  searchTerm: string;
  summary?: SummaryData;
}

function getProgramId(program: string): string {
  return program.toLowerCase().includes("computer") ? "cse" : "ece";
}

export const CoursePreviewGrid = forwardRef<
  HTMLElement,
  CoursePreviewGridProps
>(function CoursePreviewGrid(
  { courses, hasSearched, searchTerm, summary },
  ref
) {
  if (!hasSearched && courses.length === 0) return null;

  return (
    <section
      ref={ref}
      className="mx-auto max-w-7xl scroll-mt-16 px-4 py-12 sm:px-6 lg:px-8 animate-fadeSlideIn"
    >
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {hasSearched ? "Search Results" : "Recommended Courses"}
          </h2>
          {hasSearched && (
            <p className="mt-1 text-caption">
              {courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"} found for
              &ldquo;{searchTerm}&rdquo;
            </p>
          )}
          {!hasSearched && (
            <p className="mt-1 font-medium text-slate-500">
              Based on common curriculum requirements and popular searches.
            </p>
          )}
        </div>
        {hasSearched && (
          <Link
            href="/courses"
            className="flex items-center gap-1 text-sm font-bold text-brand-500 transition-all hover:gap-2"
          >
            View all courses
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        )}
      </div>

      {summary && (
        <div
          className={cn(
            "mb-8 rounded-card border px-4 py-3 text-sm",
            summary.type === "credits" &&
              "border-brand-200 bg-brand-50 text-brand-800",
            summary.type === "info" &&
              "border-slate-200 bg-slate-50 text-slate-600"
          )}
        >
          {summary.message}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="rounded-card border border-slate-200 bg-white py-16 text-center">
          <p className="text-slate-500">
            No courses found for &ldquo;{searchTerm}&rdquo;.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Try a different search term or browse all courses.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.code}?program=${getProgramId(course.program)}`}
              className="group rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-t-4 hover:border-t-brand-500 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-black tracking-widest text-brand-500">
                  {course.code}
                </span>
                <CourseCategoryBadge category={course.category} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                {course.title}
              </h3>
              <div className="mt-4 mb-6 space-y-1 text-sm text-slate-600">
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span>Structure (L-T-P)</span>
                  <span className="font-bold text-slate-900">
                    {course.lectureHours}-{course.tutorialHours}-
                    {course.practicalHours}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span>Credits</span>
                  <span className="font-bold text-slate-900">
                    {course.credits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Semester</span>
                  <span className="font-bold text-slate-900">
                    {course.semester}
                  </span>
                </div>
              </div>
              <span className="block w-full rounded-lg border border-slate-200 py-2.5 text-center text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50">
                Details
              </span>
            </Link>
          ))}
        </div>
      )}

      {!hasSearched && (
        <div className="mt-12 text-center">
          <Link
            href="/courses"
            className="flex items-center justify-center gap-1 text-sm font-bold text-brand-500 transition-all hover:gap-2"
          >
            View all courses
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
});
