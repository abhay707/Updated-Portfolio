
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Quote } from 'lucide-react';

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
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Client Testimonials</h1>
          <div className="w-20 h-1 bg-purple mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            What clients and colleagues have to say about working with me
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="transform transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-purple/10 flex items-center justify-center text-purple">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {testimonial.position} at {testimonial.company}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill={i < testimonial.rating ? "currentColor" : "none"} 
                      stroke={i < testimonial.rating ? "none" : "currentColor"}
                      className="w-4 h-4"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  ))}
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 text-purple/20 h-8 w-8" />
                  <p className="text-gray-600 dark:text-gray-300 pl-6 pt-2">{testimonial.text}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Want to provide a testimonial? 
            <Link to="/contact" className="text-purple hover:text-purple-light ml-1">
              Contact me
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
