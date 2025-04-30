
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  pulse: boolean;
  pulseSpeed: number;
}

interface ParticlesBackgroundProps {
  color?: string;
  density?: number;
  speed?: number;
  interactive?: boolean;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  color = '#9b87f5', // Default purple color
  density = 100,
  speed = 1,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useRef<{x: number, y: number} | null>(null);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particles.current = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), density);
      
      for (let i = 0; i < particleCount; i++) {
        const opacity = Math.random() * 0.5 + 0.1;
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() * 1 - 0.5) * speed,
          speedY: (Math.random() * 1 - 0.5) * speed,
          color: color,
          opacity: opacity,
          pulse: Math.random() > 0.5,
          pulseSpeed: Math.random() * 0.02 + 0.005
        });
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (interactive) {
        mousePosition.current = {
          x: event.clientX,
          y: event.clientY
        };
      }
    };

    const handleMouseLeave = () => {
      mousePosition.current = null;
    };

    // Set up events
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap particles around the screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Pulse effect
        if (particle.pulse) {
          particle.opacity += particle.pulseSpeed;
          if (particle.opacity >= 0.5 || particle.opacity <= 0.1) {
            particle.pulseSpeed = -particle.pulseSpeed;
          }
        }

        // Interactive effect with mouse
        if (mousePosition.current) {
          const dx = mousePosition.current.x - particle.x;
          const dy = mousePosition.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const angle = Math.atan2(dy, dx);
            const force = (100 - distance) / 1500;
            particle.x -= Math.cos(angle) * force * 5;
            particle.y -= Math.sin(angle) * force * 5;
          }
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
        
        // Connect particles that are close to each other
        for (let j = index + 1; j < particles.current.length; j++) {
          const dx = particles.current[j].x - particle.x;
          const dy = particles.current[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.3;
            ctx.beginPath();
            ctx.strokeStyle = `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.stroke();
          }
        }
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [color, density, speed, interactive]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-70 dark:opacity-40"
    />
  );
};

export default ParticlesBackground;
