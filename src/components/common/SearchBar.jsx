import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ placeholder = 'Search events...', onSearch, defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue);

  const submit = (e) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <form onSubmit={submit} className="relative w-full">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-paper/40" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-11"
      />
    </form>
  );
}
