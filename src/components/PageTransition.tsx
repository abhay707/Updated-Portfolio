
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParticlesBackground from './ParticlesBackground';

interface PageTransitionProps {
  children: React.ReactNode;
  background?: 'particles' | 'gradient' | 'none';
  color?: string;
  density?: number;
  disableAnimation?: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  background = 'particles',
  color = '#9b87f5',
  density = 100,
  disableAnimation = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      {background === 'particles' && (
        <ParticlesBackground color={color} density={density} />
      )}
      
      {background === 'gradient' && (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-purple/5 opacity-70" />
      )}
      
      {!disableAnimation ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative z-0"
        >
          {children}
        </motion.div>
      ) : (
        <div className="relative z-0">{children}</div>
      )}
    </div>
  );
};

export default PageTransition;
