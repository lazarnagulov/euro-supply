import { useEffect, useRef, useCallback } from 'react';
import { usePageVisibility } from './usePageVisibility';

interface UsePollingOptions<T> {
    fetchFn: () => Promise<T>;
    onSuccess: (data: T) => void;
    onError?: (error: Error) => void;
    interval?: number;
    enabled?: boolean;
    immediateFirstFetch?: boolean;
}

export function usePolling<T>({
    fetchFn,
    onSuccess,
    onError,
    interval = 5 * 60 * 1000,
    enabled = true,
    immediateFirstFetch = false,
}: UsePollingOptions<T>) {
    const isPageVisible = usePageVisibility();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isMountedRef = useRef(true);

    const fetch = useCallback(async () => {
        if (!enabled || !isPageVisible) return;

        try {
            const data = await fetchFn();

            if (isMountedRef.current) {
                onSuccess(data);
            }
        } catch (error) {
            if (onError && isMountedRef.current) {
                onError(error as Error);
            }
        }
    }, [fetchFn, enabled, isPageVisible, onSuccess, onError]);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (!isPageVisible || !enabled) {
            return;
        }

        if (immediateFirstFetch) {
            fetch();
        }

        intervalRef.current = setInterval(() => {
            fetch();
        }, interval);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [fetch, interval, isPageVisible, enabled, immediateFirstFetch]);

    return { refresh: fetch };
}