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
    <div className="h-full w-full snap-start flex flex-col justify-center items-center relative overflow-hidden">
      <div className="w-full max-w-3xl flex flex-col h-full gap-6 justify-center px-4 sm:px-6 lg:px-8">
        {/* --- Top Section: Header --- */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
              {project.title}
            </h2>
            {/* Using the first tag as the "Type" */}
            {project.tags.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100 px-2.5 py-0.5 text-xs rounded-full"
              >
                {project.tags[0]}
              </Badge>
            )}
          </div>
          <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* --- Middle Section: Media --- */}
        <motion.div
          className="h-auto w-full aspect-[3/4] bg-zinc-100 rounded-[28px] overflow-hidden relative group shadow-lg border border-zinc-100"
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

        {/* Mobile All Projects Button (Floating if needed, or keeping it hidden on mobile to save space is better, but user asked for it. I'll put it in the flex flow for mobile as well but maybe smaller) */}
        <div className="md:hidden w-full flex justify-center -mt-2 pb-4">
          <button
            onClick={onAllProjectsClick}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
          >
            <Grid size={14} />
            View all projects
          </button>
        </div>
      </div>
    </div>
  );
}
