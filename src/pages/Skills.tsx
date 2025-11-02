
import React, { useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import PageTransition from '@/components/PageTransition';

interface SkillCategory {
  title: string;
  skills: {
    name: string;
    icon: string;
    level: number;
  }[];
}

const Skills = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Frontend Development',
      skills: [
        { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', level: 95 },
        { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', level: 90 },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', level: 90 },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', level: 85 },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', level: 90 },
        { name: 'TailWind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', level: 85 },
        { name: 'Vue.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', level: 75 },
        { name: 'SASS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg', level: 80 },
      ]
    },
    {
      title: 'Backend Development',
      skills: [
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', level: 85 },
        { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', level: 85 },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', level: 70 },
        { name: 'PHP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', level: 65 },
        { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', level: 80 }
      ]
    },
    {
      title: 'Database',
      skills: [
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', level: 80 },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', level: 75 },
        { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', level: 70 },
        { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', level: 65 }
      ]
    },
    {
      title: 'DevOps & Tools',
      skills: [
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', level: 85 },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', level: 75 },
        { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', level: 70 },
        { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', level: 90 },
        { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', level: 95 }
      ]
    }
  ];

  const softSkills = [
    { name: 'Problem Solving', level: 95 },
    { name: 'Communication', level: 90 },
    { name: 'Teamwork', level: 85 },
    { name: 'Adaptability', level: 90 },
    { name: 'Time Management', level: 80 },
    { name: 'Creativity', level: 85 }
  ];

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

  // Animated Skill Item Component
  const AnimatedSkillItem = ({ name, icon, level }: { name: string; icon: string; level: number }) => {
    const progressRef = useRef<HTMLDivElement>(null);
    const isInViewport = useInViewport(progressRef);
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center mb-3">
          <img src={icon} alt={name} className="w-8 h-8 mr-3" />
          <h3 className="font-medium">{name}</h3>
        </div>
        <div ref={progressRef}>
          <Progress value={isInViewport ? level : 0} className="h-2" />
        </div>
        <div className="mt-1 text-right text-sm text-gray-600 dark:text-gray-400">
          {level}%
        </div>
      </div>
    );
  };

  // Soft Skill Item Component
  const SoftSkillItem = ({ name, level }: { name: string; level: number }) => {
    const progressRef = useRef<HTMLDivElement>(null);
    const isInViewport = useInViewport(progressRef);
    
    return (
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="font-medium">{name}</span>
          <span>{level}%</span>
        </div>
        <div ref={progressRef}>
          <Progress value={isInViewport ? level : 0} className="h-2" />
        </div>
      </div>
    );
  };

  return (
    <PageTransition background="particles" >
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">My Skills</h1>
            <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              Here's an overview of my technical skills and areas of expertise. I'm constantly learning and evolving to stay current with the latest technologies.
            </p>
          </div>
          
          {/* Technical Skills */}
          {skillCategories.map((category, index) => (
            <div key={category.title} className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <span className="w-8 h-1 bg-purple mr-3"></span>
                {category.title}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {category.skills.map((skill) => (
                  <AnimatedSkillItem 
                    key={skill.name} 
                    name={skill.name} 
                    icon={skill.icon} 
                    level={skill.level} 
                  />
                ))}
              </div>
            </div>
          ))}
          
          {/* Soft Skills */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <span className="w-8 h-1 bg-purple mr-3"></span>
              Soft Skills
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                {softSkills.slice(0, 3).map((skill) => (
                  <SoftSkillItem key={skill.name} name={skill.name} level={skill.level} />
                ))}
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                {softSkills.slice(3).map((skill) => (
                  <SoftSkillItem key={skill.name} name={skill.name} level={skill.level} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Learning Now */}
          <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">Currently Learning</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['Next.js', 'Svelte', 'Rust', 'Machine Learning'].map((tech) => (
                <div key={tech} className="bg-white dark:bg-gray-700 py-2 px-4 rounded-full text-sm font-medium">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Skills;
