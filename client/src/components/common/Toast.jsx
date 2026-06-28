import { useToast } from '../../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type} ${toast.exit ? 'exit' : ''}`}
          role="alert"
        >
          <span className="toast-icon">{icons[toast.type]}</span>
          <div className="toast-content">
            <div className="toast-title">{toast.title}</div>
            {toast.message && <div className="toast-message">{toast.message}</div>}
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  );
};

export default Toast;
