import React from 'react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toastContainer">
      {toasts.map((toast) => {
        let Icon = Info;
        if (toast.type === 'success') Icon = CheckCircle2;
        if (toast.type === 'error') Icon = AlertCircle;

        return (
          <div
            key={toast.id}
            className={`toast toast-${toast.type || 'info'} ${toast.exiting ? 'toast-exit' : ''}`}
          >
            <Icon size={18} strokeWidth={2.3} />
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}

