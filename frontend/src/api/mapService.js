import api from "./axios";

export async function geocodePlace(query) {
  const q = query.trim();
  if (q.length < 2) return null;
  try {
    const res = await api.get("/v1/maps/geocode", { params: { q } });
    return res.data;
  } catch {
    return null;
  }
}

export async function reverseGeocode(lat, lng) {
  try {
    const res = await api.get("/v1/maps/reverse", { params: { lat, lng } });
    return res.data;
  } catch {
    return null;
  }
}
