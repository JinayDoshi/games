import React from 'react';
import { Gamepad2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gamepad2 size={32} className="text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">GameHub</h1>
          </div>
          <nav className="flex space-x-4">
            <button className="text-gray-600 hover:text-gray-900">Categories</button>
            <button className="text-gray-600 hover:text-gray-900">Leaderboard</button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Create Room
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};