"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Instagram,
  Linkedin,
  Twitter,
  X,
  Share2,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MobileDock() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);

  // Only show on non-home pages on mobile/tablet
  if (isHome) return null;

  const socials = [
    {
      icon: Instagram,
      href: "https://instagram.com/naufalsyarif",
      label: "Instagram",
      color: "text-pink-500",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/naufalsyarif",
      label: "LinkedIn",
      color: "text-blue-600",
    },
    {
      icon: Github,
      href: "https://github.com/naufalsyarif",
      label: "GitHub",
      color: "text-zinc-900 dark:text-white",
    },
    {
      icon: ({ className }: { className?: string }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      ),
      href: "https://twitter.com/naufalsyarif",
      label: "X (Twitter)",
      color: "text-zinc-900 dark:text-white",
    },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center md:hidden pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 pointer-events-auto"
            />

            {/* Glassmorphism Sheet */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-20 mx-4 p-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl z-50 pointer-events-auto min-w-[300px]"
            >
              <div className="grid grid-cols-4 gap-4">
                {socials.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-white/50 dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                      <social.icon className={cn("h-7 w-7", social.color)} />
                    </div>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      {social.label}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 px-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-surround-lg rounded-full flex items-center gap-3 border border-white/20 pointer-events-auto"
      >
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          Socials
        </span>
        <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          <Share2 className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        </div>
      </motion.button>
    </div>
  );
}
