"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

const logs = [
  "INITIALIZING SYSTEM...",
  "LOADING KERNEL MODULES...",
  "VERIFYING INTEGRITY...",
  "MEMORY CHECK: 64TB OK",
  "ESTABLISHING CONNECTION...",
  "USER DETECTED: NAUFAL SYARIF",
  "ACCESS GRANTED.",
  "WELCOME."
]

export function FaultyTerminal() {
  const [text, setText] = useState<string[]>([])
  const [isGlitching, setIsGlitching] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let currentIndex = 0
    let currentLine = ""
    let charIndex = 0
    
    const typeLine = () => {
      if (currentIndex >= logs.length) return

      const targetLine = logs[currentIndex]
      
      if (charIndex < targetLine.length) {
        currentLine += targetLine[charIndex]
        setText(prev => {
          const newLines = [...prev]
          if (newLines.length === 0 || charIndex === 0) {
            newLines.push(currentLine)
          } else {
            newLines[newLines.length - 1] = currentLine
          }
          return newLines
        })
        charIndex++
        setTimeout(typeLine, Math.random() * 50 + 30)
      } else {
        currentIndex++
        charIndex = 0
        currentLine = ""
        setTimeout(typeLine, 500)
      }
    }

    // Start typing
    setTimeout(typeLine, 1000)

    // Glitch effect loop
    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 bg-black font-mono text-green-500 p-8 overflow-hidden select-none"
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] z-20" />

      <div className={`relative z-0 flex flex-col gap-2 ${isGlitching ? "animate-pulse translate-x-[2px]" : ""}`}>
        {text.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg md:text-2xl tracking-wider"
          >
            <span className="mr-2 opacity-50">{">"}</span>
            {line}
            {i === text.length - 1 && (
              <span className="animate-pulse ml-1">_</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Random floating glitch text */}
      {isGlitching && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-red-500 opacity-20 pointer-events-none mix-blend-screen">
          SYSTEM ERROR 0x000000
        </div>
      )}
    </div>
  )
}
