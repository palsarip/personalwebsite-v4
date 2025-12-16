"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "./project-card";
import { Project } from "@/lib/content";
import { X } from "lucide-react";

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
  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      className="fixed inset-0 z-50 flex flex-col bg-white/40 dark:bg-black/40 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-6 bg-white/50 backdrop-blur-md border-b border-white/20">
        <h2 className="text-xl font-bold text-zinc-900">All Projects</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-black/5 transition-colors text-zinc-600"
        >
          <X size={24} />
        </button>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => {
                    onSelectProject(project);
                  }}
                  className="aspect-[4/3]" // Force a specific aspect ratio for uniformity in grid
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
