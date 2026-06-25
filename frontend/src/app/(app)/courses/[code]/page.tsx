"use client";

import { use } from "react";
import { CourseDetailView } from "@/components/course/CourseDetailView";

export default function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ program?: string }>;
}) {
  const { code } = use(params);
  const { program } = use(searchParams);

  return <CourseDetailView code={code} programId={program} />;
}
