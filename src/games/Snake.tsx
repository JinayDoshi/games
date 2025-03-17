import React, { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const FRUITS = ['🍏', '🍌', '🍉', '🍇', '🍒'];

export const Snake: React.FC = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(generateFood());
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [foodType, setFoodType] = useState(FRUITS[Math.floor(Math.random() * FRUITS.length)]);

  function generateFood() {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }

  const checkCollision = useCallback((head) => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, [snake]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      setFood(generateFood());
      setFoodType(FRUITS[Math.floor(Math.random() * FRUITS.length)]);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, isPaused, checkCollision, score]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      const newDirection =
        e.key === 'ArrowUp' && direction.y !== 1 ? { x: 0, y: -1 } :
        e.key === 'ArrowDown' && direction.y !== -1 ? { x: 0, y: 1 } :
        e.key === 'ArrowLeft' && direction.x !== 1 ? { x: -1, y: 0 } :
        e.key === 'ArrowRight' && direction.x !== -1 ? { x: 1, y: 0 } :
        direction;
      setDirection(newDirection);
      if (e.key === ' ') setIsPaused(!isPaused);
    };

    window.addEventListener('keydown', handleKeyPress);
    const gameInterval = setInterval(moveSnake, 150);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameInterval);
    };
  }, [direction, gameOver, isPaused, moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    setFoodType(FRUITS[Math.floor(Math.random() * FRUITS.length)]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex items-center justify-between w-full max-w-[400px]">
        <div className="text-xl font-bold">Score: {score}</div>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
      <div 
        className="border-2 border-gray-300 relative bg-green-200"
        style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute bg-green-800 rounded-full ${i === 0 ? 'border-2 border-white' : ''}`}
            style={{
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE
            }}
          >
            {i === 0 && (
              <>
                <div className="w-2 h-2 bg-white absolute top-1 left-2 rounded-full"></div>
                <div className="w-2 h-2 bg-white absolute top-1 right-2 rounded-full"></div>
              </>
            )}
            {i === snake.length - 1 && <div className="w-3 h-3 bg-green-900 absolute bottom-1 left-1/2 transform -translate-x-1/2 rounded-full"></div>}
          </div>
        ))}
        {!gameOver && (
          <div
            className="absolute text-xl"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE
            }}
          >
            {foodType}
          </div>
        )}
      </div>
      {gameOver && (
        <div className="mt-4 text-center w-full max-w-[400px] p-4 bg-white border-2 border-gray-300 rounded-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Game Over!</h2>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Play Again
          </button>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">Use arrow keys to move • Space to pause</div>
    </div>
  );
};
