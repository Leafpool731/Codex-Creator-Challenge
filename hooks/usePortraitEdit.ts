"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  createPortraitEditCacheKey,
  normalizePortraitEditDescriptor,
  type PortraitEditDescriptor,
  type PortraitEditResponse
} from "@/lib/cache/cacheKey";

export type PortraitEditUiStatus =
  | "idle"
  | "optimistic"
  | "loading"
  | "cached"
  | "refined"
  | "fallback"
  | "error";

export interface PortraitEditUiState {
  status: PortraitEditUiStatus;
  imageUrl?: string;
  editType?: PortraitEditDescriptor["editType"];
  cacheKey?: string;
  cacheHit: boolean;
  aiRefined: boolean;
  source?: PortraitEditResponse["source"];
  message?: string;
}

interface UsePortraitEditOptions {
  enabled?: boolean;
  debounceMs?: number;
}

const clientPortraitEditCache = new Map<string, PortraitEditResponse>();
const preloadRequests = new Map<string, Promise<void>>();

function responseToUiState(response: PortraitEditResponse): PortraitEditUiState {
  return {
    status: response.aiRefined
      ? response.cacheHit || response.status === "precomputed"
        ? "cached"
        : "refined"
      : "fallback",
    imageUrl: response.imageUrl,
    editType: response.editType,
    cacheKey: response.cacheKey,
    cacheHit: response.cacheHit,
    aiRefined: response.aiRefined,
    source: response.source,
    message: response.message
  };
}

async function requestPortraitEdit(
  descriptor: PortraitEditDescriptor,
  signal?: AbortSignal
): Promise<PortraitEditResponse> {
  const response = await fetch("/api/edit-portrait", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizePortraitEditDescriptor(descriptor)),
    signal
  });

  if (!response.ok) {
    throw new Error(`Portrait edit request failed with ${response.status}.`);
  }

  return (await response.json()) as PortraitEditResponse;
}

export function preloadPortraitEdit(descriptor: PortraitEditDescriptor): void {
  const normalized = normalizePortraitEditDescriptor(descriptor);
  const cacheKey = createPortraitEditCacheKey(normalized);

  if (clientPortraitEditCache.has(cacheKey) || preloadRequests.has(cacheKey)) {
    return;
  }

  const preload = requestPortraitEdit(normalized)
    .then((response) => {
      clientPortraitEditCache.set(response.cacheKey, response);
    })
    .catch(() => {
      // Preloading is speculative; the interactive request will surface failures.
    })
    .finally(() => {
      preloadRequests.delete(cacheKey);
    });

  preloadRequests.set(cacheKey, preload);
}

export function usePortraitEdit(
  descriptor: PortraitEditDescriptor | null,
  { enabled = true, debounceMs = 625 }: UsePortraitEditOptions = {}
): PortraitEditUiState {
  const cacheKey = useMemo(() => {
    return descriptor ? createPortraitEditCacheKey(descriptor) : null;
  }, [descriptor]);
  const latestKeyRef = useRef<string | null>(null);
  const [state, setState] = useState<PortraitEditUiState>({
    status: "idle",
    cacheHit: false,
    aiRefined: false
  });

  useEffect(() => {
    if (!descriptor || !enabled || !cacheKey) {
      latestKeyRef.current = null;
      setState({ status: "idle", cacheHit: false, aiRefined: false });
      return undefined;
    }

    const normalized = normalizePortraitEditDescriptor(descriptor);
    const cached = clientPortraitEditCache.get(cacheKey);

    latestKeyRef.current = cacheKey;

    if (cached) {
      setState(responseToUiState({ ...cached, cacheHit: true }));
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setState({
        status: "loading",
        cacheKey,
        editType: normalized.editType,
        cacheHit: false,
        aiRefined: false,
        message: "AI refining..."
      });

      requestPortraitEdit(normalized, controller.signal)
        .then((response) => {
          clientPortraitEditCache.set(response.cacheKey, response);

          if (latestKeyRef.current === response.cacheKey) {
            setState(responseToUiState(response));
          }
        })
        .catch((error) => {
          if (controller.signal.aborted) {
            return;
          }

          if (latestKeyRef.current === cacheKey) {
            setState({
              status: "error",
              cacheKey,
              editType: normalized.editType,
              cacheHit: false,
              aiRefined: false,
              message:
                error instanceof Error
                  ? error.message
                  : "Portrait edit request failed."
            });
          }
        });
    }, debounceMs);

    setState({
      status: "optimistic",
      cacheKey,
      editType: normalized.editType,
      cacheHit: false,
      aiRefined: false,
      message: "Using instant preview while AI refines."
    });

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [cacheKey, debounceMs, descriptor, enabled]);

  return state;
}
