import React from 'react';

const filterOptions = [
  { name: 'showVotes', label: 'Показывать голоса' },
  { name: 'showCreator', label: 'Показывать создателя' },
  { name: 'showUpdatedBy', label: 'Показывать обновлено' },
  { name: 'showCategory', label: 'Показывать категорию' },
  { name: 'showStatus', label: 'Показывать статус' },
];

const FilterOptions = ({ filters, onFilterChange, onSortChange }) => (
  <div className="absolute z-50 bg-white shadow-md rounded-lg p-4 mt-2 border border-gray-300 w-full max-w-sm sm:max-w-md lg:max-w-lg">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filterOptions.map((option) => (
        <label key={option.name} className="block mb-2">
          <input
            type="checkbox"
            name={option.name}
            checked={filters[option.name]}
            onChange={onFilterChange}
          />{' '}
          {option.label}
        </label>
      ))}
    </div>
    <label className="block mb-2">
      Сортировать по:
      <select
        name="sortBy"
        value={filters.sortBy}
        onChange={onSortChange}
        className="ml-2 p-2 border border-gray-300 rounded w-full sm:w-auto"
      >
        <option value="mostVotes">Наибольшее количество голосов</option>
        <option value="mostUpvotes">Наибольшее количество голосов за</option>
        <option value="mostDownvotes">Наибольшее количество голосов против</option>
      </select>
    </label>
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4 w-full sm:w-auto"
      onClick={() => onFilterChange({ target: { name: 'showFilter', value: false } })}
    >
      Применить
    </button>
  </div>
);

export default FilterOptions;