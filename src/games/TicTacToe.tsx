import React, { useState, useEffect } from 'react';
import { useGameRoom } from '../hooks/useGameRoom';
import { supabase } from '../lib/supabase';

type Player = 'X' | 'O';
type BoardState = (Player | null)[];
type GameMode = 'bot' | 'online' | 'room' | null;

interface TicTacToeProps {
  mode: GameMode;
  roomData?: { roomId: string; password: string } | null;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

interface GameState {
  board: BoardState;
  currentPlayer: Player;
  winner: Player | 'Draw' | null;
}

export const TicTacToe: React.FC<TicTacToeProps> = ({ mode, roomData }) => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(mode === 'online' || mode === 'room');
  const [gameStatus, setGameStatus] = useState<string>('');
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  
  const { room, players, updateGameState } = useGameRoom(roomData?.roomId || null);

  useEffect(() => {
    if (mode === 'room' && room) {
      // Subscribe to real-time game state updates
      const gameStateSubscription = supabase
        .channel(`game_state:${room.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'game_rooms',
          filter: `id=eq.${room.id}`,
        }, (payload) => {
          const newState = payload.new.current_state as GameState;
          if (newState) {
            setBoard(newState.board);
            setCurrentPlayer(newState.currentPlayer);
            setWinner(newState.winner);
          }
        })
        .subscribe();

      // Set initial game state from room
      if (room.current_state) {
        const state = room.current_state as GameState;
        setBoard(state.board);
        setCurrentPlayer(state.currentPlayer);
        setWinner(state.winner);
      }

      // Determine player's symbol based on join order
      if (players.length === 2) {
        setWaitingForOpponent(false);
        const isHost = players[0].is_host;
        setPlayerSymbol(isHost ? 'X' : 'O');
      }

      return () => {
        gameStateSubscription.unsubscribe();
      };
    }
  }, [mode, room, players]);

  useEffect(() => {
    if (mode === 'online') {
      setGameStatus('Searching for an opponent...');
      const timer = setTimeout(() => {
        setWaitingForOpponent(false);
        setGameStatus('Opponent found! Game starting...');
      }, 2000);
      return () => clearTimeout(timer);
    } else if (mode === 'room' && roomData) {
      if (players.length < 2) {
        setGameStatus(`Room: ${roomData.roomId} - Waiting for opponent to join...`);
      } else {
        setGameStatus(`Room: ${roomData.roomId} - Game in progress`);
      }
    }
  }, [mode, roomData, players]);

  const checkWinner = (boardState: BoardState): Player | 'Draw' | null => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return boardState[a] as Player;
      }
    }

    if (boardState.every(cell => cell !== null)) {
      return 'Draw';
    }

    return null;
  };

  const getBotMove = (boardState: BoardState): number => {
    const emptyCells = boardState
      .map((cell, index) => ({ cell, index }))
      .filter(({ cell }) => cell === null)
      .map(({ index }) => index);
    
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const handleClick = async (index: number) => {
    if (board[index] || winner || waitingForOpponent) return;
    
    // In room mode, only allow moves on player's turn
    if (mode === 'room' && currentPlayer !== playerSymbol) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    if (gameResult) {
      setWinner(gameResult);
    } else {
      setCurrentPlayer(nextPlayer);
    }

    // Update game state in Supabase for room mode
    if (mode === 'room' && room) {
      const newState: GameState = {
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: gameResult
      };
      await updateGameState(newState);
    }

    // Handle bot mode
    if (mode === 'bot' && !gameResult && nextPlayer === 'O') {
      setTimeout(() => {
        const botMove = getBotMove(newBoard);
        const botBoard = [...newBoard];
        botBoard[botMove] = 'O';
        setBoard(botBoard);
        
        const botResult = checkWinner(botBoard);
        if (botResult) {
          setWinner(botResult);
        } else {
          setCurrentPlayer('X');
        }
      }, 500);
    }
  };

  const resetGame = async () => {
    const newBoard = Array(9).fill(null);
    setBoard(newBoard);
    setCurrentPlayer('X');
    setWinner(null);

    if (mode === 'online') {
      setWaitingForOpponent(true);
      setGameStatus('Searching for an opponent...');
    } else if (mode === 'room' && room) {
      const newState: GameState = {
        board: newBoard,
        currentPlayer: 'X',
        winner: null
      };
      await updateGameState(newState);
    }
  };

  const renderCell = (index: number) => {
    return (
      <button
        key={`cell-${index}`}
        className={`w-20 h-20 border-2 border-gray-300 text-4xl font-bold flex items-center justify-center
          ${board[index] === 'X' ? 'text-blue-600' : 'text-red-600'}
          ${!board[index] && !winner && !waitingForOpponent && (mode !== 'room' || currentPlayer === playerSymbol) ? 'hover:bg-gray-100' : ''}`}
        onClick={() => handleClick(index)}
        disabled={
          !!winner || 
          waitingForOpponent || 
          (mode === 'bot' && currentPlayer === 'O') ||
          (mode === 'room' && currentPlayer !== playerSymbol)
        }
      >
        {board[index]}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {gameStatus && (
        <div className="mb-4 text-lg font-semibold text-indigo-600">
          {gameStatus}
        </div>
      )}
      <div className="mb-4">
        {!winner && !waitingForOpponent && (
          <h2 className="text-xl font-bold">
            {mode === 'bot' && currentPlayer === 'O' 
              ? "Bot is thinking..." 
              : mode === 'room'
                ? `Current Player: ${currentPlayer} ${currentPlayer === playerSymbol ? "(Your turn)" : ""}`
                : `Current Player: ${currentPlayer}`}
          </h2>
        )}
        {winner && (
          <h2 className="text-2xl font-bold text-indigo-600">
            {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
          </h2>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({ length: 9 }, (_, i) => renderCell(i))}
      </div>
      <button
        onClick={resetGame}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        New Game
      </button>
    </div>
  );
};