'use client';

import { useState, useEffect, useCallback } from 'react';
import { Course } from '@/types/course';
import { getCoursesBySemester } from '@/services/courseService';
import { programs, semesters } from '@/data/mockCourses';
import PageContainer from '@/components/ui/PageContainer';
import SectionHeader from '@/components/ui/SectionHeader';
import Loading from '@/components/ui/Loading';
import EmptyState from '@/components/ui/EmptyState';
import SemesterFilterBar from '@/components/courses/SemesterFilterBar';
import CourseTable from '@/components/courses/CourseTable';
import CourseTableSkeleton from '@/components/courses/CourseTableSkeleton';
import CourseTableFooter from '@/components/courses/CourseTableFooter';

export default function CoursesPage() {
  const [selectedProgram, setSelectedProgram] = useState(programs[0].id);
  const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const data = await getCoursesBySemester(selectedProgram, selectedSemester);
    setCourses(data);
    setLoading(false);
  }, [selectedProgram, selectedSemester]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);

  return (
    <PageContainer>
      <SectionHeader
        title="Course Browser"
        description="Select a program and semester to browse available courses."
      />

      <SemesterFilterBar
        programs={programs}
        selectedProgram={selectedProgram}
        selectedSemester={selectedSemester}
        semesters={semesters}
        onProgramChange={setSelectedProgram}
        onSemesterChange={setSelectedSemester}
      />

      {loading ? (
        <CourseTableSkeleton />
      ) : courses.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <CourseTable courses={courses} />
          <div className="mt-4">
            <CourseTableFooter
              totalCredits={totalCredits}
              courseCount={courses.length}
            />
          </div>
        </>
      )}
    </PageContainer>
  );
}
