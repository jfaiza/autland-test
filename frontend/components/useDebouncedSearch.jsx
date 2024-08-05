import { useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

const useDebouncedSearch = (data, selectedStates, slashedFilter, setFilteredData) => {
  const debouncedSearch = useCallback(
    debounce((newValue) => {
      const lowerCaseSearchInput = newValue.toLowerCase();
      const newData = data.filter((item) => {
        const stateMatch = selectedStates.includes(item.state);
        const slashedMatch =
          slashedFilter === 'ALL' ||
          (slashedFilter === 'SLASHED' && item.total_slashed > 0) ||
          (slashedFilter === 'NOT_SLASHED' && item.total_slashed === '0');
        const hasName = item.validator_name !== 'unknown';
        const searchMatch =
          item.node_address.toLowerCase().includes(lowerCaseSearchInput) ||
          item.treasury.toLowerCase().includes(lowerCaseSearchInput) ||
          (hasName &&
            item.validator_name.toLowerCase().includes(lowerCaseSearchInput)) ||
          (!hasName &&
            item.registration_block.toLowerCase().includes(lowerCaseSearchInput));

        return stateMatch && slashedMatch && searchMatch;
      });
      setFilteredData(newData);
    }, 300), // Adjust the delay (300ms) as needed
    [data, selectedStates, slashedFilter]
  );

  return { debouncedSearch };
};

export default useDebouncedSearch;
