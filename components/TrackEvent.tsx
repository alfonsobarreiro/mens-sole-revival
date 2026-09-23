"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires one analytics event when a server-rendered page mounts. Params are
 * serialized so the effect runs once per distinct event, not per render.
 */
export default function TrackEvent({
  event,
  params,
}: {
  event: string;
  params?: Record<string, unknown>;
}) {
  const serialized = JSON.stringify(params ?? {});
  useEffect(() => {
    track(event, JSON.parse(serialized));
  }, [event, serialized]);
  return null;
}
