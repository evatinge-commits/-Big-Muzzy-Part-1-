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
  Trophy,
  Video,
  CreditCard,
  Gamepad2,
  Map as MapIcon
} from 'lucide-react';
import { MUZZY_LINES, MuzzyLine, STAGES } from './data/lines';
import StageSelection from './components/StageSelection';
import VideoLearning from './components/VideoLearning';
import Flashcards from './components/Flashcards';
import LearningReport from './components/LearningReport';

// Cartoon colors for word types
const COLORS = {
  subject: 'bg-[#b3e5fc] text-blue-800 border-blue-200', // Light Blue
  verb: 'bg-[#ffcdd2] text-red-800 border-red-200',    // Light Pink
  object: 'bg-[#fff9c4] text-yellow-800 border-yellow-200', // Light Yellow
  default: 'bg-[#e8f5e9] text-green-800 border-green-200',  // Light Green
};

// Character decorations
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

type View = 'island' | 'exercise' | 'video' | 'flashcards' | 'report' | 'stageMenu';

export default function App() {
  const [view, setView] = useState<View>('island');
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  
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
  const [totalStudySeconds, setTotalStudySeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const [parentChallenge, setParentChallenge] = useState<{ q: string; a: number } | null>(null);
  const [parentAnswer, setParentAnswer] = useState('');

  const STUDY_LIMIT = 30 * 60; // 30分钟
  const REST_DURATION = 10 * 60; // 10分钟

  // Filter lines by selected stage
  const currentStageLines = useMemo(() => {
    return selectedStageId ? MUZZY_LINES.filter(l => l.stage === selectedStageId) : [];
  }, [selectedStageId]);

  const currentLine = currentStageLines[currentIndex] || currentStageLines[0];

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
      setRestSecondsRemaining(prev => Math.max(0, prev - 5 * 60));
      setParentChallenge(null);
      setParentAnswer('');
      if (restSecondsRemaining <= 5 * 60) setIsResting(false);
    } else {
      alert("答错啦，再试一次哦！");
      setParentAnswer('');
    }
  };

  const getWords = useCallback((sentence: string) => {
    return sentence.replace(/[.,!?;]/g, '').split(' ');
  }, []);

  const speak = useCallback((text: string, rate: number = 0.8) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    if (currentLine?.speaker) {
      switch (currentLine.speaker) {
        case 'muzzy': utterance.pitch = 0.6; break;
        case 'king': utterance.pitch = 0.8; break;
        case 'sylvia': utterance.pitch = 1.6; break;
        case 'queen': utterance.pitch = 1.3; break;
        default: utterance.pitch = 1.1;
      }
    }
    window.speechSynthesis.speak(utterance);
  }, [currentLine]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view !== 'exercise') return;
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        speak(currentLine?.english, playbackRate);
      }
      if (e.key === 'Enter') {
        if (isCorrect) nextQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLine, playbackRate, isCorrect, speak, view]);

  // Exercise Loop Initialization
  useEffect(() => {
    if (view !== 'exercise' || !currentLine) return;
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
    const timer = setTimeout(() => speak(currentLine.english, playbackRate), 500);
    return () => clearTimeout(timer);
  }, [currentIndex, currentLine, view, getWords, playbackRate, speak]);

  const handleWordClick = (wordObj: WordItem) => {
    if (isCorrect) return;
    const targetWords = getWords(currentLine.english);
    const currentCorrectWord = targetWords[selectedWords.length];
    if (wordObj.text.toLowerCase() !== currentCorrectWord.toLowerCase()) {
      setWrongWordId(wordObj.id);
      setTimeout(() => setWrongWordId(null), 500);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 2000);
      return;
    }
    const newSelected = [...selectedWords, wordObj];
    setSelectedWords(newSelected);
    setShuffledWords(shuffledWords.filter(w => w.id !== wordObj.id));
    if (newSelected.length === targetWords.length) {
      setIsCorrect(true);
      speak(currentLine.english, 1);
    }
  };

  const handleRemoveWord = (wordObj: WordItem) => {
    if (isCorrect) return;
    setSelectedWords(selectedWords.filter(w => w.id !== wordObj.id));
    setShuffledWords([...shuffledWords, wordObj]);
  };

  const nextQuestion = useCallback(() => {
    if (currentIndex < currentStageLines.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (selectedStageId && !completedStages.includes(selectedStageId)) {
        setCompletedStages([...completedStages, selectedStageId]);
      }
      setFinished(true);
    }
  }, [currentIndex, currentStageLines.length, selectedStageId, completedStages]);

  const resetSelection = () => {
    const words = getWords(currentLine.english);
    const wordItems: WordItem[] = words.map((w, index) => ({ id: `${w}-${index}-${Math.random()}`, text: w }));
    setShuffledWords([...wordItems].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
  };

  const getWordColor = (word: string) => {
    const lower = word.toLowerCase();
    if (['i', 'you', 'he', 'she', 'it', 'we', 'they', "i'm", "you're", "she's", "he's", "i've"].includes(lower)) return COLORS.subject;
    if (['is', 'am', 'are', 'love', 'like', 'got', 'have', 'count', 'do', 'can'].includes(lower)) return COLORS.verb;
    return COLORS.default;
  };

  // --- Views ---

  const renderStageMenu = () => {
    const stage = STAGES.find(s => s.id === selectedStageId);
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 gap-8">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
          <div className="text-8xl mb-4">{stage?.icon}</div>
          <h2 className="text-4xl font-bold text-gray-800">{stage?.title}</h2>
          <p className="text-gray-500 mt-2">{stage?.desc}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <button onClick={() => setView('video')} className="bg-white p-8 rounded-[40px] shadow-xl border-4 border-white kawaii-btn flex flex-col items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full"><Video className="w-8 h-8 text-blue-500" /></div>
            <div className="font-bold text-lg">原声影院</div>
            <p className="text-xs text-gray-400">观看视频跟读</p>
          </button>
          <button onClick={() => setView('flashcards')} className="bg-white p-8 rounded-[40px] shadow-xl border-4 border-white kawaii-btn flex flex-col items-center gap-4">
            <div className="bg-pink-100 p-4 rounded-full"><CreditCard className="w-8 h-8 text-pink-500" /></div>
            <div className="font-bold text-lg">单词闪卡</div>
            <p className="text-xs text-gray-400">快速温习重点</p>
          </button>
          <button onClick={() => { setView('exercise'); setCurrentIndex(0); setFinished(false); }} className="bg-white p-8 rounded-[40px] shadow-xl border-4 border-brand-pink kawaii-btn flex flex-col items-center gap-4">
            <div className="bg-yellow-100 p-4 rounded-full"><Gamepad2 className="w-8 h-8 text-yellow-600" /></div>
            <div className="font-bold text-lg">通关挑战</div>
            <p className="text-xs text-gray-400">构建地道句子</p>
          </button>
        </div>

        <button onClick={() => setView('island')} className="mt-8 flex items-center gap-2 text-gray-400 font-bold hover:text-gray-600">
          <ArrowLeft size={20} /> 返回地图
        </button>
      </div>
    );
  };

  const renderExercise = () => {
    if (finished) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="p-12 bg-white rounded-[60px] shadow-2xl border-b-8 border-brand-yellow">
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">太棒了！通关啦！</h1>
            <p className="text-xl text-gray-600 mb-8">你已经掌握了本关的所有内容！</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setView('island')} className="kawaii-btn bg-brand-pink px-8 py-4 rounded-full text-xl font-bold text-pink-800 shadow-md">
                返回岛屿
              </button>
              <button onClick={() => { setCurrentIndex(0); setFinished(false); }} className="kawaii-btn bg-white border-2 border-brand-pink px-8 py-4 rounded-full text-xl font-bold text-pink-600">
                再刷一次
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    const progressPercent = ((currentIndex + 1) / currentStageLines.length) * 100;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col min-h-screen">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => setView('stageMenu')} className="p-2 bg-white rounded-full shadow-md kawaii-btn">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">{STAGES.find(s => s.id === selectedStageId)?.title}</h2>
            <div className="text-gray-400 text-xs font-bold uppercase">{currentIndex + 1} / {currentStageLines.length}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-6 bg-white rounded-full mb-12 shadow-inner border-4 border-white">
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>

        <main className="flex-1 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
            <div className="bg-brand-pink/50 px-4 py-1 rounded-xl text-pink-900 font-mono text-sm">{currentLine?.phonetic}</div>
          </motion.div>

          <div className="bg-white/80 backdrop-blur-sm rounded-[40px] p-10 border-4 border-white shadow-xl min-h-[250px] flex flex-col items-center justify-center relative">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <AnimatePresence mode="popLayout">
                {selectedWords.map((wordObj) => (
                  <motion.button key={wordObj.id} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => handleRemoveWord(wordObj)} className={`${getWordColor(wordObj.text)} word-blob`}>
                    {wordObj.text}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {!isCorrect && shuffledWords.map((wordObj) => (
                <motion.button key={wordObj.id} layout whileHover={{ scale: 1.1 }} onClick={() => handleWordClick(wordObj)} className={`${getWordColor(wordObj.text)} word-blob kawaii-btn ${wrongWordId === wordObj.id ? 'animate-shake bg-red-200 border-red-400' : ''}`}>
                  {wordObj.text}
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {isCorrect && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[140px] drop-shadow-2xl">❤️</span>
                </motion.div>
              )}
            </AnimatePresence>

            {showHint && !isCorrect && (
              <div className="absolute inset-x-0 -bottom-8 flex justify-center text-gray-300 font-bold italic tracking-widest text-lg">
                {currentLine.english}
              </div>
            )}
          </div>

          <div className="bg-brand-blue/30 p-6 rounded-3xl text-center">
            <div className="text-white text-xl font-bold bg-brand-blue px-6 py-2 rounded-full inline-block">
              {currentLine?.chinese}
            </div>
          </div>

          <section className="mt-8 flex justify-between gap-4">
             <button onClick={() => speak(currentLine?.english, playbackRate)} className="flex-1 kawaii-btn bg-pink-100 p-6 rounded-3xl flex items-center justify-center gap-2">
              <Mic2 size={24} className="text-pink-600" />
              <span className="font-bold text-pink-800">听原声 (Ctrl+A)</span>
            </button>
            <button onClick={nextQuestion} disabled={!isCorrect} className={`flex-1 kawaii-btn p-6 rounded-3xl flex items-center justify-center gap-2 ${isCorrect ? 'bg-green-400 text-white' : 'bg-gray-100 text-gray-400 grayscale cursor-not-allowed'}`}>
              <span className="font-bold">下一句 (Enter)</span>
              <ArrowRight size={24} />
            </button>
          </section>
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f9ff] text-gray-800 font-sans selection:bg-brand-pink selection:text-pink-900">
      <AnimatePresence>
        {isResting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-brand-blue/95 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-[120px] mb-4">☁️</div>
            <h2 className="text-4xl font-bold text-blue-900 mb-4">学习辛苦啦！休息一下吧</h2>
            <div className="bg-white p-10 rounded-[60px] shadow-2xl mb-8">
              <div className="text-6xl font-mono font-black text-pink-500">
                {Math.floor(restSecondsRemaining / 60)}:{(restSecondsRemaining % 60).toString().padStart(2, '0')}
              </div>
            </div>
            {!parentChallenge ? (
              <button onClick={generateChallenge} className="text-blue-500 underline font-bold opacity-60">家长挑战缩短时间</button>
            ) : (
              <div className="bg-white p-8 rounded-3xl border-4 border-brand-yellow">
                <div className="text-lg font-bold mb-4">{parentChallenge.q}</div>
                <input type="number" value={parentAnswer} onChange={e => setParentAnswer(e.target.value)} className="border-2 rounded-xl p-2 w-24 text-center mr-2 outline-none border-brand-blue" />
                <button onClick={checkParentAnswer} className="bg-brand-pink px-6 py-2 rounded-xl font-bold text-white">确认</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {view === 'island' && (
          <StageSelection 
            completedStages={completedStages} 
            onSelectStage={(id) => { setSelectedStageId(id); setView('stageMenu'); }} 
            onViewReport={() => setView('report')} 
          />
        )}
        {view === 'stageMenu' && renderStageMenu()}
        {view === 'exercise' && renderExercise()}
        {view === 'video' && selectedStageId && (
          <VideoLearning stageId={selectedStageId} onBack={() => setView('stageMenu')} />
        )}
        {view === 'flashcards' && selectedStageId && (
          <Flashcards stageId={selectedStageId} onBack={() => setView('stageMenu')} />
        )}
        {view === 'report' && (
          <LearningReport 
            completedStages={completedStages} 
            masteredCount={mastered.size} 
            totalStudySeconds={totalStudySeconds} 
            onBack={() => setView('island')} 
          />
        )}
      </div>
    </div>
  );
}
