import { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Text,
  Image,
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import { useVideoStore } from '@/stores/videoStore';
import { Video as VideoType } from '@/types/video';

interface VideoPlayerProps {
  video: VideoType;
  onClose?: () => void;
  initialTime?: number;
}

const VideoPlayer = ({ video, onClose, initialTime = 0 }: VideoPlayerProps) => {
  const playerRef = useRef<VideoRef>(null);
  const progressBarWidth = useRef(new Animated.Value(0)).current;

  const {
    updateProgress,
    markAsWatched,
    currentlyPlayingId,
    setCurrentlyPlayingId,
    getProgress,
  } = useVideoStore();
  const isEnded = (() => {
    const progress = getProgress(video.id);
    return (
      progress?.duration && progress.currentTime >= progress.duration * 0.9
    );
  })();
  const [duration, setDuration] = useState(0);
  const [_, setCurrentTime] = useState(initialTime);
  const [hasEnded, setHasEnded] = useState(isEnded);
  const [isPlaying, setIsPlaying] = useState(false);

  const shouldPlay = currentlyPlayingId === video.id;

  useEffect(() => {
    if (!shouldPlay) {
      setIsPlaying(false);
    }
  }, [shouldPlay]);

  const handlePlay = () => {
    if (hasEnded && playerRef.current) {
      playerRef.current.seek(0);
    }

    setHasEnded(false);
    setCurrentlyPlayingId(video.id);
    setIsPlaying(true);
    progressBarWidth.setValue(0);
    setCurrentTime(0);
  };

  const handleProgress = ({ currentTime }: { currentTime: number }) => {
    setCurrentTime(currentTime);

    if (!isPlaying) return;

    updateProgress(video.id, currentTime, duration);

    const progress = currentTime / duration;
    Animated.timing(progressBarWidth, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();

    if (progress >= 0.9) {
      markAsWatched(video.id);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.pressable} onPress={handlePlay}>
        <Video
          testID="video-player"
          ref={playerRef}
          source={{ uri: video.videoUrl }}
          style={styles.video}
          resizeMode="contain"
          controls
          paused={!isPlaying}
          repeat={false}
          onLoad={({ duration }) => setDuration(duration)}
          onProgress={handleProgress}
          onEnd={() => {
            setHasEnded(true);
            setIsPlaying(false);
            setCurrentlyPlayingId(null);
            onClose?.();
          }}
        />
        {!isPlaying && video.thumbnail && (
          <Image
            source={{ uri: video.thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
            testID="thumbnail"
          />
        )}
        {!isPlaying && (
          <View style={styles.playOverlay}>
            <Text style={styles.playText}>{hasEnded ? '⟳' : '▶'}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 2,
  },
  playText: {
    fontSize: 64,
    color: 'white',
  },
});

export default VideoPlayer;
