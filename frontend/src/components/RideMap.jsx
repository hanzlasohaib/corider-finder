import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const PAKISTAN_CENTER = [30.3753, 69.3451];

const pickupIcon = L.divIcon({
  className: "ride-pin ride-pin-from",
  html: '<span class="ride-pin-dot"></span>',
  iconSize: [22, 28],
  iconAnchor: [11, 28],
  popupAnchor: [0, -24],
});

const dropIcon = L.divIcon({
  className: "ride-pin ride-pin-to",
  html: '<span class="ride-pin-dot"></span>',
  iconSize: [22, 28],
  iconAnchor: [11, 28],
  popupAnchor: [0, -24],
});

function FitPoints({ points }) {
  const map = useMap();
  const pointKey = points
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng))
    .map((point) => `${point.lat.toFixed(5)},${point.lng.toFixed(5)}`)
    .join("|");

  useEffect(() => {
    const coords = pointKey
      ? pointKey.split("|").map((pair) => pair.split(",").map(Number))
      : [];
    if (!coords.length) {
      map.setView(PAKISTAN_CENTER, 6);
      return;
    }
    if (coords.length === 1) {
      map.setView(coords[0], 14);
      return;
    }
    map.fitBounds(coords, { padding: [36, 36], maxZoom: 15 });
  }, [map, pointKey]);

  return null;
}

function ClickCatcher({ onClick }) {
  useMapEvents({
    click(event) {
      if (!onClick) return;
      onClick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export default function RideMap({
  points = [],
  route = null,
  onMapClick,
  className = "",
  ariaLabel = "Map of ride locations",
}) {
  return (
    <div className={`ride-map overflow-hidden rounded-2xl ${className}`}>
      <MapContainer
        center={PAKISTAN_CENTER}
        zoom={6}
        scrollWheelZoom
        className="h-full w-full"
        aria-label={ariaLabel}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitPoints points={points} />
        <ClickCatcher onClick={onMapClick} />
        {route && route.length === 2 ? (
          <Polyline
            positions={route}
            pathOptions={{ color: "#2e7d32", weight: 4, opacity: 0.85 }}
          />
        ) : null}
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={point.kind === "drop" ? dropIcon : pickupIcon}
            eventHandlers={
              point.onSelect
                ? { click: () => point.onSelect(point) }
                : undefined
            }
          >
            {point.label ? <Popup>{point.label}</Popup> : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
