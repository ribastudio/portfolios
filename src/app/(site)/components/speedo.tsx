'use client'
import React, { useState } from "react";
import styles from "./speed.module.scss"; // Importando o CSS


interface SpeedometerProps {
  percentages: number[],
  colors: string[]
}

export const Speedometer = ({ percentages, colors }: SpeedometerProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Função para calcular os ângulos do conic-gradient
  const calculateAngles = (percentages: number[]) => {
    let total = 0;
    return percentages.map((percentage: number) => {
      const angle = (percentage / 100) * 180; // Converte porcentagem para ângulo
      total += angle;
      return total;
    });
  };

  // Gera o conic-gradient dinamicamente
  const generateConicGradient = (colors: string[], angles: number[]) => {
    let gradient = `from -90deg, `;
    colors.forEach((color: string, index: number) => {
      gradient += `${color} ${index === 0 ? 0 : angles[index - 1]}deg ${angles[index]}deg, `;
    });
    gradient += "#0000 0";
    return gradient;
  };

  const angles = calculateAngles(percentages);
  const conicGradient = generateConicGradient(colors, angles);

  return (
    <div className={styles["speedometer-container"]}>
      <div
        className={styles.speedometer}
        style={{
          background: `
            radial-gradient(#ffff 0 0) content-box,
            conic-gradient(${conicGradient})
          `,
        }}
      >
        {percentages.map((percentage: number, index: number) => (
          <div
            key={index}
            className={`${styles["speedometer-segment"]} ${selectedIndex === index ? "selected" : ""}`}
            style={{
              transform: `rotate(${angles[index]}deg)`,
              backgroundColor: selectedIndex === index ? colors[index] : "transparent",
            }}
            onClick={() => setSelectedIndex(index)}
          >dsd</div>
        ))}
      </div>
      {selectedIndex !== null && (
        <div className={styles["selected-info"]}>
          <p>Porcentagem selecionada: {percentages[selectedIndex]}%</p>
          <p>Cor: {colors[selectedIndex]}</p>
        </div>
      )}
    </div>
  );
};

