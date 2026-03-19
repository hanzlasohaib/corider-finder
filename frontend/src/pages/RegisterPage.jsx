import { useState } from "react";
import toast from "react-hot-toast";
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
  
        toast.success("Registration successful");
  
        navigate("/login");
      } catch (error) {
        toast.error("Registration failed");
      }
    };
  

  return (
    <div className="max-w-md mx-auto">

      <Card title="Create Student Account">

        <form className="space-y-4" onSubmit={handleSubmit}>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="on"
              placeholder="Enter full name"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
              University
            </label>

            <input
              id="university"
              name="university"
              type="text"
              autoComplete="on"
              placeholder="Your university"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              autoComplete="on"
              placeholder="03XXXXXXXXX"
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
              autoComplete="off"
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
