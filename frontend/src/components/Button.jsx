import { forwardRef } from "react";

const Button = forwardRef(function Button(
  {
    children,
    type = "button",
    variant = "primary",
    disabled = false,
    loading = false,
    onClick,
    className = "",
  },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 " +
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed";

  const styles = {
    primary:
      "bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-md",
    secondary:
      "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50",
    outline:
      "border border-brand-200 bg-brand-50/80 text-brand-700 hover:bg-brand-100",
    danger:
      "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      )}
      {children}
    </button>
  );
});

export default Button;
