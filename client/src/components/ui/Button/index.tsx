import React from 'react';
import styles from './styles.module.css';

interface ButtonProps {
  text: string;
  color: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  trailingIcon?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  onClick?: () => void;
}

export default function Button ({ text, color, size, trailingIcon, leadingIcon, onClick }: ButtonProps) {
  const buttonClassName = `${styles.button} ${styles[color]} ${styles[size]}`;

  return (
    <button className={buttonClassName} onClick={onClick}>
      {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
        {text}
      {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
    </button>
  );
}