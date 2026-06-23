import { apiClient } from "./api";
import type { Course, Program } from "@/types";

const PROGRAM_MAP: Record<string, { program: string; branch: string }> = {
  cse: { program: "BTECH", branch: "CSE" },
  ece: { program: "BTECH", branch: "ECE" },
};

export async function getPrograms(): Promise<Program[]> {
  return apiClient.get<Program[]>("/api/programs");
}

export async function getCoursesBySemester(
  programId: string,
  semester: number
): Promise<Course[]> {
  const mapped = PROGRAM_MAP[programId.toLowerCase()] ?? {
    program: programId.toUpperCase(),
    branch: programId.toUpperCase(),
  };
  const data = await apiClient.get<{ semester: number; courses: Course[] }>(
    "/api/curriculum/semester",
    { program: mapped.program, branch: mapped.branch, batch_year: 2023, semester }
  );
  return data.courses;
}

export async function getAllCoursesForProgram(programId: string): Promise<Course[]> {
  const mapped = PROGRAM_MAP[programId.toLowerCase()] ?? {
    program: programId.toUpperCase(),
    branch: programId.toUpperCase(),
  };
  const all: Course[] = [];
  for (let sem = 1; sem <= 8; sem++) {
    try {
      const data = await apiClient.get<{ semester: number; courses: Course[] }>(
        "/api/curriculum/semester",
        { program: mapped.program, branch: mapped.branch, batch_year: 2023, semester: sem }
      );
      if (data.courses.length === 0) break;
      all.push(...data.courses);
    } catch {
      break;
    }
  }
  return all;
}

export async function getPreviewCourses(
  programCode: string,
  branchCode: string,
  batchYear: number = 2023,
  limit: number = 6
): Promise<Course[]> {
  const data = await apiClient.get<{ courses: Course[] }>("/api/courses/preview", {
    program: programCode,
    branch: branchCode,
    batch_year: batchYear,
    limit,
  });
  return data.courses;
}
