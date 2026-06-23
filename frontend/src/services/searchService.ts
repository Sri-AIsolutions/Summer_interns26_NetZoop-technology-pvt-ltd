import { apiClient } from "./api";
import type { Course } from "@/types";

export async function searchCourses(rawQuery: string): Promise<Course[]> {
  const data = await apiClient.get<{
    data: Course[];
    pagination: { page: number; limit: number; total: number };
  }>("/api/search", { q: rawQuery, page: 1, limit: 20 });
  return data.data;
}

export async function getSuggestions(query: string): Promise<string[]> {
  const data = await apiClient.get<{ suggestions: string[] }>(
    "/api/search/suggestions",
    { q: query }
  );
  return data.suggestions;
}
