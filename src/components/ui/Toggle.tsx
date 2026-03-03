import React from 'react';
import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
  return (
    <label className={styles.wrapper}>
      <span className={`${styles.toggle} ${checked ? styles.checked : ''}`}>
        <input
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-checked={checked}
        />
        <span className={styles.knob} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};
