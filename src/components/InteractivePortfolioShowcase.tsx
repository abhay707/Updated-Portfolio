
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

// Portfolio project type definition
interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  category: 'frontend' | 'backend' | 'fullstack';
  links?: {
    demo?: string;
    github?: string;
    case?: string;
  };
}

// Portfolio showcase data
const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'dev-workstation',
    title: 'Developer Workstation',
    description: 'Development environment setup',
    longDescription: 'A comprehensive development environment with customized tooling and configurations for optimal productivity.',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1470&auto=format&fit=crop',
    technologies: ['VS Code', 'Terminal', 'Git', 'Docker'],
    category: 'frontend',
    links: {
      demo: 'https://example.com/demo',
      github: 'https://github.com/example/workstation',
    }
  },
  {
    id: 'project-launch',
    title: 'Project Launch Platform',
    description: 'Deployment automation system',
    longDescription: 'An automated CI/CD pipeline that streamlines the deployment process from development to production environments.',
    image: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=1374&auto=format&fit=crop',
    technologies: ['CI/CD', 'Docker', 'AWS', 'GitHub Actions'],
    category: 'backend',
    links: {
      demo: 'https://example.com/demo',
      github: 'https://github.com/example/launch',
      case: 'https://example.com/case-study'
    }
  },
  {
    id: 'mobile-development',
    title: 'Mobile Development',
    description: 'Cross-platform mobile solutions',
    longDescription: 'Responsive and intuitive mobile applications that work seamlessly across iOS and Android platforms.',
    image: 'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=1524&auto=format&fit=crop',
    technologies: ['React Native', 'Flutter', 'Firebase', 'Redux'],
    category: 'fullstack',
    links: {
      github: 'https://github.com/example/mobile',
      case: 'https://example.com/case-study'
    }
  }
];

const InteractivePortfolioShowcase: React.FC = () => {
  const { toast } = useToast();

  // Function to handle clicking on project links
  const handleProjectLinkClick = (projectTitle: string, linkType: string) => {
    toast({
      title: `Accessing ${linkType}`,
      description: `Opening ${linkType} for ${projectTitle}`,
    });
  };

  return (
    <section id="interactive-portfolio" className="py-16">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Portfolio</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore my work through these interactive project cards. Hover to see animations and click for more details.
          </p>
          <div className="w-20 h-1 bg-purple mx-auto mt-4"></div>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow overflow-hidden flex flex-col">
                <motion.div 
                  className="relative h-48 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4 w-full">
                      <Badge className="mb-2" variant={
                        project.category === 'frontend' ? 'default' : 
                        project.category === 'backend' ? 'secondary' : 'outline'
                      }>
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
                
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {project.longDescription}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <Badge key={tech} variant="secondary" className="bg-purple/10 text-purple">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between gap-2">
                  {project.links?.demo && (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleProjectLinkClick(project.title, 'demo')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" /> Demo
                    </Button>
                  )}
                  
                  {project.links?.github && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleProjectLinkClick(project.title, 'code')}
                    >
                      <Github className="h-4 w-4 mr-2" /> Code
                    </Button>
                  )}
                  
                  {project.links?.case && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => handleProjectLinkClick(project.title, 'case study')}
                    >
                      <Code className="h-4 w-4 mr-2" /> Case Study
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractivePortfolioShowcase;
