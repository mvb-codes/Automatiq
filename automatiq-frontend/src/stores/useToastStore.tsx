// stores/useToastStore.ts
import { create } from "zustand";

type ToastType = "success" | "error";

type Toast = {
  id: string; // change to string to match UUID
  message: string;
  type: ToastType;
};

type ToastStore = {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
};

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: (message, type = "success") => {
    const id = crypto.randomUUID(); // use web API instead of node:crypto
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
