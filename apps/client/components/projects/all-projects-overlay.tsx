"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "./project-card";
import { Project } from "@/lib/content";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AllProjectsOverlayProps {
  projects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export function AllProjectsOverlay({
  projects,
  onClose,
  onSelectProject,
}: AllProjectsOverlayProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories
  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  // Filter projects
  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-50 flex flex-col bg-zinc-50/90 dark:bg-black/90 overflow-hidden"
    >
      {/* Header with Filters */}
      <div className="flex flex-col gap-4 px-6 py-4 md:px-8 md:py-6 bg-white/50 dark:bg-black/50 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shrink-0 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            All Projects
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Categories (Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                selectedCategory === cat
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[200px] md:auto-rows-[240px]"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  key={project.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "relative group rounded-3xl overflow-hidden cursor-pointer bg-zinc-100 dark:bg-zinc-800",
                    project.featured
                      ? "sm:col-span-2 sm:row-span-2" // Featured items are 2x2 on larger screens
                      : "col-span-1 row-span-1"
                  )}
                  onClick={() => onSelectProject(project)}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => onSelectProject(project)}
                    className="h-full w-full"
                  />
                  
                  {/* Hover Overlay for Featured/Bento Context */}
                  {/* Note: The ProjectCard component itself might handle some visuals, 
                      but we ensure it fills the bento cell here. */}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
