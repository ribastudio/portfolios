'use client';
import React, { ReactNode, forwardRef } from 'react';
import styles from './BordedPanel.module.scss';

interface BordedPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const BordedPanel = forwardRef<HTMLDivElement, BordedPanelProps>(
  ({ children, ...props }, ref) => {
    return (
      <div className={styles.wrapper} {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

// Define o nome do componente para facilitar a depuração
BordedPanel.displayName = 'BordedPanel';