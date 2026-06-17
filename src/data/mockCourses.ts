import { Course, Program } from '@/types/course';

export const programs: Program[] = [
  { id: 'cs', name: 'Computer Science' },
  { id: 'ds', name: 'Data Science' },
];

export const mockCourses: Course[] = [
  // Computer Science - Semester 1
  { id: 'cs-101', code: 'CS101', name: 'Introduction to Programming', credits: 4, category: 'Core', programId: 'cs', semester: 1, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'cs-102', code: 'MATH101', name: 'Calculus I', credits: 4, category: 'Core', programId: 'cs', semester: 1, aliases: ['maths', 'mathematics'] },
  { id: 'cs-103', code: 'CS103', name: 'Discrete Mathematics', credits: 3, category: 'Core', programId: 'cs', semester: 1, aliases: ['cse', 'btech cse', 'computer science', 'maths'] },
  { id: 'cs-104', code: 'ENG101', name: 'Technical Communication', credits: 2, category: 'Audit', programId: 'cs', semester: 1, aliases: ['cse', 'btech cse'] },
  { id: 'cs-105', code: 'CS105', name: 'Digital Logic & Design', credits: 3, category: 'Core', programId: 'cs', semester: 1, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'cs-106', code: 'CS106', name: 'Programming Lab I', credits: 2, category: 'Lab', programId: 'cs', semester: 1, aliases: ['cse', 'btech cse'] },

  // Computer Science - Semester 2
  { id: 'cs-201', code: 'CS201', name: 'Data Structures', credits: 4, category: 'Core', programId: 'cs', semester: 2, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'cs-202', code: 'MATH201', name: 'Linear Algebra', credits: 3, category: 'Core', programId: 'cs', semester: 2, aliases: ['maths', 'mathematics'] },
  { id: 'cs-203', code: 'CS203', name: 'Object-Oriented Programming', credits: 4, category: 'Core', programId: 'cs', semester: 2, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'cs-204', code: 'CS204', name: 'Web Development Fundamentals', credits: 3, category: 'Elective', programId: 'cs', semester: 2, aliases: ['cse', 'btech cse'] },
  { id: 'cs-205', code: 'CS205', name: 'Data Structures Lab', credits: 2, category: 'Lab', programId: 'cs', semester: 2, aliases: ['cse', 'btech cse'] },

  // Computer Science - Semester 3
  { id: 'cs-301', code: 'CS301', name: 'Algorithms', credits: 4, category: 'Core', programId: 'cs', semester: 3, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'cs-302', code: 'CS302', name: 'Database Management Systems', credits: 4, category: 'Core', programId: 'cs', semester: 3, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'cs-303', code: 'CS303', name: 'Computer Networks', credits: 3, category: 'Core', programId: 'cs', semester: 3, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'cs-304', code: 'CS304', name: 'Machine Learning', credits: 3, category: 'Elective', programId: 'cs', semester: 3, aliases: ['cse', 'btech cse', 'ai', 'artificial intelligence'] },
  { id: 'cs-305', code: 'CS305', name: 'DBMS Lab', credits: 2, category: 'Lab', programId: 'cs', semester: 3, aliases: ['cse', 'btech cse'] },
  { id: 'cs-306', code: 'MATH301', name: 'Probability & Statistics', credits: 3, category: 'Core', programId: 'cs', semester: 3, aliases: ['maths', 'mathematics'] },

  // Computer Science - Semester 4
  { id: 'cs-401', code: 'CS401', name: 'Operating Systems', credits: 4, category: 'Core', programId: 'cs', semester: 4, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'cs-402', code: 'CS402', name: 'Software Engineering', credits: 3, category: 'Core', programId: 'cs', semester: 4, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'cs-403', code: 'CS403', name: 'Cybersecurity Essentials', credits: 3, category: 'Elective', programId: 'cs', semester: 4, aliases: ['cse', 'btech cse'] },
  { id: 'cs-404', code: 'CS404', name: 'Cloud Computing', credits: 3, category: 'Elective', programId: 'cs', semester: 4, aliases: ['cse', 'btech cse'] },
  { id: 'cs-405', code: 'CS405', name: 'Professional Ethics', credits: 1, category: 'Audit', programId: 'cs', semester: 4, aliases: ['cse', 'btech cse'] },
  { id: 'cs-406', code: 'CS406', name: 'Networks Lab', credits: 2, category: 'Lab', programId: 'cs', semester: 4, aliases: ['cse', 'btech cse'] },

  // Data Science - Semester 1
  { id: 'ds-101', code: 'DS101', name: 'Introduction to Data Science', credits: 4, category: 'Core', programId: 'ds', semester: 1, aliases: ['data science'] },
  { id: 'ds-102', code: 'MATH101', name: 'Calculus I', credits: 4, category: 'Core', programId: 'ds', semester: 1, aliases: ['maths', 'mathematics'] },
  { id: 'ds-103', code: 'DS103', name: 'Python Programming', credits: 4, category: 'Core', programId: 'ds', semester: 1, aliases: ['data science'] },
  { id: 'ds-104', code: 'ENG101', name: 'Technical Communication', credits: 2, category: 'Audit', programId: 'ds', semester: 1 },
  { id: 'ds-105', code: 'DS105', name: 'Python Lab', credits: 2, category: 'Lab', programId: 'ds', semester: 1 },

  // Data Science - Semester 2
  { id: 'ds-201', code: 'DS201', name: 'Data Wrangling', credits: 3, category: 'Core', programId: 'ds', semester: 2, aliases: ['data science'] },
  { id: 'ds-202', code: 'MATH201', name: 'Linear Algebra', credits: 3, category: 'Core', programId: 'ds', semester: 2, aliases: ['maths', 'mathematics'] },
  { id: 'ds-203', code: 'DS203', name: 'Statistics for Data Science', credits: 4, category: 'Core', programId: 'ds', semester: 2, aliases: ['data science', 'maths'] },
  { id: 'ds-204', code: 'DS204', name: 'Data Visualization', credits: 3, category: 'Elective', programId: 'ds', semester: 2, aliases: ['data science'] },
  { id: 'ds-205', code: 'DS205', name: 'Data Wrangling Lab', credits: 2, category: 'Lab', programId: 'ds', semester: 2 },

  // Data Science - Semester 3
  { id: 'ds-301', code: 'DS301', name: 'Machine Learning', credits: 4, category: 'Core', programId: 'ds', semester: 3, aliases: ['data science', 'ai', 'artificial intelligence'] },
  { id: 'ds-302', code: 'DS302', name: 'Big Data Analytics', credits: 3, category: 'Core', programId: 'ds', semester: 3, aliases: ['data science'] },
  { id: 'ds-303', code: 'DS303', name: 'Database Systems', credits: 3, category: 'Core', programId: 'ds', semester: 3, aliases: ['data science'] },
  { id: 'ds-304', code: 'DS304', name: 'Natural Language Processing', credits: 3, category: 'Elective', programId: 'ds', semester: 3, aliases: ['data science', 'ai'] },
  { id: 'ds-305', code: 'DS305', name: 'ML Lab', credits: 2, category: 'Lab', programId: 'ds', semester: 3, aliases: ['data science'] },

  // Data Science - Semester 4
  { id: 'ds-401', code: 'DS401', name: 'Deep Learning', credits: 4, category: 'Core', programId: 'ds', semester: 4, aliases: ['data science', 'ai'] },
  { id: 'ds-402', code: 'DS402', name: 'Data Engineering', credits: 3, category: 'Core', programId: 'ds', semester: 4, aliases: ['data science'] },
  { id: 'ds-403', code: 'DS403', name: 'Business Intelligence', credits: 3, category: 'Elective', programId: 'ds', semester: 4, aliases: ['data science'] },
  { id: 'ds-404', code: 'DS404', name: 'Time Series Analysis', credits: 3, category: 'Elective', programId: 'ds', semester: 4 },
  { id: 'ds-405', code: 'DS405', name: 'Research Methodology', credits: 1, category: 'Audit', programId: 'ds', semester: 4 },
  { id: 'ds-406', code: 'DS406', name: 'Deep Learning Lab', credits: 2, category: 'Lab', programId: 'ds', semester: 4 },

  // Additional courses for search coverage
  { id: 'cse-101', code: 'CSE101', name: 'Computer Science Engineering', credits: 4, category: 'Core', programId: 'cs', semester: 1, aliases: ['cse', 'btech cse', 'computer science'] },
  { id: 'ma-101', code: 'MA101', name: 'Engineering Mathematics', credits: 4, category: 'Core', programId: 'cs', semester: 1, aliases: ['maths', 'mathematics'] },
  { id: 'phy-101', code: 'PHY101', name: 'Engineering Physics', credits: 3, category: 'Core', programId: 'cs', semester: 1, aliases: ['phy', 'physics'] },
  { id: 'phy-102', code: 'PHY102', name: 'Physics Lab', credits: 2, category: 'Lab', programId: 'cs', semester: 1, aliases: ['phy', 'physics'] },
];

export const semesters = [1, 2, 3, 4];
