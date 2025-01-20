'use client'

import { FloatingNavDemo } from '@/components/mainnavbar'
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'

// Function to fetch users from the API
const fetchUsers = async (username?: string, email?: string, gender?: string) => {
  try {
    const payload = {
      username,
      email,
      gender,
    };

    const response = await axios.post('/api/users', payload);
    if (response.data.success) {
      return response.data.users;  // Make sure this returns an array of users
    } else {
      console.error('Error fetching users:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('An error occurred while fetching users:', error);
    return [];
  }
}

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
  });

  const handleSwipe = (direction: string) => {
    if (direction === 'left') {
      setCurrentIndex((prev) => (prev + 1) % users.length);
      console.log("right swipe");
      
    } else if (direction === 'right') {
      setCurrentIndex((prev) => (prev - 1 + users.length) % users.length);
    }
  };

  // Fetch users once component mounts
  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem('username')
      const email = localStorage.getItem('email')
      const gender = localStorage.getItem('gender')
      console.log("Username:", username, "Email:", email, "Gender:", gender);
      
      try {
        const fetchedUsers = await fetchUsers(username || "", email || "", gender || ""); // Corrected email
        setUsers(fetchedUsers);
        console.log("Users fetched:", fetchedUsers);
        
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentItem = users[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>No users found</p>
      </div>
    );
  }

  // Dynamically render user details
  return (
    <div
      {...swipeHandlers}
      className="min-h-screen bg-gradient-to-b from-red-500 via-red-600 to-red-800 flex justify-center items-center"
    >
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <FloatingNavDemo />
        <div className="text-center mt-6">
          <h2 className="text-2xl font-semibold text-gray-800">{currentItem.username}</h2>
          <p className="text-gray-600">{currentItem.description || "No description available"}</p>
          <p className="text-gray-600">{currentItem.email}</p>
          <p className="text-gray-600">{currentItem.gender}</p>
        </div>

        {/* Buttons for PC */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => handleSwipe('right')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Previous
          </button>
          <button
            onClick={() => handleSwipe('left')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
