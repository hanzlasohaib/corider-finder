export function formatRideWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function rideRouteLabel(ride) {
  return `${ride.pickup_location} to ${ride.destination}`;
}

export function toLocalDatetimeValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
