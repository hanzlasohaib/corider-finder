import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCurrentUser } from "../api/userService";
import Button from "../components/Button";
import Card from "../components/Card";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Could not load your profile.");
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading profile...</p>;
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          My profile
        </h1>
        <p className="text-sm text-slate-600">{error || "Profile unavailable."}</p>
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          My profile
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Account details used across offered and joined rides.
        </p>
      </div>

      <Card>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium text-slate-900">{user.full_name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">University</dt>
            <dd className="font-medium text-slate-900">{user.university}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Phone</dt>
            <dd className="font-medium text-slate-900">{user.phone || "N/A"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium capitalize text-slate-900">{user.role || "student"}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

export default ProfilePage;
