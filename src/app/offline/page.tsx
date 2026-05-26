"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <span className="text-6xl" role="img" aria-label="Sem conexão">
        📡
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Sem conexão</h1>
        <p className="text-gray-500">
          Verifique sua conexão com a internet e tente novamente.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white active:bg-blue-700"
      >
        Tentar novamente
      </button>
    </div>
  );
}
