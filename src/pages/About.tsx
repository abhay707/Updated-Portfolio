
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Front_Image from "../Img/About_1.jpg";
import CV from "../Img/Abhay_CV.pdf";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PageTransition from "@/components/PageTransition";

interface SkillBarProps {
  name: string;
  percentage: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, percentage }) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const isInViewport = useInViewport(progressRef);

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <span className="font-medium">{name}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          ref={progressRef}
          className="bg-purple rounded-full h-2"
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

// Custom hook to detect if element is in viewport
function useInViewport(ref: React.RefObject<Element>) {
  const [isIntersecting, setIntersecting] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref]);

  return isIntersecting;
}

interface TechIconProps {
  name: string;
  icon: string;
  index: number;
}

const TechIcon: React.FC<TechIconProps> = ({ name, icon, index }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
          >
            <div className="w-16 h-16 flex items-center justify-center mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img src={icon} alt={name} className="w-10 h-10 object-contain" />
            </div>
            <span className="text-xs font-medium">{name}</span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const About = () => {
  const frontendSkills = [
    { name: "React", percentage: 90 },
    { name: "JavaScript / TypeScript", percentage: 85 },
    { name: "HTML & CSS", percentage: 95 },
    { name: "Tailwind CSS", percentage: 85 },
  ];

  const backendSkills = [
    { name: "Node.js", percentage: 80 },
    { name: "Express.js", percentage: 85 },
    { name: "MongoDB", percentage: 75 },
    { name: "PostgreSQL", percentage: 70 },
  ];

  const techIcons = [
    {
      name: "React",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    },
    {
      name: "TypeScript",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    },
    {
      name: "Node.js",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    },
    {
      name: "MongoDB",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    },
    {
      name: "PostgreSQL",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    },
    {
      name: "AWS",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    },
    {
      name: "Docker",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    },
    {
      name: "Git",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    },
  ];

  return (
    <PageTransition background="gradient">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* About Me Section */}
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-4">About Me</h1>
              <div className="w-20 h-1 bg-purple mx-auto"></div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div 
                  className="border-4 border-purple dark:border-purple-light rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <img
                    src={Front_Image}
                    alt="Abhay Chaturvedi"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div 
                  className="absolute -bottom-6 -right-6 w-24 h-24 bg-purple rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 10,
                    delay: 0.4
                  }}
                >
                  <motion.span 
                    className="text-white font-bold"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  >
                    2+ Years
                  </motion.span>
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold">Abhay Chaturvedi</h2>
                <h3 className="text-xl text-purple">Full Stack Web Developer</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I'm a dedicated Full Stack Developer with over 2 years of
                  professional experience building web applications. I specialize
                  in React, Node.js, and TypeScript to create responsive and
                  performant web experiences.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  My experience spans from startups to enterprise clients,
                  focusing on creating scalable solutions with clean code and
                  excellent user experiences.
                </p>

                <motion.div 
                  className="grid grid-cols-2 gap-4 text-sm mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div>
                    <span className="font-medium">Name:</span> Abhay Chaturvedi
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> abhx1437@gmail.com
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> Punjab, India
                  </div>
                  <div>
                    <span className="font-medium">Degree:</span> B.Tech Computer
                    Science
                  </div>
                </motion.div>

                <motion.div 
                  className="pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <a href={CV} download>
                    <Button className="bg-purple hover:bg-purple-light flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Download CV
                    </Button>
                  </a>
                </motion.div>
              </motion.div>
            </div>

            {/* Skills Section */}
            <motion.div 
              className="mb-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2 
                className="text-3xl font-bold text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                My Skills
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-10 mb-10">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <motion.span 
                      className="w-8 h-1 bg-purple mr-3"
                      initial={{ width: 0 }}
                      whileInView={{ width: "2rem" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    ></motion.span>
                    Frontend Development
                  </h3>

                  {frontendSkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <SkillBar
                        name={skill.name}
                        percentage={skill.percentage}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <motion.span 
                      className="w-8 h-1 bg-purple mr-3"
                      initial={{ width: 0 }}
                      whileInView={{ width: "2rem" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    ></motion.span>
                    Backend Development
                  </h3>

                  {backendSkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <SkillBar
                        name={skill.name}
                        percentage={skill.percentage}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Tech Stack */}
              <motion.h3 
                className="text-xl font-bold mb-6 text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Technologies I Work With
              </motion.h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6 justify-items-center">
                {techIcons.map((tech, index) => (
                  <TechIcon key={tech.name} name={tech.name} icon={tech.icon} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Fun Fact */}
            <motion.div 
              className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
            >
              <h3 className="text-xl font-bold mb-4">Fun Fact</h3>
              <p className="text-gray-700 dark:text-gray-300">
                When I'm not coding, you can find me hiking in the mountains or
                experimenting with new coffee brewing techniques.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
