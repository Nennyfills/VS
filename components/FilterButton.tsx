import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export type FilterType = 'all' | 'watched' | 'unwatched' | 'in_progress';

const FilterButton = ({
  type,
  label,
  count,
  setFilter,
  filter,
}: {
  type: FilterType;
  label: string;
  count: number;
  filter: FilterType;
  setFilter: (value: FilterType) => void;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === type && styles.activeFilterButton,
      ]}
      onPress={() => setFilter(type)}
      testID={`filter-button-${type}`}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === type && styles.activeFilterButtonText,
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );
};

export default FilterButton;

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 80,
  },
  activeFilterButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  filterButtonText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeFilterButtonText: {
    color: 'white',
  },
});
