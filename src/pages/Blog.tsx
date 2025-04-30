
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  image?: string;
}

const Blog = () => {
  const [posts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "How to Build a Responsive Portfolio Website with React and Tailwind",
      excerpt: "Learn how to create a professional portfolio website that looks great on all devices using React and Tailwind CSS.",
      date: "April 10, 2023",
      readTime: "8 min read",
      category: "Web Development",
      slug: "responsive-portfolio-website",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
    },
    {
      id: 2,
      title: "Understanding TypeScript Generics for Better Code",
      excerpt: "A deep dive into TypeScript generics and how they can help you write more reusable and type-safe code.",
      date: "March 22, 2023",
      readTime: "12 min read",
      category: "TypeScript",
      slug: "typescript-generics",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713"
    },
    {
      id: 3,
      title: "State Management in Modern React Applications",
      excerpt: "Explore different state management solutions for React applications and when to use each one.",
      date: "February 15, 2023",
      readTime: "10 min read",
      category: "React",
      slug: "react-state-management",
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159"
    }
  ]);

  return (
    <PageTransition background="gradient" color="#7E69AB">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
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
              Thoughts, tutorials, and insights about web development and programming
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {posts.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.2 * index + 0.5,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                  {post.image && (
                    <motion.div 
                      className="relative h-48 w-full overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={`${post.image}?auto=format&fit=crop&w=600&h=300`}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <motion.div 
                        className="absolute top-4 left-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 * index + 0.7 }}
                      >
                        <Badge variant="secondary" className="bg-purple text-white hover:bg-purple-light">
                          {post.category}
                        </Badge>
                      </motion.div>
                    </motion.div>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl leading-tight hover:text-purple transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-3 text-xs mt-2">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {post.readTime}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {post.excerpt}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-purple hover:text-purple-light transition-colors text-sm flex items-center"
                      >
                        Read more 
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Blog;
