import { Course, SearchResult } from '@/types/course';
import { mockCourses } from '@/data/mockCourses';

export async function getCoursesBySemester(
  programId: string,
  semester: number
): Promise<Course[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return mockCourses.filter(
    (course) =>
      course.programId === programId && course.semester === semester
  );
}

export async function searchCourses(
  query: string
): Promise<SearchResult[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (query.toLowerCase().trim() === 'error') {
    throw new Error('SERVICE_UNAVAILABLE');
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  if (!normalizedQuery || queryWords.length === 0) {
    return [];
  }

  const resultsMap = new Map<string, SearchResult>();

  for (const course of mockCourses) {
    const codeNormalized = course.code.toLowerCase().trim();
    const aliases = (course.aliases ?? []).map((a) => a.toLowerCase().trim());
    const nameLower = course.name.toLowerCase();

    let rank: 1 | 2 | 3 = 3;
    let matchedAlias: string | undefined;

    // Step 1 — Exact code match (rank 1)
    if (codeNormalized === normalizedQuery) {
      rank = 1;
    }
    // Step 2 — Alias match (rank 2)
    else if (aliases.includes(normalizedQuery)) {
      rank = 2;
      matchedAlias = aliases.find((a) => a === normalizedQuery);
    }
    // Step 2b — Also check if any alias matches via word-level (e.g. "compter science" matching "computer science")
    else if (aliases.some((a) => a.includes(normalizedQuery))) {
      rank = 2;
      matchedAlias = aliases.find((a) => a.includes(normalizedQuery));
    }
    else {
      // Step 3 — Partial name match (rank 3)
      // Check if course name includes the full query
      let partialMatch = nameLower.includes(normalizedQuery);

      // Also check if any query word appears in the course name
      if (!partialMatch) {
        partialMatch = queryWords.some((word) =>
          nameLower.includes(word)
        );
      }

      // Also check aliases for word-level partial match
      if (!partialMatch) {
        partialMatch = aliases.some((alias) =>
          queryWords.some((word) => alias.includes(word))
        );
      }

      if (!partialMatch) {
        continue;
      }
      rank = 3;
    }

    const existing = resultsMap.get(course.id);
    if (!existing || rank < existing.rank) {
      resultsMap.set(course.id, {
        course_id: course.id,
        course_name: course.name,
        course_code: course.code,
        category: course.category,
        credits: course.credits,
        semester: course.semester,
        rank,
        matched_alias: matchedAlias,
      });
    }
  }

  const results = Array.from(resultsMap.values());

  results.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.course_name.localeCompare(b.course_name);
  });

  return results.slice(0, 10);
}
