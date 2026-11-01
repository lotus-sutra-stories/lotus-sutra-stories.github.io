"use client";

import { useSyncExternalStore } from "react";

import {
  DEFAULT_PREFS,
  PREFS_KEY,
  parsePrefs,
  type ReaderPrefs,
} from "@/components/site/reading-prefs";

/**
 * Reader-preferences store backed by localStorage, consumed via
 * useSyncExternalStore. Module-level cache keeps getSnapshot referentially
 * stable; updates flow through updateReaderPrefs (cache + persist +
 * notify). The server snapshot is the default prefs so static generation
 * and hydration render identically, swapping to the user's stored prefs
 * after mount.
 */

let cache: ReaderPrefs | null = null;
const listeners = new Set<() => void>();

function read(): ReaderPrefs {
  if (cache) return cache;
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    cache = parsePrefs(window.localStorage.getItem(PREFS_KEY));
  } catch {
    cache = DEFAULT_PREFS;
  }
  return cache;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot(): ReaderPrefs {
  return read();
}

function getServerSnapshot(): ReaderPrefs {
  return DEFAULT_PREFS;
}

export function useReaderPrefs(): ReaderPrefs {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function updateReaderPrefs(next: ReaderPrefs): void {
  cache = next;
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable (private mode); keep the in-memory value.
  }
  for (const listener of listeners) listener();
}
