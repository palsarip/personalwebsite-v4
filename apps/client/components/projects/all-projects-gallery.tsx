"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/content";
import { X, ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExpandedProjectCard } from "./expanded-project-card";

interface GalleryProjectItemProps {
  project: Project;
  onClick: () => void;
  layoutId?: string;
}

function GalleryProjectItem({ project, onClick, layoutId }: GalleryProjectItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (project.videoUrl && videoRef.current) {
      videoRef.current.play().catch((e) => console.warn("Hover play failed:", e));
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
      layout

      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className="group flex flex-col gap-4 cursor-pointer"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image/Video Container */}
      <div className="aspect-[4/3] rounded-[24px] overflow-hidden bg-zinc-100 relative">
        {/* Static Image */}
        <img
          src={project.imageUrl}
          alt={project.title}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500 absolute inset-0",
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
            onPlaying={() => setIsVideoPlaying(true)}
            onError={() => setIsVideoPlaying(false)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 pointer-events-none",
              isVideoPlaying ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur text-[10px] font-medium uppercase tracking-widest rounded-full text-zinc-900 z-10">
            Featured
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-zinc-900 leading-none group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <span className="text-xs text-zinc-500 font-medium">
            {project.category}
          </span>
        </div>
        <ArrowUpRight
          size={18}
          className="text-zinc-300 group-hover:text-zinc-900 transition-colors"
        />
      </div>
    </motion.div>
  );
}

interface AllProjectsGalleryProps {
  projects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export function AllProjectsGallery({
  projects,
  onClose,
  onSelectProject,
}: AllProjectsGalleryProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ["All", ...cats];
  }, [projects]);

  // Filter Projects
  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      activeCategory === "All" || project.category === activeCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden font-sans"
    >
      {/* --- Header Section --- */}
      <div className="border-b border-zinc-100 flex flex-col bg-white z-20">
        {/* Top Row: Title & Close */}
        <div className="px-6 py-6 md:px-12 md:py-8 pb-0 md:pb-0">
          <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
              All Projects
            </h1>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-zinc-900"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Bottom Row: Editorial Filters & Search */}
        <div className="px-6 md:px-12 pb-6 md:pb-8 pt-6">
          <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between h-8">
            {/* Categories */}
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar mask-linear-gradient">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "text-sm font-medium transition-colors whitespace-nowrap",
                    activeCategory === cat
                      ? "text-zinc-900 border-b border-zinc-900 pb-0.5"
                      : "text-zinc-400 hover:text-zinc-600 pb-0.5 border-b border-transparent"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center justify-end w-48">
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 border-b border-zinc-200 pb-1"
                  >
                    <Search size={14} className="text-zinc-400 shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onBlur={() => !searchQuery && setIsSearchOpen(false)}
                      className="bg-transparent border-none outline-none text-sm text-zinc-900 w-full placeholder:text-zinc-300"
                    />
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                    >
                      <X size={14} className="text-zinc-400 hover:text-zinc-900" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSearchOpen(true)}
                    className="text-zinc-400 hover:text-zinc-900 transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 hidden md:block">
                      Search
                    </span>
                    <Search size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* --- Gallery Grid --- */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 max-w-[1920px] mx-auto">
            {filteredProjects.map((project, index) => (
              <GalleryProjectItem
                key={project.title}
                project={project}
                onClick={() => setSelectedProject(project)}
                layoutId={`${activeCategory}-${project.title}`}
              />
            ))}
        </div>

        {/* Footer padding */}
        <div className="h-20" />
      </div>

      {/* --- Detail Modal --- */}
      <AnimatePresence>
        {selectedProject && (
          <ExpandedProjectCard
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            mode="modal" // Using Classic Modal mode
            layoutId={`${activeCategory}-${selectedProject.title}`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
