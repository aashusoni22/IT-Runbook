import { SearchClient } from "@/components/search-client";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  return <SearchClient initialQuery={q} />;
}
