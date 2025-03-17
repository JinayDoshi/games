import React, { useState } from 'react';
import { Header } from './components/Header';
import { GameGrid } from './components/GameGrid';
import { GameView } from './components/GameView';

function App() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  const handlePlayGame = (gameId: string) => {
    setSelectedGame(gameId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedGame ? (
          <div>
            <button
              onClick={() => setSelectedGame(null)}
              className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center"
            >
              ← Back to Games
            </button>
            <GameView gameId={selectedGame} />
          </div>
        ) : (
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Games</h2>
            <GameGrid 
              onPlayGame={handlePlayGame}
              category={selectedCategory}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;