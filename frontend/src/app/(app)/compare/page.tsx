"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/common";
import { CourseTable } from "@/components/courses/CourseTable";
import { getCoursesBySemester } from "@/services/courseService";
import type { Course } from "@/types";

export default function ComparePage() {
  const [semester, setSemester] = useState(1);
  const [cseCourses, setCseCourses] = useState<Course[]>([]);
  const [eceCourses, setEceCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getCoursesBySemester("cse", semester),
      getCoursesBySemester("ece", semester),
    ])
      .then(([cse, ece]) => {
        setCseCourses(cse);
        setEceCourses(ece);
      })
      .finally(() => setLoading(false));
  }, [semester]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Compare Programs"
        subtitle="Compare courses side by side across programs"
      />

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Semester:</span>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }, (_, i) => i + 1).map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => setSemester(sem)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                semester === sem
                  ? "bg-brand-500 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-card border border-slate-200 bg-white p-6">
              <div className="mb-4 h-6 w-40 rounded bg-slate-200" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="mb-3 h-4 w-full rounded bg-slate-100" />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              CSE &mdash; Semester {semester}
              <span className="ml-2 text-sm font-normal text-slate-400">
                {cseCourses.length} courses
              </span>
            </h2>
            {cseCourses.length > 0 ? (
              <CourseTable courses={cseCourses} />
            ) : (
              <p className="text-sm text-slate-400">No courses available.</p>
            )}
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              ECE &mdash; Semester {semester}
              <span className="ml-2 text-sm font-normal text-slate-400">
                {eceCourses.length} courses
              </span>
            </h2>
            {eceCourses.length > 0 ? (
              <CourseTable courses={eceCourses} />
            ) : (
              <p className="text-sm text-slate-400">No courses available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
