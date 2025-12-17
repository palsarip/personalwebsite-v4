"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { projectsData, Project } from "@/lib/content";
import { ProjectScrollItem } from "@/components/projects/project-scroll-item";
import { ExpandedProjectCard } from "@/components/projects/expanded-project-card";
import { AllProjectsOverlay } from "@/components/projects/all-projects-overlay";
import { ChevronUp, ChevronDown, Grid, Info, ExternalLink } from "lucide-react";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle Scroll to update active index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / container.clientHeight);
      if (index !== activeProjectIndex) {
        setActiveProjectIndex(index);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeProjectIndex]);

  // Scroll to specific index
  const scrollToProject = (index: number) => {
    if (index < 0 || index >= projectsData.length) return;
    const element = document.getElementById(`project-snap-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to project when selected from All Projects overlay
  const handleSelectFromOverlay = (project: Project) => {
    setShowAllProjects(false);
    const index = projectsData.indexOf(project);
    scrollToProject(index);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollToProject(activeProjectIndex + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToProject(activeProjectIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProjectIndex]);

  return (
    <div className="relative h-[calc(100dvh-11rem)] w-full overflow-hidden">
      {/* Scroll Snap Container */}
      <div
        ref={scrollContainerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
      >
        {projectsData.map((project, index) => (
          <div
            key={index}
            id={`project-snap-${index}`}
            className="snap-start h-full w-full"
          >
            <ProjectScrollItem
              project={project}
              onDetailsClick={() => setSelectedProject(project)}
              onAllProjectsClick={() => setShowAllProjects(true)}
            />
          </div>
        ))}
      </div>

      {/* --- Floating Navigation & Actions Wrapper --- */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
        <div className="w-full max-w-3xl relative h-full flex items-center">
          {/* Left: Navigation */}
          <div
            className="absolute flex-col gap-3 pointer-events-auto items-end z-50
            hidden xl:flex
            xl:left-0 xl:-translate-x-full xl:-ml-6"
          >
            <button
              onClick={() => scrollToProject(activeProjectIndex - 1)}
              disabled={activeProjectIndex === 0}
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:bg-zinc-100/50"
            >
              <ChevronUp size={20} />
            </button>

            <button
              onClick={() => setShowAllProjects(true)}
              className="p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:scale-105 transition-all group hover:bg-zinc-100/50"
            >
              <Grid size={20} className="transition-transform duration-300" />
            </button>

            <button
              onClick={() => scrollToProject(activeProjectIndex + 1)}
              disabled={activeProjectIndex === projectsData.length - 1}
              className="p-2 rounded-full text-zinc-400 hover:text-zinc-900 transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:bg-zinc-100/50"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Right: Actions (Floating) */}
          <div
            className="absolute flex-col gap-3 pointer-events-auto items-start z-50
            hidden xl:flex
            xl:right-auto xl:left-full xl:ml-6"
          >
            {/* Details Button */}
            <button
              onClick={() =>
                setSelectedProject(projectsData[activeProjectIndex])
              }
              className="p-3 rounded-full bg-white shadow-surround-md text-zinc-400 hover:text-zinc-900 transition-all hover:scale-105"
              title="Details"
            >
              <Info size={20} />
            </button>

            {/* Preview Button */}
            <a
              href={projectsData[activeProjectIndex]?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white shadow-surround-md text-zinc-400 hover:text-zinc-900 transition-all hover:scale-105"
              title="Preview"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Details Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ExpandedProjectCard
            project={selectedProject}
            layoutId={undefined}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      {/* All Projects Overlay */}
      <AnimatePresence>
        {showAllProjects && (
          <AllProjectsOverlay
            projects={projectsData}
            onClose={() => setShowAllProjects(false)}
            onSelectProject={handleSelectFromOverlay}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
