import { Game } from '../types/game';

export const games: Game[] = [
  {
    id: 'snake',
    name: 'Snake',
    category: 'casual',
    description: 'Classic snake game. Eat the food, grow longer, and avoid hitting walls or yourself!',
    image: 'https://images.unsplash.com/photo-1605118883297-a515a0969f13?auto=format&fit=crop&q=80&w=500',
    maxPlayers: 1,
    featured: true
  },
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    category: 'puzzle',
    description: "Classic game of X's and O's. Get three in a row to win!",
    image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=500',
    maxPlayers: 2,
    featured: true
  },
  {
    id: 'connect-four',
    name: 'Connect Four',
    category: 'puzzle',
    description: 'Connect 4 pieces in a row to win! Play against friends or AI.',
    image: 'https://images.unsplash.com/photo-1606503153255-59d5e417e3f3?auto=format&fit=crop&q=80&w=500',
    maxPlayers: 2
  }
];