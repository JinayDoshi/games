import React from 'react';
import { Game } from '../types/game';
import { Users, Trophy, ArrowRight } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onPlay: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      <img 
        src={game.image} 
        alt={game.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{game.name}</h3>
          {game.featured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Featured
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4">{game.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-500">
            <Users size={18} />
            <span className="text-sm">{game.maxPlayers > 1 ? `1-${game.maxPlayers}` : '1'} Players</span>
          </div>
          <button
            onClick={() => onPlay(game.id)}
            className="flex items-center space-x-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <span>Play</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};