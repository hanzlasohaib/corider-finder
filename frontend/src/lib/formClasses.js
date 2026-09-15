/** Shared Tailwind classes for text inputs — keep forms visually aligned app-wide */
export const fieldControlClass =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-all placeholder:text-slate-400 " +
  "hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

export const fieldClass = `mt-1.5 ${fieldControlClass}`;

export const fieldWithIconClass = `${fieldClass} pl-10`;

export function withFieldError(baseClass, hasError) {
  if (!hasError) return baseClass;
  return `${baseClass} border-red-400 focus:border-red-500 focus:ring-red-500/20`;
}
