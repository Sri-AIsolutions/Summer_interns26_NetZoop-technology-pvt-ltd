import type { ReactNode } from "react";

interface HeroSectionProps {
  children?: ReactNode;
}

export function HeroSection({ children }: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-[480px] items-center justify-center overflow-hidden sm:min-h-[560px] lg:min-h-[600px]"
      style={{
        background: "linear-gradient(135deg, #b50346 0%, #91083c 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center">
        <div className="animate-fadeIn">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Find Your Course,<br className="hidden sm:inline" /> Instantly
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-white/90 sm:text-xl">
            Search courses, credits, semesters, electives and curriculum
            information across programs.
          </p>
        </div>
        {children && (
          <div className="mt-10 animate-slideUp">{children}</div>
        )}
      </div>
    </section>
  );
}
