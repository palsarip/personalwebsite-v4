"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Project } from "@/lib/content";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ExpandedProjectCardProps {
  project: Project;
  onClose: () => void;
  layoutId?: string;
}

export function ExpandedProjectCard({
  project,
  onClose,
  layoutId,
}: ExpandedProjectCardProps) {
  // Gallery State
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(
    null
  );
  const [showFullGallery, setShowFullGallery] = useState(false);

  useEffect(() => {
    // Prevent scrolling on body when card is open
    document.body.style.overflow = "hidden";
    // Init gallery image
    if (project.gallery && project.gallery.length > 0) {
      setActiveGalleryImage(project.gallery[0]);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [project]);

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

      {/* Expanded Card Container - Sheet Style (Top 10vh) */}
      <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
        <motion.div
          layoutId={layoutId}
          layout
          transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
          className={cn(
            "w-full h-[90vh] bg-white text-zinc-900 rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col pointer-events-auto relative mt-[10vh]"
          )}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 rounded-full p-2 bg-black/10 backdrop-blur-md hover:bg-black/20 transition-colors text-zinc-900"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>

          {/* Scrollable Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="flex-1 overflow-y-auto"
          >
            {/* Media Header */}
            <div className="relative w-full aspect-video max-h-[60vh]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 sm:p-10 text-white max-w-5xl mx-auto w-full">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                  {project.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-white/20 text-white hover:bg-white/30 border-transparent"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Body Wrapper (Spacing Logic) */}
            <div className="mt-12 w-full">
              {/* Interactive Gallery (Above Description) */}
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
                                className="relative rounded-xl overflow-hidden aspect-4/3 shadow-sm cursor-pointer transition-all group w-full"
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

              {/* Description Content */}
              <div className="prose prose-lg px-6 sm:px-8 pb-12 max-w-2xl mx-auto w-full text-zinc-600">
                <p className="lead text-xl text-zinc-900 font-medium">
                  {project.description}
                </p>

                <h3>Project Overview</h3>
                <p>
                  This project was conceived to address specific challenges in
                  the domain. Leveraging modern web technologies, we aimed to
                  create a solution that is not only functional but also
                  intuitive and performant. The architecture prioritizes
                  scalability and maintainability.
                </p>

                <h3>Key Features</h3>
                <ul>
                  <li>Real-time data synchronization across clients.</li>
                  <li>
                    Responsive design that works seamlessly on mobile and
                    desktop.
                  </li>
                  <li>Integrated analytics for tracking user engagement.</li>
                  <li>Secure authentication and role-based access control.</li>
                </ul>

                <h3>Technical Challenges</h3>
                <p>
                  One of the main hurdles was ensuring smooth video playback
                  while maintaining fast load times. We implemented lazy loading
                  strategies and optimized standard media formats. Additionally,
                  state management was complex due to the real-time nature of
                  the data.
                </p>

                <h3>Outcome</h3>
                <p>
                  The final product exceeded performance benchmarks, reducing
                  load times by 40%. User feedback has been overwhelmingly
                  positive, particularly regarding the intuitive interface and
                  the "sleek" interactions.
                </p>

                <div className="pt-8">
                  <Link
                    href={project.link}
                    className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-zinc-800"
                    target="_blank"
                  >
                    View Live Project
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Full Gallery Overlay */}
      <AnimatePresence>
        {showFullGallery && project.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-md flex flex-col p-4 sm:p-8 overflow-y-auto"
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
              {project.gallery.map((src, idx) => (
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
