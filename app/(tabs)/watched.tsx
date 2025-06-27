import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useVideoStore } from '@/stores/videoStore';
import VideoList from '@/container/VideoList';

const WatchedScreen = () => {
  const { videos, watchedVideos } = useVideoStore();

  const watchedVideosList = useMemo(() => {
    const watchedVideoIds = new Set(
      watchedVideos.map((watched) => watched.videoId)
    );
    return videos.filter((video) => watchedVideoIds.has(video.id));
  }, [videos, watchedVideos]);

  const watchedCount = watchedVideosList.length;
  const countText = useMemo(
    () => `${watchedCount} video${watchedCount !== 1 ? 's' : ''} completed`,
    [watchedCount]
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Watched Videos</Text>
        <Text style={styles.subtitle}>{countText}</Text>
      </View>

      {watchedCount > 0 ? (
        <VideoList videos={watchedVideosList} showWatchedOnly={true} />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No watched videos yet</Text>
          <Text style={styles.emptySubtext}>
            Start watching videos to see them here
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#999',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WatchedScreen;
