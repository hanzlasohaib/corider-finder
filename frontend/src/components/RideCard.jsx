import Button from "./Button";

function RideCard({ ride, onJoin, joinedAt }) {
  return (
    <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center">

      <div>
        <p className="font-medium text-gray-800">
          {ride.pickup_location} → {ride.destination}
        </p>

        <p className="text-sm text-gray-600">
          Departure: {new Date(ride.departure_time).toLocaleString()}
        </p>

        <p className="text-sm text-gray-600">
          Seats: {ride.available_seat} | Price: Rs {ride.fare}
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
        <Button variant="secondary" onClick={() => onJoin(ride.id)}>
          Join
        </Button>
      )}

    </div>
  );
}

export default RideCard;