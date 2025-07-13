import { useMemo, useState } from 'react';

export const useSearch = (data, searchFields = []) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase();
    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field];
        return fieldValue && fieldValue.toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFields]);

  const clearSearch = () => setSearchQuery('');

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    clearSearch,
    hasActiveSearch: searchQuery.trim().length > 0
  };
};
