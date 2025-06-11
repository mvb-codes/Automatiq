// components/ToastContainer.tsx
import { useToastStore } from "../stores/useToastStore";

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert shadow-lg z-50 ${
            toast.type === "success" ? "alert-success" : "alert-error"
          } text-white flex justify-between items-center`}
        >
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-2">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
