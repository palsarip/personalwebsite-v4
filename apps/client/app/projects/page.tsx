"use client";

import { Container } from "@/components/layout/container";
import { ProjectCard } from "@/components/projects/project-card";
import { ExpandedProjectCard } from "@/components/projects/expanded-project-card";
import { projectsData, Project } from "@/lib/content";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <Container className="py-8 md:py-12">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projectsData.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            layoutId={`project-${index}`}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ExpandedProjectCard
            project={selectedProject}
            layoutId={`project-${projectsData.indexOf(selectedProject)}`}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </Container>
  );
}
