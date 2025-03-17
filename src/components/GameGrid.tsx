import React from 'react';
import { GameCard } from './GameCard';
import { games } from '../data/games';
import { Game } from '../types/game';

interface GameGridProps {
  category?: string;
  onPlayGame: (gameId: string) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ category, onPlayGame }) => {
  const filteredGames = category 
    ? games.filter(game => game.category === category)
    : games;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredGames.map((game: Game) => (
        <GameCard 
          key={game.id} 
          game={game} 
          onPlay={onPlayGame}
        />
      ))}
    </div>
  );
};