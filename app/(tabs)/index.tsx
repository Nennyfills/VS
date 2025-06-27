import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useVideoStore } from '@/stores/videoStore';
import VideoList from '@/container/VideoList';
import { match, P } from 'ts-pattern';
import me from '@/data/currentUSer';

const LoadingView = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading videos...</Text>
  </View>
);

const ErrorView = ({ error }: { error: string }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>Error loading videos</Text>
    <Text style={styles.errorSubtext}>{error}</Text>
  </View>
);

const EmptyView = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No videos found</Text>
    <Text style={styles.emptySubtext}>Check back later for new content</Text>
  </View>
);

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.title}>{me.username}</Text>
    <Text style={styles.subtitle}>Discover amazing content</Text>
  </View>
);

const VideoScreen = () => {
  const { videos, isLoading, error, fetchVideos } = useVideoStore();

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const displayContent = useMemo(
    () =>
      match({ isLoading, error, videos })
        .with({ isLoading: true }, () => <LoadingView />)
        .with({ error: P.string }, ({ error }) => <ErrorView error={error} />)
        .with({ isLoading: false, error: null, videos: [] }, () => (
          <EmptyView />
        ))
        .with({ isLoading: false, error: null }, ({ videos }) => (
          <VideoList videos={videos} />
        ))
        .exhaustive(),
    [isLoading, error, videos]
  );

  return (
    <View style={styles.container}>
      <Header />
      {displayContent}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
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
    fontSize: 14,
    textAlign: 'center',
  },
});

export default VideoScreen;
