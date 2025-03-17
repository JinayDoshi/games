import React, { useState, useCallback, useEffect } from 'react';

type Player = 1 | 2;
type Cell = Player | null;
type Board = Cell[][];
type GameMode = 'bot' | 'online' | 'room' | null;

interface ConnectFourProps {
  mode: GameMode;
  roomData?: { roomId: string; password: string } | null;
}

const ROWS = 6;
const COLS = 7;

const createEmptyBoard = (): Board => 
  Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

export const ConnectFour: React.FC<ConnectFourProps> = ({ mode, roomData }) => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(mode === 'online');
  const [gameStatus, setGameStatus] = useState<string>('');

  useEffect(() => {
    if (mode === 'online') {
      setGameStatus('Searching for an opponent...');
      // Simulate finding an opponent after 2 seconds
      const timer = setTimeout(() => {
        setWaitingForOpponent(false);
        setGameStatus('Opponent found! Game starting...');
      }, 2000);
      return () => clearTimeout(timer);
    } else if (mode === 'room' && roomData) {
      setGameStatus(`Room: ${roomData.roomId} - Waiting for opponent to join...`);
    }
  }, [mode, roomData]);

  const checkWinner = useCallback((board: Board, row: number, col: number, player: Player): boolean => {
    // Check horizontal
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[row][c] === player &&
        board[row][c + 1] === player &&
        board[row][c + 2] === player &&
        board[row][c + 3] === player
      ) {
        return true;
      }
    }

    // Check vertical
    for (let r = 0; r <= ROWS - 4; r++) {
      if (
        board[r][col] === player &&
        board[r + 1][col] === player &&
        board[r + 2][col] === player &&
        board[r + 3][col] === player
      ) {
        return true;
      }
    }

    // Check diagonal (positive slope)
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (
          board[r][c] === player &&
          board[r - 1][c + 1] === player &&
          board[r - 2][c + 2] === player &&
          board[r - 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    // Check diagonal (negative slope)
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (
          board[r][c] === player &&
          board[r + 1][c + 1] === player &&
          board[r + 2][c + 2] === player &&
          board[r + 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    return false;
  }, []);

  const checkDraw = (board: Board): boolean => {
    return board[0].every(cell => cell !== null);
  };

  const getBotMove = (board: Board): number => {
    // Simple bot strategy: Find first available column
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === null) {
        return col;
      }
    }
    return 0;
  };

  const dropPiece = (col: number) => {
    if (winner || board[0][col] !== null || waitingForOpponent) return;

    const newBoard = board.map(row => [...row]);
    let row = ROWS - 1;

    while (row >= 0 && newBoard[row][col] !== null) {
      row--;
    }

    if (row >= 0) {
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);

      if (checkWinner(newBoard, row, col, currentPlayer)) {
        setWinner(currentPlayer);
      } else if (checkDraw(newBoard)) {
        setWinner('Draw');
      } else {
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);

        // Bot's turn
        if (mode === 'bot' && nextPlayer === 2 && !winner) {
          setTimeout(() => {
            const botCol = getBotMove(newBoard);
            let botRow = ROWS - 1;
            while (botRow >= 0 && newBoard[botRow][botCol] !== null) {
              botRow--;
            }
            if (botRow >= 0) {
              const botBoard = newBoard.map(row => [...row]);
              botBoard[botRow][botCol] = 2;
              setBoard(botBoard);
              
              if (checkWinner(botBoard, botRow, botCol, 2)) {
                setWinner(2);
              } else if (checkDraw(botBoard)) {
                setWinner('Draw');
              } else {
                setCurrentPlayer(1);
              }
            }
          }, 500);
        }
      }
    }
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(1);
    setWinner(null);
    if (mode === 'online') {
      setWaitingForOpponent(true);
      setGameStatus('Searching for an opponent...');
    }
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
            {mode === 'bot' && currentPlayer === 2 
              ? "Bot is thinking..." 
              : `Player ${currentPlayer}'s Turn`}
          </h2>
        )}
        {winner && (
          <h2 className="text-2xl font-bold text-indigo-600">
            {winner === 'Draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
          </h2>
        )}
      </div>
      <div className="bg-blue-800 p-4 rounded-lg">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className="w-12 h-12 m-1 rounded-full bg-white hover:bg-gray-200 flex items-center justify-center"
                onClick={() => dropPiece(colIndex)}
                disabled={!!winner || waitingForOpponent || (mode === 'bot' && currentPlayer === 2)}
              >
                {cell && (
                  <div
                    className={`w-10 h-10 rounded-full ${
                      cell === 1 ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                  />
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        New Game
      </button>
    </div>
  );
};