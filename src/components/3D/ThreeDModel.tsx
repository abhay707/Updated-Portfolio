
import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Environment, Float, Box, Sphere, Torus } from '@react-three/drei';
import { Group } from 'three';
import { ErrorBoundary } from 'react-error-boundary';

// Add fallback component for when 3D models fail to load
const ModelFallback = ({ shape = 'box', color = 'purple' }: { shape?: 'box' | 'sphere' | 'torus'; color?: string }) => {
  const ref = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={ref}>
      {shape === 'box' && <Box args={[1, 1, 1]}><meshStandardMaterial color={color} /></Box>}
      {shape === 'sphere' && <Sphere args={[0.8, 32, 32]}><meshStandardMaterial color={color} /></Sphere>}
      {shape === 'torus' && <Torus args={[0.6, 0.2, 16, 32]}><meshStandardMaterial color={color} /></Torus>}
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
  
  // Custom error handler for GLTF loading
  const handleError = () => {
    console.error(`Failed to load model from: ${path}`);
    setHasError(true);
  };
  
  let gltf;
  try {
    gltf = useGLTF(path, undefined, handleError);
  } catch (error) {
    console.error('GLTF loading error:', error);
    return <ModelFallback shape={fallbackShape} />;
  }
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  if (hasError) {
    return <ModelFallback shape={fallbackShape} />;
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  );
}

interface ThreeDModelProps {
  modelPath: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  backgroundColor?: string;
  height?: string;
  fallbackShape?: 'box' | 'sphere' | 'torus';
}

const ThreeDModel: React.FC<ThreeDModelProps> = ({
  modelPath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  backgroundColor = 'transparent',
  height = '400px',
  fallbackShape = 'box'
}) => {
  return (
    <div className="w-full" style={{ height, background: backgroundColor }}>
      <ErrorBoundary fallback={<div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg">Failed to load 3D model</div>}>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
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
            <Environment preset="city" />
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
