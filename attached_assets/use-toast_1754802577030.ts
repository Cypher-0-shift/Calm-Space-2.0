// src/hooks/use-toast.ts
import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState("");

  const showToast = useCallback((message: string, duration = 2500) => {
    setToast(message);
    setTimeout(() => setToast(""), duration);
  }, []);

  return { toast, showToast };
}
