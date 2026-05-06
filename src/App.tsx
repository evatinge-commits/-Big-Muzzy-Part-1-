/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Mic2, 
  Star, 
  Droplet, 
  CheckCircle2, 
  RefreshCcw,
  Volume2,
  Trophy
} from 'lucide-react';
import { MUZZY_LINES, MuzzyLine } from './data/lines';

// Cartoon colors for word types
const COLORS = {
  subject: 'bg-[#b3e5fc] text-blue-800 border-blue-200', // Light Blue
  verb: 'bg-[#ffcdd2] text-red-800 border-red-200',    // Light Pink
  object: 'bg-[#fff9c4] text-yellow-800 border-yellow-200', // Light Yellow
  default: 'bg-[#e8f5e9] text-green-800 border-green-200',  // Light Green
};

// Character decorations (Emoji versions for simplicity, normally would be assets)
const CHARACTERS = {
  muzzy: '🦖',
  king: '🦁',
  queen: '👑',
  sylvia: '👸',
  corvax: '🧪',
  bob: '🧑‍🌾'
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [playbackRate, setPlaybackRate] = useState(0.8);
  const [finished, setFinished] = useState(false);

  const currentLine = MUZZY_LINES[currentIndex];

  // Helper to split sentence into words clean
  const getWords = useCallback((sentence: string) => {
    return sentence.replace(/[.,!?;]/g, '').split(' ');
  }, []);

  // Initialize current question
  useEffect(() => {
    const words = getWords(currentLine.english);
    setShuffledWords([...words].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setIsCorrect(false);
    setShowHint(false);
    
    // Auto-read on next
    speak(currentLine.english, 0.8);
  }, [currentIndex, currentLine.english, getWords]);

  const speak = (text: string, rate: number = 0.8) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.2; // Slightly higher pitch for kids
    window.speechSynthesis.speak(utterance);
  };

  const handleWordClick = (word: string, index: number) => {
    if (isCorrect) return;

    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    // Filter out used word from shuffled (just one instance)
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);

    // Check if sentence complete
    const targetWords = getWords(currentLine.english);
    if (newSelected.length === targetWords.length) {
      if (newSelected.join(' ') === targetWords.join(' ')) {
        setIsCorrect(true);
        speak(currentLine.english, 1); // Read at normal speed once correct
      } else {
        // Soft fail animation would go here
        setTimeout(() => {
          setShuffledWords([...targetWords].sort(() => Math.random() - 0.5));
          setSelectedWords([]);
        }, 1000);
      }
    }
  };

  const resetSelection = () => {
    const targetWords = getWords(currentLine.english);
    setShuffledWords([...targetWords].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
  };

  const toggleMastery = () => {
    const newMastered = new Set(mastered);
    if (newMastered.has(currentIndex)) {
      newMastered.delete(currentIndex);
    } else {
      newMastered.add(currentIndex);
    }
    setMastered(newMastered);
  };

  const nextQuestion = () => {
    if (currentIndex < MUZZY_LINES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Assign colors based on index/type heuristic
  const getWordColor = (word: string, index: number) => {
    const lower = word.toLowerCase();
    if (['i', 'you', 'he', 'she', 'it', 'we', 'they', "i'm", "you're", "she's", "he's"].includes(lower)) return COLORS.subject;
    if (['is', 'am', 'are', 'love', 'like', 'got', 'have', 'count', 'do'].includes(lower)) return COLORS.verb;
    return index > 1 ? COLORS.object : COLORS.default;
  };

  const progressPercent = ((currentIndex + 1) / MUZZY_LINES.length) * 100;

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }}
          className="p-12 bg-white rounded-3xl shadow-xl border-4 border-brand-yellow"
        >
          <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">哇！太棒了！</h1>
          <p className="text-xl text-gray-600 mb-8">你完成了所有《Big Muzzy》的台词！</p>
          <button 
            onClick={() => { setCurrentIndex(0); setFinished(false); }}
            className="kawaii-btn bg-brand-green px-8 py-3 rounded-full text-xl font-bold text-green-800 shadow-md"
          >
            再学一遍
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 font-sans tracking-tight">
            《Big Muzzy》 Part 1
          </h1>
          <span className="text-gray-500 font-medium">
            {currentIndex + 1} / {MUZZY_LINES.length}
          </span>
        </div>
        
        {/* Character Deco */}
        <div className="flex gap-2 text-3xl">
          {Object.values(CHARACTERS).slice(0, 3).map((c, i) => (
            <motion.span 
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="relative h-6 bg-white rounded-full mb-8 shadow-inner overflow-visible border-2 border-brand-pink/30">
        <div 
          className="absolute inset-y-0 left-0 rainbow-gradient rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          style={{ left: `${progressPercent}%` }}
        >
          <div className="text-2xl">☁️</div>
        </motion.div>
      </div>

      {/* Main Learning Card */}
      <main className="flex-1 flex flex-col gap-6">
        {/* Line 1: Phonetic */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div className="bg-brand-pink/50 px-4 py-1 rounded-xl border border-brand-pink text-pink-900 font-mono text-sm kawaii-shadow">
            {currentLine.phonetic}
          </div>
        </motion.div>

        {/* Line 2: English / Puzzle */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-4 border-white shadow-lg min-h-[220px] flex flex-col items-center justify-center relative">
          
          {/* Selected Words */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 min-h-[60px]">
            <AnimatePresence mode="popLayout">
              {selectedWords.map((word, i) => (
                <motion.div
                  key={`${word}-${i}`}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className={`${getWordColor(word, i)} word-blob flex items-center gap-1`}
                >
                  {word}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Shuffled/Available Words */}
          <div className="flex flex-wrap justify-center gap-4">
            <AnimatePresence>
              {!isCorrect && shuffledWords.map((word, i) => (
                <motion.button
                  key={`shuf-${word}-${i}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleWordClick(word, i)}
                  className={`${getWordColor(word, 4)} word-blob kawaii-btn text-lg`}
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Success Sticker */}
          <AnimatePresence>
            {isCorrect && (
              <motion.div 
                initial={{ scale: 0, rotate: 360 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute -top-12 -right-4 bg-brand-yellow p-4 rounded-full shadow-lg border-4 border-white text-4xl"
              >
                {CHARACTERS.muzzy} ✨
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint Overlay */}
          <AnimatePresence>
            {showHint && !isCorrect && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-3xl p-6"
              >
                <div className="text-3xl font-bold text-gray-400 opacity-50 tracking-wide select-none pointer-events-none">
                  {currentLine.english}
                </div>
                <button 
                  onClick={() => setShowHint(false)}
                  className="absolute top-4 right-4 text-gray-400"
                >✕</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Line 3: Translation */}
        <motion.div 
          animate={{ scale: isCorrect ? 1.05 : 1 }}
          className="bg-brand-blue/30 p-4 rounded-2xl text-center shadow-sm"
        >
          <div className="text-white text-lg font-bold bg-brand-blue/80 inline-block px-6 py-1 rounded-full shadow-inner">
            {currentLine.chinese}
          </div>
        </motion.div>

        {/* Line 4: Controls */}
        <section className="mt-4 grid grid-cols-5 gap-3 md:gap-6">
          <button 
            onClick={prevQuestion}
            className="kawaii-btn bg-[#b3e5fc] p-4 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-md border-b-4 border-blue-400/50"
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-8 h-8 text-blue-800" />
            <span className="text-xs font-bold text-blue-900">上一个</span>
          </button>

          <button 
            onClick={() => speak(currentLine.english, playbackRate)}
            className="kawaii-btn bg-[#ffcdd2] p-4 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-md border-b-4 border-pink-400/50"
          >
            <Mic2 className="w-8 h-8 text-red-800" />
            <span className="text-xs font-bold text-red-900">听一听</span>
          </button>

          <button 
            onClick={toggleMastery}
            className={`kawaii-btn p-4 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-md border-b-4 ${mastered.has(currentIndex) ? 'bg-[#fff176] border-yellow-500' : 'bg-[#fffde7] border-yellow-200'}`}
          >
            <Star className={`w-8 h-8 ${mastered.has(currentIndex) ? 'text-yellow-600 fill-yellow-500' : 'text-yellow-400'}`} />
            <span className="text-xs font-bold text-yellow-900">我会啦</span>
          </button>

          <div className="flex flex-col gap-2">
             <button 
              onClick={() => setShowHint(true)}
              className="kawaii-btn flex-1 bg-[#f3e5f5] p-3 rounded-2xl flex flex-col items-center justify-center shadow-md border-b-4 border-purple-300"
            >
              <Droplet className="w-6 h-6 text-purple-800" />
              <span className="text-[10px] font-bold text-purple-950">提示</span>
            </button>
            <button 
              onClick={resetSelection}
              className="kawaii-btn flex-1 bg-gray-100 p-3 rounded-2xl flex flex-col items-center justify-center shadow-md border-b-4 border-gray-300"
            >
              <RefreshCcw className="w-6 h-6 text-gray-500" />
              <span className="text-[10px] font-bold text-gray-600">重来</span>
            </button>
          </div>

          <button 
            onClick={nextQuestion}
            className={`kawaii-btn p-4 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-md border-b-4 ${isCorrect ? 'bg-[#c8e6c9] border-green-400' : 'bg-gray-50 border-gray-200'}`}
          >
            <ArrowRight className="w-8 h-8 text-green-800" />
            <span className="text-xs font-bold text-green-900">下一个</span>
          </button>
        </section>

        {/* Speed Adjustment */}
        <div className="flex justify-center items-center gap-4 mt-4 text-gray-500 font-bold text-sm">
          <span>语速:</span>
          {[0.75, 1, 1.25].map(rate => (
            <button
              key={rate}
              onClick={() => setPlaybackRate(rate)}
              className={`px-3 py-1 rounded-full transition-colors ${playbackRate === rate ? 'bg-brand-pink text-pink-800' : 'bg-white'}`}
            >
              {rate === 1 ? '正常' : rate === 0.75 ? '慢' : '快'}
            </button>
          ))}
        </div>
      </main>

      {/* Floating Sparkles Component could go here */}
      <footer className="mt-auto pt-8 pb-4 text-center text-pink-300/60 font-mono text-xs uppercase tracking-widest">
        Big Muzzy English Adventure
      </footer>
    </div>
  );
}
