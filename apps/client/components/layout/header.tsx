"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Github, Instagram, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Staggered variants for the social container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 1, // Keep container visible so children can animate out
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // Variants for individual icons
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };

  return (
    <header className="fixed top-0 z-50 w-full pointer-events-none">
      <Container className="h-20 flex items-center">
        <div
          className={cn(
            "relative flex w-full items-center",
            isHome && "hidden md:flex" // Hide on mobile home, show on desktop home. Always show on other pages.
          )}
        >
          {/* Name Pill Container - Controls Position */}
          <div
            className={cn(
              "flex w-full items-center transition-all duration-500 ease-in-out",
              isHome ? "justify-center" : "justify-start"
            )}
          >
            <motion.div
              layout
              className="flex items-center bg-white shadow-surround-lg pointer-events-auto backdrop-blur-md rounded-full px-6 py-3 h-14"
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
                mass: 1,
                delay: 0, // Simultaneous animation
              }}
            >
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-zinc-900 whitespace-nowrap">
                  Naufal Syarif
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Socials (Absolute Positioned) */}
          <AnimatePresence>
            {!isHome && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 flex items-center space-x-2"
              >
                {[
                  {
                    Icon: Instagram,
                    href: "https://instagram.com",
                    label: "Instagram",
                  },
                  {
                    Icon: ({ className }: { className?: string }) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={className}
                      >
                        <circle cx="12" cy="12" r="4" />
                        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                      </svg>
                    ),
                    href: "https://threads.net",
                    label: "Threads",
                  },
                  {
                    Icon: Linkedin,
                    href: "https://linkedin.com",
                    label: "LinkedIn",
                  },
                  { Icon: Github, href: "https://github.com", label: "GitHub" },
                ].map((social, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-12 w-12 bg-white shadow-surround-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-full pointer-events-auto flex items-center justify-center"
                    >
                      <Link href={social.href} target="_blank" rel="noreferrer">
                        <social.Icon className="h-5 w-5" />
                        <span className="sr-only">{social.label}</span>
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </header>
  );
}
