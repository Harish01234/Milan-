'use client';
import { useEffect, useState, useRef } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, push } from 'firebase/database';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [isClient, setIsClient] = useState(false);
  const messageListRef = useRef(null);

  // Handle Client-Side Rendering
  useEffect(() => {
    setIsClient(true);
    const storedSender = localStorage.getItem('username') || 'alice';
    const storedReceiver = localStorage.getItem('recever') || 'bob';
    setSender(storedSender);
    setReceiver(storedReceiver);
  }, []);

  // Fetch Messages in Real-Time
  useEffect(() => {
    if (sender && receiver) {
      const messagesRef = ref(db, `messages/${getChatId(sender, receiver)}`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
          setMessages(messageList);
        } else {
          setMessages([]);
        }
      });
      return () => unsubscribe();
    }
  }, [sender, receiver]);

  // Auto-Scroll to the Latest Message
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Send Message to Firebase
  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const messagesRef = ref(db, `messages/${getChatId(sender, receiver)}`);
      push(messagesRef, {
        sender: sender,
        message: newMessage.trim(),
        timestamp: Date.now(),
      })
        .then(() => setNewMessage(''))
        .catch((error) => console.error('Error sending message:', error));
    }
  };

  // Generate Chat ID Based on Usernames
  const getChatId = (user1, user2) => {
    return [user1, user2].sort().join('_');
  };

  if (!isClient) return null; // Prevent SSR Issues

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-purple-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">Chat with {receiver}</h1>
          <p className="text-sm">Logged in as: {sender}</p>
        </div>

        {/* Messages */}
        <div
          className="h-96 overflow-y-auto p-4 bg-gray-50"
          ref={messageListRef}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded-lg max-w-xs ${
                msg.sender === sender
                  ? 'bg-blue-100 self-end ml-auto'
                  : 'bg-gray-200'
              }`}
            >
              <p className="font-semibold">{msg.sender}:</p>
              <p>{msg.message}</p>
              <p className="text-xs text-gray-500 text-right">
                {new Date(msg.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-gray-100 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Send
          </button>
        </div>

        {/* Sender/Receiver Setup */}
        <div className="p-4 bg-gray-50 flex gap-4 justify-between">
          <input
            type="text"
            placeholder="Set Sender"
            value={sender}
            onChange={(e) => {
              setSender(e.target.value);
              localStorage.setItem('sender', e.target.value);
            }}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Set Receiver"
            value={receiver}
            onChange={(e) => {
              setReceiver(e.target.value);
              localStorage.setItem('receiver', e.target.value);
            }}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
