
import React, { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  useGLTF, 
  Environment, 
  Float, 
  Box, 
  Sphere, 
  Torus, 
  Stars,
  Cloud,
  useTexture
} from '@react-three/drei';
import { Group, TextureLoader, DoubleSide } from 'three';
import { ErrorBoundary } from 'react-error-boundary';
import { useToast } from '@/hooks/use-toast';

// Add a background component for 3D scenes
const SceneBackground = ({ type = 'stars', color = '#050816' }) => {
  return (
    <>
      <color attach="background" args={[color]} />
      {type === 'stars' && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      {type === 'clouds' && (
        <>
          {/* Cloud component used correctly without count prop */}
          <Cloud position={[0, 0, -15]} speed={0.4} opacity={0.7} />
          <Cloud position={[10, 5, -10]} speed={0.2} opacity={0.5} />
          <Cloud position={[-10, -5, -15]} speed={0.3} opacity={0.6} />
          <fog attach="fog" args={['#050816', 10, 50]} />
        </>
      )}
      {type === 'minimal' && <fog attach="fog" args={[color, 15, 35]} />}
    </>
  );
};

// Enhanced fallback component for when 3D models fail to load
const ModelFallback = ({ shape = 'box', color = 'purple' }: { shape?: 'box' | 'sphere' | 'torus'; color?: string }) => {
  const ref = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });

  return (
    <group ref={ref}>
      {shape === 'box' && (
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
        </Box>
      )}
      {shape === 'sphere' && (
        <Sphere args={[0.8, 32, 32]}>
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
        </Sphere>
      )}
      {shape === 'torus' && (
        <Torus args={[0.6, 0.2, 16, 32]}>
          <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
        </Torus>
      )}
    </group>
  );
};

// A simple plane to serve as a platform for the model
const Platform = ({ size = 2, color = '#444444' }) => {
  return (
    <group position={[0, -1, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  );
};

interface ModelProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  fallbackShape?: 'box' | 'sphere' | 'torus';
}

function Model({ path, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], fallbackShape = 'box' }: ModelProps) {
  const groupRef = useRef<Group>(null);
  const [hasError, setHasError] = useState(false);
  const toast = useToast();
  
  // Using try/catch with useState for error handling
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Load model with proper error handling
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        console.log(`Loading model from path: ${path}`);
        
        // Check if the path is valid before loading
        if (!path || path === '') {
          throw new Error('Model path is empty');
        }
        
        const gltf = await useGLTF.load(path, undefined, (error) => {
          console.error('GLTF loading error:', error);
          setHasError(true);
          toast({
            title: "Failed to load 3D model",
            description: `Using fallback for ${path.split('/').pop()}`,
            variant: "destructive",
          });
        });
        
        if (!gltf || !gltf.scene) {
          throw new Error('Invalid GLTF model');
        }
        
        setModel(gltf);
        console.log(`Model loaded successfully: ${path}`);
      } catch (error) {
        console.error('Model loading error:', error);
        setHasError(true);
        toast({
          title: "Failed to load 3D model",
          description: "Using placeholder shape instead",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadModel();
    
    // Cleanup function
    return () => {
      useGLTF.clear(path);
    };
  }, [path, toast]);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  // Show fallback if loading failed
  if (hasError || !model) {
    console.log(`Showing fallback for ${path}:`, fallbackShape);
    return <ModelFallback shape={fallbackShape} />;
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={model.scene} />
    </group>
  );
}

// Prefetch all models to avoid loading issues
useGLTF.preload('/models/laptop.glb');
useGLTF.preload('/models/rocket.glb');
useGLTF.preload('/models/phone.glb');

interface ThreeDModelProps {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  backgroundColor?: string;
  height?: string;
  fallbackShape?: 'box' | 'sphere' | 'torus';
  backgroundType?: 'stars' | 'clouds' | 'minimal';
  showPlatform?: boolean;
  showEnvironment?: boolean;
}

const ThreeDModel: React.FC<ThreeDModelProps> = ({
  modelPath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  backgroundColor = 'transparent',
  height = '400px',
  fallbackShape = 'box',
  backgroundType = 'stars',
  showPlatform = true,
  showEnvironment = true
}) => {
  return (
    <div className="w-full relative rounded-xl overflow-hidden" style={{ height, background: backgroundColor }}>
      <ErrorBoundary fallback={
        <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center p-4">
            <p className="text-red-500 mb-2">Failed to load 3D model</p>
            <p className="text-sm text-gray-500">Falling back to placeholder</p>
          </div>
        </div>
      }>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          <SceneBackground type={backgroundType} />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Model 
                path={modelPath} 
                scale={scale} 
                position={position} 
                rotation={rotation}
                fallbackShape={fallbackShape} 
              />
            </Float>
            
            {showPlatform && <Platform />}
            {showEnvironment && <Environment preset="city" />}
          </Suspense>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default ThreeDModel;
