
import React, { useEffect, useRef } from 'react';
import { Briefcase, School, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

interface TimelineItem {
  id: number;
  title: string;
  organization: string;
  date: string;
  description: string[];
  type: 'work' | 'education';
}

const Experience = () => {
  const timelineData: TimelineItem[] = [
    {
      id: 1,
      title: 'Robotic Programming Intern',
      organization: 'Moonpreneur',
      date: 'Feb 2025 - Present',
      description: [
        'Work as robotic programming intern',
        'Developed a robotic arm using Arduino and Python',
        'Collaborated with a team to design and implement robotic solutions',
        'Conducted research on advanced robotic technologies'
      ],
      type: 'work'
    },
    {
      id: 2,
      title: 'Bachelor of Science in Computer Science',
      organization: 'Lovely Professional Univeristy',
      date: '2022 - 2026',
      description: [
        'Focused on Software Engineering and Database Systems',
        'Dean\'s List for all semesters',
        'Senior Project: Developed a real-time collaboration platform'
      ],
      type: 'education'
    }
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
  
  const TimelineItemComponent = ({ item, index }: { item: TimelineItem; index: number }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    const isInViewport = useInViewport(itemRef);
    
    const variants = {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    };
    
    return (
      <motion.div 
        ref={itemRef}
        className="timeline-item"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={variants}
        transition={{ duration: 0.6, delay: index * 0.2 }}
      >
        <motion.div 
          className="timeline-dot"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            delay: index * 0.2 + 0.3 
          }}
        >
          <motion.span 
            className="absolute top-0 left-0 w-full h-full rounded-full bg-purple"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(110, 89, 165, 0.4)",
                "0 0 0 10px rgba(110, 89, 165, 0)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        
        <motion.div 
          className="timeline-content"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex gap-2 items-center mb-2">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.type === 'work' ? (
                <Briefcase size={18} className="text-purple" />
              ) : (
                <School size={18} className="text-purple" />
              )}
            </motion.div>
            <h3 className="font-bold text-lg">{item.title}</h3>
          </div>
          
          <h4 className="font-medium text-purple mb-1">{item.organization}</h4>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Calendar size={14} className="mr-1" />
            <span>{item.date}</span>
          </div>
          
          <motion.ul 
            className="list-disc ml-4 space-y-1"
          >
            {item.description.map((point, idx) => (
              <motion.li 
                key={idx} 
                className="text-gray-700 dark:text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.1 }}
              >
                {point}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <PageTransition background="particles" color="#33C3F0">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-4">Experience & Education</h1>
              <motion.div 
                className="w-0 h-1 bg-purple mx-auto mb-6"
                animate={{ width: "5rem" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              ></motion.div>
              <motion.p 
                className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                My professional journey and educational background that have shaped my career as a Full Stack Developer.
              </motion.p>
            </motion.div>
            
            <div className="relative mt-16 pl-6">
              {/* Main timeline line */}
              <motion.div 
                className="absolute left-0 top-0 w-0.5 bg-gray-300 dark:bg-gray-700"
                style={{ height: '0%' }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.5 }}
              ></motion.div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {timelineData.map((item, index) => (
                  <TimelineItemComponent key={item.id} item={item} index={index} />
                ))}
              </div>
              
              {/* Timeline end */}
              <motion.div 
                className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                <motion.div 
                  className="w-3 h-3 rounded-full bg-purple"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(110, 89, 165, 0.4)",
                      "0 0 0 10px rgba(110, 89, 165, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                ></motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Experience;
