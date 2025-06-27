import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Video,
  VideoProgress,
  WatchedVideo,
  VideoComment,
} from '@/types/video';
import { mockVideos } from '@/data/mockVideos';

interface VideoStore {
  videos: Video[];
  watchedVideos: WatchedVideo[];
  videoProgress: VideoProgress[];
  comments: VideoComment[];
  isLoading: boolean;
  error: string | null;
  currentlyPlayingId: string | null;

  // Actions
  fetchVideos: () => Promise<void>;
  markAsWatched: (videoId: string, rating?: number) => Promise<void>;
  unmarkAsWatched: (videoId: string) => Promise<void>;
  updateProgress: (
    videoId: string,
    currentTime: number,
    duration: number
  ) => Promise<void>;
  getProgress: (videoId: string) => VideoProgress | null;
  isVideoWatched: (videoId: string) => boolean;
  addComment: (videoId: string, text: string, author: string) => Promise<void>;
  updateComment: (commentId: string, text: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  getCommentsForVideo: (videoId: string) => VideoComment[];
  loadStoredData: () => Promise<void>;
  setCurrentlyPlayingId: (videoId: string | null) => void;
}

const STORAGE_KEYS = {
  WATCHED_VIDEOS: 'watchedVideos',
  VIDEO_PROGRESS: 'videoProgress',
  COMMENTS: 'videoComments',
};

export const useVideoStore = create<VideoStore>((set, get) => ({
  videos: [],
  watchedVideos: [],
  videoProgress: [],
  comments: [],
  isLoading: false,
  error: null,
  currentlyPlayingId: null,

  setCurrentlyPlayingId: (videoId) => {
    set({ currentlyPlayingId: videoId });
  },

  fetchVideos: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ videos: mockVideos, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch videos', isLoading: false });
    }
  },

  loadStoredData: async () => {
    try {
      const [watchedVideos, videoProgress, comments] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WATCHED_VIDEOS),
        AsyncStorage.getItem(STORAGE_KEYS.VIDEO_PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.COMMENTS),
      ]);

      set({
        watchedVideos: watchedVideos ? JSON.parse(watchedVideos) : [],
        videoProgress: videoProgress ? JSON.parse(videoProgress) : [],
        comments: comments ? JSON.parse(comments) : [],
      });
    } catch (error) {
      console.error('Failed to load stored data:', error);
    }
  },

  markAsWatched: async (videoId: string, rating?: number) => {
    const watchedVideo: WatchedVideo = {
      videoId,
      watchedAt: new Date(),
      rating,
    };

    const updatedWatchedVideos = [
      ...get().watchedVideos.filter((v) => v.videoId !== videoId),
      watchedVideo,
    ];

    set({ watchedVideos: updatedWatchedVideos });

    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.WATCHED_VIDEOS,
        JSON.stringify(updatedWatchedVideos)
      );
    } catch (error) {
      console.error('Failed to save watched video:', error);
    }
  },

  unmarkAsWatched: async (videoId: string) => {
    const updatedWatchedVideos = get().watchedVideos.filter(
      (v) => v.videoId !== videoId
    );

    set({ watchedVideos: updatedWatchedVideos });

    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.WATCHED_VIDEOS,
        JSON.stringify(updatedWatchedVideos)
      );
    } catch (error) {
      console.error('Failed to remove watched video:', error);
    }
  },

  updateProgress: async (
    videoId: string,
    currentTime: number,
    duration: number
  ) => {
    const progress: VideoProgress = {
      videoId,
      currentTime,
      duration,
      lastWatched: new Date(),
      isCompleted: currentTime >= duration * 0.9,
    };

    const updatedProgress = [
      ...get().videoProgress.filter((p) => p.videoId !== videoId),
      progress,
    ];

    set({ videoProgress: updatedProgress });

    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.VIDEO_PROGRESS,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  },

  getProgress: (videoId: string) => {
    return get().videoProgress.find((p) => p.videoId === videoId) || null;
  },

  isVideoWatched: (videoId: string) => {
    return get().watchedVideos.some((v) => v.videoId === videoId);
  },

  addComment: async (videoId: string, text: string, author: string) => {
    const comment: VideoComment = {
      id: Date.now().toString(),
      videoId,
      text,
      author,
      createdAt: new Date(),
    };

    const updatedComments = [...get().comments, comment];

    set({ comments: updatedComments });

    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMMENTS,
        JSON.stringify(updatedComments)
      );
    } catch (error) {
      console.error('Failed to save comment:', error);
    }
  },

  updateComment: async (commentId: string, text: string) => {
    const updatedComments = get().comments.map((comment) =>
      comment.id === commentId ? { ...comment, text } : comment
    );

    set({ comments: updatedComments });

    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMMENTS,
        JSON.stringify(updatedComments)
      );
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  },
  //TODO: use this function
  deleteComment: async (commentId: string) => {
    const updatedComments = get().comments.filter((c) => c.id !== commentId);

    set({ comments: updatedComments });

    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMMENTS,
        JSON.stringify(updatedComments)
      );
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  },

  getCommentsForVideo: (videoId: string) => {
    return get().comments.filter((c) => c.videoId === videoId);
  },
}));

// Export standalone functions for easier access outside React components
export const videoStoreActions = {
  addComment: (videoId: string, text: string, author: string) =>
    useVideoStore.getState().addComment(videoId, text, author),
  updateComment: (commentId: string, text: string) =>
    useVideoStore.getState().updateComment(commentId, text),
  deleteComment: (commentId: string) =>
    useVideoStore.getState().deleteComment(commentId),
  getCommentsForVideo: (videoId: string) =>
    useVideoStore.getState().getCommentsForVideo(videoId),
  markAsWatched: (videoId: string, rating?: number) =>
    useVideoStore.getState().markAsWatched(videoId, rating),
  unmarkAsWatched: (videoId: string) =>
    useVideoStore.getState().unmarkAsWatched(videoId),
  updateProgress: (videoId: string, currentTime: number, duration: number) =>
    useVideoStore.getState().updateProgress(videoId, currentTime, duration),
  getProgress: (videoId: string) =>
    useVideoStore.getState().getProgress(videoId),
  isVideoWatched: (videoId: string) =>
    useVideoStore.getState().isVideoWatched(videoId),
  fetchVideos: () => useVideoStore.getState().fetchVideos(),
  loadStoredData: () => useVideoStore.getState().loadStoredData(),
  setCurrentlyPlayingId: (videoId: string | null) =>
    useVideoStore.getState().setCurrentlyPlayingId(videoId),
};
