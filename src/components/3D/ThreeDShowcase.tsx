
import React from 'react';
import { motion } from 'framer-motion';
import ThreeDModel from './ThreeDModel';
import { useToast } from '@/hooks/use-toast';

// Updated models with fallbacks and enhanced backgrounds
const MODELS = [
  {
    id: 'laptop',
    name: 'Developer Laptop',
    description: 'Interactive 3D model of a development workstation',
    path: '/models/laptop.glb', // Local path (will use fallback if not available)
    fallbackShape: 'box' as const,
    scale: 0.4,
    position: [0, -0.5, 0] as [number, number, number],
    bgColor: 'rgba(110, 89, 165, 0.1)',
    backgroundType: 'stars' as const
  },
  {
    id: 'rocket',
    name: 'Project Launch',
    description: 'Representing successful project deployments',
    path: '/models/rocket.glb', // Local path (will use fallback if not available)
    fallbackShape: 'torus' as const,
    scale: 0.8,
    position: [0, -1, 0] as [number, number, number],
    bgColor: 'rgba(110, 89, 165, 0.05)',
    backgroundType: 'clouds' as const
  },
  {
    id: 'phone',
    name: 'Mobile Development',
    description: 'Responsive designs for all devices',
    path: '/models/phone.glb', // Local path (will use fallback if not available)
    fallbackShape: 'sphere' as const,
    scale: 1,
    position: [0, 0, 0] as [number, number, number],
    bgColor: 'rgba(110, 89, 165, 0.1)',
    backgroundType: 'minimal' as const
  }
];

const ThreeDShowcase: React.FC = () => {
  const toast = useToast();
  
  React.useEffect(() => {
    // Informational toast about 3D models
    toast({
      title: "3D Models Loading",
      description: "You can interact with models by dragging to rotate",
    });
  }, [toast]);
  
  return (
    <section id="3d-showcase" className="py-16">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Portfolio</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore my work through these interactive 3D models. Drag to rotate and interact with each model.
          </p>
          <div className="w-20 h-1 bg-purple mx-auto mt-4"></div>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {MODELS.map((model, index) => (
            <motion.div
              key={model.id}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="aspect-square">
                <ThreeDModel 
                  modelPath={model.path}
                  scale={model.scale}
                  position={model.position}
                  backgroundColor={model.bgColor}
                  height="100%"
                  fallbackShape={model.fallbackShape}
                  backgroundType={model.backgroundType}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{model.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{model.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreeDShowcase;
