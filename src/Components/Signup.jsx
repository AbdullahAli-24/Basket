import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserInDatabase } from "../lib/userFunctions";
import { setCurrentUser } from "../lib/auth";
import { toast } from "react-hot-toast";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        // Create user in database (will get numeric ID from database)
        const newUser = await createUserInDatabase(username, email, password);
        
        // Store user in localStorage with database ID
        setCurrentUser(newUser);
        
        toast.success("Account created successfully! ✅");
        navigate("/");
      } catch (error) {
        console.error("Signup error:", error);
        if (error.message.includes("duplicate") || error.message.includes("unique")) {
          toast.error("Username or email already exists!");
        } else {
          toast.error("Failed to create account. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-[400px] mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg mb-12">
      <h2 className="text-center mb-7 text-2xl font-semibold text-gray-800">
        Sign Up
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div className="mb-5">
          <label className="block mb-1.5 font-medium text-gray-700">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter your username"
            className={` outline-0 w-full px-3 py-2 border rounded-md ${errors.username
              ? "border-red-500"
              : "border-gray-300 focus:border-teal-500 "
              }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-1.5 font-medium text-gray-700">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            className={` outline-0 w-full px-3 py-2 border rounded-md ${errors.email
              ? "border-red-500"
              : "border-gray-300 focus:border-teal-500 "
              }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1.5 font-medium text-gray-700">
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            className={` outline-0 w-full px-3 py-2 border rounded-md ${errors.password
              ? "border-red-500"
              : "border-gray-300 focus:border-teal-500 "
              }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg mt-4 outline-0 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
