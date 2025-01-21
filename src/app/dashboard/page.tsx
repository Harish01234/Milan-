'use client';

import { FloatingNavDemo } from '@/components/mainnavbar';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

// Fetch users from API
const fetchUsers = async (username?: string, email?: string, gender?: string) => {
  try {
    const response = await axios.post('/api/users', { username, email, gender });
    return response.data.success ? response.data.users : [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

const Page = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
  });

  const handleSwipe = (direction: string) => {
    const loggedInUserEmail = localStorage.getItem('email') || '';

    if (direction === 'right') {
      const newIndex = (currentIndex + 1) % users.length;

      // Log details for the swipe
      logSwipeDetails(direction, loggedInUserEmail, users[newIndex]?.email);

      // Add to matches using API
      addToMatches(loggedInUserEmail, users[newIndex]?.email, direction);

      setImageLoaded(false);
      setCurrentIndex(newIndex);
    }

    if (direction === 'left') {
      const newIndex = (currentIndex - 1 + users.length) % users.length;
      setImageLoaded(false);
      setCurrentIndex(newIndex);
    }
  };

  const logSwipeDetails = (direction: string, userEmailA: string, userEmailB: string) => {
    if (direction === 'right') {
      const logData = {
        userEmailA: userEmailA,
        userEmailB: userEmailB,
        direction: direction,
      };

      // Log swipe details as JSON
      console.log(JSON.stringify(logData, null, 2));
    }
  };

  const addToMatches = async (userEmailA: string, userEmailB: string, direction: string) => {
    try {
      const response = await axios.post('/api/addtomatches', {
        userEmailA,
        userEmailB,
        direction,
      });

      if (response.data.success) {
        console.log('Successfully added to matches:', response.data);

        // Show a pop-up if it's a mutual match
        if (response.data.message === 'Mutual match found!') {
          setPopupMessage(response.data.message);
          setShowPopup(true);

          // Automatically hide the pop-up after 3 seconds
          setTimeout(() => {
            setShowPopup(false);
          }, 3000);
        }
      } else {
        console.error('Error adding to matches:', response.data);
      }
    } catch (error) {
      console.error('Error during add to matches API call:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const username = localStorage.getItem('username') || '';
      const email = localStorage.getItem('email') || '';
      const gender = localStorage.getItem('gender') || '';
      const fetchedUsers = await fetchUsers(username, email, gender);
      setUsers(fetchedUsers);
      setLoading(false);
    };
    fetchData();
  }, []);

  const currentItem = users[currentIndex];

  if (loading) return <p className="min-h-screen flex justify-center items-center">Loading...</p>;
  if (!currentItem) return <p className="min-h-screen flex justify-center items-center">No users found</p>;

  return (
    <div
      {...swipeHandlers}
      className="min-h-screen bg-gradient-to-b from-pink-500 to-purple-700 flex justify-center items-center px-4"
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <FloatingNavDemo />
        <div className="relative">
          {!imageLoaded && <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>}
          <img
            src={currentItem.profilePicture || '/placeholder.png'}
            alt={currentItem.username}
            className={`w-full h-72 object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="p-4 bg-pink-50">
          <h2 className="text-xl font-bold text-red-600">{currentItem.username}</h2>
          <p className="text-sm text-gray-700">{currentItem.bio || 'No bio available'}</p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">DOB:</span> {new Date(currentItem.dateOfBirth).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {currentItem.location || 'Not specified'}
          </p>
          <div className="mt-2">
            <p className="font-medium text-red-500">Interests:</p>
            <ul className="flex flex-wrap gap-2 mt-1">
              {currentItem.interests?.length ? (
                currentItem.interests.map((interest: string, i: number) => (
                  <li key={i} className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs">
                    {interest}
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-xs">No interests available</p>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-between bg-pink-100 p-3">
          <button
            onClick={() => handleSwipe('left')}
            className="w-1/2 text-center py-2 text-sm bg-red-600 text-white rounded-l-lg hover:bg-red-700"
          >
            Previous
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="w-1/2 text-center py-2 text-sm bg-red-600 text-white rounded-r-lg hover:bg-red-700"
          >
            Next
          </button>
        </div>
      </div>

      {/* Pop-up Notification */}
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-green-600">🎉 {popupMessage}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
