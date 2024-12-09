'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Correct hooks for Next.js app directory
import axios from 'axios'; // Use axios for API requests
import { BeatLoader } from 'react-spinners'; // Loader for UI feedback

const VerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const params = useParams();
  const router = useRouter(); // For navigation if needed

  // Handle string | string[] type
  const emailParam = params?.email;
  const email = typeof emailParam === 'string' ? decodeURIComponent(emailParam) : null;

  useEffect(() => {
    if (!email) {
      setPopupMessage('Email not found in the route.');
      setShowPopup(true);
    }
  }, [email]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setPopupMessage('Email is missing. Please try again.');
      setShowPopup(true);
      return;
    }

    setLoading(true);
    setMessage('');
    setShowPopup(false);

    try {
      const response = await axios.post('/api/verification', {
        email,
        otp,
      });

      setPopupMessage(response.data.message);
      setShowPopup(true);

      if (response.status === 200) {
        setMessage('Verification successful.');
      } else {
        setMessage('Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setPopupMessage('An error occurred. Please try again.');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-pink-400 via-red-500 to-pink-600">
        <h1 className="text-white text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-pink-400 via-red-500 to-pink-600">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Verify Your Account</h2>

        <form onSubmit={handleVerification} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {message && (
            <p className={`mt-2 text-sm ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:bg-pink-400"
            disabled={loading}
          >
            {loading ? <BeatLoader color="white" size={15} /> : 'Verify'}
          </button>
        </form>

        {showPopup && (
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 text-center space-y-3"
            style={{
              backgroundColor: popupMessage.includes('successful') ? '#6ee7b7' : '#fca5a5',
            }}
          >
            <h3 className="text-lg font-bold">{popupMessage}</h3>
            <button
              className="bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
