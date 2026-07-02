"use client";

import { useState, useEffect } from "react";
import { SectionHeader, EmptyState } from "@/components/common";
import { SemesterFilterBar } from "@/components/courses/SemesterFilterBar";
import { CourseTable } from "@/components/courses/CourseTable";
import { CourseCardMobile } from "@/components/courses/CourseCardMobile";
import { CourseTableSkeleton } from "@/components/courses/CourseTableSkeleton";
import { CourseTableFooter } from "@/components/courses/CourseTableFooter";
import { getPrograms, getCoursesBySemester } from "@/services/courseService";
import type { Course, Program } from "@/types";

export default function CoursesPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getPrograms(),
      getCoursesBySemester("BTECH", 1),
    ]).then(([loadedPrograms, loadedCourses]) => {
      setPrograms(loadedPrograms);
      setCourses(loadedCourses);
      if (loadedPrograms.length > 0) {
        setSelectedProgram(loadedPrograms[0].id);
      }
      // Pre-fetch remaining semesters to warm the backend cache
      for (let sem = 2; sem <= 8; sem++) {
        getCoursesBySemester("BTECH", sem).catch(() => {});
      }
    }).catch(() => {
      setCourses([]);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  function handleProgramChange(id: string) {
    setSelectedProgram(id);
    const prog = programs.find((p) => p.id === id);
    if (prog) {
      setLoading(true);
      getCoursesBySemester(prog.code, selectedSemester)
        .then(setCourses)
        .catch(() => setCourses([]))
        .finally(() => setLoading(false));
    }
  }

  function handleSemesterChange(sem: number) {
    setSelectedSemester(sem);
    const prog = programs.find((p) => p.id === selectedProgram);
    if (prog) {
      setLoading(true);
      getCoursesBySemester(prog.code, sem)
        .then(setCourses)
        .catch(() => setCourses([]))
        .finally(() => setLoading(false));
    }
  }
=======
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPrograms().then((loadedPrograms) => {
      setPrograms(loadedPrograms);
      if (loadedPrograms.length > 0) {
        setSelectedProgram(loadedPrograms[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedProgram) return;

    setLoading(true);
    const prog = programs.find((p) => p.id === selectedProgram);
    if (!prog) {
      setLoading(false);
      return;
    }
    getCoursesBySemester(prog.code, selectedSemester)
      .then((data) => {
        setCourses(data);
      })
      .catch(() => {
        setCourses([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedProgram, selectedSemester, programs]);
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Courses"
        subtitle="View courses by program and semester"
      />

      <SemesterFilterBar
        programs={programs}
        selectedProgram={selectedProgram}
        selectedSemester={selectedSemester}
<<<<<<< HEAD
        onProgramChange={handleProgramChange}
        onSemesterChange={handleSemesterChange}
=======
        onProgramChange={(id) => setSelectedProgram(id)}
        onSemesterChange={(sem) => setSelectedSemester(sem)}
>>>>>>> bf6f30f4f688adc078b4fe50d0695691bcee795c
      />

      {loading ? (
        <CourseTableSkeleton />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses found"
          message="No courses match the selected program and semester."
        />
      ) : (
        <>
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
          />
        </>
      )}
    </div>
  );
}
