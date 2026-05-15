"use client";
import { useId, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["application/pdf", "image/jpeg", "image/png"];

export function DocumentUploader({
  onFile,
  label = "Selecionar arquivo",
  hint = "PDF, JPG ou PNG até 10 MB",
  disabled = false,
}: {
  onFile: (file: File) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState(false);

  function validate(file: File): string | null {
    if (file.size > MAX_BYTES) return "Arquivo maior que 10 MB";
    if (!ALLOWED.includes(file.type)) return "Tipo inválido (use PDF, JPG ou PNG)";
    return null;
  }

  function handle(file: File | null) {
    if (!file) return;
    const err = validate(file);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onFile(file);
  }

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed p-6 text-center transition",
        hover ? "border-blue-500 bg-blue-50" : "border-zinc-300 bg-white",
        disabled && "pointer-events-none opacity-50",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        handle(e.dataTransfer.files[0] ?? null);
      }}
    >
      <UploadCloud className="mx-auto mb-2 h-8 w-8 text-zinc-500" aria-hidden />
      <label
        htmlFor={id}
        className="cursor-pointer text-sm font-medium text-blue-700 underline"
      >
        {label}
      </label>
      <p className="mt-1 text-xs text-zinc-500">{hint}</p>
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(",")}
        className="sr-only"
        onChange={(e) => handle(e.target.files?.[0] ?? null)}
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
