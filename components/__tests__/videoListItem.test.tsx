import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import VideoListItem from '../VideoListItem';

const mockVideo = {
  id: '1',
  title: 'Test Video',
  description: 'A test video',
  thumbnail: '',
  videoUrl: '',
  duration: 120,
  genre: 'Tutorial',
  releaseYear: 2024,
};

describe('VideoListItem', () => {
  it('renders video title and description', () => {
    render(
      <VideoListItem
        video={mockVideo as any}
        isWatched={false}
        progress={null}
        numComments={0}
        gotoComment={jest.fn()}
      />
    );
    expect(screen.getByText('Test Video')).toBeTruthy();
    expect(screen.getByText('A test video')).toBeTruthy();
  });

  it('shows watched indicator if isWatched is true', () => {
    render(
      <VideoListItem
        video={mockVideo as any}
        isWatched={true}
        progress={null}
        numComments={0}
        gotoComment={jest.fn()}
      />
    );
    expect(screen.getByTestId('video-list-item')).toBeTruthy();
  });

  it('shows progress bar and percentage if progress is provided', () => {
    render(
      <VideoListItem
        video={mockVideo as any}
        isWatched={false}
        progress={{
          videoId: '1',
          currentTime: 60,
          duration: 120,
          lastWatched: new Date(),
          isCompleted: false,
        }}
        numComments={0}
        gotoComment={jest.fn()}
      />
    );
    expect(screen.getByText('50% watched')).toBeTruthy();
  });

  it('shows correct comment count', () => {
    render(
      <VideoListItem
        video={mockVideo as any}
        isWatched={false}
        progress={null}
        numComments={3}
        gotoComment={jest.fn()}
      />
    );
    expect(screen.getByText('3 comments')).toBeTruthy();
  });

  it('calls gotoComment when comment button is pressed', () => {
    const gotoComment = jest.fn();
    render(
      <VideoListItem
        video={mockVideo as any}
        isWatched={false}
        progress={null}
        numComments={1}
        gotoComment={gotoComment}
      />
    );
    fireEvent.press(screen.getByText('1 comment'));
    expect(gotoComment).toHaveBeenCalled();
  });
});
