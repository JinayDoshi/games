import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GameRoom {
  id: string;
  game_id: string;
  password: string;
  status: 'waiting' | 'playing' | 'finished';
  current_state: any;
  maxPlayers?: number;  // Added for validation
}

interface RoomPlayer {
  id: string;
  player_name: string;
  is_host: boolean;
}

// Helper function to validate UUID format
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function useGameRoom(roomId: string | null) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    
    // Validate UUID format
    if (!isValidUUID(roomId)) {
      setError('Invalid room ID format');
      return;
    }

    // Subscribe to room changes
    const roomSubscription = supabase
      .from(`game_rooms:id=eq.${roomId}`)
      .on('UPDATE', (payload) => {
        setRoom(payload.new as GameRoom);
      })
      .subscribe();

    // Subscribe to player changes
    const playersSubscription = supabase
      .from(`room_players:room_id=eq.${roomId}`)
      .on('INSERT', fetchPlayers)
      .on('DELETE', fetchPlayers)
      .subscribe();

    // Initial data fetch
    fetchRoom();
    fetchPlayers();

    return () => {
      supabase.removeChannel(roomSubscription);
      supabase.removeChannel(playersSubscription);
    };
  }, [roomId]);

  const fetchRoom = async () => {
    if (!roomId || !isValidUUID(roomId)) return;

    const { data, error } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      setError(error.message);
    } else {
      setRoom(data);
    }
  };

  const fetchPlayers = async () => {
    if (!roomId || !isValidUUID(roomId)) return;

    const { data, error } = await supabase
      .from('room_players')
      .select('*')
      .eq('room_id', roomId);

    if (error) {
      setError(error.message);
    } else {
      setPlayers(data);
    }
  };

  const createRoom = async (gameId: string, playerName: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }

      const password = Math.random().toString(36).slice(-8);
      
      const { data: room, error: roomError } = await supabase
        .from('game_rooms')
        .insert([
          { game_id: gameId, password, status: 'waiting', maxPlayers: 4 }  // Ensure maxPlayers exists
        ])
        .select()
        .single();

      if (roomError) throw roomError;

      const { error: playerError } = await supabase
        .from('room_players')
        .insert([
          {
            room_id: room.id,
            user_id: userData.user.id,
            player_name: playerName,
            is_host: true
          }
        ]);

      if (playerError) throw playerError;

      return { roomId: room.id, password };
    } catch (err: any) {
      setError(err.message);
    }
  };

  const joinRoom = async (roomId: string, password: string, playerName: string) => {
    try {
      if (!isValidUUID(roomId)) {
        throw new Error('Invalid room ID format');
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }

      const { data: room, error: roomError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('id', roomId)
        .eq('password', password)
        .single();

      if (roomError || !room) {
        throw new Error('Invalid room ID or password');
      }

      if (room.maxPlayers && players.length >= room.maxPlayers) {
        throw new Error('Room is full');
      }

      const { error: playerError } = await supabase
        .from('room_players')
        .insert([
          {
            room_id: roomId,
            user_id: userData.user.id,
            player_name: playerName,
            is_host: false
          }
        ]);

      if (playerError) throw playerError;

      return room;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateGameState = async (state: any) => {
    if (!room) return;

    const { error } = await supabase
      .from('game_rooms')
      .update({ current_state: state })
      .eq('id', room.id);

    if (error) {
      setError(error.message);
    }
  };

  return {
    room,
    players,
    error,
    createRoom,
    joinRoom,
    updateGameState
  };
}
