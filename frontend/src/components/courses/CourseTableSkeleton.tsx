import { Skeleton } from "@/components/common";

export function CourseTableSkeleton() {
  return (
    <div className="animate-pulse rounded-card border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 px-6 py-4 ${i % 2 === 1 ? "bg-slate-50/40" : ""}`}
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
