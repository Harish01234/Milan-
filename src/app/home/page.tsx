'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SuccessStory {
  names: string;
  story: string;
}

const successStories: SuccessStory[] = [
  { names: "Aman & Priya", story: "We found love and happiness through Milan." },
  { names: "Rahul & Sneha", story: "Milan made our dream come true." },
  { names: "Aditya & Riya", story: "A connection that changed our lives forever." },
];

export default function HomePage(): React.ReactElement {
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const router = useRouter();

  const nextStory = (): void => {
    setCurrentStoryIndex((prevIndex) =>
      prevIndex === successStories.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center text-gray-800 font-sans">
      {/* Navbar */}
      <header className="w-full py-4 px-6 flex justify-between items-center border-b border-pink-200">
        <h1 className="text-2xl font-bold text-pink-700">Milan (मिलन)</h1>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 bg-pink-600 text-white font-medium rounded-full shadow hover:bg-pink-700"
        >
          Login
        </button>
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center text-center mt-12 px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
          जहाँ दिल मिलते हैं
        </h2>
        <p className="text-lg md:text-xl mb-8 text-pink-700">
          "Where Hearts Meet" – Start your journey with Milan.
        </p>
        <button
          onClick={() => router.push("/signup")}
          className="px-8 py-4 bg-pink-500 text-white font-semibold rounded-full shadow-lg hover:bg-pink-600"
        >
          Create Account
        </button>

        {/* Success Stories Carousel */}
        <div className="mt-12 w-full max-w-4xl flex justify-center items-center">
          <div className="bg-white border border-pink-300 rounded-lg shadow p-6 max-w-lg text-gray-700 text-center">
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
      <footer className="w-full py-8 bg-pink-100 text-center text-sm text-pink-700 border-t border-pink-300 mt-12">
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
