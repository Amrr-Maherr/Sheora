const RECENT_SEARCHES_KEY = "sheora:recent-searches";
const MAX_RECENT_SEARCHES = 6;

export function readRecentSearches(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]",
    ) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

function writeRecentSearches(searches: string[]) {
  try {
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch {
    // Storage can be unavailable in private mode; keep the in-memory value.
  }
}

export function addRecentSearch(query: string): string[] {
  const value = query.trim();

  if (!value) {
    return readRecentSearches();
  }

  const next = [
    value,
    ...readRecentSearches().filter(
      (item) => item.toLocaleLowerCase() !== value.toLocaleLowerCase(),
    ),
  ].slice(0, MAX_RECENT_SEARCHES);

  writeRecentSearches(next);

  return next;
}

export function removeRecentSearch(query: string): string[] {
  const next = readRecentSearches().filter(
    (item) => item.toLocaleLowerCase() !== query.toLocaleLowerCase(),
  );

  writeRecentSearches(next);

  return next;
}
