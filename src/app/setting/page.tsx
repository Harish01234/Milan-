import React from 'react';
import { FloatingNavDemo } from '../demo/page';

function Setting() {
  return (
    <div className="min-h-screen w-full bg-blue-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">Profile</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Username</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">Privacy</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Profile Visibility</label>
              <select className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Public</option>
                <option>Private</option>
                <option>Friends Only</option>
              </select>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Notifications</label>
              <input type="checkbox" className="mr-2 leading-tight" /> Receive email notifications
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">Account</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Change Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
              <input
                type="password"
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 text-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Save Changes
            </button>
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
