import React, { useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeImg from '../Img/Home1.jpg';
import PageTransition from '@/components/PageTransition';
import InteractivePortfolioShowcase from '@/components/InteractivePortfolioShowcase';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length && isTyping) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      
      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length) {
      setIsTyping(false);
    }
  }, [currentIndex, text, isTyping]);

  return (
    <div className="relative">
      <span className="text-xl md:text-2xl font-light">
        {displayText}
        <span className={`inline-block w-1 h-6 bg-purple ml-1 ${isTyping ? 'animate-blink' : 'opacity-0'}`}></span>
      </span>
    </div>
  );
};

const Hero = () => {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('about-preview');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4">      
      <div className="container max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="mb-6 w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mx-auto border-4 border-purple shadow-xl"
            animate={{ 
              y: [0, -20, 0],
              boxShadow: [
                "0 10px 15px -3px rgba(110, 89, 165, 0.3)",
                "0 15px 25px -5px rgba(110, 89, 165, 0.5)",
                "0 10px 15px -3px rgba(110, 89, 165, 0.3)"
              ]
            }}
            transition={{ 
              duration: 6, 
              ease: "easeInOut",
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <img 
              src={HomeImg}
              alt="Developer Profile" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Abhay <span className="text-purple">Chaturvedi</span>
          </motion.h1>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Full Stack Web Developer
          </motion.h2>
          
          <motion.div 
            className="mb-10 h-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <TypewriterText text="Building elegant web solutions with modern technologies." />
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button asChild className="bg-purple hover:bg-purple-light">
              <Link to="/contact">Get In Touch</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/projects">View Projects</Link>
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          onClick={scrollToNextSection}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          <span className="sr-only">Scroll Down</span>
        </motion.div>
      </div>
    </section>
  );
};

const AboutPreview = () => {
  return (
    <section id="about-preview" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-purple mx-auto"></div>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg">
              I'm a passionate Full Stack Developer with expertise in building modern web applications using React, Node.js, and other cutting-edge technologies.
            </p>
            <p>
              With 5+ years of professional experience, I enjoy crafting user-friendly interfaces and scalable backend solutions for clients ranging from startups to enterprise companies.
            </p>
            <Button asChild>
              <Link to="/about">Learn More About Me</Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'GraphQL'].map((tech, index) => (
              <motion.div 
                key={tech} 
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center transform hover:scale-105 transition-transform card-hover"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <span className="block text-purple font-medium">{tech}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ProjectsPreview = () => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured online store with payment processing',
      image: 'https://images.unsplash.com/photo-1661956602868-6ae368943878',
      tech: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task tracking application with real-time updates',
      image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
      tech: ['React', 'Firebase', 'Tailwind']
    }
  ];
  
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Projects</h2>
          <div className="w-20 h-1 bg-purple mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project) => (
            <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="bg-purple/10 text-purple px-2 py-1 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/projects">View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button asChild>
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const ContactPreview = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
        <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
        <p className="max-w-lg mx-auto mb-8">
          Have a project in mind or want to discuss potential opportunities? I'm always open to new challenges and collaborations.
        </p>
        <Button size="lg" asChild className="bg-purple hover:bg-purple-light">
          <Link to="/contact">Get In Touch</Link>
        </Button>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <PageTransition background="particles" density={120}>
      <Hero />
      <InteractivePortfolioShowcase />
      <AboutPreview />
      <ProjectsPreview />
      <ContactPreview />
    </PageTransition>
  );
};

export default Home;
