"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "./api";

/** Small data hook: loads on mount (and when `path` changes) and exposes reload/setData. */
export function useFetch<T>(path: string | null, auth = false) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      setData(await api<T>(path, { auth }));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [path, auth]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, setData, loading, error, reload: load };
}