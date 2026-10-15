"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Client-only current year. Avoids reading the clock during prerender. */
export function useCurrentYear() {
  return useSyncExternalStore(
    subscribe,
    () => String(new Date().getFullYear()),
    () => "",
  );
}
