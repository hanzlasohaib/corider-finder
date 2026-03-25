import Button from "./Button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRide } from "../context/RideContext";

function RideCard({
  ride,
  onJoin,
  isJoined: initialJoined,
  onLeave,
  onCancel,
  onComplete,
  onDelete,
  joinedAt,
  ...props
}) {

  const { 
    hasActiveRide, 
    refreshRideState, 
    setHasActiveRide 
  } = useRide();
  const [isJoinedState, setIsJoinedState] = useState(initialJoined);
  const buttonVariant = isJoinedState ? "secondary" : "primary";

  const handleJoin = async () => {
    if (hasActiveRide) {
      toast.error("You are already in an active ride");
      return;
    }

    try {
      await onJoin(ride.id);          // call API
      setIsJoinedState(true); // update UI immediately
    } catch (err) {
      console.error(err);
      toast.error("Failed to join ride");
    }
  };

  const isActive = ride.status === "active";
  const isCompleted = ride.status === "completed";
  const isCancelled = ride.status === "cancelled";

  const seatText = ride.available_seat === 1 ? "seat" : "seats";

  // 🎯 Status Badge Styles
  const statusStyles = {
    active: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 flex justify-between items-start shadow-sm hover:shadow-md transition">

      {/* LEFT SECTION */}
      <div className="space-y-1">
        {/* Route */}
        <p className="font-semibold text-gray-800 text-lg">
          {ride.pickup_location} → {ride.destination}
        </p>

        {/* Status + Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            {new Date(ride.departure_time).toLocaleString()}
          </span>

          {/* Status Badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[ride.status]}`}
          >
            {ride.status}
          </span>
        </div>

        {/* Details */}
        <p className="text-sm text-gray-600">
          {ride.available_seat} {seatText} left • Rs {ride.fare}/seat
        </p>

        <p className="text-sm text-gray-600">
          Driver: <span className="font-medium">{ride.driver?.full_name}</span>
        </p>

        {/* Joined time */}
        {joinedAt && (
          <p className="text-xs text-gray-500">
            Joined: {new Date(joinedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* RIGHT SECTION (Actions) */}
      <div className="flex flex-col gap-2 items-end">


        {/* 🟢 JOIN */}
        {onJoin && isActive && (
          <Button
            variant={buttonVariant}
            disabled={isJoinedState || hasActiveRide}
            onClick={async () => {
              try {
                await handleJoin();

                // ⚡ Optimistic update
                setHasActiveRide(true);

                // 🔄 Sync with backend
                await refreshRideState();
              } catch (err) {
                console.error(err);
              }
            }}
          >
            {isJoinedState ? "Joined" : hasActiveRide ? "Busy" : "Join"}
          </Button>
        )}

        {/* 🔴 LEAVE */}
        {onLeave && !isCompleted && !isCancelled && (
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await onLeave(ride.id);

                // ⚡ Optimistic update
                setHasActiveRide(false);

                // 🔄 Sync
                await refreshRideState();
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Leave
          </Button>
        )}

        {/* DRIVER CONTROLS */}
        {isActive && (
          <>
            {onCancel && (
              <Button
                onClick={async () => {
                  try {
                    await onCancel(ride.id);

                    // ⚡ Optimistic update
                    setHasActiveRide(false);

                    // 🔄 Sync
                    await refreshRideState();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Cancel
              </Button>
            )}

            {onComplete && (
              <Button
                onClick={async () => {
                  try {
                    await onComplete(ride.id);

                    // ⚡ Optimistic update
                    setHasActiveRide(false);

                    // 🔄 Sync
                    await refreshRideState();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Complete
              </Button>
            )}
          </>
        )}

        {/* DELETE (only if NOT completed) */}
        {!isCompleted && onDelete && (
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await onDelete(ride.id);

                // ⚡ Optimistic update
                setHasActiveRide(false);

                // 🔄 Sync
                await refreshRideState();
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Delete
          </Button>
        )}

      </div>
    </div>
  );
}

export default RideCard;