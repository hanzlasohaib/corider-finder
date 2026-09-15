import { useEffect, useRef } from "react";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Go back",
  variant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.activeElement;
    cancelRef.current?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape" && !loading) {
        event.preventDefault();
        onCancelRef.current();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={() => {
          if (!loading) onCancel();
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg"
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold tracking-tight text-slate-900"
        >
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="mt-2 text-sm text-slate-600">
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            ref={cancelRef}
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant}
            loading={loading}
            disabled={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
