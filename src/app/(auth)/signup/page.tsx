'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface FormData {
  username: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  dateOfBirth: string;
  
}

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    gender: '',
    dateOfBirth: '',
   
  });

  const [errors, setErrors] = useState<any>({});
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false); // Loader state
  const [popup, setPopup] = useState<{ message: string; type: 'success' | 'error' } | null>(null); // Popup state
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    return newErrors;
  };

  const showPopup = (message: string, type: 'success' | 'error') => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 3000); // Hide popup after 3 seconds
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true); // Start loader
      try {
        // Make API call using axios
        const response = await axios.post('/api/signup', formData);

        // Simulate a successful response
        if (response.status === 200) {
          showPopup('Account created successfully!', 'success');
          if (isClient) {
            router.push(`/verification/${formData.email}`); // Redirect to verification page after successful signup
          }
        } else {
          showPopup('Something went wrong. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Error during signup:', error);
        showPopup('Failed to create account. Please try again.', 'error');
      } finally {
        setLoading(false); // End loader
      }
    } else {
      setErrors(validationErrors);
    }
  };

  if (!isClient) {
    return null; // Optionally render a loader or null until the client-side renders
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 to-red-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="peer w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-pink-500 text-gray-800 placeholder-transparent"
              placeholder="Username"
              required
            />
            <label
              htmlFor="username"
              className="absolute left-3 top-0 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-pink-500"
            >
              Username
            </label>
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="peer w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-pink-500 text-gray-800 placeholder-transparent"
              placeholder="Email"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-0 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-pink-500"
            >
              Email
            </label>
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="peer w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-pink-500 text-gray-800 placeholder-transparent"
              placeholder="Password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-0 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-pink-500"
            >
              Password
            </label>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          {/* Gender */}
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="peer w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-pink-500 text-gray-800 placeholder-transparent"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <label
              htmlFor="gender"
              className="absolute left-3 top-0 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-pink-500"
            >
              Gender
            </label>
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="peer w-full p-3 border-b-2 border-gray-300 focus:outline-none focus:border-pink-500 text-gray-800 placeholder-transparent"
              placeholder="Date of Birth"
              required
            />
            <label
              htmlFor="dateOfBirth"
              className="absolute left-3 top-0 transform -translate-y-1/2 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-pink-500"
            >
              Date of Birth
            </label>
            {errors.dateOfBirth && <p className="text-red-500 text-xs">{errors.dateOfBirth}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full p-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:outline-none"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

          {/* Already have an account */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-pink-500 hover:underline">
              Login here
            </a>
          </div>
        </form>
      </div>

      {/* Popup */}
      {popup && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 ${popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-4 rounded-md shadow-lg`}
        >
          <p>{popup.message}</p>
        </div>
      )}
    </div>
  );
};

export default SignUp;
