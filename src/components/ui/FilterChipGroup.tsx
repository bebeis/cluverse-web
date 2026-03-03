'use client';

import React from 'react';
import styles from './FilterChipGroup.module.css';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterChipGroupProps {
  options: FilterOption[];
  selectedId: string;
  onChange: (id: string) => void;
}

export const FilterChipGroup: React.FC<FilterChipGroupProps> = ({ options, selectedId, onChange }) => {
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.chipGroup}>
        {options.map((option) => (
          <button
            key={option.id}
            className={`${styles.chip} ${selectedId === option.id ? styles.active : ''}`}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
