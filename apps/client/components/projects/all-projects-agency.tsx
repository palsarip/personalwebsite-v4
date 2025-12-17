"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/content";
import { X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AllProjectsAgencyProps {
  projects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export function AllProjectsAgency({
  projects,
  onClose,
  onSelectProject,
}: AllProjectsAgencyProps) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex bg-white overflow-hidden font-sans"
    >
      {/* --- Main Content --- */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-8 md:px-12 md:py-10">
          <div className="flex flex-col">
            <h2 className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1">
              Index
            </h2>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              All Projects
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white border border-zinc-100 shadow-sm hover:bg-zinc-50 transition-all text-zinc-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-20">
          <div className="flex flex-col max-w-5xl">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => onSelectProject(project)}
                className="group relative border-t border-zinc-100 py-6 cursor-pointer flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 transition-colors hover:border-zinc-300"
              >
                {/* Index Number */}
                <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors">
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-semibold text-zinc-900 group-hover:text-black transition-all group-hover:translate-x-2">
                  {project.title}
                </h3>

                {/* Meta (Categories) */}
                <div className="flex items-center gap-4 text-zinc-500 group-hover:text-zinc-800 transition-colors md:w-1/4 justify-end">
                  <span className="text-xs font-medium">{project.category}</span>
                  <ArrowUpRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0"
                  />
                </div>
                
                {/* Image Reveal on Hover (Small card right) */}
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[240px] aspect-video rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none hidden lg:block scale-95 group-hover:scale-100 z-20 shadow-xl translate-x-4 group-hover:-translate-x-4">
                    <img src={project.imageUrl} className="w-full h-full object-cover" />
                 </div>
              </motion.div>
            ))}
            {/* Final Border */}
            <div className="border-t border-zinc-100" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
