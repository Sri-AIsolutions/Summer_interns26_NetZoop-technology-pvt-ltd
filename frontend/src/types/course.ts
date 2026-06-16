export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  description: string;
  department: string;
  program: string;
  semester: number;
}

export interface Program {
  id: string;
  name: string;
  code: string;
  duration: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Semester {
  number: number;
  courses: Course[];
}
