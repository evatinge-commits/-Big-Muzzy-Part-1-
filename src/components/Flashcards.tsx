import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MUZZY_LINES } from '../data/lines';
import { ArrowLeft, RotateCw } from 'lucide-react';

interface FlashcardsProps {
  stageId: number;
  onBack: () => void;
}

export default function Flashcards({ stageId, onBack }: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const stageLines = MUZZY_LINES.filter(l => l.stage === stageId);
  const currentLine = stageLines[index];

  const nextCard = () => {
    setIsFlipped(false);
    setIndex((index + 1) % stageLines.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setIndex((index - 1 + stageLines.length) % stageLines.length);
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto py-12 px-4 h-screen">
       <div className="w-full flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-md kawaii-btn">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="bg-white px-4 py-1 rounded-full shadow-sm font-bold text-gray-400">
          Card {index + 1} / {stageLines.length}
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLine.order}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full h-full relative preserve-3d cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="w-full h-full relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front: English */}
              <div 
                className="absolute inset-0 bg-white rounded-[40px] shadow-2xl border-8 border-brand-blue flex flex-col items-center justify-center p-12 text-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                  {currentLine.english}
                </h2>
                <div className="mt-8 text-gray-400 font-mono text-lg">
                  {currentLine.phonetic}
                </div>
                <div className="absolute bottom-10 flex items-center gap-2 text-blue-300 font-bold uppercase tracking-widest text-sm">
                  <RotateCw className="w-4 h-4" /> 点击翻面
                </div>
              </div>

              {/* Back: Chinese */}
              <div 
                className="absolute inset-0 bg-brand-blue rounded-[40px] shadow-2xl border-8 border-white flex flex-col items-center justify-center p-12 text-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="text-6xl mb-6">🦒</div>
                <h2 className="text-4xl md:text-5xl font-bold text-blue-900">
                  {currentLine.chinese}
                </h2>
                <div className="mt-12 w-24 h-2 bg-white/40 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-6 w-full max-w-sm">
        <button 
          onClick={prevCard}
          className="flex-1 bg-white p-6 rounded-3xl shadow-lg border-b-8 border-gray-100 font-bold text-gray-600 kawaii-btn"
        >
          上一张
        </button>
        <button 
          onClick={nextCard}
          className="flex-1 bg-brand-pink p-6 rounded-3xl shadow-lg border-b-8 border-pink-300 font-bold text-pink-800 kawaii-btn"
        >
          下一张
        </button>
      </div>

      <div className="text-gray-400 text-sm font-medium">
        提示：通过闪卡快速预览本关的核心表达！
      </div>
    </div>
  );
}
