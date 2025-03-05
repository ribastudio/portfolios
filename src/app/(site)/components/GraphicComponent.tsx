import React from 'react';
import styles from './GraphicComponent.module.scss';

export const GraphicComponent = () => {
  return (
    <div className={`${styles["multi-graph"]} ${styles.margin}`}>
      JavaScript
      <div
        className={styles.graph}
        data-name="jQuery"
        style={{ "--percentage": 80, "--fill": "#0669AD" } as React.CSSProperties}
      ></div>
      <div
        className={styles.graph}
        data-name="jQ596"
        style={{ "--percentage": 85, "--fill": "#f0f0f0" } as React.CSSProperties}
      ></div>
      <div
        className={styles.graph}
        data-name="Angular"
        style={{ "--percentage": 60, "--fill": "#E62A39" } as React.CSSProperties}
      ></div>
      <div
        className={styles.graph}
        data-name="React"
        style={{ "--percentage": 30, "--fill": "#FEDA3E" } as React.CSSProperties}
      ></div>
      <div
        className={styles.graph}
        data-name="Rbact"
        style={{ "--percentage": 10, "--fill": "#FFF" } as React.CSSProperties}
      ></div>
    </div>
  );
};