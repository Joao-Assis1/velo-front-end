"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ConnectReturnPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app/instructor/settings");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-600">
      <Loader2 className="animate-spin" size={36} />
      <p className="font-medium">Verificando sua conta...</p>
    </div>
  );
}
