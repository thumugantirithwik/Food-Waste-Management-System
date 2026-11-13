/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
};

const bgColors = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
  warning: 'bg-yellow-50 border-yellow-200',
};

function ToastItem({ id, type = 'info', message, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border shadow-md transition-all duration-300 ${bgColors[type]} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {icons[type]}
      <p className="flex-1 text-sm text-gray-800">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

let toastListeners = [];
let toastIdCounter = 0;

export function toast(message, type = 'info') {
  const id = ++toastIdCounter;
  toastListeners.forEach((fn) => fn({ id, message, type }));
}
toast.success = (msg) => toast(msg, 'success');
toast.error = (msg) => toast(msg, 'error');
toast.info = (msg) => toast(msg, 'info');
toast.warning = (msg) => toast(msg, 'warning');

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (t) => setToasts((prev) => [...prev, t]);
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={remove} />
      ))}
    </div>
  );
}

