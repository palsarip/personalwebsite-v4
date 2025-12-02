"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  children: ReactNode;
}

export function ContextMenu({
  isOpen,
  onClose,
  position,
  children,
}: ContextMenuProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.2, bounce: 0 }}
            style={{ top: position.y, left: position.x }}
            className="fixed z-[9999] 
                       bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md 
                       rounded-xl shadow-xl border border-white/20 dark:border-zinc-700/50 
                       p-1.5 min-w-[200px] origin-top-left"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
