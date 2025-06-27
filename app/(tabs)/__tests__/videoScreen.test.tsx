import { render, screen } from '@testing-library/react-native';
import VideoScreen from '../index';
import { mockVideos } from '@/data/mockVideos';

jest.mock('@/container/VideoList', () => {
  require('react');
  const { Text } = require('react-native');
  return () => <Text>VideoList</Text>;
});
jest.mock('@/data/currentUSer', () => ({ username: 'Ginny' }));

let mockStore: any = {};

jest.mock('@/stores/videoStore', () => ({
  useVideoStore: () => mockStore,
  useVideoProgressStore: () => mockStore,
  useVideoCommentStore: () => mockStore,
  isVideoWatched: () => false,
}));

describe('VideoScreen', () => {
  let useVideoStoreSpy: jest.SpyInstance;

  afterEach(() => {
    if (useVideoStoreSpy) useVideoStoreSpy.mockRestore();
  });

  it('renders loading state', () => {
    useVideoStoreSpy = jest
      .spyOn(require('@/stores/videoStore'), 'useVideoStore')
      .mockReturnValue({
        videos: [],
        isLoading: true,
        error: null,
        fetchVideos: jest.fn(),
      });
    render(<VideoScreen />);
    expect(screen.getByText('Loading videos...')).toBeTruthy();
  });

  it('renders error state', () => {
    useVideoStoreSpy = jest
      .spyOn(require('@/stores/videoStore'), 'useVideoStore')
      .mockReturnValue({
        videos: [],
        isLoading: false,
        error: 'Network error',
        fetchVideos: jest.fn(),
      });
    render(<VideoScreen />);
    expect(screen.getByText('Error loading videos')).toBeTruthy();
    expect(screen.getByText('Network error')).toBeTruthy();
  });

  it('renders video list when loaded', () => {
    useVideoStoreSpy = jest
      .spyOn(require('@/stores/videoStore'), 'useVideoStore')
      .mockReturnValue({
        videos: mockVideos,
        isLoading: false,
        error: null,
        fetchVideos: jest.fn(),
      });
    render(<VideoScreen />);
    expect(screen.getByText('Ginny')).toBeTruthy();
    expect(screen.getByText('Discover amazing content')).toBeTruthy();
    expect(screen.getByText('VideoList')).toBeTruthy();
  });
});
