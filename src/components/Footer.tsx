
import React from 'react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} DevPortfolio. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="https://github.com/abhay707" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://www.linkedin.com/in/abhay-chaturvedi7/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a 
              href="mailto:abhx1437@gmail.com" 
              className="social-icon"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
