"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { Home, Folder, Mail } from "lucide-react"

const DOCK_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Contact", href: "/contact", icon: Mail },
]

export function Dock() {
  const mouseX = useMotionValue(Infinity)

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <div className="flex h-16 items-end gap-4 rounded-2xl border border-black/10 bg-white/80 px-4 pb-3 backdrop-blur-md dark:border-white/10 dark:bg-black/20">
        {DOCK_ITEMS.map((item) => (
          <DockIcon key={item.name} mouseX={mouseX} item={item} />
        ))}
      </div>
    </div>
  )
}

function DockIcon({
  mouseX,
  item,
}: {
  mouseX: MotionValue
  item: (typeof DOCK_ITEMS)[0]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 90, 48])
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const [isBouncing, setIsBouncing] = React.useState(false)
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      onClick={() => {
        setIsBouncing(true)
        setTimeout(() => setIsBouncing(false), 1000) // Reset after animation
      }}
    >
      <motion.div
        ref={ref}
        style={{ width }}
        animate={isBouncing ? { y: [0, -20, 0, -10, 0] } : { y: 0 }}
        transition={
          isBouncing
            ? {
                duration: 1,
                ease: "easeInOut",
                times: [0, 0.2, 0.5, 0.7, 1],
              }
            : { type: "spring", mass: 0.1, stiffness: 150, damping: 12 }
        }
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-xl bg-white shadow-sm border border-black/5",
          pathname === item.href &&
            "after:absolute after:-bottom-2 after:h-1 after:w-1 after:rounded-full after:bg-black"
        )}
      >
        <Icon className="h-1/2 w-1/2 text-black" strokeWidth={1.5} />
        <span className="sr-only">{item.name}</span>
      </motion.div>
    </Link>
  )
}
