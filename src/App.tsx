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

interface WordItem {
  id: string;
  text: string;
}

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<WordItem[]>([]);
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [playbackRate, setPlaybackRate] = useState(0.8);
  const [finished, setFinished] = useState(false);
  const [wrongWordId, setWrongWordId] = useState<string | null>(null);

  // --- 休息模式状态 ---
  const [studyStartTime] = useState(Date.now());
  const [totalStudySeconds, setTotalStudySeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const [parentChallenge, setParentChallenge] = useState<{ q: string; a: number } | null>(null);
  const [parentAnswer, setParentAnswer] = useState('');

  const STUDY_LIMIT = 30 * 60; // 30分钟
  const REST_DURATION = 10 * 60; // 10分钟

  // 1. 学习计时器
  useEffect(() => {
    if (isResting || finished) return;
    const interval = setInterval(() => {
      setTotalStudySeconds(prev => {
        const next = prev + 1;
        if (next >= STUDY_LIMIT) {
          setIsResting(true);
          setRestSecondsRemaining(REST_DURATION);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, finished]);

  // 2. 休息计时器
  useEffect(() => {
    if (!isResting || restSecondsRemaining <= 0) {
      if (isResting && restSecondsRemaining <= 0) setIsResting(false);
      return;
    }
    const interval = setInterval(() => {
      setRestSecondsRemaining(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restSecondsRemaining]);

  // 3. 生成家长挑战
  const generateChallenge = () => {
    const isMult = Math.random() > 0.5;
    if (isMult) {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      setParentChallenge({ q: `${a} × ${b} = ?`, a: a * b });
    } else {
      const b = Math.floor(Math.random() * 8) + 2;
      const a = b * (Math.floor(Math.random() * 8) + 2);
      setParentChallenge({ q: `${a} ÷ ${b} = ?`, a: a / b });
    }
  };

  const checkParentAnswer = () => {
    if (parseInt(parentAnswer) === parentChallenge?.a) {
      // 答对缩短5分钟
      setRestSecondsRemaining(prev => Math.max(0, prev - 5 * 60));
      setParentChallenge(null);
      setParentAnswer('');
      if (restSecondsRemaining <= 5 * 60) setIsResting(false);
    } else {
      alert("答错啦，再试一次哦！");
      setParentAnswer('');
    }
  };

  // --- 原有逻辑 ---
  const currentLine = MUZZY_LINES[currentIndex];

  // Helper to split sentence into words clean
  const getWords = useCallback((sentence: string) => {
    return sentence.replace(/[.,!?;]/g, '').split(' ');
  }, []);

  const speak = useCallback((text: string, rate: number = 0.8) => {
    // 优先尝试原声播放
    if (currentLine.audioSrc) {
      const audio = new Audio(currentLine.audioSrc);
      audio.playbackRate = rate;
      audio.play().catch(e => console.log('Audio file play failed', e));
      return;
    }

    // 否则使用 AI 模拟嗓音
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;

    // 模仿原声嗓音角色
    switch (currentLine.speaker) {
      case 'muzzy':
        utterance.pitch = 0.6; // Muzzy 嗓音低沉
        break;
      case 'king':
        utterance.pitch = 0.8; // 国王嗓音威严
        break;
      case 'sylvia':
        utterance.pitch = 1.6; // 公主嗓音甜美
        break;
      case 'queen':
        utterance.pitch = 1.3;
        break;
      default:
        utterance.pitch = 1.1; // 普通嗓音稍高，适合儿童
    }

    window.speechSynthesis.speak(utterance);
  }, [currentLine]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + A -> Speak (忽略大小写)
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        speak(currentLine.english, playbackRate);
      }
      // Enter -> Next
      if (e.key === 'Enter') {
        if (isCorrect) {
          nextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLine.english, playbackRate, isCorrect, speak]);

  // Initialize current question
  useEffect(() => {
    const words = getWords(currentLine.english);
    const wordItems: WordItem[] = words.map((w, index) => ({
      id: `${w}-${index}-${Math.random()}`,
      text: w,
    }));
    setShuffledWords([...wordItems].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
    setIsCorrect(false);
    setShowHint(false);
    setWrongWordId(null);
    
    // 下一题自动朗读
    const timer = setTimeout(() => {
      speak(currentLine.english, playbackRate);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentIndex, currentLine.english, getWords, playbackRate, speak]);

  const handleWordClick = (wordObj: WordItem) => {
    if (isCorrect) return;

    const targetWords = getWords(currentLine.english);
    const currentCorrectWord = targetWords[selectedWords.length];

    // Check if the clicked word is correct for this position
    if (wordObj.text.toLowerCase() !== currentCorrectWord.toLowerCase()) {
      setWrongWordId(wordObj.id);
      setTimeout(() => setWrongWordId(null), 500); // Reset shake state
      // Show hint automatically on mistake
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
      return;
    }

    const newSelected = [...selectedWords, wordObj];
    setSelectedWords(newSelected);
    setShuffledWords(shuffledWords.filter(w => w.id !== wordObj.id));

    // Check if sentence complete
    if (newSelected.length === targetWords.length) {
      setIsCorrect(true);
      speak(currentLine.english, 1);
    }
  };

  const handleRemoveWord = (wordObj: WordItem) => {
    if (isCorrect) return;
    // For simplicity, we remove from the end or just this one? 
    // To maintain sentence structure, usually we remove the last one or allow arbitrary removal.
    // Let's allow arbitrary removal for better UX "退回".
    setSelectedWords(selectedWords.filter(w => w.id !== wordObj.id));
    setShuffledWords([...shuffledWords, wordObj]);
  };

  const resetSelection = () => {
    const words = getWords(currentLine.english);
    const wordItems: WordItem[] = words.map((w, index) => ({
      id: `${w}-${index}-${Math.random()}`,
      text: w,
    }));
    setShuffledWords([...wordItems].sort(() => Math.random() - 0.5));
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

  const nextQuestion = useCallback(() => {
    if (currentIndex < MUZZY_LINES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  }, [currentIndex]);

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Assign colors based on index/type heuristic
  const getWordColor = (word: string) => {
    const lower = word.toLowerCase();
    if (['i', 'you', 'he', 'she', 'it', 'we', 'they', "i'm", "you're", "she's", "he's", "i've"].includes(lower)) return COLORS.subject;
    if (['is', 'am', 'are', 'love', 'like', 'got', 'have', 'count', 'do', 'can'].includes(lower)) return COLORS.verb;
    return COLORS.default;
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
      {/* 休息模式遮罩 */}
      <AnimatePresence>
        {isResting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-blue/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-[120px] mb-4"
            >
              ☁️
            </motion.div>
            <h2 className="text-4xl font-bold text-blue-900 mb-4">学习辛苦啦！休息一下吧</h2>
            <p className="text-xl text-blue-700 mb-8 max-w-md">
              眼睛需要休息哦，快去远眺窗外，或者和 Big Muzzy 一起跳个舞吧！
            </p>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border-4 border-white mb-8">
              <div className="text-5xl font-mono font-bold text-pink-500 mb-2">
                {Math.floor(restSecondsRemaining / 60)}:{(restSecondsRemaining % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">后可以继续学习</div>
            </div>

            {/* 家长验证区域 */}
            {!parentChallenge ? (
              <button 
                onClick={generateChallenge}
                className="text-blue-500 underline font-bold opacity-60 hover:opacity-100"
              >
                家长验证（可挑战口诀缩短 5 分钟）
              </button>
            ) : (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-6 rounded-2xl shadow-lg border-2 border-brand-yellow">
                <div className="text-lg font-bold text-gray-700 mb-4">验证问题（仅限家长）：{parentChallenge.q}</div>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={parentAnswer}
                    onChange={(e) => setParentAnswer(e.target.value)}
                    className="border-2 border-gray-100 rounded-xl px-4 py-2 w-24 text-center focus:border-brand-pink outline-none"
                    placeholder="答案"
                  />
                  <button 
                    onClick={checkParentAnswer}
                    className="bg-brand-pink px-4 py-2 rounded-xl font-bold text-pink-800"
                  >
                    提交
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
              {selectedWords.map((wordObj, i) => (
                <motion.button
                  key={wordObj.id}
                  layout
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  onClick={() => handleRemoveWord(wordObj)}
                  className={`${getWordColor(wordObj.text)} word-blob flex items-center gap-1 cursor-pointer hover:opacity-80 active:scale-95`}
                >
                  {wordObj.text}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Shuffled/Available Words */}
          <div className="flex flex-wrap justify-center gap-4">
            <AnimatePresence>
              {!isCorrect && shuffledWords.map((wordObj, i) => (
                <motion.button
                  key={wordObj.id}
                  layout
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleWordClick(wordObj)}
                  className={`
                    ${getWordColor(wordObj.text)} word-blob kawaii-btn text-lg
                    ${wrongWordId === wordObj.id ? 'animate-shake !bg-red-200 !border-red-400' : ''}
                  `}
                >
                  {wordObj.text}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Success Heart Popup */}
          <AnimatePresence>
            {isCorrect && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <div className="flex flex-col items-center">
                   <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="text-[120px] drop-shadow-2xl"
                   >
                     ❤️
                   </motion.div>
                   <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white px-6 py-2 rounded-full border-4 border-brand-pink text-pink-600 font-bold text-2xl shadow-xl"
                   >
                     做得真棒！
                   </motion.div>
                </div>
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
