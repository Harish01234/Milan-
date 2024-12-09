'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const successStories = [
  {
    names: "Priya & Rahul",
    story: "I was feeling lonely back in my hometown because most of my friends had started romantic relationships while I was abroad. We both decided to download Milan and see what happened. Without the app, we may have never met and embarked on this wild, wonderful journey. Thank you for bringing us and so many other couples together around the world. I will forever be grateful.",
  },
  {
    names: "Nisha & Arjun",
    story: "After years of struggling to meet the right person, I finally found my match on Milan. We talked for hours on end before we even met in person, and the connection was even better in real life. Milan helped us find each other in a way I never thought possible.",
  },
  {
    names: "Ankita & Rohan",
    story: "We met on Milan during the pandemic, both feeling a bit lost and disconnected. Little did we know, we would fall in love and make memories we’ll cherish forever. Milan gave us the chance to meet and gave us something we didn’t even know we were searching for.",
  },
  {
    names: "Neha & Vivek",
    story: "Being new to the city, I was looking for someone to talk to, and Milan brought me Vivek. We started off as friends, but it didn't take long to realize we had something special. Milan made it easy for us to meet, and the journey has been incredible.",
  },
  {
    names: "Divya & Amit",
    story: "We were both hesitant at first but took the leap. Milan made it so easy to connect, and now here we are, planning our future together. I never thought I would find my soulmate online, but Milan proved me wrong in the best way possible.",
  },
  {
    names: "Simran & Raj",
    story: "I had almost given up on finding someone special, but then I met Raj on Milan. We started talking and discovered so much about each other. Our connection grew deeper every day, and now we’re inseparable. Milan helped me find the love I never thought I’d find.",
  },
  {
    names: "Sonia & Karan",
    story: "We both had similar interests but had never crossed paths until Milan brought us together. It’s amazing how the app brought two people from completely different backgrounds to find love. Our connection was instant, and now we’re making memories every day.",
  },
  {
    names: "Ayesha & Rohit",
    story: "The best part of Milan is the opportunity it gives you to meet people who are serious about finding love. Rohit and I started off with a simple conversation, but it grew into something amazing. Milan gave us the platform to make that connection.",
  },
  {
    names: "Tanya & Harsh",
    story: "We were both busy with our careers and had little time to meet new people. Milan changed that. It connected us, and we instantly clicked. Now, we're planning our future together. Milan made it possible for us to find love despite our hectic schedules.",
  },
  {
    names: "Rita & Sanjay",
    story: "I never believed in online dating until I met Sanjay. Milan made it so easy to connect with people who are genuine. From the first message to now, we’ve built a beautiful relationship that I’ll always cherish.",
  },
];

export default function HomePage() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const router = useRouter();

  // Function to handle next story
  const nextStory = () => {
    setCurrentStoryIndex((prevIndex) =>
      prevIndex === successStories.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center text-gray-800 font-sans">
      {/* Navbar */}
      <header className="w-full py-4 px-6 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold text-red-600">Milan (मिलन)</h1>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 bg-pink-500 text-white font-medium rounded-full shadow hover:bg-pink-600"
        >
          Login
        </button>
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center text-center mt-12 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-pink-500 mb-4">
          जहाँ दिल मिलते हैं
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-600">
          "Where Hearts Meet" – Start your journey with Milan.
        </p>
        <button
          onClick={() => router.push("/signup")}
          className="px-8 py-4 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600"
        >
          Create Account
        </button>

        {/* Success Stories Carousel */}
        <div className="mt-12 w-full max-w-4xl flex justify-center items-center">
          <div className="bg-pink-50 border border-pink-200 rounded-lg shadow p-6 max-w-lg text-gray-700 text-center">
            <h3 className="text-xl font-semibold text-pink-600">
              {successStories[currentStoryIndex].names}
            </h3>
            <p className="italic text-lg mt-4">
              {successStories[currentStoryIndex].story}
            </p>
            <button
              onClick={nextStory}
              className="mt-6 px-6 py-2 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600"
            >
              Next Story
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-pink-50 text-center text-sm text-gray-600 border-t mt-12">
        <div className="space-x-6 mb-4">
          <a href="#" className="hover:text-pink-500">
            About
          </a>
          <a href="#" className="hover:text-pink-500">
            Contact
          </a>
          <a href="#" className="hover:text-pink-500">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-pink-500">
            Terms of Service
          </a>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          {/* Add social media icons here */}
          <a href="#" className="hover:text-pink-500">
            Facebook
          </a>
          <a href="#" className="hover:text-pink-500">
            Instagram
          </a>
          <a href="#" className="hover:text-pink-500">
            Twitter
          </a>
        </div>
        <p>© {new Date().getFullYear()} Milan. All rights reserved.</p>
      </footer>
    </div>
  );
}