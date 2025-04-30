
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Quote } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  text: string;
  rating: number;
}

const Testimonials = () => {
  const [testimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Project Manager",
      company: "TechCorp",
      text: "Working with this developer was a fantastic experience. Their attention to detail and ability to translate our vision into reality exceeded our expectations.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "CTO",
      company: "StartupXYZ",
      text: "Exceptional work on our web application. The developer not only delivered on time but also suggested valuable improvements that enhanced the overall user experience.",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      position: "Marketing Director",
      company: "Creative Solutions",
      text: "The portfolio website developed for our agency has received countless compliments. Clean code, responsive design, and excellent communication throughout the project.",
      rating: 4
    }
  ]);

  return (
    <PageTransition background="particles" color="#6E59A5" density={80}>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">Client Testimonials</h1>
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
              What clients and colleagues have to say about working with me
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  show: { opacity: 1, y: 0 }
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                <Card className="transform transition-all duration-300 hover:shadow-lg h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="h-10 w-10 rounded-full bg-purple/10 flex items-center justify-center text-purple"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <User className="h-5 w-5" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {testimonial.position} at {testimonial.company}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="flex mb-4 text-yellow-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill={i < testimonial.rating ? "currentColor" : "none"} 
                          stroke={i < testimonial.rating ? "none" : "currentColor"}
                          className="w-4 h-4"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </motion.svg>
                      ))}
                    </motion.div>
                    <motion.div 
                      className="relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Quote className="absolute -top-2 -left-2 text-purple/20 h-8 w-8" />
                      <p className="text-gray-600 dark:text-gray-300 pl-6 pt-2">{testimonial.text}</p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <p className="text-gray-500 dark:text-gray-400">
              Want to provide a testimonial? 
              <Link to="/contact" className="text-purple hover:text-purple-light ml-1">
                Contact me
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Testimonials;
