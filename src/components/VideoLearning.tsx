import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MUZZY_LINES, MuzzyLine } from '../data/lines';
import { ArrowLeft, Play, Pause, Repeat } from 'lucide-react';

interface VideoLearningProps {
  stageId: number;
  onBack: () => void;
}

export default function VideoLearning({ stageId, onBack }: VideoLearningProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);

  const stageLines = MUZZY_LINES.filter(l => l.stage === stageId);
  const currentLine = stageLines.find(l => 
    currentTime >= (l.startTime || 0) && currentTime <= (l.endTime || 0)
  );

  useEffect(() => {
    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: 'vWkxc9r18U0', // Example: Big Muzzy Part 1
        playerVars: {
          playsinline: 1,
          controls: 0,
          rel: 0,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startTracking();
            } else {
              setIsPlaying(false);
              stopTracking();
            }
          }
        }
      });
    };

    return () => stopTracking();
  }, []);

  const startTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 100);
  };

  const stopTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  };

  const seekToLine = (line: MuzzyLine) => {
    if (line.startTime !== undefined) {
      playerRef.current?.seekTo(line.startTime, true);
      playerRef.current?.playVideo();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 md:p-8 h-screen">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-md kawaii-btn">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">📺 原声影院练习</h2>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        {/* Video Side */}
        <div className="flex-[2] flex flex-col gap-4">
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white">
            <div id="youtube-player" className="w-full h-full" />
            
            {/* Custom Controls Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
               <button onClick={togglePlay} className="p-4 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md text-white transition-all">
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-current" />}
              </button>
            </div>
          </div>

          {/* Current Subtitle Banner */}
          <div className="bg-white/90 p-6 rounded-3xl border-4 border-brand-pink shadow-lg min-h-[120px] flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {currentLine ? (
                <motion.div
                  key={currentLine.order}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="space-y-2"
                >
                  <p className="text-3xl font-bold text-gray-800 tracking-wide font-sans">{currentLine.english}</p>
                  <p className="text-pink-500 font-bold">{currentLine.chinese}</p>
                </motion.div>
              ) : (
                <p className="text-gray-300 font-bold italic">观看视频，对应台词会在这里出现哦 ✨</p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Script Side */}
        <div className="flex-1 bg-white/50 backdrop-blur-sm rounded-3xl border-4 border-white shadow-xl overflow-hidden flex flex-col">
          <div className="p-4 bg-brand-blue/30 border-b-2 border-white font-bold text-blue-800 flex items-center justify-between">
            <span>本关剧本清单</span>
            <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">{stageLines.length} 句</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {stageLines.map(line => (
              <button
                key={line.order}
                onClick={() => seekToLine(line)}
                className={`
                  w-full text-left p-3 rounded-2xl transition-all border-2 
                  ${currentLine?.order === line.order 
                    ? 'bg-brand-pink border-brand-pink shadow-md scale-105 z-10' 
                    : 'bg-white border-transparent hover:border-brand-pink/30 hover:bg-white/80'}
                `}
              >
                <div className={`text-sm font-bold ${currentLine?.order === line.order ? 'text-pink-900' : 'text-gray-700'}`}>
                  {line.english}
                </div>
                <div className={`text-xs opacity-60 ${currentLine?.order === line.order ? 'text-pink-800' : 'text-gray-400'}`}>
                  {line.chinese}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
