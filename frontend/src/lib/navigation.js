export function safeDashboardPath(value) {
  if (typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/dashboard")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  return value;
}
