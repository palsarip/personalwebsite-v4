import { Container } from "@/components/layout/container"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const projects = [
  {
    title: "Project One",
    description:
      "A modern web application built with Next.js and Tailwind CSS.",
    tags: ["Next.js", "React", "Tailwind"],
    link: "#",
  },
  {
    title: "Project Two",
    description:
      "An e-commerce platform with a custom design system.",
    tags: ["TypeScript", "Node.js", "PostgreSQL"],
    link: "#",
  },
  {
    title: "Project Three",
    description:
      "A productivity tool for remote teams.",
    tags: ["Vue.js", "Firebase", "Sass"],
    link: "#",
  },
]

export default function ProjectsPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="text-lg text-muted-foreground">
          A collection of my recent work and side projects.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={project.link}>View Project</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Container>
  )
}
