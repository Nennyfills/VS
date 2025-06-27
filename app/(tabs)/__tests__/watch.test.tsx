import { render, screen } from '@testing-library/react-native';
import WatchedScreen from '../watched';

jest.mock('@/container/VideoList', () => {
  require('react');
  const { Text } = require('react-native');
  return () => <Text>VideoList</Text>;
});

describe('WatchedScreen', () => {
  let useVideoStoreSpy: jest.SpyInstance;

  afterEach(() => {
    if (useVideoStoreSpy) useVideoStoreSpy.mockRestore();
  });

  it('renders empty state when no watched videos', () => {
    useVideoStoreSpy = jest
      .spyOn(require('@/stores/videoStore'), 'useVideoStore')
      .mockReturnValue({
        videos: [{ id: '1', title: 'Test Video' }],
        watchedVideos: [],
      });
    render(<WatchedScreen />);
    expect(screen.getByText('No watched videos yet')).toBeTruthy();
    expect(
      screen.getByText('Start watching videos to see them here')
    ).toBeTruthy();
  });

  it('renders watched videos list when there are watched videos', () => {
    useVideoStoreSpy = jest
      .spyOn(require('@/stores/videoStore'), 'useVideoStore')
      .mockReturnValue({
        videos: [
          { id: '1', title: 'Test Video' },
          { id: '2', title: 'Another Video' },
        ],
        watchedVideos: [{ videoId: '1', watchedAt: new Date() }],
      });
    render(<WatchedScreen />);
    expect(screen.getByText('Watched Videos')).toBeTruthy();
    expect(screen.getByText('1 video completed')).toBeTruthy();
    expect(screen.getByText('VideoList')).toBeTruthy();
  });
});
