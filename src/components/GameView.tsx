import React, { useState } from 'react';
import { Snake } from '../games/Snake';
import { TicTacToe } from '../games/TicTacToe';
import { ConnectFour } from '../games/ConnectFour';
import { GameModeSelector } from './GameModeSelector';
import { PlayerList } from './PlayerList';

interface GameViewProps {
  gameId: string;
}

export const GameView: React.FC<GameViewProps> = ({ gameId }) => {
  const [gameMode, setGameMode] = useState<'bot' | 'online' | 'room' | null>(null);
  const [roomData, setRoomData] = useState<{ roomId: string; password: string } | null>(null);
  const [players, setPlayers] = useState<Array<{ id: string; name: string; isHost: boolean }>>([]);

  const handleSelectMode = (mode: 'bot' | 'online' | 'room', roomInfo?: { roomId: string; password: string }) => {
    setGameMode(mode);
    if (roomInfo) {
      setRoomData(roomInfo);
      // Simulate player data - in a real app, this would come from the backend
      setPlayers([
        { id: '1', name: 'You', isHost: !roomInfo.roomId },
        { id: '2', name: 'Waiting for player...', isHost: false }
      ]);
    }
  };

  const getGameName = () => {
    switch (gameId) {
      case 'tic-tac-toe':
        return 'Tic Tac Toe';
      case 'connect-four':
        return 'Connect Four';
      case 'snake':
        return 'Snake';
      default:
        return 'Game';
    }
  };

  if (!gameMode && (gameId === 'tic-tac-toe' || gameId === 'connect-four')) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <GameModeSelector onSelectMode={handleSelectMode} gameName={getGameName()} />
      </div>
    );
  }

  const renderGame = () => {
    switch (gameId) {
      case 'snake':
        return <Snake />;
      case 'tic-tac-toe':
        return <TicTacToe mode={gameMode} roomData={roomData} />;
      case 'connect-four':
        return <ConnectFour mode={gameMode} roomData={roomData} />;
      default:
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800">Game Not Found</h2>
            <p className="text-gray-600">The selected game is not available.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex gap-8">
        {gameMode === 'room' && (
          <div className="flex-shrink-0">
            <PlayerList players={players} currentPlayerId="1" />
          </div>
        )}
        <div className="flex-grow flex justify-center">
          {renderGame()}
        </div>
      </div>
    </div>
  );
};