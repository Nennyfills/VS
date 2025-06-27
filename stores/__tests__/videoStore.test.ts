import { useVideoStore, videoStoreActions } from '@/stores/videoStore';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('Video Store - Comments', () => {
  beforeEach(() => {
    // Reset store state before each test
    useVideoStore.setState({
      videos: [],
      watchedVideos: [],
      videoProgress: [],
      comments: [],
      isLoading: false,
      error: null,
      currentlyPlayingId: null,
    });
  });

  it('should add a comment to a video', async () => {
    await videoStoreActions.addComment('video1', 'Nice video!', 'User1');
    const comments = videoStoreActions.getCommentsForVideo('video1');
    expect(comments).toHaveLength(1);
    expect(comments[0].text).toBe('Nice video!');
    expect(comments[0].author).toBe('User1');
  });

  it('should update a comment', async () => {
    await videoStoreActions.addComment('video1', 'Old comment', 'User1');
    const comment = videoStoreActions.getCommentsForVideo('video1')[0];
    await videoStoreActions.updateComment(comment.id, 'Updated comment');
    const updated = videoStoreActions.getCommentsForVideo('video1')[0];
    expect(updated.text).toBe('Updated comment');
  });

  it('should fetch comments for a specific video', async () => {
    await videoStoreActions.addComment('video1', 'Comment 1', 'User1');
    await videoStoreActions.addComment('video2', 'Comment 2', 'User2');
    const comments1 = videoStoreActions.getCommentsForVideo('video1');
    const comments2 = videoStoreActions.getCommentsForVideo('video2');
    expect(comments1).toHaveLength(1);
    expect(comments2).toHaveLength(1);
    expect(comments1[0].text).toBe('Comment 1');
    expect(comments2[0].text).toBe('Comment 2');
  });
});
