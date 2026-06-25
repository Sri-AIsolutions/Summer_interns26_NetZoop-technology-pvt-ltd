interface SourceInfoCardProps {
  department: string;
}

export function SourceInfoCard({ department }: SourceInfoCardProps) {
  return (
    <div className="rounded-2xl bg-slate-800 p-6 text-white shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <svg className="h-5 w-5 text-white/70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="text-sm font-bold text-white/90">Source Information</h4>
          <div className="space-y-1.5 text-sm text-white/60">
            <p>Department of {department}</p>
            <p>2024 Academic Handbook &mdash; Amrita Vishwa Vidyapeetham</p>
            <p>Last updated: January 2024</p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
              <svg className="h-3.5 w-3.5 text-white/70" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <span className="text-sm text-white/50">
              curriculum@amrita.edu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
