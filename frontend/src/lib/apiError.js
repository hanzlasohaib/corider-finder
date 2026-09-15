export function apiErrorMessage(error, fallback = "Something went wrong. Try again.") {
  if (typeof error === "string" && error.trim()) return error;

  const detail =
    error?.response?.data?.detail ?? error?.detail ?? error?.message;

  if (typeof detail === "string" && detail.trim()) return detail;

  if (Array.isArray(detail)) {
    const first = detail[0];
    if (typeof first === "string") return first;
    if (first?.msg) return String(first.msg);
  }

  return fallback;
}
