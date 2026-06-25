import { cn } from "@/lib/utils";

interface SemesterSummary {
  number: number;
  credits: number;
  courseCount: number;
  isAvailable: boolean;
}

interface FullJourneyGridProps {
  semesters: SemesterSummary[];
  selectedSemester: number;
  onSelect: (semester: number) => void;
}

export function FullJourneyGrid({
  semesters,
  selectedSemester,
  onSelect,
}: FullJourneyGridProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">
        Full Journey Overview
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {semesters.map((sem) => {
          const isActive = selectedSemester === sem.number;
          return (
            <button
              key={sem.number}
              type="button"
              onClick={() => onSelect(sem.number)}
              className={cn(
                "relative rounded-xl border p-5 text-left transition-all",
                isActive
                  ? "border-brand-500 bg-brand-50/30 ring-2 ring-brand-500/30 shadow-md"
                  : sem.isAvailable
                    ? "border-slate-200 bg-white hover:border-brand-200 hover:shadow-sm"
                    : "border-slate-100 bg-slate-50/50"
              )}
            >
              {sem.isAvailable && !isActive && (
                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
              )}
              <p
                className={cn(
                  "text-xs font-medium uppercase tracking-wider",
                  isActive ? "text-brand-600" : "text-slate-500"
                )}
              >
                Sem {sem.number}
              </p>
              <p
                className={cn(
                  "mt-1 text-2xl font-black",
                  isActive
                    ? "text-brand-700"
                    : sem.isAvailable
                      ? "text-slate-900"
                      : "text-slate-300"
                )}
              >
                {sem.credits}
              </p>
              <p
                className={cn(
                  "text-xs",
                  sem.isAvailable ? "text-slate-500" : "text-slate-300"
                )}
              >
                {sem.isAvailable
                  ? `${sem.courseCount} course${sem.courseCount === 1 ? "" : "s"}`
                  : "Coming Soon"}
              </p>
              {isActive && (
                <span className="mt-2 inline-block rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { SemesterSummary };
