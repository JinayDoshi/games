/*
  # Game rooms and players schema

  1. New Tables
    - `game_rooms`
      - `id` (uuid, primary key)
      - `game_id` (text, references game type)
      - `password` (text, room password)
      - `status` (text, room status)
      - `current_state` (jsonb, current game state)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `room_players`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references game_rooms)
      - `user_id` (uuid, references auth.users)
      - `player_name` (text)
      - `is_host` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for room creation and joining
    - Add policies for updating game state
*/

-- Create game_rooms table
CREATE TABLE game_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL,
  password text NOT NULL,
  status text NOT NULL DEFAULT 'waiting',
  current_state jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create room_players table
CREATE TABLE room_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES game_rooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name text NOT NULL,
  is_host boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;

-- Policies for game_rooms
CREATE POLICY "Anyone can create rooms"
  ON game_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Players can view their rooms"
  ON game_rooms
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_players
      WHERE room_players.room_id = game_rooms.id
      AND room_players.user_id = auth.uid()
    )
    OR
    status = 'waiting'
  );

CREATE POLICY "Players can update their rooms"
  ON game_rooms
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM room_players
      WHERE room_players.room_id = game_rooms.id
      AND room_players.user_id = auth.uid()
    )
  );

-- Policies for room_players
CREATE POLICY "Anyone can join rooms"
  ON room_players
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Players can view room members"
  ON room_players
  FOR SELECT
  TO authenticated
  USING (
    room_id IN (
      SELECT room_id FROM room_players
      WHERE user_id = auth.uid()
    )
  );