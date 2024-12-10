'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Interfaces for typing
interface LoginData {
  identifier: string; // Can be either username or email
  password: string;
}

interface Popup {
  type: 'success' | 'error';
  message: string;
}

// Main Login Page Component
const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({}); // State for form errors
  const [isClient, setIsClient] = useState<boolean>(false); // Ensure this is client-rendered
  const [loading, setLoading] = useState<boolean>(false); // Loader state
  const [popup, setPopup] = useState<Popup | null>(null); // Popup notifications
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Enable rendering on the client side
  }, []);

  // Handle user input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate the form before submission
  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!loginData.identifier) newErrors.identifier = 'Username or Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post('/api/signin', loginData);

        if (response.status === 200) {
          setPopup({ type: 'success', message: 'Login successful!' });
          setTimeout(() => {
            setPopup(null);
            router.push('/dashboard');
          }, 2000);
        }
      } catch (error: any) {
        setLoading(false);
        if (error.response) {
          setPopup({ type: 'error', message: error.response.data.error });
        } else {
          setPopup({
            type: 'error',
            message: 'An unexpected error occurred. Please try again later.',
          });
        }
        setTimeout(() => setPopup(null), 2000);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  if (!isClient) {
    return null; // Return null until we ensure this is a client-side render
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-200 to-red-300">
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full sm:w-96">
        <h2 className="text-4xl font-extrabold text-center text-pink-600 mb-8">Welcome Back ❤️</h2>

        {/* Popup Notification */}
        {popup && (
          <div
            className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white text-center text-sm font-semibold shadow-xl animate-fade-in-out transition-all duration-300 ${
              popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {popup.message}
          </div>
        )}

        {/* Loader Animation */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-gray-700">
            <div className="border-t-4 border-pink-400 border-solid w-12 h-12 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8 relative">
          {/* Username/Email Field */}
          <div className="relative">
            <input
              type="text"
              name="identifier"
              value={loginData.identifier}
              onChange={handleChange}
              className="peer w-full p-4 border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-gray-800 placeholder-transparent"
              placeholder="Username or Email"
              required
            />
            <label
              htmlFor="identifier"
              className="absolute left-4 top-0 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-pink-400 peer-focus:top-0 peer-focus:text-pink-500"
            >
              Username or Email
            </label>
            {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>}
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="peer w-full p-4 border-2 border-pink-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-gray-800 placeholder-transparent"
              placeholder="Password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-0 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-pink-400 peer-focus:top-0 peer-focus:text-pink-500"
            >
              Password
            </label>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-gradient-to-r from-pink-500 to-red-400 text-white font-bold rounded-lg hover:from-red-400 hover:to-pink-500 focus:outline-none shadow-lg transition-transform transform hover:-translate-y-1"
              disabled={loading}
            >
              Log In
            </button>
          </div>

          {/* Signup redirect */}
          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-pink-500 hover:underline">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

/* Animations for popup */
<style jsx>{`
  @keyframes fade-in-out {
    0%, 100% { opacity: 0; transform: translateY(-20px); }
    50% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-out {
    animation: fade-in-out 2s ease-in-out;
  }
`}</style>
