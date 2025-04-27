
import React, { useEffect, useRef } from 'react';
import { Briefcase, School, Calendar } from 'lucide-react';

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
      title: 'Senior Full Stack Developer',
      organization: 'Tech Innovations Inc.',
      date: 'Jan 2022 - Present',
      description: [
        'Lead a team of 5 developers to build and maintain multiple client projects',
        'Architected and implemented a scalable e-commerce platform serving over 100K monthly users',
        'Improved application performance by 40% through code optimization and database restructuring',
        'Implemented CI/CD pipeline reducing deployment time by 60%'
      ],
      type: 'work'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      organization: 'Digital Solutions LLC',
      date: 'Jun 2019 - Dec 2021',
      description: [
        'Developed responsive web applications using React.js and Node.js',
        'Designed and implemented RESTful APIs and GraphQL endpoints',
        'Collaborated with UX/UI designers to implement user-friendly interfaces',
        'Participated in agile development processes and sprint planning'
      ],
      type: 'work'
    },
    {
      id: 3,
      title: 'Frontend Developer',
      organization: 'WebCraft Studios',
      date: 'Aug 2017 - May 2019',
      description: [
        'Created responsive and interactive user interfaces using JavaScript and CSS',
        'Worked with design team to translate mockups into functional web pages',
        'Optimized website performance and accessibility',
        'Implemented tracking and analytics features'
      ],
      type: 'work'
    },
    {
      id: 4,
      title: 'Master of Computer Science',
      organization: 'Tech University',
      date: '2015 - 2017',
      description: [
        'Specialized in Web Technologies and Distributed Systems',
        'Graduated with distinction (3.9 GPA)',
        'Thesis: "Performance Optimization Techniques for Modern Web Applications"'
      ],
      type: 'education'
    },
    {
      id: 5,
      title: 'Bachelor of Science in Computer Science',
      organization: 'State University',
      date: '2011 - 2015',
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
    
    return (
      <div 
        ref={itemRef}
        className={`timeline-item ${isInViewport ? 'animate-fade-in' : 'opacity-0'}`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="timeline-dot">
          <span className="absolute top-0 left-0 w-full h-full rounded-full bg-purple scale-0 transition-transform duration-500" 
            style={{ transform: isInViewport ? 'scale(1)' : 'scale(0)' }}
          />
        </div>
        
        <div className="timeline-content">
          <div className="flex gap-2 items-center mb-2">
            {item.type === 'work' ? (
              <Briefcase size={18} className="text-purple" />
            ) : (
              <School size={18} className="text-purple" />
            )}
            <h3 className="font-bold text-lg">{item.title}</h3>
          </div>
          
          <h4 className="font-medium text-purple mb-1">{item.organization}</h4>
          
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Calendar size={14} className="mr-1" />
            <span>{item.date}</span>
          </div>
          
          <ul className="list-disc ml-4 space-y-1">
            {item.description.map((point, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Experience & Education</h1>
            <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
              My professional journey and educational background that have shaped my career as a Full Stack Developer.
            </p>
          </div>
          
          <div className="relative mt-16 pl-6">
            {/* Main timeline line */}
            <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {timelineData.map((item, index) => (
                <TimelineItemComponent key={item.id} item={item} index={index} />
              ))}
            </div>
            
            {/* Timeline end */}
            <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2">
              <div className="w-3 h-3 rounded-full bg-purple"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experience;
