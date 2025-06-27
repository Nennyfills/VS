import { render, screen } from '@testing-library/react-native';
import ProfileScreen from '../profile';

jest.mock('@/data/currentUSer', () => ({
  username: 'Ginny',
  initials: 'GN',
}));

jest.mock('@/stores/videoStore', () => ({
  useVideoStore: () => ({
    videos: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }],
    watchedVideos: [
      { videoId: '1', watchedAt: new Date() },
      { videoId: '2', watchedAt: new Date() },
      { videoId: '5', watchedAt: new Date() },
    ],
    videoProgress: [
      {
        videoId: '3',
        currentTime: 60,
        duration: 120,
        lastWatched: new Date(),
        isCompleted: false,
      },
      {
        videoId: '4',
        currentTime: 0,
        duration: 120,
        lastWatched: new Date(),
        isCompleted: false,
      },
    ],
    comments: [
      {
        id: 'c1',
        videoId: '1',
        text: 'Great!',
        author: 'Ginny',
        createdAt: new Date(),
      },
      {
        id: 'c2',
        videoId: '2',
        text: 'Nice!',
        author: 'Ginny',
        createdAt: new Date(),
      },
    ],
  }),
}));

describe('ProfileScreen', () => {
  it('renders user name and initials', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Ginny')).toBeTruthy();
    expect(screen.getByText('GN')).toBeTruthy();
  });

  it('renders correct stats', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Watched')).toBeTruthy();
    expect(screen.getByText('60% complete')).toBeTruthy();
    expect(screen.getByText('In Progress')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
    expect(screen.getByText('Comments')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });
});
