"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Project } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

interface ProjectCardProps {
  project: Project;
  className?: string;
  onClick?: () => void;
  layoutId?: string;
}

export function ProjectCard({
  project,
  className,
  onClick,
  layoutId,
}: ProjectCardProps) {
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
    <motion.div
      layoutId={layoutId}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
      className={cn(
        // Card Container: White, Shadow-md, Rounded
        "group relative flex flex-col rounded-3xl bg-white shadow-md block h-full cursor-pointer",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Media Container - Padded Inside */}
      <div className="p-4 pb-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
          {/* Static Image */}
          <img
            src={project.imageUrl}
            alt={project.title}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-500",
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
        </div>
      </div>

      {/* Content - Inside the Card */}
      <div className="flex flex-col p-6 pt-4">
        <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-3 group-hover:text-zinc-700 transition-colors">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-zinc-200"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
