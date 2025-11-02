import React, { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pong from "../Img/Projects/Pong.jpg";
import FitnessApp from "../Img/Projects/Fitness.jpg";
import Event from "../Img/Projects/Event.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageTransition from '@/components/PageTransition';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  category: "frontend" | "backend" | "fullstack" | "other";
  github: string;
  demo: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-featured online shopping platform with payment processing, user authentication, and admin dashboard.",
    image: "https://images.unsplash.com/photo-1661956602868-6ae368943878",
    tech: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
    category: "fullstack",
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "Collaborative task tracking application with real-time updates, user assignments and progress tracking.",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
    tech: ["React", "Firebase", "Tailwind CSS", "React DnD"],
    category: "frontend",
    github: "https://github.com/abhay707/Notes-app.git",
    demo: "https://notes-app-beige-three.vercel.app/",
  },
  {
    id: 3,
    title: "Social Media Dashboard",
    description:
      "Analytics dashboard for tracking social media metrics across multiple platforms with data visualization.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    tech: ["Vue.js", "Vuex", "Chart.js", "SCSS"],
    category: "frontend",
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: 4,
    title: "RESTful API Service",
    description:
      "High-performance API service with authentication, rate limiting, and comprehensive documentation.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    tech: ["Node.js", "Express", "PostgreSQL", "JWT", "Swagger"],
    category: "backend",
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: 5,
    title: "Event Management System",
    description:
      "A platform to organize, manage, and track events with user registration, event scheduling, and real-time updates.",
    image: Event,
    tech: ["PHP", "MySQL", "TypeScript"],
    category: "fullstack",
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: 6,
    title: "Content Management System",
    description:
      "Custom CMS with role-based access control, media management, and publishing workflow.",
    image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9",
    tech: ["React", "GraphQL", "Node.js", "PostgreSQL"],
    category: "fullstack",
    github: "https://github.com",
    demo: "https://example.com",
  },
  {
    id: 7,
    title: "Retro Pong Game",
    description:
      "A classic Pong game built with HTML5 Canvas and JavaScript, featuring multiplayer mode.",
    image: Pong,
    tech: ["Javascript", "HTML5", "CSS3"],
    category: "frontend",
    github: "https://github.com/abhay707/Retro-pong-game.git",
    demo: "https://retro-pong-games.netlify.app/",
  },
  {
    id: 8,
    title: "Fitness Companion App",
    description:
      "A fitness tracking app built with React and Tailwind CSS, featuring a smart chatbot for personalized guidance.",
    image: FitnessApp,
    tech: ["React", "Tailwind CSS", "TypeScript", "Chatbot Integration"],
    category: "frontend",
    github: "https://github.com/abhay707/Fit_Labs.git",
    demo: "https://fit-labs.vercel.app/",
  },
];

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md group hover:shadow-xl transition-shadow duration-300 animate-fade-in">
      <div className="h-56 overflow-hidden relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" asChild>
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" />
                Live Demo
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-1 h-4 w-4" />
                Code
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="bg-purple/10 text-purple px-2 py-1 rounded text-xs"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center text-gray-500">
          <span className="text-xs capitalize bg-gray-100 dark:bg-gray-700 py-1 px-2 rounded">
            {project.category}
          </span>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredProjects =
    activeTab === "all"
      ? projectsData
      : projectsData.filter((project) => project.category === activeTab);

  return (
    <PageTransition background="particles" >
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">My Projects</h1>
            <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Here are some of the projects I've worked on. Each project is
              unique and showcases different skills and technologies.
            </p>
          </div>

          <Tabs
            defaultValue="all"
            className="mb-12"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="fullstack">Full Stack</TabsTrigger>
                <TabsTrigger value="others">Others</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="frontend" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="backend" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fullstack" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="others" className="animate-fade-in">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Projects;
