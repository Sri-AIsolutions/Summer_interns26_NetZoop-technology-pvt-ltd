import type { Program } from "@/types";

interface SemesterFilterBarProps {
  programs: Program[];
  selectedProgram: string;
  selectedSemester: number;
  onProgramChange: (programId: string) => void;
  onSemesterChange: (semester: number) => void;
}

export function SemesterFilterBar({
  programs,
  selectedProgram,
  selectedSemester,
  onProgramChange,
  onSemesterChange,
}: SemesterFilterBarProps) {
  const selectedProgramObj = programs.find((p) => p.id === selectedProgram);
  const semesters = selectedProgramObj
    ? Array.from({ length: selectedProgramObj.duration }, (_, i) => i + 1)
    : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <select
          value={selectedProgram}
          onChange={(e) => onProgramChange(e.target.value)}
          className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:w-72"
          aria-label="Select program"
        >
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Semester">
        {semesters.map((sem) => (
          <button
            key={sem}
            type="button"
            role="tab"
            aria-selected={selectedSemester === sem}
            onClick={() => onSemesterChange(sem)}
            className={`rounded-xl px-5 py-2 text-sm font-semibold transition-all ${
              selectedSemester === sem
                ? "bg-brand-500 text-white shadow-lg ring-2 ring-brand-500/30"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Sem {sem}
          </button>
        ))}
      </div>
    </div>
  );
}
