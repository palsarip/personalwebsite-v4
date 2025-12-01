"use client"

import { usePathname } from "next/navigation"
import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Simple Fade In on route change
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      )
    },
    { dependencies: [pathname], scope: containerRef }
  )

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}
