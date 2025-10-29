import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

/**
 * Generic data-fetching hook backed by Axios.
 *
 * @param {string} url - Endpoint to call.
 * @param {object} options
 * @param {('GET'|'POST'|'PUT'|'PATCH'|'DELETE')} [options.method='GET']
 * @param {boolean} [options.immediate=true] - Trigger request on mount.
 * @param {object} [options.config={}] - Additional Axios configuration.
 */
const useApi = (url, { method = 'GET', immediate = true, config = {} } = {}) => {
  const isMountedRef = useRef(true);
  const controllerRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(
    async (overrideConfig = {}) => {
      if (!url) {
        return null;
      }

      const abortController = new AbortController();
      controllerRef.current?.abort();
      controllerRef.current = abortController;

      if (isMountedRef.current) {
        setLoading(true);
        setError(null);
      }

      try {
        const response = await axios({
          url,
          method,
          signal: abortController.signal,
          ...config,
          ...overrideConfig,
        });

        if (isMountedRef.current) {
          setData(response.data);
        }

        return response.data;
      } catch (err) {
        if (abortController.signal.aborted) {
          return null;
        }
        if (isMountedRef.current) {
          setError(err);
        }
        throw err;
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    },
    [url, method, config],
  );

  useEffect(() => {
    if (!immediate) {
      return undefined;
    }

    execute().catch(() => undefined);
    return undefined;
  }, [execute, immediate]);

  const refetch = useCallback(
    (overrideConfig) => execute(overrideConfig),
    [execute],
  );

  return {
    data,
    loading,
    error,
    refetch,
    setData,
  };
};

export default useApi;
