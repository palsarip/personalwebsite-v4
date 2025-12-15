"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Home,
  Folder,
  Mail,
  LayoutGrid, // Replaces Share2 conceptually for "All Categories"
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";

const DOCK_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Contact", href: "/contact", icon: Mail },
];

const SOCIALS = [
  {
    icon: Instagram,
    href: "https://instagram.com/naufalsyarif",
    label: "Instagram",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/naufalsyarif",
    label: "LinkedIn",
  },
  {
    icon: Github,
    href: "https://github.com/naufalsyarif",
    label: "GitHub",
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
  },
];

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-transparent"
            />

            {/* Glassmorphism Sheet - Dark Theme */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 mx-auto p-6 bg-black/60 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl z-50 min-w-[320px]"
            >
              <div className="grid grid-cols-4 gap-4 lg:hidden">
                {SOCIALS.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    className="flex flex-col items-center gap-3 group"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-200">
                      <social.icon className={cn("h-6 w-6 text-white")} />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-white/70">
                      {social.label}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative z-50 flex h-16 items-end gap-4 rounded-2xl border border-black/10 bg-white/80 px-4 pb-3 backdrop-blur-md dark:border-white/10 dark:bg-black/20">
        {DOCK_ITEMS.map((item) => (
          <DockIcon key={item.name} mouseX={mouseX} item={item} />
        ))}

        <DockIcon
          mouseX={mouseX}
          item={{ name: "All Categories", href: "#", icon: LayoutGrid }}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
    </div>
  );
}

function DockIcon({
  mouseX,
  item,
  onClick,
  className,
}: {
  mouseX: MotionValue;
  item: { name: string; href: string; icon: any };
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 90, 48]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [isBouncing, setIsBouncing] = React.useState(false);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(className)}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 1000); // Reset after animation
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
  );
}
