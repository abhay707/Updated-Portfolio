
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Music, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";

// Sample music tracks - in a real app, you would use actual audio files
const SAMPLE_TRACKS = [
  {
    id: 1,
    title: "BADDERS",
    artist: "PEEKABOO, Flowdan & Skrillex",
    file: "/src/music/Music_1.mp3", // Placeholder path
    cover: "/src/Img/Music/Music_1_Cover.jpg"
  },
  {
    id: 2,
    title: "Wrath",
    artist: "Freddie Dredd",
    file: "/src/music/Music_2.mp3", // Using same file as placeholder
    cover: "/src/Img/Music/Music_2_Cover.png"
  },
  {
    id: 3,
    title: "Drop It Like It's Hot!",
    artist: "Haarper & Luga",
    file: "/src/music/Music_3.mp3", // Using same file as placeholder
    cover: "/src/Img/Music/Music_3_Cover.png"
  },
  {
    id: 4,
    title: "9mm",
    artist: "Memphis Cult, Groove Dealers & SPLYXER",
    file: "/src/music/Music_4.mp3", // Using same file as placeholder
    cover: "/src/Img/Music/Music_4_Cover.png"
  },
  {
    id: 5,
    title: "Rave",
    artist: "Lane 8",
    file: "/src/music/Music_5.mp3", // Using same file as placeholder
    cover: "/src/Img/Music/Music_5_Cover.png"
  },
  {
    id: 6,
    title: "Feel",
    artist: "Misanthrop",
    file: "/src/music/Music_6.mp3", // Using same file as placeholder
    cover: "/src/Img/Music/Music_6_Cover.png"
  }
];

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = SAMPLE_TRACKS[currentTrackIndex];

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(currentTrack.file);
    audioRef.current.volume = volume;
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      if (audio) setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      if (audio) setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      handleNextTrack();
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
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

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
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };
  
  const handlePrevTrack = () => {
    const newIndex = (currentTrackIndex - 1 + SAMPLE_TRACKS.length) % SAMPLE_TRACKS.length;
    changeTrack(newIndex);
  };
  
  const handleNextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % SAMPLE_TRACKS.length;
    changeTrack(newIndex);
  };
  
  const changeTrack = (newIndex: number) => {
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    setCurrentTrackIndex(newIndex);
    setCurrentTime(0);
    
    // The new audio will be set up in the useEffect
    // If the previous track was playing, start playing the new track
    setTimeout(() => {
      if (wasPlaying && audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
        });
        setIsPlaying(true);
      }
    }, 100);
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
        isExpanded ? "w-72 rounded-xl p-3" : "w-12 h-12"
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
              <Avatar className="w-10 h-10 mr-3 ring-1 ring-purple">
                <AvatarImage src={currentTrack.cover} alt={currentTrack.title} />
                <AvatarFallback className="bg-purple text-white">
                  <Music size={16} />
                </AvatarFallback>
              </Avatar>
              
              <div className="text-sm truncate">
                <div className="font-medium">{currentTrack.title}</div>
                <div className="text-xs text-gray-500">{currentTrack.artist}</div>
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
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handlePrevTrack}
              >
                <SkipBack size={16} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 mx-1" 
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleNextTrack}
              >
                <SkipForward size={16} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </Button>
              <Slider 
                value={[isMuted ? 0 : volume]} 
                min={0}
                max={1}
                step={0.05}
                onValueChange={handleVolumeChange}
                className="w-16 h-1.5"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MusicPlayer;
