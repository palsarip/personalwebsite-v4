"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}

export function Sheet({ isOpen, onClose, children, title, className }: SheetProps) {
  // Prevent scrolling when sheet is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Sheet Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "fixed inset-y-0 right-0 z-50 h-full w-full sm:w-[500px] border-l bg-background shadow-xl flex flex-col", // Removed p-6, added flex-col
              className
            )}
          >
            {/* Floating Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 rounded-full p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-foreground"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
