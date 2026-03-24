import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return { toasts, showToast };
}

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 max-w-sm w-full">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className={`p-5 rounded-3xl border shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-10 duration-500 backdrop-blur-xl ${
            toast.type === 'success' 
              ? "bg-green-500/10 border-green-500/20 text-green-500" 
              : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <p className="text-xs font-black uppercase tracking-widest flex-1">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
