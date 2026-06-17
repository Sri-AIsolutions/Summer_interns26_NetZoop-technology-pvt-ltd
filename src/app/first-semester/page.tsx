'use client';

import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/types/course';
import { getCoursesBySemester } from '@/services/courseService';
import { programs } from '@/data/mockCourses';
import PageContainer from '@/components/ui/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import EmptyState from '@/components/ui/EmptyState';
import FirstSemesterProgramSelector from '@/components/courses/FirstSemesterProgramSelector';
import CourseTable from '@/components/courses/CourseTable';
import CourseTableSkeleton from '@/components/courses/CourseTableSkeleton';
import CourseTableFooter from '@/components/courses/CourseTableFooter';

export default function FirstSemesterPage() {
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0].id);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);

  const fetchCourses = useCallback(async (programId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCoursesBySemester(programId, 1);
      setCourses(data);
    } catch {
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(selectedProgramId);
  }, [selectedProgramId, fetchCourses]);

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const programName = selectedProgram?.name ?? '';

  return (
    <PageContainer>
      <SectionHeader
        title="First Semester Curriculum"
        description={
          <span aria-live="polite">
            Your courses for Semester 1 &mdash; {programName}
          </span>
        }
      />

      <FirstSemesterProgramSelector
        programs={programs}
        selectedProgramId={selectedProgramId}
        onChange={setSelectedProgramId}
      />

      <div aria-busy={loading} aria-label="Course list">
        {loading ? (
          <CourseTableSkeleton />
        ) : error ? (
          <EmptyState
            title="Something went wrong"
            description={error}
          />
        ) : courses.length === 0 ? (
          <EmptyState
            title="No courses found"
            description={`No courses found for Semester 1 of ${programName}.`}
          />
        ) : (
          <>
            <div role="region" aria-label="Course table">
              <CourseTable courses={courses} caption={`Semester 1 courses for ${programName}`} />
            </div>
            <div className="mt-4">
              <CourseTableFooter
                totalCredits={totalCredits}
                courseCount={courses.length}
              />
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
