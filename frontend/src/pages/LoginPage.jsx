import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authService";
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import { Link } from "react-router-dom";

function LoginPage() {

    const navigate = useNavigate();
    const { login } = useAuth();
  
    const [form, setForm] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const data = await loginUser(form);
  
        login(data.access_token);
  
        navigate("/dashboard");
      } catch (error) {
        toast.error("Invalid credentials");
      }
    };

  return (
    <div className="max-w-md mx-auto">

      <Card title="Login to CoRide Finder">

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="on"
              placeholder="student@email.com"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>

        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>

      </Card>

    </div>
  );
}

export default LoginPage;
