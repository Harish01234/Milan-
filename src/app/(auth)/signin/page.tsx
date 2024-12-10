'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface LoginData {
  identifier: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isClient, setIsClient] = useState(false); // To ensure client-side rendering
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Update to true after the component mounts
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!loginData.identifier) newErrors.identifier = 'Username or Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post('/api/signin', loginData);
        if (response.status === 200) {
          router.push('/dashboard');
        }
      } catch (error: any) {
        if (error.response) {
          alert(error.response.data.error || 'Login failed!');
        } else {
          alert('Network error. Please try again later.');
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  if (!isClient) return null; // Ensure nothing is rendered on the server

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Welcome Back ❤️</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="identifier"
              value={loginData.identifier}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="Username or Email"
            />
            {errors.identifier && <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="Password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-pink-500 text-white font-bold rounded-lg hover:bg-pink-600"
            >
              Log In
            </button>
          </div>
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
