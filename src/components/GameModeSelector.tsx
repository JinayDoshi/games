import React, { useState } from 'react';
import { Bot, Users, UserPlus, UserSquare2 } from 'lucide-react';
import { nanoid } from 'nanoid';

interface GameModeSelectorProps {
  onSelectMode: (mode: 'bot' | 'online' | 'room', roomData?: { roomId: string; password: string }) => void;
  gameName: string;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode, gameName }) => {
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [playerName, setPlayerName] = useState('');

  const handleCreateRoom = () => {
    const newRoomId = nanoid(8);
    const newPassword = nanoid(6);
    setRoomId(newRoomId);
    setPassword(newPassword);
    setShowCreateRoom(true);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectMode('room', { roomId, password });
  };

  if (showJoinRoom) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Room</h2>
        <form onSubmit={handleJoinRoom} className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
              Room ID
            </label>
            <input
              type="text"
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Join
            </button>
            <button
              type="button"
              onClick={() => setShowJoinRoom(false)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (showCreateRoom) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Room Created!</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Room ID</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={roomId}
                readOnly
                className="block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={password}
                readOnly
                className="block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Share these credentials with your friend to join the game.
          </p>
          <button
            onClick={() => onSelectMode('room', { roomId, password })}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            disabled={!playerName}
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Game Mode - {gameName}</h2>
      <div className="space-y-4">
        <button
          onClick={() => onSelectMode('bot')}
          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700"
        >
          <Bot size={20} />
          <span>Play Against Bot</span>
        </button>
        <button
          onClick={() => onSelectMode('online')}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700"
        >
          <Users size={20} />
          <span>Play Online</span>
        </button>
        <button
          onClick={handleCreateRoom}
          className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-purple-700"
        >
          <UserPlus size={20} />
          <span>Create Room</span>
        </button>
        <button
          onClick={() => setShowJoinRoom(true)}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700"
        >
          <UserSquare2 size={20} />
          <span>Join Room</span>
        </button>
      </div>
    </div>
  );
};