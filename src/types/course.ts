export type CourseCategory = 'Core' | 'Elective' | 'Lab' | 'Audit';

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  category: CourseCategory;
  programId: string;
  semester: number;
  aliases?: string[];
}

export interface Program {
  id: string;
  name: string;
}

export interface SearchResult {
  course_id: string;
  course_name: string;
  course_code: string;
  category: CourseCategory;
  credits: number;
  semester: number;
  rank: 1 | 2 | 3;
  matched_alias?: string;
}
