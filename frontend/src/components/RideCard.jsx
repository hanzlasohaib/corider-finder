import Button from "./Button";

function RideCard({
  ride,
  onJoin,
  isJoined,
  onLeave,
  onCancel,
  onComplete,
  onDelete,
  joinedAt,
  ...props
}) {

  const isActive = ride.status === "active";
  const isCompleted = ride.status === "completed";
  const isCancelled = ride.status === "cancelled";
  const seatText = ride.available_seat === 1 ? "seat" : "seats";

  return (
    <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center">

      <div>
        <p className="font-medium text-gray-800">
          {ride.pickup_location} → {ride.destination}
        </p>

        <p className="text-sm text-gray-600">
          Departure: {new Date(ride.departure_time).toLocaleString()} | Status: {ride.status}
        </p>

        <p className="text-sm text-gray-600">
        {ride.available_seat} {seatText} left • Rs {ride.fare}/seat | Driver: {ride.driver?.full_name}
        </p>

        {/* Show joined timestamp if available */}
        {joinedAt && (
          <p className="text-sm text-gray-500">
            Joined At: {new Date(joinedAt).toLocaleString()}
          </p>
        )}
      </div>


      {/* Show Join button only if onJoin prop exists */}
      {onJoin && (
        <Button variant="secondary" disabled={isJoined} onClick={() => onJoin(ride.id)}>
          {isJoined ? "Joined" : "Join"}
        </Button>
      )}

      {onLeave && (
        <Button
          variant="danger"
          onClick={() => onLeave(ride.id)}
        >
          Leave
        </Button>
      )}

      {/* Cancel */}
      {onCancel && (
        <Button
          disabled={!isActive}
          onClick={() => onCancel(ride.id)}
        >
          Cancel
        </Button>
      )}

      {/* Complete */}
      {onComplete && (
        <Button
          disabled={!isActive}
          onClick={() => onComplete(ride.id)}
        >
          Complete
        </Button>
      )}

      {/* Delete */}
      {onDelete && (
        <Button
          variant="danger"
          disabled={isCompleted}
          onClick={() => onDelete(ride.id)}
        >
          Delete
        </Button>
      )}

    </div>
  );
}

export default RideCard;