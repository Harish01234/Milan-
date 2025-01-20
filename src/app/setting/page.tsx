'use client';

import React, { useState, useEffect } from 'react';
import { FloatingNavDemo } from '@/components/mainnavbar';
import Link from 'next/link';
import axios from 'axios';

function Setting() {
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Retrieve the email from localStorage (assuming it is stored there)
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleLabelClick = (label: string) => {
    setActiveInput(label);
    setInputValue('');
  };

  const handleAddClick = () => {
    if (activeInput && inputValue) {
      // Log the JSON object with the label, value, and email
      console.log(JSON.stringify({ email, [activeInput]: inputValue }));

      axios.post('/api/add', { email, [activeInput]: inputValue })
        .then((response) => {
          console.log(response.data);
          // Handle success, e.g., show a success message
        })
        .catch((error) => {
          console.error(error);
          // Handle error, e.g., show an error message
        });

      // Save the input value to the state
      setInputs((prev) => ({
        ...prev,
        [activeInput]: inputValue,
      }));

      // Reset the active input and input value
      setActiveInput(null);
      setInputValue('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-pink-500 via-red-500 to-violet-500 p-6">
      <div className="bg-gradient-to-r from-lavender-500 via-pink-500 to-red-500 p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-8">
        <h2 className="text-3xl font-bold text-red-600 mb-6">Profile Settings</h2>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-gradient-to-r from-pink-300 via-lavender-300 to-violet-300 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">Profile</h3>
            {['Username', 'Gender', 'Date of Birth', 'Bio', 'Location'].map((label) => (
              <div key={label} className="mt-4">
                <label
                  className="block text-sm font-medium text-pink-600 cursor-pointer"
                  onClick={() => handleLabelClick(label)}
                >
                  {label}
                </label>

                {/* Render input field and Add button only when activeInput matches the label */}
                {activeInput === label && (
                  <div>
                    <input
                      type={label === 'Date of Birth' ? 'date' : 'text'}
                      className="mt-1 block w-full px-4 py-2 border-2 border-pink-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder={`Enter your ${label.toLowerCase()}`}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                      className="mt-2 bg-gradient-to-r from-pink-600 via-red-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-700 hover:via-red-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={handleAddClick}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preferences Section */}
          <div className="bg-gradient-to-r from-pink-300 via-lavender-300 to-violet-300 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">Preferences</h3>
            {['Preferred Gender', 'Age Range', 'Max Distance (km)'].map((label) => (
              <div key={label} className="mt-4">
                <label
                  className="block text-sm font-medium text-pink-600 cursor-pointer"
                  onClick={() => handleLabelClick(label)}
                >
                  {label}
                </label>

                {/* Render input field and Add button only when activeInput matches the label */}
                {activeInput === label && (
                  <div>
                    <input
                      type={label === 'Age Range' || label === 'Max Distance (km)' ? 'number' : 'text'}
                      className="mt-1 block w-full px-4 py-2 border-2 border-pink-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder={`Enter your ${label.toLowerCase()}`}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                      className="mt-2 bg-gradient-to-r from-pink-600 via-red-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-700 hover:via-red-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={handleAddClick}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Account Section */}
          <div className="bg-gradient-to-r from-pink-300 via-lavender-300 to-violet-300 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600">Account</h3>
            {['Change Password', 'Confirm Password'].map((label) => (
              <div key={label} className="mt-4">
                <label
                  className="block text-sm font-medium text-pink-600 cursor-pointer"
                  onClick={() => handleLabelClick(label)}
                >
                  {label}
                </label>

                {/* Render input field and Add button only when activeInput matches the label */}
                {activeInput === label && (
                  <div>
                    <input
                      type="password"
                      className="mt-1 block w-full px-4 py-2 border-2 border-pink-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder={`Enter new ${label.toLowerCase()}`}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button
                      className="mt-2 bg-gradient-to-r from-pink-600 via-red-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-700 hover:via-red-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      onClick={handleAddClick}
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Navigation */}
        <div className="mt-8">
          <FloatingNavDemo />
        </div>
      </div>
    </div>
  );
}

export default Setting;
