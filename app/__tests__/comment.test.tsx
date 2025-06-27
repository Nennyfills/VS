import { render, fireEvent, screen } from '@testing-library/react-native';
import CommentSection from '../comment';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ videoId: '1' }),
}));

describe('CommentSection', () => {
  let mockAddComment: jest.SpyInstance;

  beforeEach(() => {
    mockAddComment = jest
      .spyOn(require('@/stores/videoStore'), 'useVideoStore')
      .mockReturnValue({
        getCommentsForVideo: () => [
          {
            id: 'c1',
            videoId: '1',
            text: 'Hello',
            author: 'You',
            createdAt: new Date(),
          },
          {
            id: 'c2',
            videoId: '1',
            text: 'World',
            author: 'Other',
            createdAt: new Date(),
          },
        ],
        addComment: jest.fn(),
        updateComment: jest.fn(),
      });
  });

  afterEach(() => {
    mockAddComment.mockRestore();
  });

  it('renders comments and input', () => {
    render(<CommentSection />);
    expect(screen.getByText('Comments')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getByText('World')).toBeTruthy();
    expect(screen.getByPlaceholderText('Add a comment...')).toBeTruthy();
  });

  it('adds a comment', () => {
    const mockStore = {
      getCommentsForVideo: () => [
        {
          id: 'c1',
          videoId: '1',
          text: 'Hello',
          author: 'You',
          createdAt: new Date(),
        },
        {
          id: 'c2',
          videoId: '1',
          text: 'World',
          author: 'Other',
          createdAt: new Date(),
        },
      ],
      addComment: jest.fn(),
      updateComment: jest.fn(),
    };

    mockAddComment.mockReturnValue(mockStore);

    render(<CommentSection />);
    const input = screen.getByPlaceholderText('Add a comment...');
    fireEvent.changeText(input, 'New comment');
    const sendButton = screen.getByTestId('send-comment');
    fireEvent.press(sendButton);
    expect(mockStore.addComment).toHaveBeenCalledWith(
      '1',
      'New comment',
      'You'
    );
  });

  it('edits a comment', () => {
    const mockStore = {
      getCommentsForVideo: () => [
        {
          id: 'c1',
          videoId: '1',
          text: 'Hello',
          author: 'You',
          createdAt: new Date(),
        },
      ],
      addComment: jest.fn(),
      updateComment: jest.fn(),
    };

    mockAddComment.mockReturnValue(mockStore);

    render(<CommentSection />);
    fireEvent.press(screen.getByTestId('edit-comment'));

    const editInput = screen.getByDisplayValue('Hello');
    fireEvent.changeText(editInput, 'Edited comment');
    fireEvent.press(screen.getByTestId('save-edit'));
    expect(mockStore.updateComment).toHaveBeenCalled();
  });
});
