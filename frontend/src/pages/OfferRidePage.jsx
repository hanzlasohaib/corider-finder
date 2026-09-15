import { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, Clock, Users, Coins } from "lucide-react";
import { createRide } from "../api/rideService";
import { useRide } from "../context/RideContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { fieldWithIconClass, withFieldError } from "../lib/formClasses";
import { apiErrorMessage } from "../lib/apiError";
import { toLocalDatetimeValue } from "../lib/formatRide";

const OfferRouteMap = lazy(() => import("../components/OfferRouteMap"));

function OfferRidePage() {
  const navigate = useNavigate();
  const { hasActiveRide, refreshRideState } = useRide();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    from_location: "",
    to_location: "",
    departure_time: "",
    available_seats: "",
    price: "",
  });

  const minDeparture = toLocalDatetimeValue(new Date(Date.now() + 60_000));

  const handleChange = (e) => {
    setFormError("");
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (hasActiveRide) {
      setFormError("Finish or leave your current ride before hosting a new one.");
      return;
    }

    if (form.departure_time && form.departure_time < minDeparture) {
      setFormError("Pick a departure time in the future.");
      return;
    }

    try {
      setSubmitting(true);
      await createRide(form);
      toast.success("Ride published. It is on My rides.");
      await refreshRideState();
      navigate("/dashboard/myrides");
    } catch (err) {
      console.error(err);
      setFormError(
        apiErrorMessage(err, "Could not publish this ride. Check the details and try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = "text-sm font-medium text-slate-700";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Offer a ride
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Share your route and fare. Click the map to set pickup then destination, or type them.
        </p>
      </div>

      <Card
        title="Trip details"
        subtitle="Passenger seats are limited to 1 or 2."
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="from_location" className={labelClass}>
                From
              </label>
              <div className="relative mt-1.5">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="from_location"
                  name="from_location"
                  value={form.from_location}
                  required
                  autoComplete="street-address"
                  placeholder="Pickup area"
                  onChange={handleChange}
                  className={fieldWithIconClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="to_location" className={labelClass}>
                To
              </label>
              <div className="relative mt-1.5">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-500"
                  aria-hidden
                />
                <input
                  id="to_location"
                  name="to_location"
                  value={form.to_location}
                  required
                  autoComplete="street-address"
                  placeholder="Destination"
                  onChange={handleChange}
                  className={fieldWithIconClass}
                />
              </div>
            </div>
          </div>

          <Suspense fallback={<div className="h-72 rounded-2xl bg-stone-200" aria-hidden />}>
            <OfferRouteMap
              fromLocation={form.from_location}
              toLocation={form.to_location}
              onPickupResolved={(label) =>
                setForm((current) => ({ ...current, from_location: label }))
              }
              onDropResolved={(label) =>
                setForm((current) => ({ ...current, to_location: label }))
              }
            />
          </Suspense>

          <div>
            <label htmlFor="departure_time" className={labelClass}>
              Departure time
            </label>
            <div className="relative mt-1.5">
              <Clock
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                id="departure_time"
                type="datetime-local"
                name="departure_time"
                value={form.departure_time}
                required
                min={minDeparture}
                onChange={handleChange}
                className={withFieldError(
                  fieldWithIconClass,
                  Boolean(formError && formError.includes("departure"))
                )}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="available_seats" className={labelClass}>
                Passenger seats
              </label>
              <div className="relative mt-1.5">
                <Users
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="available_seats"
                  type="number"
                  name="available_seats"
                  value={form.available_seats}
                  required
                  min="1"
                  max="2"
                  placeholder="1 or 2"
                  onChange={handleChange}
                  aria-describedby="seats-hint"
                  className={fieldWithIconClass}
                />
              </div>
              <p id="seats-hint" className="mt-1 text-xs text-slate-500">
                Max 2, including a pillion seat.
              </p>
            </div>

            <div>
              <label htmlFor="price" className={labelClass}>
                Price (Rs / seat)
              </label>
              <div className="relative mt-1.5">
                <Coins
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600"
                  aria-hidden
                />
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={form.price}
                  required
                  min="0"
                  step="1"
                  placeholder="Fare per seat"
                  onChange={handleChange}
                  className={fieldWithIconClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={hasActiveRide || submitting}
              loading={submitting}
            >
              {hasActiveRide ? "Already in a ride" : "Publish ride"}
            </Button>
            {hasActiveRide && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/dashboard/myrides")}
              >
                Open My rides
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default OfferRidePage;
