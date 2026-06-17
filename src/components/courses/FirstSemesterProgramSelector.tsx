'use client';

import { Program } from '@/types/course';

interface FirstSemesterProgramSelectorProps {
  programs: Program[];
  selectedProgramId: string;
  onChange: (programId: string) => void;
}

export default function FirstSemesterProgramSelector({
  programs,
  selectedProgramId,
  onChange,
}: FirstSemesterProgramSelectorProps) {
  return (
    <div className="mb-6">
      <label
        htmlFor="first-semester-program-select"
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        Program
      </label>
      <select
        id="first-semester-program-select"
        value={selectedProgramId}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select your program"
        className="block w-full sm:w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      >
        {programs.map((program) => (
          <option key={program.id} value={program.id}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  );
}
