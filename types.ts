
export enum Page {
  BENCH = 'The Bench',
  BOARD = 'Message Board',
  CALENDAR = 'Mood Calendar'
}

export interface AudioTrack {
  id: string;
  name: string;
  volume: number;
  icon: string;
}

export type UserProfile = 'Knight' | 'Hornet';

export interface Comment {
  id: string;
  text: string;
  author: UserProfile;
  timestamp: string;
}

export interface Note {
  id: string;
  text: string;
  imageUrl?: string;
  liked: boolean;
  timestamp: string;
  author: UserProfile;
  comments: Comment[];
}

export type MoodType = 'happy' | 'sad' | 'angry' | 'neutral' | 'peaceful';

export const MOODS: Record<MoodType, string> = {
  happy: '😊',
  sad: '😟',
  angry: '🤬',
  neutral: '😐',
  peaceful: '😌'
};

export interface DailyData {
  mood?: MoodType;
  journal?: string;
}