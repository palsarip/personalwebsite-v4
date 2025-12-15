"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  className,
  children,
  onClick,
  layoutId,
  enableHover = false,
  enableTap = true,
  label,
  labelPosition = "top-left",
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  layoutId?: string;
  enableHover?: boolean;
  enableTap?: boolean;
  label?: string;
  labelPosition?: "top-left" | "top-center";
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      layout
      whileHover={enableHover ? { scale: 1.02 } : undefined}
      whileTap={enableTap ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
      onClick={onClick}
      className={cn(
        "row-span-1 relative rounded-2xl group/bento p-12 py-20 border border-transparent justify-between flex flex-col space-y-4 overflow-hidden",
        onClick && "cursor-pointer",
        className
      )}
    >
      {label && (
        <div
          className={cn(
            "absolute top-6 z-20 px-3 py-1 bg-black rounded-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
            "text-[10px] font-bold text-white uppercase tracking-widest",
            labelPosition === "top-center"
              ? "left-1/2 -translate-x-1/2"
              : "left-12"
          )}
        >
          {label}
        </div>
      )}
      {children}
    </motion.div>
  );
};
