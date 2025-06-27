import { render, fireEvent, screen } from '@testing-library/react-native';
import VideoPlayer from '../VideoPlayer';

jest.mock('@/stores/videoStore', () => ({
  useVideoStore: () => ({
    updateProgress: jest.fn(),
    markAsWatched: jest.fn(),
    currentlyPlayingId: null,
    setCurrentlyPlayingId: jest.fn(),
    getProgress: () => null,
  }),
}));

const mockVideo = {
  id: '1',
  title: 'Test Video',
  description: 'A test video',
  thumbnail: 'https://example.com/thumb.jpg',
  videoUrl: 'https://example.com/video.mp4',
  duration: 120,
  genre: 'Tutorial',
  releaseYear: 2024,
};

describe('VideoPlayer', () => {
  it('renders thumbnail and play overlay when not playing', () => {
    render(<VideoPlayer video={mockVideo as any} />);
    expect(screen.getByText('▶')).toBeTruthy();
  });

  it('renders thumbnail image', () => {
    render(<VideoPlayer video={mockVideo} />);
    expect(screen.getByTestId('thumbnail')).toBeTruthy();
  });

  it('calls setCurrentlyPlayingId and starts playing on press', () => {
    const setCurrentlyPlayingId = jest.fn();
    jest
      .spyOn(require('@/stores/videoStore'), 'useVideoStore')
      .mockReturnValue({
        updateProgress: jest.fn(),
        markAsWatched: jest.fn(),
        currentlyPlayingId: null,
        setCurrentlyPlayingId,
        getProgress: () => null,
      });
    render(<VideoPlayer video={mockVideo as any} />);
    fireEvent.press(screen.getByText('▶'));
    expect(setCurrentlyPlayingId).toHaveBeenCalledWith('1');
  });
});
