"use client";

import { useRef, useState } from "react";
import { Project } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Info, ExternalLink, Grid } from "lucide-react";

interface ProjectScrollItemProps {
  project: Project;
  onDetailsClick: () => void;
  onAllProjectsClick: () => void;
}

export function ProjectScrollItem({
  project,
  onDetailsClick,
  onAllProjectsClick,
}: ProjectScrollItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (project.videoUrl && videoRef.current) {
      videoRef.current.play().catch((e) => {
        console.warn("Video play failed:", e);
      });
      setIsVideoPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (project.videoUrl && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsVideoPlaying(false);
    }
  };

  return (
    <div className="h-full w-full snap-start flex flex-col justify-center items-center px-4 relative overflow-hidden">
      <div className="w-full max-w-3xl flex flex-col h-full gap-4 md:gap-6 justify-center">
        {/* --- Top Section: Header --- */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
              {project.title}
            </h2>
            {/* Using the first tag as the "Type" */}
            {project.tags.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100 px-2 py-0.5 text-xs rounded-full"
              >
                {project.tags[0]}
              </Badge>
            )}
          </div>
          <p className="text-zinc-500 text-sm md:text-base max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* --- Middle Section: Media --- */}
        <motion.div
          className="w-full portrait:aspect-[4/5] landscape:aspect-video bg-zinc-100 rounded-[24px] overflow-hidden relative group shadow-sm border border-zinc-100 transition-all duration-500 ease-in-out"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 0.995 }}
          transition={{ duration: 0.4 }}
        >
          {/* Static Image */}
          <img
            src={project.imageUrl}
            alt={project.title}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-500 absolute inset-0",
              isVideoPlaying ? "opacity-0" : "opacity-100"
            )}
          />

          {/* Video Preview */}
          {project.videoUrl && (
            <video
              ref={videoRef}
              src={project.videoUrl}
              muted
              loop
              playsInline
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 pointer-events-none",
                isVideoPlaying ? "opacity-100" : "opacity-0"
              )}
            />
          )}

          {/* Play Button Indicator (optional, fades out on play) */}
          {!isVideoPlaying && project.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          )}
        </motion.div>

        {/* --- Bottom Section: Actions (Mobile/Tablet Only) --- */}
        <div className="flex xl:hidden flex-row items-center justify-between gap-3 shrink-0 w-full px-2">
          {/* Details Button */}
          <button
            onClick={onDetailsClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm"
          >
            <Info size={16} />
            Details
          </button>

          {/* All Projects Button (Center) */}
          <button
            onClick={onAllProjectsClick}
            className="flex items-center justify-center h-10 w-10 shrink-0 rounded-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm"
            title="All Projects"
          >
            <Grid size={16} />
          </button>

          {/* Preview Button */}
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 hover:shadow-lg transition-all shadow-md group"
          >
            Preview
            <ExternalLink
              size={16}
              className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
