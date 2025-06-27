import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Video } from '@/types/video';
import { useVideoStore } from '@/stores/videoStore';
import VideoListItem from '../components/VideoListItem';
import FilterButton, { FilterType } from '../components/FilterButton';
import { useRouter } from 'expo-router';

interface VideoListProps {
  videos: Video[];
  showWatchedOnly?: boolean;
}

const VideoList = ({ videos, showWatchedOnly }: VideoListProps) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const router = useRouter();

  const { isVideoWatched, getProgress, getCommentsForVideo } = useVideoStore();

  const filteredVideos = videos.filter((video) => {
    if (showWatchedOnly) {
      return isVideoWatched(video.id);
    }
    const isWatched = isVideoWatched(video.id);
    const progress = getProgress(video.id);
    const hasProgress =
      progress && progress.currentTime > 0 && !progress.isCompleted;

    switch (filter) {
      case 'watched':
        return isWatched;
      case 'unwatched':
        return !isWatched && !hasProgress;
      case 'in_progress':
        return hasProgress;
      default:
        return true;
    }
  });

  const renderVideoListItem = ({ item }: { item: Video }) => (
    <VideoListItem
      video={item}
      isWatched={isVideoWatched(item.id)}
      progress={getProgress(item.id)}
      numComments={getCommentsForVideo(item.id).length ?? 0}
      gotoComment={() =>
        router.push({
          pathname: '/comment',
          params: { videoId: item.id },
        })
      }
    />
  );

  const watchedCount = videos.filter((v) => isVideoWatched(v.id)).length;
  const unwatchedCount = videos.filter(
    (v) =>
      !isVideoWatched(v.id) &&
      (!getProgress(v.id) || getProgress(v.id)?.currentTime === 0)
  ).length;
  const inProgressCount = videos.filter((v) => {
    const progress = getProgress(v.id);
    return progress && progress.currentTime > 0 && !progress.isCompleted;
  }).length;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filtersScrollView}
      >
        <FilterButton
          type="all"
          label="All"
          count={videos.length}
          setFilter={setFilter}
          filter={filter}
        />
        <FilterButton
          type="watched"
          label="Watched"
          count={watchedCount}
          setFilter={setFilter}
          filter={filter}
        />
        <FilterButton
          type="in_progress"
          label="In Progress"
          count={inProgressCount}
          setFilter={setFilter}
          filter={filter}
        />
        <FilterButton
          type="unwatched"
          label="Unwatched"
          count={unwatchedCount}
          setFilter={setFilter}
          filter={filter}
        />
      </ScrollView>

      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredVideos}
          renderItem={renderVideoListItem}
          keyExtractor={(item) => item.id}
          numColumns={1}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No videos found</Text>
              <Text style={styles.emptySubtext}>
                Check back later for new content
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default VideoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  filtersScrollView: {
    maxHeight: 50,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 4,

    gap: 8,
    flexDirection: 'row',
  },

  resultsInfo: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  resultsText: {
    color: '#666',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});
