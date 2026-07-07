"use client";

import { useCallback, useEffect, useState } from "react";
import { readFavorites, toggleFavorite } from "@/lib/storage";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readFavorites());
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites(toggleFavorite(id));
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggle, isFavorite };
}
