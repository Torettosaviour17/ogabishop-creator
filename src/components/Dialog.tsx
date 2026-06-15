interface DialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "warning" | "error" | "success";
}

export default function Dialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  type = "info",
}: DialogProps) {
  if (!isOpen) return null;

  const iconMap = {
    info: "fas fa-info-circle text-blue-400",
    warning: "fas fa-exclamation-triangle text-yellow-400",
    error: "fas fa-times-circle text-red-500",
    success: "fas fa-check-circle text-green-400",
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999]">
      <div className="bg-gradient-to-br from-red-950 to-black rounded-2xl p-6 max-w-md w-full mx-4 border border-red-700 shadow-2xl">
        <div className="text-center mb-4">
          <i className={`${iconMap[type]} text-5xl mb-3`}></i>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-300 mt-2">{message}</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-full font-semibold transition"
          >
            {confirmText}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-full font-semibold transition"
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
