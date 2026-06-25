interface LTPVisualCardsProps {
  lecture: number;
  tutorial: number;
  practical: number;
}

export function LTPVisualCards({
  lecture,
  tutorial,
  practical,
}: LTPVisualCardsProps) {
  const cards = [
    {
      label: "Lecture",
      letter: "L",
      value: lecture,
      color: "brand",
      desc: "Theoretical instruction hours per week",
      bg: "bg-blue-50",
      text: "text-blue-700",
      valueText: "text-blue-600",
      watermark: "text-blue-200/60",
    },
    {
      label: "Tutorial",
      letter: "T",
      value: tutorial,
      color: "amber",
      desc: "Small group problem-solving sessions",
      bg: "bg-amber-50",
      text: "text-amber-700",
      valueText: "text-amber-600",
      watermark: "text-amber-200/60",
    },
    {
      label: "Practical",
      letter: "P",
      value: practical,
      color: "emerald",
      desc: "Hands-on lab or project work",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      valueText: "text-emerald-600",
      watermark: "text-emerald-200/60",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-2xl border ${card.bg} p-6 shadow-sm`}
        >
          <div className={`pointer-events-none absolute -bottom-3 -right-2 select-none text-[96px] font-black leading-none ${card.watermark}`}>
            {card.letter}
          </div>
          <div className="relative z-10">
            <p className={`text-4xl font-black ${card.valueText}`}>
              {card.value}
            </p>
            <p className={`mt-1 text-sm font-bold ${card.text}`}>
              {card.label}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {card.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
