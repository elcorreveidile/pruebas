"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* noop */
        }
      }}
      className="inline-flex items-center gap-1 rounded-lg border border-cream-deep bg-white px-2 py-1 text-xs font-semibold text-slate hover:bg-cream-deep/50"
      title="Copiar URL"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-sage" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copiado" : "Copiar URL"}
    </button>
  );
}
