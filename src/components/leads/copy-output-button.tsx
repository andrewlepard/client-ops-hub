"use client";

import { useEffect, useState } from "react";

type CopyOutputButtonProps = {
  label: string;
  value: string;
};

export function CopyOutputButton({
  label,
  value,
}: CopyOutputButtonProps) {
  const [copied, setCopied] = useState(false);
  const tooltipText = copied ? "Copied" : `Copy ${label.toLowerCase()}`;

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={tooltipText}
      className={`group relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border transition ${
        copied
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
      }`}
      aria-label={tooltipText}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-[0_10px_24px_rgba(15,23,42,0.18)] transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {tooltipText}
      </span>
    </button>
  );
}
