'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FloatingNavDemo } from '@/components/mainnavbar';
import {  useRouter } from 'next/navigation'; 

interface UserProfileProps {
  params: Promise<{ email?: string }>;
}

const UserProfile: React.FC<UserProfileProps> = ({ params }) => {
  const [email, setEmail] = useState<string | undefined>();
  const [posts, setPosts] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  localStorage.setItem('recever', userData?.username || '');

  const router = useRouter();


  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      if (resolvedParams?.email) {
        try {
          const decodedEmail = decodeURIComponent(resolvedParams.email);
          setEmail(decodedEmail);
        } catch (error) {
          console.error('Error decoding email:', error);
          setEmail(resolvedParams.email);
        }
      }
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) return;
      setLoading(true);
      try {
        const response = await axios.post('/api/getallposts', { email });
        if (response.data.success) {
          setPosts(response.data.data);
          setUserData(response.data.user);
        } else {
          console.error('Failed to fetch user data:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  // Function to handle chat button click
  const handleChatClick = () => {
    // Add your chat functionality here
    console.log('Chat button clicked!');
    // Example: Open a chat modal or redirect to a chat page

    router.push('/chat');
    
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 min-h-screen py-10 px-4 sm:px-10">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 md:w-40 md:h-40 bg-gradient-to-br from-pink-300 to-purple-500 rounded-full overflow-hidden shadow-lg">
            <img
              src={userData?.profilePicture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{userData?.username || 'User'}</h1>
            <p className="mt-2 text-lg">{userData?.gender || 'Not specified'}</p>
            {email && <p className="mt-2 text-lg">Email: {email}</p>}
            {userData?.location && (
              <p className="mt-2 text-lg">Location: {userData.location}</p>
            )}
            {userData?.bio && (
              <p className="mt-2 text-lg ">Bio: {userData.bio}</p>
            )}
            {userData?.premium?.isActive && (
              <p className="mt-2 text-lg font-semibold text-yellow-300">
                Premium User
              </p>
            )}
            {/* Chat Button */}
            <button
              onClick={handleChatClick}
              className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Bio & Interests */}
      <div className="max-w-4xl mx-auto mt-6 p-6 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {userData?.interests?.length > 0
            ? userData.interests.map((interest: string, index: number) => (
                <span
                  key={index}
                  className="bg-gradient-to-br from-yellow-300 to-red-500 text-white py-1 px-3 rounded-full text-sm font-medium shadow-sm"
                >
                  {interest}
                </span>
              ))
            : 'No interests added.'}
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-4xl mx-auto mt-6 p-6 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Posts</h2>
        {loading ? (
          <p className="text-white text-center">Loading posts...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-400 to-green-500 p-4 rounded-lg shadow hover:shadow-xl transition"
                >
                  <img
                    src={post}
                    alt={`Post ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-white">Post {index + 1}</h3>
                </div>
              ))
            ) : (
              <p className="text-white text-center">No posts to display.</p>
            )}
          </div>
        )}

        {/* Floating Navigation */}
        <div className="mt-8">
          <FloatingNavDemo />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;