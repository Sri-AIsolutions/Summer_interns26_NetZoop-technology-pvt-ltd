import Link from "next/link";

export function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div className="grid h-auto grid-cols-1 gap-4 md:h-[500px] md:grid-cols-4 md:grid-rows-2">
        {/* Feature 1 — Dark card spanning 2 cols x 2 rows */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900 p-8 text-white md:col-span-2 md:row-span-2">
          <div className="relative z-10">
            <svg
              className="mb-4 h-8 w-8 text-brand-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
              />
            </svg>
            <h3 className="text-3xl font-black leading-tight">
              Instant Degree Audits &amp; <br />
              Credit Analysis
            </h3>
            <p className="mt-4 max-w-sm text-neutral-400">
              Never guess how many credits you need. Let our AI analyze your
              progress and suggest the fastest path to graduation.
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-brand-700/20 blur-3xl transition-all duration-500 group-hover:bg-brand-700/40" />
        </div>

        {/* Feature 2 — Compare Electives */}
        <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Compare Electives
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Side-by-side comparison of difficulty and workload.
            </p>
            <Link
              href="/compare"
              className="mt-3 inline-block text-sm font-semibold text-brand-500 hover:text-brand-600"
            >
              Try it now &rarr;
            </Link>
          </div>
          <svg
            className="ml-4 h-10 w-10 text-brand-200"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </div>

        {/* Feature 3 — Active Courses Stat */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white p-8 text-center">
          <span className="text-4xl font-black text-brand-500">2.5k+</span>
          <span className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            Active Courses
          </span>
        </div>

        {/* Feature 4 — AI Engine */}
        <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-700 p-8 text-center text-white">
          <span className="text-4xl font-black">AI</span>
          <span className="mt-2 text-xs font-bold uppercase tracking-widest text-white/60">
            Driven Engine
          </span>
        </div>
      </div>
    </section>
  );
}
