
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';

// Sample music track - in a real app, you would use an actual audio file
const SAMPLE_TRACK = {
  title: "Ambient Melody",
  artist: "Abhay Chaturvedi"
};

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio('/music/ambient.mp3');
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio) setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      if (audio) setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (audio) audio.currentTime = 0;
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className={cn(
        "fixed left-4 bottom-4 z-30 bg-white dark:bg-gray-900 rounded-full shadow-lg transition-all",
        isExpanded ? "w-64 rounded-xl p-3" : "w-12 h-12"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {!isExpanded ? (
        <motion.button 
          className="w-12 h-12 rounded-full bg-purple text-white flex items-center justify-center hover:bg-purple-light transition-colors"
          onClick={toggleExpanded}
          whileTap={{ scale: 0.95 }}
        >
          <Music size={18} />
        </motion.button>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <button 
                className="w-8 h-8 rounded-full bg-purple text-white flex items-center justify-center mr-2 hover:bg-purple-light"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause size={14} />
                ) : (
                  <Play size={14} className="ml-0.5" />
                )}
              </button>
              <div className="text-sm truncate">
                <div className="font-medium">{SAMPLE_TRACK.title}</div>
                <div className="text-xs text-gray-500">{SAMPLE_TRACK.artist}</div>
              </div>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={toggleExpanded}
            >
              <Music size={16} />
            </button>
          </div>
          
          <div className="w-full mt-1">
            <Slider 
              value={[currentTime]} 
              max={duration || 100}
              step={1}
              onValueChange={handleSliderChange}
              className="w-full h-1.5"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MusicPlayer;
