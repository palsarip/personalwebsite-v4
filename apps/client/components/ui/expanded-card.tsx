"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { BentoItem } from "@/lib/content";
import { cn } from "@/lib/utils";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface ExpandedCardProps {
  item: BentoItem;
  onClose: () => void;
  layoutId: string;
}

export function ExpandedCard({ item, onClose, layoutId }: ExpandedCardProps) {
  // Determine if we have sheet content to show
  const hasSheetContent = item.type === "sheet" && "sheetContent" in item.data;

  useEffect(() => {
    // Prevent scrolling on body when card is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />

      {/* Expanded Card Container - Centered */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
        {/* The Card Itself - Target for Framer Motion layoutId */}
        <motion.div
          layoutId={layoutId}
          layout
          transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
          className={cn(
            "w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative",
            // Re-apply style config if needed, or just use standard background
            item.style?.background || "bg-white",
            item.style?.textColor || "text-zinc-900"
          )}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 rounded-full p-2 bg-black/10 backdrop-blur-md hover:bg-black/20 transition-colors text-white"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>

          {/* Scrollable Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }} // Slight delay to let shell start morphing
            className="flex-1 overflow-y-auto bg-transparent text-foreground"
          >
            {hasSheetContent ? (
              <>
                {/* Hero Header Logic */}
                {/* Priority: 1. Cover (if header pos), 2. Legacy heroImageUrl */}
                {((item.data.cover &&
                  (item.data.cover.expandedPosition === "header" ||
                    !item.data.cover.expandedPosition)) ||
                  ("heroImageUrl" in item.data && item.data.heroImageUrl)) && (
                  <div className="relative w-full h-64 sm:h-80">
                    {/* Render Video or Image based on type */}
                    {item.data.cover?.type === "video" ? (
                      <video
                        src={item.data.cover.url}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={
                          item.data.cover?.url ||
                          (item.data as any).heroImageUrl
                        }
                        alt={item.data.sheetTitle}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                      <motion.h2
                        layoutId={`title-${item.id}`}
                        className="text-3xl sm:text-4xl font-bold font-sans"
                      >
                        {item.data.sheetTitle}
                      </motion.h2>
                      {item.data.description && (
                        <motion.p
                          layoutId={`description-${item.id}`}
                          className="text-lg opacity-90 mt-2 font-medium"
                        >
                          {item.data.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                )}

                {/* Standard Header (if no hero image) */}
                {!(
                  item.data.cover &&
                  (item.data.cover.expandedPosition === "header" ||
                    !item.data.cover.expandedPosition)
                ) &&
                  !("heroImageUrl" in item.data && item.data.heroImageUrl) && (
                    <div className="p-6 sm:p-8 pb-0">
                      <motion.h2
                        layoutId={`title-${item.id}`}
                        className="text-3xl sm:text-4xl font-bold font-sans"
                      >
                        {item.data.sheetTitle}
                      </motion.h2>
                      {item.data.description && (
                        <motion.p
                          layoutId={`description-${item.id}`}
                          className="text-lg opacity-80 mt-2 font-medium"
                        >
                          {item.data.description}
                        </motion.p>
                      )}
                    </div>
                  )}

                {/* Content - Morphing Entry */}
                <motion.div
                  layoutId={`content-${item.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="prose dark:prose-invert p-6 sm:p-8 max-w-none"
                >
                  {/* Cover Image/Video in Content Mode */}
                  {item.data.cover &&
                    item.data.cover.expandedPosition === "content" && (
                      <div className="mb-6 rounded-xl overflow-hidden w-full h-64 sm:h-80 relative">
                        {item.data.cover.type === "video" ? (
                          <video
                            src={item.data.cover.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={item.data.cover.url}
                            alt={item.data.sheetTitle}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    )}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.data.sheetContent || "",
                    }}
                  />
                </motion.div>

                {/* Action Bar (Sticky Bottom) */}
                {"cta" in item.data && item.data.cta && (
                  <div className="sticky bottom-0 left-0 right-0 p-6 sm:p-8 bg-background/80 backdrop-blur-md border-t border-border">
                    <a
                      href={item.data.cta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-foreground text-background font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      {item.data.cta.label}
                    </a>
                  </div>
                )}
              </>
            ) : (
              // Fallback for non-sheet items (if we ever allow expanding them)
              <div className="p-8 flex items-center justify-center h-full">
                <p>No details available.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </>,
    document.body
  );
}
