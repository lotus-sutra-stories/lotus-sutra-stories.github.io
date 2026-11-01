"use client";

import { useSyncExternalStore } from "react";

/**
 * Bookmark store backed by localStorage, consumed via
 * useSyncExternalStore. This is the "external system" pattern: the cache is
 * module-level (so getSnapshot is referentially stable), updates go through
 * toggleBookmark (which mutates the cache and notifies listeners), and the
 * server snapshot is a stable empty set for SSR/static export.
 *
 * Bookmarks are stored ONLY in the user's browser — no login, no account,
 * no network.
 */

const KEY = "lss-bookmarks";

const EMPTY: ReadonlySet<string> = new Set<string>();

let cache: ReadonlySet<string> | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): ReadonlySet<string> {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    cache = new Set(
      Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [],
    );
  } catch {
    cache = new Set();
  }
  return cache;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  // Sync across tabs in the same browser.
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ReadonlySet<string> {
  return readFromStorage();
}

function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY;
}

export function useBookmarks(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function toggleBookmark(slug: string): ReadonlySet<string> {
  const current = readFromStorage();
  const next = new Set(current);
  if (next.has(slug)) {
    next.delete(slug);
  } else {
    next.add(slug);
  }
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...next]));
  } catch {
    // Storage may be unavailable (private mode); keep the in-memory set.
  }
  for (const listener of listeners) listener();
  return next;
}
