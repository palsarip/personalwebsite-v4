"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/lib/content";
import { X, Search, LayoutGrid, List as ListIcon, Calendar, Code2, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExpandedProjectCard } from "./expanded-project-card";

interface AllProjectsFinderProps {
  projects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export function AllProjectsFinder({
  projects,
  onClose,
  onSelectProject,
}: AllProjectsFinderProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-zinc-50 dark:bg-zinc-900/95 backdrop-blur-xl overflow-hidden font-sans"
    >
      {/* --- Toolbar --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-4 flex-1">
           {/* Window Controls Decoration */}
           <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
           </div>

           {/* Search */}
           <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-300 dark:focus:border-zinc-700 focus:outline-none transition-all text-sm"
            />
           </div>
        </div>

        <div className="flex items-center gap-2">
            {/* View Toggles */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 border border-zinc-200 dark:border-zinc-700">
                <button 
                    onClick={() => setViewMode("grid")}
                    className={cn("p-1.5 rounded-md transition-all", viewMode === "grid" ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-zinc-400 hover:text-zinc-600")}
                >
                    <LayoutGrid size={16} />
                </button>
                <button 
                    onClick={() => setViewMode("list")}
                    className={cn("p-1.5 rounded-md transition-all", viewMode === "list" ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-zinc-400 hover:text-zinc-600")}
                >
                    <ListIcon size={16} />
                </button>
            </div>

            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-2" />

            <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 transition-colors"
            >
                <X size={20} />
            </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Project List/Grid Container */}
        <div className={cn("flex-1 overflow-y-auto p-4 transition-all duration-300", selectedProject ? "mr-0 xl:mr-[600px]" : "")}>
            
            {filteredProjects.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p>No projects found</p>
                </div>
            )}

            {/* LIST VIEW */}
            {viewMode === "list" && (
                <div className="min-w-[600px]">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 mb-2">
                        <div className="col-span-4">Name</div>
                        <div className="col-span-3">Category</div>
                        <div className="col-span-4">Tech Stack</div>
                        <div className="col-span-1 text-right">Links</div>
                    </div>
                    {/* Rows */}
                    <div className="space-y-1">
                        {filteredProjects.map((project) => (
                            <motion.div 
                                layout
                                key={project.title}
                                onClick={() => setSelectedProject(project)}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "grid grid-cols-12 gap-4 px-4 py-3 rounded-lg cursor-pointer items-center text-sm transition-colors group",
                                    selectedProject?.title === project.title 
                                        ? "bg-blue-500 text-white" 
                                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800/50"
                                )}
                            >
                                <div className="col-span-4 flex items-center gap-3 font-medium truncate">
                                    {project.category === "Folder" ? <Folder size={16} className={selectedProject?.title === project.title ? "text-white" : "text-blue-500"} /> : <Code2 size={16} className="opacity-70" />}
                                    {project.title}
                                </div>
                                <div className="col-span-3 opacity-80 truncate">{project.category}</div>
                                <div className="col-span-4 flex flex-wrap gap-1">
                                    {project.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className={cn("text-[10px] px-1.5 py-0.5 rounded-full border opacity-80", selectedProject?.title === project.title ? "border-white/30 bg-white/10" : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800")}>
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags.length > 3 && <span className="opacity-60 text-xs">+{project.tags.length - 3}</span>}
                                </div>
                                <div className="col-span-1 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 rounded-full bg-current ml-auto" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* GRID VIEW */}
            {viewMode === "grid" && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                     {filteredProjects.map((project) => (
                        <motion.button
                            layout
                            key={project.title}
                            onClick={() => setSelectedProject(project)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "flex flex-col items-center gap-3 p-4 rounded-xl transition-all aspect-square justify-center group text-center",
                                selectedProject?.title === project.title 
                                    ? "bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500" 
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
                            )}
                        >
                            <div className="w-16 h-16 rounded-lg overflow-hidden shadow-sm bg-zinc-100 relative group-hover:scale-105 transition-transform">
                                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                                {project.featured && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className={cn("text-sm font-medium leading-tight", selectedProject?.title === project.title ? "text-blue-600 dark:text-blue-400" : "text-zinc-700 dark:text-zinc-300")}>
                                    {project.title}
                                </span>
                                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{project.category}</span>
                            </div>
                        </motion.button>
                     ))}
                </div>
            )}
        </div>

        {/* --- Side Panel (Preview) --- */}
        <AnimatePresence>
            {selectedProject && (
                <div className="absolute top-0 right-0 h-full z-20 shadow-[-4px_0_24px_rgba(0,0,0,0.05)] border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 w-full md:w-[600px]">
                     <ExpandedProjectCard 
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                        mode="side-panel"
                     />
                </div>
            )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
