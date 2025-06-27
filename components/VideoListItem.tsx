import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Clock, MessageCirclePlus } from 'lucide-react-native';
import { Video, VideoProgress } from '@/types/video';
import VideoPlayer from './VideoPlayer';

interface VideoListItemProps {
  video: Video;
  isWatched?: boolean;
  progress?: VideoProgress | null;
  numComments: number;
  gotoComment: () => void;
}

export default function VideoListItem({
  video,
  isWatched,
  progress,
  numComments,
  gotoComment,
}: VideoListItemProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!progress) return 0;
    return (progress.currentTime / progress.duration) * 100;
  };

  return (
    <View style={styles.container} testID="video-list-item">
      <View style={styles.containerWrapper}>
        <VideoPlayer video={video} initialTime={progress?.currentTime} />
        {progress && progress.currentTime > 0 && (
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${getProgressPercentage()}%` },
              ]}
            />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {video.title}
          </Text>
          <View style={styles.durationBadge}>
            <Text style={styles.duration}>
              {formatDuration(video.duration || 0)}
            </Text>
          </View>
        </View>

        {video.description && (
          <Text style={styles.description} numberOfLines={2}>
            {video.description}
          </Text>
        )}

        <View style={styles.metadata}>
          <View style={styles.metaRow}>
            <View style={styles.watchedAndGenre}>
              {video.genre && <Text style={styles.genre}>{video.genre}</Text>}
              {isWatched && (
                <View style={styles.watchedIndicator}>
                  <Check color="white" size={9} />
                </View>
              )}
            </View>
            {video.releaseYear && (
              <Text style={styles.year}>{video.releaseYear}</Text>
            )}
          </View>

          {progress && progress.currentTime > 0 && (
            <View style={styles.progressInfo}>
              <Clock color="#666" size={12} />
              <Text style={styles.progressText}>
                {Math.round(getProgressPercentage())}% watched
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.commentsInfo} onPress={gotoComment}>
            <MessageCirclePlus color="#fff" size={18} />
            <Text style={styles.commentsText}>
              {numComments} comment{numComments !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  containerWrapper: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },

  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff6b6b',
  },

  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  duration: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  watchedIndicator: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 4,
    marginVertical: 4,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watchedAndGenre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  description: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  metadata: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genre: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
  },
  year: {
    color: '#666',
    fontSize: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  progressText: {
    color: '#666',
    fontSize: 11,
    fontWeight: '500',
  },

  commentsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  commentsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
