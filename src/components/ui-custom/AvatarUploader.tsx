"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_DIMENSION = 400;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

async function compressToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width >= height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Falha ao carregar imagem"));
    };
    img.src = url;
  });
}

export function AvatarUploader({
  currentImage,
  name,
  onImage,
  disabled = false,
}: {
  currentImage?: string;
  name?: string;
  onImage: (base64: string) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  async function handle(file: File | null | undefined) {
    if (!file) return;
    if (!ALLOWED.includes(file.type)) {
      setError("Use JPEG, PNG ou WebP");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Imagem maior que 5 MB");
      return;
    }
    setError(null);
    setIsProcessing(true);
    try {
      const base64 = await compressToBase64(file);
      setPreview(base64);
      onImage(base64);
    } catch {
      setError("Erro ao processar a imagem");
    } finally {
      setIsProcessing(false);
    }
  }

  const isInteractive = !disabled && !isProcessing;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Avatar + drop zone */}
      <div
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        aria-label="Alterar foto de perfil"
        className={cn(
          "relative group select-none outline-none",
          isInteractive ? "cursor-pointer" : "pointer-events-none opacity-60",
        )}
        onClick={() => isInteractive && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && isInteractive && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (isInteractive) setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handle(e.dataTransfer.files[0]);
        }}
      >
        {/* Circle */}
        <div
          className={cn(
            "w-24 h-24 rounded-full overflow-hidden border-2 shadow-md transition-all duration-200",
            isDragging
              ? "border-velo-blue scale-105 shadow-lg shadow-velo-blue/20"
              : "border-slate-100 group-hover:border-velo-blue/40",
          )}
        >
          {preview ? (
            <img src={preview} alt={name ?? "Foto de perfil"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 font-bold text-2xl">
              {name?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}

          {/* Processing overlay */}
          {isProcessing && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <Loader2 size={24} className="text-white animate-spin" />
            </div>
          )}

          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 rounded-full bg-velo-blue/20 flex items-center justify-center">
              <Camera size={22} className="text-velo-blue" />
            </div>
          )}
        </div>

        {/* Camera badge */}
        <div
          className={cn(
            "absolute bottom-0 right-0 bg-velo-blue text-white p-2 rounded-full border-2 border-white shadow-lg",
            "transition-transform duration-150",
            isInteractive && "group-hover:scale-110",
          )}
          aria-hidden
        >
          <Camera size={16} />
        </div>

        <input
          id={id}
          ref={inputRef}
          type="file"
          accept={ALLOWED.join(",")}
          className="sr-only"
          disabled={!isInteractive}
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </div>

      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        Clique ou arraste uma foto
        <br />
        JPEG, PNG ou WebP · máx. 5 MB
      </p>

      {error && (
        <p role="alert" className="text-xs text-rose-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
