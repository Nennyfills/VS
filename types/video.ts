export interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration?: number;
  genre?: string;
  releaseYear?: number;
}

export interface VideoProgress {
  videoId: string;
  currentTime: number;
  duration: number;
  lastWatched: Date;
  isCompleted: boolean;
}

export interface WatchedVideo {
  videoId: string;
  watchedAt: Date;
  rating?: number;
  comment?: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  text: string;
  createdAt: Date;
  author: string;
}
