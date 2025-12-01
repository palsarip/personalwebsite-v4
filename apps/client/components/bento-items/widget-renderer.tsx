"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin } from "lucide-react"
import { WidgetCard } from "@/lib/content"

import { cn } from "@/lib/utils"

interface WidgetRendererProps {
  item: WidgetCard
}

// --- Analog Clock Component ---
function AnalogClock({ time, isLarge = false, withFace = true }: { time: Date, isLarge?: boolean, withFace?: boolean }) {
  const seconds = time.getSeconds()
  const minutes = time.getMinutes()
  const hours = time.getHours()

  const secondDegrees = (seconds / 60) * 360
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360
  const hourDegrees = ((hours + minutes / 60) / 12) * 360

  return (
    <div className={cn(
      "relative rounded-full flex items-center justify-center",
      // Size
      isLarge ? "w-56 h-56" : "w-32 h-32",
      // Face Style
      withFace 
        ? "border-[3px] border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-inner" 
        : "border-none bg-transparent"
    )}>
      {/* Clock Face Markers (Lines) */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute bg-zinc-300 dark:bg-zinc-600 rounded-full",
            i % 3 === 0 ? "w-1 h-3" : "w-0.5 h-1.5"
          )}
          style={{
            transform: `rotate(${i * 30}deg) translateY(${isLarge ? "-100px" : "-38px"})`,
          }}
        />
      ))}

      {/* Hour Hand */}
      <div
        className={cn(
          "absolute bg-zinc-800 dark:bg-zinc-200 rounded-full origin-bottom z-10 bottom-[50%]",
          isLarge ? "w-2 h-16 left-[calc(50%-4px)]" : "w-1.5 h-8 left-[calc(50%-3px)]"
        )}
        style={{
          transform: `rotate(${hourDegrees}deg)`,
          boxShadow: "0 0 4px rgba(0,0,0,0.1)"
        }}
      />

      {/* Minute Hand */}
      <div
        className={cn(
          "absolute bg-zinc-500 dark:bg-zinc-400 rounded-full origin-bottom z-20 bottom-[50%]",
          isLarge ? "w-1.5 h-20 left-[calc(50%-3px)]" : "w-1 h-11 left-[calc(50%-2px)]"
        )}
        style={{
          transform: `rotate(${minuteDegrees}deg)`,
          boxShadow: "0 0 4px rgba(0,0,0,0.1)"
        }}
      />

      {/* Second Hand */}
      <div
        className={cn(
          "absolute bg-red-500 rounded-full z-30",
          isLarge 
            ? "w-1 h-28 left-[calc(50%-2px)] top-[calc(50%-88px)] origin-[50%_88px]" 
            : "w-0.5 h-14 left-[calc(50%-1px)] top-[calc(50%-44px)] origin-[50%_44px]"
        )}
        style={{
          transform: `rotate(${secondDegrees}deg)`,
        }}
      />

      {/* Center Pivot */}
      <div className={cn(
        "absolute bg-zinc-800 dark:bg-zinc-200 rounded-full z-40 border-2 border-white dark:border-zinc-800",
        isLarge ? "w-4 h-4" : "w-2 h-2"
      )} />
    </div>
  )
}

// --- Cycle Clock Component ---
function CycleClock({ time, timeZone, locationName }: { time: Date, timeZone: string, locationName: string }) {
  const hours = parseInt(time.toLocaleTimeString("en-US", { hour: "2-digit", hour12: false, timeZone }))
  
  // Determine gradient based on time of day
  let gradientClass = "bg-gradient-to-br from-blue-500 to-cyan-400" // Day (Default)
  let icon = "☀️"

  if (hours >= 5 && hours < 10) {
    gradientClass = "bg-gradient-to-br from-indigo-400 to-orange-300" // Dawn
    icon = "🌅"
  } else if (hours >= 10 && hours < 17) {
    gradientClass = "bg-gradient-to-br from-blue-400 to-sky-300" // Day
    icon = "☀️"
  } else if (hours >= 17 && hours < 20) {
    gradientClass = "bg-gradient-to-br from-orange-400 to-purple-500" // Dusk
    icon = "🌇"
  } else {
    gradientClass = "bg-gradient-to-br from-slate-800 to-slate-900" // Night
    icon = "🌙"
  }

  return (
    <div className={cn("absolute inset-0 flex flex-col items-center justify-center text-white p-6", gradientClass)}>
      <div className="text-6xl mb-2 animate-pulse-slow">{icon}</div>
      <h3 className="text-4xl font-bold font-mono tracking-wider drop-shadow-md">
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: timeZone,
          hour12: false,
        })}
      </h3>
      <p className="text-sm font-medium opacity-90 mt-2 flex items-center gap-1 drop-shadow-sm">
        <MapPin className="w-3 h-3" />
        {locationName}
      </p>
    </div>
  )
}

