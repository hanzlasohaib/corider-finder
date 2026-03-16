import Card from "../components/Card";
import Button from "../components/Button";

function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h2>
        <p className="text-gray-600">
          Manage your rides and find new ride matches.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card title="Offer a Ride">
          <p className="text-gray-600 mb-4">
            Traveling somewhere? Offer a ride and share travel costs with another student.
          </p>

          <Button>
            Offer Ride
          </Button>
        </Card>

        <Card title="Find a Ride">
          <p className="text-gray-600 mb-4">
            Search available rides offered by other students.
          </p>

          <Button variant="secondary">
            Find Ride
          </Button>
        </Card>

      </div>

      {/* Available Rides Preview */}
      <Card title="Available Rides">

        <div className="space-y-4">

          <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">
                Campus → City Center
              </p>
              <p className="text-sm text-gray-600">
                Departure: Today 5:30 PM
              </p>
            </div>

            <Button variant="secondary">
              View
            </Button>
          </div>

          <div className="border border-gray-200 rounded-md p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-800">
                University Gate → Metro Station
              </p>
              <p className="text-sm text-gray-600">
                Departure: Tomorrow 9:00 AM
              </p>
            </div>

            <Button variant="secondary">
              View
            </Button>
          </div>

        </div>

      </Card>

    </div>
  );
}

export default DashboardPage;
