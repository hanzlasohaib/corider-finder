import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRide } from "../context/RideContext";
import { formatRideWhen, rideRouteLabel } from "../lib/formatRide";
import {
  ArrowRight,
  CalendarClock,
  Coins,
  User,
  Users,
} from "lucide-react";

function formatStatus(status) {
  if (!status) return "";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    active: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    completed: "bg-slate-100 text-slate-700 ring-slate-200/80",
    cancelled: "bg-red-50 text-red-700 ring-red-100",
    joined: "bg-brand-50 text-brand-700 ring-brand-100",
    full: "bg-amber-50 text-amber-800 ring-amber-100",
    neutral: "bg-slate-100 text-slate-600 ring-slate-200/80",
  };
  const key = tones[tone] ? tone : "neutral";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[key]}`}
    >
      {children}
    </span>
  );
}

const ACTION_COPY = {
  join: {
    title: "Join this ride?",
    confirmLabel: "Join this ride",
    variant: "primary",
    extra: "The trip will stay on My rides after you join.",
  },
  leave: {
    title: "Leave this ride?",
    confirmLabel: "Leave this ride",
    variant: "secondary",
    extra: "Your seat will open for someone else.",
  },
  cancel: {
    title: "Cancel this ride?",
    confirmLabel: "Cancel this ride",
    variant: "secondary",
    extra: "Riders will no longer be able to join.",
  },
  complete: {
    title: "Mark this ride complete?",
    confirmLabel: "Mark as complete",
    variant: "primary",
    extra: "Use this after the trip has happened.",
  },
  delete: {
    title: "Delete this ride?",
    confirmLabel: "Delete this ride",
    variant: "danger",
    extra: "This cannot be undone.",
  },
};

function RideCard({
  ride,
  onJoin,
  isJoined: initialJoined,
  onLeave,
  onCancel,
  onComplete,
  onDelete,
  joinedAt,
}) {
  const { hasActiveRide, refreshRideState, setHasActiveRide } = useRide();
  const [isJoinedState, setIsJoinedState] = useState(initialJoined);
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setIsJoinedState(Boolean(initialJoined));
  }, [initialJoined]);

  const isActive = ride.status === "active";
  const isCompleted = ride.status === "completed";
  const isCancelled = ride.status === "cancelled";
  const seatsLeft = Number(ride.available_seat);
  const isFull = !Number.isFinite(seatsLeft) ? false : seatsLeft <= 0;
  const seatText = ride.available_seat === 1 ? "seat" : "seats";
  const when = formatRideWhen(ride.departure_time);
  const route = rideRouteLabel(ride);

  const joinDisabled =
    isJoinedState ||
    (hasActiveRide && !isJoinedState) ||
    isFull ||
    !isActive;

  let joinLabel = "Join ride";
  if (isJoinedState) joinLabel = "Joined";
  else if (isFull) joinLabel = "Full";
  else if (hasActiveRide) joinLabel = "In a ride";

  const copy = pending ? ACTION_COPY[pending] : null;
  const dialogDescription = copy
    ? `${route} at ${when}. Rs ${ride.fare} per seat. ${copy.extra}`
    : "";

  const runAction = async (kind) => {
    if (kind === "join" && hasActiveRide) {
      toast.error("You are already in an active ride");
      setPending(null);
      return;
    }

    setBusy(true);
    try {
      if (kind === "join") {
        await onJoin(ride.id);
        setIsJoinedState(true);
        setHasActiveRide(true);
      } else if (kind === "leave") {
        await onLeave(ride.id);
        setHasActiveRide(false);
      } else if (kind === "cancel") {
        await onCancel(ride.id);
        setHasActiveRide(false);
      } else if (kind === "complete") {
        await onComplete(ride.id);
        setHasActiveRide(false);
      } else if (kind === "delete") {
        await onDelete(ride.id);
        setHasActiveRide(false);
      }
      await refreshRideState();
      setPending(null);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:border-slate-300/80 hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              tone={
                {
                  active: "active",
                  completed: "completed",
                  cancelled: "cancelled",
                }[ride.status] ?? "neutral"
              }
            >
              {formatStatus(ride.status)}
            </Badge>
            {isJoinedState && onJoin && <Badge tone="joined">Joined</Badge>}
            {isFull && isActive && <Badge tone="full">Full</Badge>}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              <span className="truncate">{ride.pickup_location}</span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-slate-300"
                aria-hidden
              />
              <span className="truncate">{ride.destination}</span>
            </div>

            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <CalendarClock
                  className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                  aria-hidden
                />
                <time dateTime={ride.departure_time}>{when}</time>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" aria-hidden />
                  {Number.isFinite(seatsLeft) ? seatsLeft : ride.available_seat}{" "}
                  {seatText} left
                </span>
                <span className="inline-flex items-center gap-2 font-medium text-slate-800">
                  <Coins className="h-4 w-4 text-emerald-600" aria-hidden />
                  Rs {ride.fare}/seat
                </span>
              </div>

              <div className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" aria-hidden />
                <span>
                  Driver{" "}
                  <span className="font-medium text-slate-800">
                    {ride.driver?.full_name ?? "—"}
                  </span>
                </span>
              </div>

              {joinedAt && (
                <p className="text-xs text-slate-500">
                  Joined {formatRideWhen(joinedAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end lg:w-auto lg:min-w-[200px] lg:flex-col">
          {onJoin && isActive && (
            <Button
              variant={isJoinedState ? "secondary" : "primary"}
              disabled={joinDisabled || busy}
              onClick={() => setPending("join")}
              className="w-full sm:w-auto lg:w-full"
            >
              {joinLabel}
            </Button>
          )}

          {onLeave && !isCompleted && !isCancelled && (
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => setPending("leave")}
              className="w-full sm:w-auto lg:w-full"
            >
              Leave ride
            </Button>
          )}

          {isActive && (
            <>
              {onCancel && (
                <Button
                  variant="secondary"
                  disabled={busy}
                  onClick={() => setPending("cancel")}
                  className="w-full sm:w-auto lg:w-full"
                >
                  Cancel ride
                </Button>
              )}

              {onComplete && (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => setPending("complete")}
                  className="w-full sm:w-auto lg:w-full"
                >
                  Complete ride
                </Button>
              )}
            </>
          )}

          {!isCompleted && onDelete && (
            <Button
              variant="danger"
              disabled={busy}
              onClick={() => setPending("delete")}
              className="w-full sm:w-auto lg:w-full"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(pending)}
        title={copy?.title ?? ""}
        description={dialogDescription}
        confirmLabel={copy?.confirmLabel ?? "Confirm"}
        variant={copy?.variant ?? "primary"}
        loading={busy}
        onCancel={() => {
          if (!busy) setPending(null);
        }}
        onConfirm={() => runAction(pending)}
      />
    </article>
  );
}

export default RideCard;
