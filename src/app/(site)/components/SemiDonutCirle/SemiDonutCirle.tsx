'use client'

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { pie, arc } from 'd3-shape'
import styles from './SemiDonutCirle.module.scss' // Importando o SCSS

export type GraphicValuesType = {
  value: number
  label: string
  color: string
}

export interface SemiDonutCirleProps {
  values: GraphicValuesType[]
  initialText: string
}

export const SemiDonutCirle = ({
  values,
  initialText 
}: SemiDonutCirleProps) => {
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null)
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const textRef = useRef<SVGTextElement | null>(null)
  const specificRef = useRef<SVGTextElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Configurações do gráfico
  const width = 600
  const height = 200
  const radius = Math.min(width, height) / 2
  const centerX = width / 2
  const centerY = height

  // Cria os arcos para cada porcentagem
  const createArcs = () => {
    if (!Array.isArray(values)) {
      console.error('O valor de "values" deve ser um array.')
      return []
    }

    const isValid = values.every((item) => {
      return (
        typeof item === 'object' &&
        item !== null &&
        'value' in item &&
        'label' in item &&
        'color' in item
      )
    })

    if (!isValid) {
      console.error('Cada item de "values" deve ter a estrutura { value: number, label: string, color: string }.')
      return []
    }

    const pieGenerator = pie<GraphicValuesType>()
      .value((d) => d.value)
      .startAngle(-0.5 * Math.PI)
      .endAngle(0.5 * Math.PI)

    const arcs = pieGenerator(values)

    const arcGenerator = arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius)
      .cornerRadius(10)

    return arcs.map((arcData, index) => ({
      path: arcGenerator({
        ...arcData, // Passa os dados do arco
        innerRadius: radius * 0.7, // Define o innerRadius
        outerRadius: radius, // Define o outerRadius
      }),
      color: values[index].color,
      percentage: values[index].value,
      label: values[index].label,
    }))
  }

  const arcs = createArcs()

  // Animação do valor central com GSAP
  useEffect(() => {
    if (selectedPercentage !== null && textRef.current) {
      gsap.to(textRef.current, {
        textContent: selectedPercentage,
        duration: 0.5,
        snap: { textContent: 1 },
        onUpdate: () => {
          if (textRef.current) {
            textRef.current.textContent = `${Math.round(Number(textRef.current.textContent))}%`
          }
        },
      })
    }

    if (selectedLabel !== null && specificRef.current) {
      specificRef.current.textContent = selectedLabel
    }
  }, [selectedPercentage, selectedLabel])

  // Resetar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (svgRef.current && !svgRef.current.contains(event.target as Node)) {
        setSelectedPercentage(null)
        setSelectedLabel(null)
        setSelectedIndex(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{ overflow: 'visible' }}
      className={styles.container}
    >
      {/* Renderiza os arcos */}
      {arcs.map((arc, index) => (
        <path
          key={index}
          d={arc.path || ''}
          fill={arc.color}
          onClick={() => {
            setSelectedPercentage(arc.percentage)
            setSelectedLabel(arc.label)
            setSelectedIndex(index)
          }}
          className={`${styles.segment} ${
            selectedIndex !== null && selectedIndex !== index ? styles.dimmed : ''
          }`}
          style={{ cursor: 'pointer' }}
        />
      ))}

      {/* Texto central (porcentagem) */}
      <text
        ref={textRef}
        x={centerX}
        y={centerY - 20}
        textAnchor="middle"
        fontSize="20"
        fill="#000"
      >
        {selectedPercentage !== null ? `${Math.round(selectedPercentage)}%` : initialText}
      </text>

      {/* Texto central (label) */}
      <text
        ref={specificRef}
        x={centerX}
        y={centerY - 50}
        textAnchor="middle"
        fontSize="20"
        fill="#000"
      >
        {selectedLabel || 'Selecione uma categoria'}
      </text>
    </svg>
  )
}