"use client";
import React from "react";

type CalloutProps = {
  title?: string;
  children: React.ReactNode;
};

export function Callout({ title, children }: CalloutProps) {
  return (
    <div className="my-8 rounded-lg border border-border bg-muted p-6">
      {title && <h3 className="mb-3 font-medium">{title}</h3>}
      <div className="space-y-2">{children}</div>
    </div>
  );
}
