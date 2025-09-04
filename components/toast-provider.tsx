"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = {
  id: string;
  message: string;
  variant?: "default" | "destructive" | "success";
  durationMs?: number;
};

type ToastContextValue = {
  showToast: (opts: { message: string; variant?: Toast["variant"]; durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((opts: { message: string; variant?: Toast["variant"]; durationMs?: number }) => {
    const id = crypto.randomUUID();
    const toast: Toast = {
      id,
      message: opts.message,
      variant: opts.variant || "default",
      durationMs: opts.durationMs ?? 3000,
    };
    setToasts((prev) => [...prev, toast]);
    window.setTimeout(() => remove(id), toast.durationMs);
  }, [remove]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`rounded-lg border px-4 py-3 shadow-lg text-sm backdrop-blur bg-white/95 dark:bg-gray-800/95 ${
                t.variant === "destructive"
                  ? "border-red-300 text-red-900 dark:border-red-600 dark:text-red-100"
                  : t.variant === "success"
                  ? "border-green-300 text-green-900 dark:border-green-600 dark:text-green-100"
                  : "border-gray-200 text-gray-900 dark:border-gray-600 dark:text-gray-100"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}


