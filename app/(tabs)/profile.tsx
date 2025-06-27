import { useMemo, memo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  CircleCheck as CheckCircle,
  Clock,
  MessageCircle,
} from 'lucide-react-native';
import { useVideoStore } from '@/stores/videoStore';
import me from '@/data/currentUSer';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
}

const StatCard = ({ icon, title, value, subtitle }: StatCardProps) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>{icon}</View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
  </View>
);

const ProfileScreen = () => {
  const { videos, watchedVideos, videoProgress, comments } = useVideoStore();

  const stats = useMemo(() => {
    const totalVideos = videos.length;
    const watchedCount = watchedVideos.length;

    // More efficient filtering - single pass through videoProgress
    const inProgressCount = videoProgress.reduce((count, progress) => {
      return progress.currentTime > 0 && !progress.isCompleted
        ? count + 1
        : count;
    }, 0);

    const totalComments = comments.length;
    const completionRate =
      totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

    return {
      totalVideos,
      watchedCount,
      inProgressCount,
      totalComments,
      completionRate,
    };
  }, [videos.length, watchedVideos.length, videoProgress, comments.length]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{me.initials}</Text>
          </View>
          <Text style={styles.name}>{me.username}</Text>
          <Text style={styles.subtitle}>Enjoy your favorite content</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsGrid} testID="stat-watched">
            <StatCard
              icon={<CheckCircle color="#4CAF50" size={24} />}
              title="Watched"
              value={stats.watchedCount}
              subtitle={`${stats.completionRate}% complete`}
            />
            <StatCard
              icon={<Clock color="#ff6b6b" size={24} />}
              title="In Progress"
              value={stats.inProgressCount}
            />
            <StatCard
              icon={<MessageCircle color="#FF9800" size={24} />}
              title="Comments"
              value={stats.totalComments}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#999',
    fontSize: 16,
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '47%',
    minHeight: 120,
    justifyContent: 'center',
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  statSubtitle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
});
