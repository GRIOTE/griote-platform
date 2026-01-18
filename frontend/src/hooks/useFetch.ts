// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';

interface UseFetchOptions<T> {
  fetcher: () => Promise<T>;
  deps?: any[];
}

export function useFetch<T>({ fetcher, deps = [] }: UseFetchOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    fetcher()
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, deps);

  return { data, loading, error };
}
