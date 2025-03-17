import React from 'react';
import { Crown, User } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  isHost: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, currentPlayerId }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-64">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Players</h3>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center space-x-2 p-2 rounded-md ${
              player.id === currentPlayerId ? 'bg-indigo-50' : ''
            }`}
          >
            {player.isHost ? (
              <Crown size={18} className="text-yellow-500" />
            ) : (
              <User size={18} className="text-gray-500" />
            )}
            <span className="text-gray-700">
              {player.name}
              {player.id === currentPlayerId && ' (You)'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};