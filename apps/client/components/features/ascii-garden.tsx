"use client"

import React, { useEffect, useRef } from "react"

const ROWS = 20
const COLS = 60

// Characters representing different states of grass/flowers based on "wind" angle
// 0: upright, negative: left, positive: right
type Cell = {
  x: number
  y: number
  type: string
  offset: number
}

export function AsciiGarden() {
  const preRef = useRef<HTMLPreElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const gridRef = useRef<Cell[][]>([])

  // Initialize grid
  useEffect(() => {
    const grid = []
    for (let y = 0; y < ROWS; y++) {
      const row = []
      for (let x = 0; x < COLS; x++) {
        // Randomly decide if it's grass or a flower or empty space
        const rand = Math.random()
        let type = "empty"
        if (y > 8) { // More density at the bottom
           if (rand > 0.3) type = "grass"
           if (rand > 0.95) type = "flower"
        } else if (y > 5) {
            if (rand > 0.7) type = "grass"
        }
        
        row.push({
          x,
          y,
          type,
          offset: Math.random() * 100, // Random offset for wind variation
        })
      }
      grid.push(row)
    }
    gridRef.current = grid
  }, [])

  useEffect(() => {
    let animationFrameId: number
    let time = 0

    const render = () => {
      time += 0.02
      if (!preRef.current) return

      let output = ""

      // Mouse influence calculations
      // We map mouse coordinates to grid coordinates roughly
      // This is an approximation since we don't know exact pixel size of chars
      // but we can assume the pre is centered.
      
      // For simplicity, let's just use a global "wind" that follows the mouse x relative to center
      // or just local influence if we can track it.
      // Since tracking exact char position is hard without layout thrashing,
      // let's do a global wind + local wave.

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const cell = gridRef.current[y][x]
          
          if (cell.type === "empty") {
            output += " "
            continue
          }

          // Wind simulation
          // Base wind: sine wave moving across x
          const baseWind = Math.sin(time + x * 0.1 + cell.offset) * 0.5
          
          // Gusts: larger low frequency wave
          const gust = Math.sin(time * 0.5 + x * 0.05) * 0.5

          // Mouse interaction (simplified)
          // If we had exact mouse pos relative to element, we'd use it.
          // For now, let's just make the wind react to the mouse X position if active
          let mouseForce = 0
          if (mouseRef.current.active) {
             // Normalize mouse X to -1 to 1 range relative to window width
             const normX = (mouseRef.current.x / window.innerWidth) * 2 - 1
             // Influence cells based on their X position relative to mouse
             const cellNormX = (x / COLS) * 2 - 1
             const dist = Math.abs(normX - cellNormX)
             if (dist < 0.5) {
                 mouseForce = (normX - cellNormX) * (1 - dist) * 5
             }
          }

          const totalForce = baseWind + gust + mouseForce
          
          // Determine character
          let char = "|"
          if (cell.type === "flower") {
             char = "Y" // Upright flower
             if (totalForce < -0.5) char = "("
             else if (totalForce > 0.5) char = ")"
          } else {
             // Grass
             if (totalForce < -0.3) char = "/"
             else if (totalForce > 0.3) char = "\\"
             else char = "|"
          }

          output += char
        }
        output += "\n"
      }

      preRef.current.textContent = output
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseRef.current.x = e.clientX
    mouseRef.current.y = e.clientY
    mouseRef.current.active = true
  }

  const handleMouseLeave = () => {
    mouseRef.current.active = false
  }

  return (
    <div 
        className="flex items-center justify-center w-full h-full cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      <pre
        ref={preRef}
        className="font-mono text-xs leading-none select-none text-center whitespace-pre"
        style={{ fontFamily: '"Courier New", Courier, monospace' }} // Ensure consistent width
      />
    </div>
  )
}
