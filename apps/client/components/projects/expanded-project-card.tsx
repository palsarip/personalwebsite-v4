"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { Project } from "@/lib/content";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ExpandedProjectCardProps {
  project: Project;
  onClose: () => void;
  layoutId?: string;
  mode?: "modal" | "side-panel";
}

export function ExpandedProjectCard({
  project,
  onClose,
  layoutId,
  mode = "modal",
}: ExpandedProjectCardProps) {
  // Gallery State
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(
    null
  );
  const [showFullGallery, setShowFullGallery] = useState(false);

  useEffect(() => {
    // Only lock body scroll if in modal mode
    if (mode === "modal") {
      document.body.style.overflow = "hidden";
    }
    // Init gallery image
    if (project.gallery && project.gallery.length > 0) {
      setActiveGalleryImage(project.gallery[0]);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [project, mode]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop (Only for modal) */}
      {mode === "modal" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Expanded Card Container */}
      <div
        className={cn(
          "fixed z-50 flex pointer-events-none",
          mode === "modal"
            ? "inset-0 items-center justify-center p-4 sm:p-8"
            : "inset-y-0 right-0 h-full w-full md:w-[600px] items-stretch"
        )}
      >
        <motion.div
          layoutId={layoutId}
          layout
          initial={
            mode === "side-panel" ? { x: "100%", opacity: 0 } : undefined
          }
          animate={
            mode === "side-panel" ? { x: 0, opacity: 1 } : undefined
          }
          exit={
            mode === "side-panel" ? { x: "100%", opacity: 0 } : undefined
          }
          transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
          className={cn(
            "bg-white text-zinc-900 shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative",
            mode === "modal"
              ? "w-full max-w-3xl max-h-[90vh] rounded-3xl"
              : "w-full h-full border-l border-zinc-200"
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
            transition={{ delay: 0.1, duration: 0.2 }}
            className="flex-1 overflow-y-auto bg-white"
          >
            {/* --- Hero Header Logic (Overlay) --- */}
            <div className="relative w-full h-64 sm:h-80">
              {project.videoUrl ? (
                <video
                  src={project.videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
                {/* Category/Date equivalent */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2"
                >
                  {project.category}
                </motion.div>
                
                <motion.h2
                  layoutId={layoutId ? `title-${layoutId}` : undefined}
                  className="text-3xl sm:text-4xl font-bold font-sans text-white"
                >
                  {project.title}
                </motion.h2>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white rounded-md text-[9px] font-bold uppercase tracking-widest border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* --- Content Body --- */}
            <div className="mt-8 w-full">
              
              {/* 1. Interactive Gallery */}
              {project.gallery &&
                project.gallery.length > 0 &&
                activeGalleryImage && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="px-6 sm:px-8 mb-10 w-full max-w-2xl mx-auto"
                  >
                    <div className="space-y-4">
                      {/* Main Image */}
                      <div className="relative rounded-2xl overflow-hidden shadow-lg w-full bg-zinc-100 aspect-video">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={activeGalleryImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            src={activeGalleryImage}
                            alt="Gallery Main"
                            className="w-full h-full object-cover"
                          />
                        </AnimatePresence>
                      </div>

                      {/* Thumbnails */}
                      {(() => {
                        let others = [...project.gallery!];
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

              {/* 2. Text Content */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="prose prose-lg px-6 sm:px-8 pb-12 max-w-2xl mx-auto w-full 
                             prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900
                             prose-p:text-zinc-700 prose-p:leading-relaxed
                             prose-a:text-blue-600 hover:prose-a:underline
                             prose-blockquote:border-l-4 prose-blockquote:border-zinc-200 prose-blockquote:pl-4 prose-blockquote:italic"
                >
                  {/* Lead Description */}
                  <p className="lead text-xl font-medium text-zinc-900 mb-8">
                     {project.description}
                  </p>

                  {/* Filler/Structure to mimic Article feel */}
                  <h3>About the Project</h3>
                  <p>
                    This project represents a detailed exploration into {project.category.toLowerCase()} development. 
                    We focused on creating a seamless user experience that balances functionality with aesthetic appeal.
                  </p>

                  <h3>Key Technologies</h3>
                  <p>
                    Built using a modern stack including: <strong>{project.tags.join(", ")}</strong>. 
                    Each technology was chosen for its performance characteristics and developer experience.
                  </p>

                  {/* Spacer for bottom bar */}
                  <div className="h-12" />
              </motion.div>
            </div>
            
            {/* Scroll padding */}
            <div className="h-20" />
          </motion.div>

          {/* Action Bar (Sticky Bottom) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-white/80 backdrop-blur-md border-t border-zinc-100">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full bg-zinc-900 text-white font-bold py-3 rounded-xl hover:bg-zinc-800 transition-colors shadow-lg"
            >
              Visit Project <ExternalLink size={16} className="ml-2" />
            </a>
          </div>

        </motion.div>
      </div>

      {/* Full Gallery Overlay */}
      <AnimatePresence>
        {showFullGallery && project.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/95 backdrop-blur-md flex flex-col p-4 sm:p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 max-w-7xl mx-auto w-full">
              <span className="text-white/70 font-medium">Gallery</span>
              <button
                onClick={() => setShowFullGallery(false)}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto w-full pb-20">
              {project.gallery.map((src, idx) => (
                <motion.div
                  key={`${src}-full-${idx}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer shadow-2xl group"
                  onClick={() => {
                    setActiveGalleryImage(src);
                    setShowFullGallery(false);
                  }}
                >
                  <img
                    src={src}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {activeGalleryImage === src && (
                    <div className="absolute inset-0 ring-4 ring-white/50 rounded-xl" />
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
