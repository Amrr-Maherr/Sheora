"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBrands } from "@/features/brands";
import { useCategories } from "@/features/categories";
import { useCatalogProducts } from "@/features/products";
import {
  addRecentSearch,
  readRecentSearches,
  removeRecentSearch,
} from "../lib/recentSearches";
import { SearchOverlayPresenter } from "./SearchOverlayPresenter";

const POPULAR_SEARCHES = [
  "سيروم هيالورونيك مركز",
  "عطر لو دامير",
  "غسول سيرافيه المرطب",
  "روح أحمر مخملي",
  "طقم هدايا ملكي",
];

type SearchOverlayContainerProps = {
  onClose: () => void;
  initialQuery?: string;
};

export function SearchOverlayContainer({
  onClose,
  initialQuery = "",
}: SearchOverlayContainerProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(
    null,
  );
  const [recentSearches, setRecentSearches] =
    useState<string[]>(readRecentSearches);

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const {
    data,
    isLoading,
    isError,
  } = useCatalogProducts({
    search: debouncedQuery.trim() || undefined,
    categorySlug: activeCategorySlug ?? undefined,
    perPage: 8,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (panelRef.current?.contains(target)) {
        return;
      }

      if (
        target instanceof Element &&
        target.closest("[data-search-trigger]")
      ) {
        return;
      }

      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [onClose]);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchedCategories = (
    normalizedQuery
      ? categories.filter((category) =>
          category.name.toLocaleLowerCase().includes(normalizedQuery),
        )
      : categories.slice(0, 4)
  ).slice(0, 4);
  const matchedBrands = (
    normalizedQuery
      ? brands.filter((brand) =>
          brand.name.toLocaleLowerCase().includes(normalizedQuery),
        )
      : brands.slice(0, 4)
  ).slice(0, 4);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = query.trim();

    if (!value) {
      return;
    }

    setRecentSearches(addRecentSearch(value));
    const params = new URLSearchParams({ q: value });

    if (activeCategorySlug) {
      params.set("category", activeCategorySlug);
    }

    onClose();
    router.push(`/products?${params.toString()}`);
  };

  const handleSelectQuery = (value: string) => {
    setQuery(value);
    setDebouncedQuery(value);
    inputRef.current?.focus();
  };

  const handleRemoveRecent = (value: string) => {
    setRecentSearches(removeRecentSearch(value));
  };

  return (
    <SearchOverlayPresenter
      panelRef={panelRef}
      inputRef={inputRef}
      query={query}
      onQueryChange={setQuery}
      onSubmit={handleSubmit}
      onClose={onClose}
      categories={categories}
      activeCategorySlug={activeCategorySlug}
      onSelectCategory={setActiveCategorySlug}
      products={data?.products ?? []}
      totalCount={data?.meta.total ?? 0}
      isLoading={isLoading}
      isError={isError}
      recentSearches={recentSearches}
      popularSearches={POPULAR_SEARCHES}
      onSelectQuery={handleSelectQuery}
      onRemoveRecent={handleRemoveRecent}
      matchedCategories={matchedCategories}
      matchedBrands={matchedBrands}
    />
  );
}
