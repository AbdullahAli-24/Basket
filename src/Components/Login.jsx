import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../lib/auth";
import { getUserFromDatabase } from "../lib/userFunctions";
import { toast } from "react-hot-toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
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
        // Get user from database
        const foundUser = await getUserFromDatabase(username, password);

        if (foundUser) {
          // Store user in localStorage with database ID
          setCurrentUser(foundUser);
          toast.success("Login successful! ✅");
          navigate("/");
        } else {
          toast.error("Invalid username or password!");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-[400px] mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg mb-12">
      <h2 className="text-center mb-7 text-2xl font-semibold text-gray-800">
        Login
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
              : "border-gray-300 focus:border-teal-500"
              }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
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
              : "border-gray-300 focus:border-teal-500"
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
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
