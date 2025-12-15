"use client";

import { motion, AnimatePresence } from "framer-motion";
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

  // Gallery State
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(
    null
  );

  // Full Gallery View State
  const [showFullGallery, setShowFullGallery] = useState(false);

  useEffect(() => {
    // Reset active image when item changes
    if (
      item.type === "sheet" &&
      item.data.gallery &&
      item.data.gallery.length > 0
    ) {
      setActiveGalleryImage(item.data.gallery[0]);
    } else {
      setActiveGalleryImage(null);
    }
  }, [item]);

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
                      {item.data.date && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2"
                        >
                          {item.data.date}
                        </motion.div>
                      )}
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
                      {/* Header Info: Date & Tags (Hero Mode - Light/White Text) */}
                      {(item.data.date ||
                        (item.data.tags && item.data.tags.length > 0)) && (
                        <div className="flex flex-col gap-2 mt-4 items-start">
                          {item.data.tags && item.data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {item.data.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white rounded-md text-[9px] font-bold uppercase tracking-widest border border-white/10"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
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
                    <div className="px-6 sm:px-8 pt-12 pb-6 max-w-2xl mx-auto w-full text-left">
                      {item.data.date && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2"
                        >
                          {item.data.date}
                        </motion.div>
                      )}
                      <motion.h2
                        layoutId={`title-${item.id}`}
                        className="text-3xl sm:text-4xl font-bold font-sans tracking-tight text-foreground"
                      >
                        {item.data.sheetTitle}
                      </motion.h2>
                      {item.data.description && (
                        <motion.p
                          layoutId={`description-${item.id}`}
                          className="text-lg text-zinc-800 mt-2 font-medium leading-relaxed"
                        >
                          {item.data.description}
                        </motion.p>
                      )}
                      {/* Header Info: Date & Tags */}
                      {(item.data.date ||
                        (item.data.tags && item.data.tags.length > 0)) && (
                        <div className="flex flex-col gap-2 mt-6 items-start">
                          {item.data.tags && item.data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {item.data.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded-md text-[9px] font-bold uppercase tracking-widest"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                {/* 2. Interactive Gallery - Moved */}
                {item.data.gallery &&
                  item.data.gallery.length > 0 &&
                  activeGalleryImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="px-6 sm:px-8 mb-10 w-full max-w-2xl mx-auto"
                    >
                      <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-lg w-full bg-zinc-100">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={activeGalleryImage}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              src={activeGalleryImage}
                              alt="Gallery Main"
                              className="w-full h-auto"
                            />
                          </AnimatePresence>
                        </div>

                        {/* Thumbnails */}
                        {(() => {
                          let others = [...item.data.gallery];
                          if (activeGalleryImage) {
                            const activeIndex =
                              others.indexOf(activeGalleryImage);
                            if (activeIndex !== -1) {
                              others.splice(activeIndex, 1);
                            }
                          }

                          if (others.length === 0) return null;

                          const displayCount = 4;
                          const visibleOthers = others.slice(0, displayCount);
                          const remainingCount = others.length - displayCount;

                          return (
                            <div className="grid grid-cols-4 gap-3">
                              {visibleOthers.map((src, idx) => (
                                <button
                                  key={`${src}-${idx}`}
                                  onClick={() => {
                                    if (
                                      idx === displayCount - 1 &&
                                      remainingCount > 0
                                    ) {
                                      setShowFullGallery(true);
                                    } else {
                                      setActiveGalleryImage(src);
                                    }
                                  }}
                                  className="relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm cursor-pointer transition-all group w-full"
                                >
                                  <img
                                    src={src}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    alt="Thumbnail"
                                  />
                                  {idx === displayCount - 1 &&
                                    remainingCount > 0 && (
                                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                                        <span className="text-white font-bold text-sm sm:text-base">
                                          +{remainingCount + 1} more
                                        </span>
                                      </div>
                                    )}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </motion.div>
                  )}

                {/* Content - Morphing Entry */}
                <motion.div
                  layoutId={`content-${item.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="prose prose-lg px-6 sm:px-8 pb-12 max-w-2xl mx-auto w-full 
                             prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                             prose-p:text-zinc-800 prose-p:leading-relaxed
                             prose-blockquote:border-l-4 prose-blockquote:border-zinc-200 prose-blockquote:pl-4 prose-blockquote:italic
                             prose-img:rounded-2xl prose-img:shadow-sm"
                >
                  {/* 3. HTML Content (Rest of Paragraphs) */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item.data.sheetContent!,
                    }}
                    className="prose prose-lg max-w-none text-justify
                      prose-headings:font-bold prose-headings:text-zinc-900 prose-headings:text-left
                      prose-p:text-zinc-900 prose-p:leading-relaxed
                      prose-li:text-zinc-900
                      prose-strong:text-zinc-900
                      prose-img:rounded-2xl prose-img:shadow-lg prose-img:w-full
                      prose-a:text-blue-600 hover:prose-a:underline
                      prose-blockquote:border-l-4 prose-blockquote:border-zinc-900
                      prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-zinc-900
                      prose-blockquote:font-medium prose-blockquote:py-2 prose-blockquote:my-6
                    "
                  />

                  {/* CTA Button */}
                  {item.data.cta && (
                    <div className="pt-6">
                      <a
                        href={item.data.cta.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full font-semibold hover:bg-zinc-800 transition-colors"
                      >
                        {item.data.cta.label}
                      </a>
                    </div>
                  )}
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
              /* Fallback for non-sheet items or empty content */
              <div className="p-8">
                <p>No content available.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Full Gallery Overlay */}
      <AnimatePresence>
        {showFullGallery && item.type === "sheet" && item.data.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex flex-col p-4 sm:p-8 overflow-y-auto"
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowFullGallery(false)}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto w-full">
              {item.data.gallery.map((src, idx) => (
                <motion.div
                  key={`${src}-full-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer shadow-lg group"
                  onClick={() => {
                    setActiveGalleryImage(src);
                    setShowFullGallery(false);
                  }}
                >
                  <img
                    src={src}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {activeGalleryImage === src && (
                    <div className="absolute inset-0 ring-4 ring-blue-500/50 rounded-xl" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
