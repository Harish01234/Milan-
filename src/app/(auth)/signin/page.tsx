'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface LoginData {
  identifier: string; // Can be either username or email
  password: string;
}

const Login = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState<any>({});
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [popup, setPopup] = useState<{ type: string; message: string } | null>(null); // Popup state
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors: any = {};
    if (!loginData.identifier) newErrors.identifier = 'Username or Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  // Handle form submission with axios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true); // Start loading
      try {
        // Submit data to the API using axios
        const response = await axios.post('/api/signin', loginData);

        if (response.status === 200) {
          // Show success popup
          setPopup({ type: 'success', message: 'Login successful!' });
          setTimeout(() => {
            setPopup(null); // Hide popup after 2 seconds
            router.push('/dashboard'); // Redirect to the dashboard
          }, 2000);
        }
      } catch (error: any) {
        setLoading(false); // Stop loading
        if (error.response) {
          // Handle server-side error
          setPopup({ type: 'error', message: error.response.data.error });
          setTimeout(() => setPopup(null), 2000);
        } else {
          // Handle network or unexpected error
          setPopup({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
          setTimeout(() => setPopup(null), 2000);
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  if (!isClient) {
    return null; // Optionally render a loader or null until the client-side renders
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Log In</h2>
        
        {/* Popup Message */}
        {popup && (
          <div
            className={`absolute top-20 left-1/2 transform -translate-x-1/2 p-4 rounded-md text-white ${
              popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {popup.message}
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-700">
            <div className="border-t-4 border-blue-500 border-solid w-12 h-12 rounded-full animate-spin"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {/* Username or Email */}
          <div className="relative">
            <input
              type="text"
              name="identifier"
              value={loginData.identifier}
              onChange={handleChange}
              className="peer w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 placeholder-transparent"
              placeholder="Username or Email"
              required
            />
            <label
              htmlFor="identifier"
              className="absolute left-3 top-0 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-blue-500"
            >
              Username or Email
            </label>
            {errors.identifier && <p className="text-red-500 text-xs">{errors.identifier}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="peer w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-gray-800 placeholder-transparent"
              placeholder="Password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-0 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-blue-500"
            >
              Password
            </label>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
              disabled={loading} // Disable button while loading
            >
              Log In
            </button>
          </div>

          {/* Don't have an account */}
          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
