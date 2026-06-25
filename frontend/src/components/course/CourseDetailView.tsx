"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Course } from "@/types";
import { Skeleton } from "@/components/common";
import { CourseCategoryBadge } from "@/components/courses/CourseCategoryBadge";
import { LTPVisualCards } from "./LTPVisualCards";
import { RelatedCourses } from "./RelatedCourses";
import { SourceInfoCard } from "./SourceInfoCard";
import { getCourseByCode, getRelatedCourses } from "@/services/courseService";

interface CourseDetailViewProps {
  code: string;
  programId?: string;
}

function MetadataIcon({ label }: { label: string }) {
  switch (label) {
    case "Credits":
      return (
        <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      );
    case "Category":
      return (
        <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
      );
    case "L-T-P":
      return (
        <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
        </svg>
      );
    case "Semester":
      return (
        <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      );
    case "Department":
      return (
        <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      );
    case "Program":
      return (
        <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
        </svg>
      );
    default:
      return null;
  }
}

export function CourseDetailView({ code, programId }: CourseDetailViewProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [related, setRelated] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCourseByCode(code, programId)
      .then((data) => {
        setCourse(data);
        if (data) {
          getRelatedCourses(data).then((r) => setRelated(r));
        }
      })
      .catch(() => {
        setCourse(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code, programId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="rounded-card border border-slate-200 bg-white py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">
          Course not found
        </p>
        <p className="mt-1 text-sm text-slate-500">
          No course with code &ldquo;{code}&rdquo; was found.
        </p>
        <Link
          href="/courses"
          className="mt-4 inline-block text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          &larr; Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/courses" className="hover:text-brand-500 transition-colors">
          Courses
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span>Semester {course.semester}</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="font-medium text-slate-900">{course.code}</span>
      </nav>

      {/* Course header */}
      <div className="space-y-3">
        <span className="inline-block rounded-lg border border-brand-200 bg-brand-50 px-3 py-1 font-mono text-xs font-bold text-brand-600">
          {course.code}
        </span>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          {course.title}
        </h1>
        {course.description && (
          <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
            {course.description}
          </p>
        )}
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MetadataItem label="Credits" value={String(course.credits)} />
        <MetadataItem label="Category">
          <CourseCategoryBadge category={course.category} />
        </MetadataItem>
        <MetadataItem label="L-T-P" value={`${course.lectureHours}-${course.tutorialHours}-${course.practicalHours}`} />
        <MetadataItem label="Semester" value={String(course.semester)} />
        <MetadataItem label="Department" value={course.department} />
        <MetadataItem label="Program" value={course.program} />
      </div>

      {/* L-T-P Visual Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Learning Distribution
        </h3>
        <LTPVisualCards
          lecture={course.lectureHours}
          tutorial={course.tutorialHours}
          practical={course.practicalHours}
        />
      </div>

      {/* Related Courses */}
      {related.length > 0 && <RelatedCourses courses={related} />}

      {/* Source Info */}
      <SourceInfoCard department={course.department} />
    </div>
  );
}

function MetadataItem({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <MetadataIcon label={label} />
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
      {children ?? (
        <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
      )}
    </div>
  );
}
