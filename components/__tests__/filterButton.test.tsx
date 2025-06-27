import { render, fireEvent, screen } from '@testing-library/react-native';
import FilterButton from '../FilterButton';

describe('FilterButton', () => {
  it('renders the label and count', () => {
    render(
      <FilterButton
        type="watched"
        label="Watched"
        count={5}
        filter="all"
        setFilter={() => {}}
      />
    );
    expect(screen.getByText('Watched (5)')).toBeTruthy();
  });

  it('calls setFilter with the correct type when pressed', () => {
    const setFilter = jest.fn();
    render(
      <FilterButton
        type="in_progress"
        label="In Progress"
        count={2}
        filter="all"
        setFilter={setFilter}
      />
    );
    fireEvent.press(screen.getByTestId('filter-button-in_progress'));
    expect(setFilter).toHaveBeenCalledWith('in_progress');
  });

  it('applies active styles when selected', async () => {
    render(
      <FilterButton
        type="unwatched"
        label="Unwatched"
        count={3}
        filter="unwatched"
        setFilter={() => {}}
      />
    );
    fireEvent.press(screen.getByTestId('filter-button-unwatched'));
    const button = screen.getByTestId('filter-button-unwatched');
    expect(button).toHaveStyle({ backgroundColor: '#ff6b6b' });
  });
});
