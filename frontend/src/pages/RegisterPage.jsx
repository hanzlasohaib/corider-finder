import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { registerUser } from "../api/authService";


function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
      full_name: "",
      university: "",
      email: "",
      phone: "",
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
        await registerUser(form);
  
        alert("Registration successful");
  
        navigate("/login");
      } catch (error) {
        alert("Registration failed");
      }
    };
  

  return (
    <div className="max-w-md mx-auto">

      <Card title="Create Student Account">

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              name="full_name"
              type="text"
              placeholder="Enter full name"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University
            </label>

            <input
              name="university"
              type="text"
              placeholder="Your university"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              name="email"
              type="email"
              placeholder="student@email.com"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>

            <input
              name="phone"
              type="text"
              placeholder="03XXXXXXXXX"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              name="password"
              type="password"
              placeholder="Create password"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>

        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>

      </Card>

    </div>
  );
}

export default RegisterPage;
