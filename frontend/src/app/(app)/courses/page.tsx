"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/common";
import { SemesterFilterBar } from "@/components/courses/SemesterFilterBar";
import { CourseTable } from "@/components/courses/CourseTable";
import { CourseCardMobile } from "@/components/courses/CourseCardMobile";
import { CourseTableSkeleton } from "@/components/courses/CourseTableSkeleton";
import { CourseTableFooter } from "@/components/courses/CourseTableFooter";
import { CreditProgressionBar } from "@/components/courses/CreditProgressionBar";
import { SemesterOverviewCard } from "@/components/courses/SemesterOverviewCard";
import { FullJourneyGrid } from "@/components/courses/FullJourneyGrid";
import type { SemesterSummary } from "@/components/courses/FullJourneyGrid";
import { getPrograms, getCoursesBySemester } from "@/services/courseService";
import { mockCoursesData } from "@/data/mockCourses";
import type { Course, Program } from "@/types";

export default function CoursesPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadedPrograms = getPrograms();
    setPrograms(loadedPrograms);
    if (loadedPrograms.length > 0) {
      setSelectedProgram(loadedPrograms[0].id);
    }
  }, []);

  useEffect(() => {
    if (!selectedProgram) return;

    setLoading(true);
    getCoursesBySemester(selectedProgram, selectedSemester)
      .then((data) => {
        setCourses(data);
      })
      .catch(() => {
        setCourses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedProgram, selectedSemester]);

  const program = programs.find((p) => p.id === selectedProgram);

  const semesterSummaries = useMemo(() => {
    const programData = programs.find((p) => p.id === selectedProgram);
    if (!programData) return [];

    const summaries: SemesterSummary[] = [];
    for (let sem = 1; sem <= programData.duration; sem++) {
      const semCourses = mockCoursesData.filter(
        (c) => c.program === programData.name && c.semester === sem
      );
      summaries.push({
        number: sem,
        credits: semCourses.reduce((sum, c) => sum + c.credits, 0),
        courseCount: semCourses.length,
        isAvailable: semCourses.length > 0,
      });
    }
    return summaries;
  }, [programs, selectedProgram]);

  const completedCredits = useMemo(() => {
    return semesterSummaries
      .filter((s) => s.isAvailable)
      .reduce((sum, s) => sum + s.credits, 0);
  }, [semesterSummaries]);

  const totalTarget = 160;
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-500 transition-colors">
          Programs
        </Link>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="font-medium text-slate-900">Roadmap</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Program Roadmap
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {program?.name ?? "Select a program"} &mdash;{" "}
            {program?.duration ?? 8} Semester Journey
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white shrink-0">
          <svg className="h-4 w-4 text-brand-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {completedCredits} / {totalTarget} Credits
        </div>
      </div>

      {/* Program & Semester selector */}
      <SemesterFilterBar
        programs={programs}
        selectedProgram={selectedProgram}
        selectedSemester={selectedSemester}
        onProgramChange={(id) => setSelectedProgram(id)}
        onSemesterChange={(sem) => setSelectedSemester(sem)}
      />

      {/* Loading state */}
      {loading ? (
        <CourseTableSkeleton />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses found"
          message="No courses match the selected program and semester."
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left — main content */}
          <div className="flex-1 min-w-0 space-y-6">
            <SemesterOverviewCard
              semester={selectedSemester}
              totalCredits={totalCredits}
              courseCount={courses.length}
              courses={courses}
            />

            <div className="hidden md:block">
              <CourseTable courses={courses} />
            </div>
            <div className="space-y-4 md:hidden">
              {courses.map((course) => (
                <CourseCardMobile key={course.id} course={course} />
              ))}
            </div>
            <CourseTableFooter
              totalCredits={totalCredits}
              courseCount={courses.length}
              courses={courses}
            />
          </div>

          {/* Right — sidebar */}
          <div className="w-full lg:w-72 shrink-0 space-y-6">
            <CreditProgressionBar
              completedCredits={completedCredits}
              totalTarget={totalTarget}
            />

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50">
                <svg className="h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-800">Curriculum Overview</h4>
              <p className="mt-1 text-xs text-slate-500">
                Visualize your academic journey across all semesters
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full Journey Grid */}
      <FullJourneyGrid
        semesters={semesterSummaries}
        selectedSemester={selectedSemester}
        onSelect={setSelectedSemester}
      />
    </div>
  );
}
