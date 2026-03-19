import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/userService";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Profile</h2>

      <div className="border p-4 rounded">
        <p><strong>Name:</strong> {user.full_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>University:</strong> {user.university}</p>
        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
      </div>

      <div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
      </div>

    </div>
  );
}

export default ProfilePage;