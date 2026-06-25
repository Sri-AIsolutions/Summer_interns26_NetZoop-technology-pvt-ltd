import { mockCoursesData, mockProgramsData } from "@/data/mockCourses";
import type { Course, Program } from "@/types";

export function getPrograms(): Program[] {
  return mockProgramsData;
}

export async function getCoursesBySemester(
  programId: string,
  semester: number
): Promise<Course[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const program = mockProgramsData.find((p) => p.id === programId);
  if (!program) return [];

  return mockCoursesData.filter(
    (course) => course.program === program.name && course.semester === semester
  );
}

export async function getCourseByCode(
  code: string,
  programId?: string
): Promise<Course | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const codeUpper = code.toUpperCase();
  const matches = mockCoursesData.filter((c) => c.code === codeUpper);

  if (matches.length === 0) return null;

  if (matches.length === 1) return matches[0];

  if (programId) {
    const program = mockProgramsData.find((p) => p.id === programId);
    if (program) {
      const programMatch = matches.find((c) => c.program === program.name);
      if (programMatch) return programMatch;
    }
  }

  return matches[0];
}

export async function getRelatedCourses(course: Course): Promise<Course[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));

  return mockCoursesData.filter(
    (c) =>
      c.id !== course.id &&
      (c.department === course.department || c.semester === course.semester) &&
      c.program === course.program
  );
}
