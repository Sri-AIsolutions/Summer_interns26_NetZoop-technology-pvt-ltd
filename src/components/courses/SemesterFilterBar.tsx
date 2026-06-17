'use client';

import { Program } from '@/types/course';

interface SemesterFilterBarProps {
  programs: Program[];
  selectedProgram: string;
  selectedSemester: number;
  semesters: number[];
  onProgramChange: (programId: string) => void;
  onSemesterChange: (semester: number) => void;
}

export default function SemesterFilterBar({
  programs,
  selectedProgram,
  selectedSemester,
  semesters,
  onProgramChange,
  onSemesterChange,
}: SemesterFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <label
          htmlFor="program-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Program
        </label>
        <select
          id="program-select"
          value={selectedProgram}
          onChange={(e) => onProgramChange(e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label
          htmlFor="semester-select"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Semester
        </label>
        <select
          id="semester-select"
          value={selectedSemester}
          onChange={(e) => onSemesterChange(Number(e.target.value))}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
