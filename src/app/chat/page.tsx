'use client';
import { useEffect, useState } from 'react';

export default function ChatPage() {
  const [email, setEmail] = useState<string>(''); // Sender email
  const [userProfileEmail, setUserProfileEmail] = useState<string>(''); // Receiver email
  const [message, setMessage] = useState<string>(''); // Current message
  const [messages, setMessages] = useState<string[]>([]); // List of messages
  const [isClient, setIsClient] = useState(false); // Client-side flag

  // Load email and userProfileEmail from localStorage on component mount
  useEffect(() => {
    setIsClient(true); // Set the flag to true once we're on the client

    const storedEmail = localStorage.getItem('username');
    const storedUserProfileEmail = localStorage.getItem('upusername');

    if (storedEmail) setEmail(storedEmail);
    if (storedUserProfileEmail) setUserProfileEmail(storedUserProfileEmail);
  }, []);

  // Save email and userProfileEmail to localStorage whenever they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('email', email);
      localStorage.setItem('userProfileEmail', userProfileEmail);
    }
  }, [email, userProfileEmail, isClient]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Log sender, receiver, and message as a single JSON object
      const logData = {
        sender: email,
        receiver: userProfileEmail,
        message: message,
      };
      console.log(JSON.stringify(logData));

      setMessages([...messages, `${email}: ${message}`]);
      setMessage('');
    }
  };

  if (!isClient) return null; // Prevent SSR mismatch by returning null until client-side is ready

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
          <h1 className="text-white text-2xl font-bold">Chat with {userProfileEmail}</h1>
          <p className="text-sm text-purple-200">Logged in as: {email}</p>
        </div>

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">{msg}</p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