// --- Terminal Stack Component ---
function TerminalStack({ stack }: { stack: string[] }) {
  const [currentText, setCurrentText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentWord = stack[currentIndex]
      
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1))
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1))
      }

      if (!isDeleting && currentText === currentWord) {
        setTimeout(() => setIsDeleting(true), 1000) // Wait before deleting
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % stack.length)
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex, stack])

  return (
    <div className="flex flex-col items-start justify-center h-full w-full p-6 bg-zinc-950 font-mono text-green-400 text-sm overflow-hidden">
      <div className="flex items-center gap-2 mb-4 opacity-50">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="space-y-1">
        <p className="opacity-50">$ install dependencies</p>
        <p>
          <span className="text-blue-400">❯</span> installing{" "}
          <span className="text-white font-bold">{currentText}</span>
          <span className="animate-pulse">_</span>
        </p>
      </div>
    </div>
  )
}

// --- Icon Stack Component ---
function IconStack({ stack }: { stack: string[] }) {
  // Helper to get icon URL (using simpleicons.org)
  const getIconUrl = (tech: string) => {
    const slug = tech.toLowerCase().replace(/\./g, 'dot').replace(/\s+/g, '')
    return `https://cdn.simpleicons.org/${slug}/000000/ffffff` // Default black, dark mode white handled by filter or separate logic
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-zinc-300 to-transparent dark:from-zinc-900 z-10" />
      <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-zinc-300 to-transparent dark:from-zinc-900 z-10" />
      
      <div className="flex gap-8 animate-infinite-scroll whitespace-nowrap items-center">
          {[...stack, ...stack].map((tech, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
              <img 
                src={getIconUrl(tech)} 
                alt={tech}
                className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity dark:invert"
                onError={(e) => {
                  // Fallback if icon not found: hide image, show text? 
                  // For now just hide the broken image
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          ))}
      </div>
    </div>
  )
}

// --- Bubble Stack Component ---
function BubbleStack({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center content-center gap-2 h-full w-full p-4">
      {stack.map((tech, i) => (
        <span 
          key={i} 
          className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}

export function WidgetRenderer({ item }: WidgetRendererProps) {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    if (item.data.type === "time-location") {
      const timer = setInterval(() => setTime(new Date()), 1000)
      return () => clearInterval(timer)
    }
  }, [item.data.type])

  switch (item.data.type) {
    case "tech-stack":
      if (item.data.variant === "terminal") {
        return <TerminalStack stack={item.data.stack} />
      }
      if (item.data.variant === "icons") {
        return <IconStack stack={item.data.stack} />
      }
      if (item.data.variant === "bubble") {
        return <BubbleStack stack={item.data.stack} />
      }
      
      // Default Marquee
      return (
        <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-zinc-300 to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-zinc-300 to-transparent z-10" />
          <div className="flex gap-8 animate-infinite-scroll whitespace-nowrap">
              {[...item.data.stack, ...item.data.stack].map((tech, i) => (
                  <span key={i} className="text-lg font-bold opacity-50 hover:opacity-100 transition-opacity cursor-default">
                      {tech}
                  </span>
              ))}
          </div>
        </div>
      )
    case "time-location":
       if (!time) return (
         <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
         </div>
       )

       if (item.data.variant === "analog") {
         const isLarge = item.style?.background === "bg-transparent"
         const withFace = item.data.withFace !== false // Default to true if undefined
         return (
           <div className="flex flex-col items-center justify-center h-full w-full">
             <AnalogClock time={time} isLarge={isLarge} withFace={withFace} />
             {item.data.locationName && (
               <p className="text-xs text-zinc-500 mt-4 font-mono">
                 {item.data.locationName}
               </p>
             )}
           </div>
         )
       }

       if (item.data.variant === "cycle") {
         return <CycleClock time={time} timeZone={item.data.timeZone} locationName={item.data.locationName || ""} />
       }

       // Default Digital
       return (
          <div className="flex flex-col items-center justify-center h-full">
              <Clock className="w-8 h-8 mb-2 opacity-50" />
              <h3 className="text-3xl font-bold font-mono">
                  {time.toLocaleTimeString("en-US", { 
                      hour: "2-digit", 
                      minute: "2-digit", 
                      timeZone: item.data.timeZone,
                      hour12: false
                  })}
              </h3>
              {item.data.locationName && (
                <p className="text-sm opacity-70 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {item.data.locationName}
                </p>
              )}
          </div>
       )
  }
  return null 
}