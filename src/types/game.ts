export interface Game {
  id: string;
  name: string;
  category: GameCategory;
  description: string;
  image: string;
  maxPlayers: number;
  featured?: boolean;
}

export type GameCategory = 
  | 'arcade'
  | 'racing'
  | 'card'
  | 'board'
  | 'puzzle'
  | 'casual';

export interface Room {
  id: string;
  gameId: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
}