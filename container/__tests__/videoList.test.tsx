import { render, fireEvent, screen } from '@testing-library/react-native';
import VideoList from '../VideoList';
import { mockVideos } from '@/data/mockVideos';

jest.mock('@/stores/videoStore', () => ({
  useVideoStore: () => ({
    isVideoWatched: (id: string) => id === '1',
    getProgress: (id: string) =>
      id === '2'
        ? { currentTime: 30, isCompleted: false }
        : { currentTime: 0, isCompleted: false },
    getCommentsForVideo: () => [],
  }),
}));

describe('VideoList', () => {
  it('renders all videos by default', () => {
    render(<VideoList videos={mockVideos} />);
    expect(screen.getAllByTestId('video-list-item').length).toBe(6);
  });

  it('filters watched videos', () => {
    render(<VideoList videos={mockVideos} />);
    fireEvent.press(screen.getByTestId('filter-button-watched'));
    expect(screen.getAllByTestId('video-list-item').length).toBe(1);
  });
  it('filters in progress videos', () => {
    render(<VideoList videos={mockVideos} />);
    fireEvent.press(screen.getByTestId('filter-button-in_progress'));
    expect(screen.getAllByTestId('video-list-item').length).toBe(1);
  });
  it('filters unwatched videos', () => {
    render(<VideoList videos={mockVideos} />);
    fireEvent.press(screen.getByTestId('filter-button-unwatched'));
    expect(screen.getAllByTestId('video-list-item').length).toBe(4);
  });
  it('shows empty state when no videos match', () => {
    render(<VideoList videos={[]} />);
    expect(screen.getByText('No videos found')).toBeTruthy();
  });
});
