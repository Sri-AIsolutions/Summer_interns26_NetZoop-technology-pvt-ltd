import { apiClient } from "./api";
import type { Course, Program } from "@/types";

interface Branch {
  id: string;
  program_id: string;
  name: string;
  code: string;
}

// Maps shorthand IDs used by homepage/chat ("cse", "ece") to full backend codes
const SHORTHAND_MAP: Record<string, { program: string; branch: string }> = {
  cse: { program: "BTECH", branch: "CSE" },
  ece: { program: "BTECH", branch: "ECE" },
};

async function resolveProgramBranch(
  programId: string
): Promise<{ program: string; branch: string }> {
  const shorthand = SHORTHAND_MAP[programId.toLowerCase()];
  if (shorthand) return shorthand;

  const programCode = programId.toUpperCase();
  const branches = await apiClient.get<Branch[]>(
    `/api/programs/${programCode}/branches`
  );
  const branchCode = branches.length > 0 ? branches[0].code : programCode;
  return { program: programCode, branch: branchCode };
}

export async function getPrograms(): Promise<Program[]> {
  return apiClient.get<Program[]>("/api/programs");
}

export async function getBranches(programCode: string): Promise<Branch[]> {
  return apiClient.get<Branch[]>(`/api/programs/${programCode}/branches`);
}

export async function getCoursesBySemester(
  programId: string,
  semester: number
): Promise<Course[]> {
  const { program, branch } = await resolveProgramBranch(programId);
  const data = await apiClient.get<{ semester: number; courses: Course[] }>(
    "/api/curriculum/semester",
    { program, branch, batch_year: 2023, semester }
  );
  return data.courses;
}

export async function getAllCoursesForProgram(
  programId: string
): Promise<Course[]> {
  const { program, branch } = await resolveProgramBranch(programId);
  const all: Course[] = [];
  for (let sem = 1; sem <= 8; sem++) {
    try {
      const data = await apiClient.get<{ semester: number; courses: Course[] }>(
        "/api/curriculum/semester",
        { program, branch, batch_year: 2023, semester: sem }
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
