interface CreditProgressionBarProps {
  completedCredits: number;
  totalTarget: number;
}

export function CreditProgressionBar({
  completedCredits,
  totalTarget,
}: CreditProgressionBarProps) {
  const percentage = Math.min(
    Math.round((completedCredits / totalTarget) * 100),
    100
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-bold text-slate-800">Credit Progression</span>
        <span className="text-xs font-semibold text-brand-600">
          {percentage}%
        </span>
      </div>
      <p className="mb-3 text-xs text-slate-400">
        {completedCredits} of {totalTarget} credits completed
      </p>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
