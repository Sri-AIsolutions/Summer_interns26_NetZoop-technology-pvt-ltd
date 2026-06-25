"use client";

import type { Course } from "@/types";
import { cn } from "@/lib/utils";

export interface SummaryData {
  type: "credits" | "compare" | "info";
  message: string;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  text: string;
  courses?: Course[];
  summary?: SummaryData;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end animate-slideUp">
      <div className="max-w-xl rounded-2xl rounded-tr-none bg-[#b50346] px-4 py-3 text-sm leading-relaxed text-white shadow-md">
        {text}
      </div>
    </div>
  );
}

function CourseCompactView({ courses }: { courses: Course[] }) {
  if (courses.length === 1) {
    const c = courses[0];
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:border-brand-200">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
            {c.category}
          </span>
          <span className="text-xs font-bold text-neutral-800">{c.credits} Cr</span>
        </div>
        <h5 className="text-sm font-bold text-neutral-800">{c.title}</h5>
        <p className="text-[11px] text-neutral-500">
          {c.code} &middot; L-T-P: {c.lectureHours}-{c.tutorialHours}-{c.practicalHours}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
      {courses.map((c) => (
        <div
          key={c.id}
          className="rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:border-brand-200"
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
              {c.category}
            </span>
            <span className="text-xs font-bold text-neutral-800">{c.credits} Cr</span>
          </div>
          <h5 className="text-sm font-bold text-neutral-800">{c.title}</h5>
          <p className="text-[11px] text-neutral-500">
            {c.code} &middot; Sem {c.semester}
          </p>
        </div>
      ))}
    </div>
  );
}

function SummaryBanner({ summary }: { summary: SummaryData }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border p-4",
        summary.type === "credits" &&
          "border-brand-100 bg-brand-50",
        summary.type === "compare" &&
          "border-indigo-100 bg-indigo-50",
        summary.type === "info" &&
          "border-slate-200 bg-slate-50"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm",
          summary.type === "credits" && "text-brand-700",
          summary.type === "compare" && "text-indigo-600",
          summary.type === "info" && "text-slate-600"
        )}
      >
        {summary.type === "credits" && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        )}
        {summary.type === "compare" && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        )}
        {summary.type === "info" && (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <h4
          className={cn(
            "text-sm font-bold",
            summary.type === "credits" && "text-brand-900",
            summary.type === "compare" && "text-indigo-900",
            summary.type === "info" && "text-slate-900"
          )}
        >
          {summary.type === "credits" && "Total Credits"}
          {summary.type === "compare" && "Stream Comparison"}
          {summary.type === "info" && "Information"}
        </h4>
        <p
          className={cn(
            "text-xs",
            summary.type === "credits" && "text-brand-700/80",
            summary.type === "compare" && "text-indigo-700/80",
            summary.type === "info" && "text-slate-600"
          )}
        >
          {summary.message}
        </p>
      </div>
    </div>
  );
}

function AssistantMessage({
  text,
  courses,
  summary,
}: {
  text: string;
  courses?: Course[];
  summary?: SummaryData;
}) {
  return (
    <div className="flex gap-4 animate-slideUp">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100">
        <span className="text-[10px] font-bold text-brand-700">AI</span>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold tracking-wider text-neutral-400">
          ASSISTANT
        </span>

        {text && (
          <div className="max-w-2xl rounded-2xl rounded-tl-none border border-neutral-100 bg-white p-5 text-sm leading-relaxed text-neutral-800 shadow-sm">
            {text}
          </div>
        )}

        {summary && <SummaryBanner summary={summary} />}

        {courses && courses.length > 0 && <CourseCompactView courses={courses} />}

        {courses && courses.length === 0 && !summary && !text && (
          <p className="text-xs text-slate-400">
            No courses matched your query. Try a different term.
          </p>
        )}
      </div>
    </div>
  );
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "user") {
    return <UserBubble text={message.text} />;
  }

  return (
    <AssistantMessage
      text={message.text}
      courses={message.courses}
      summary={message.summary}
    />
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-4 items-center animate-fadeIn">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100">
        <span className="text-[10px] font-bold text-brand-700">AI</span>
      </div>
      <div className="flex gap-1.5 rounded-full border border-neutral-100 bg-white px-3 py-2">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-700 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-700 [animation-delay:200ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-700 [animation-delay:400ms]" />
      </div>
    </div>
  );
}
