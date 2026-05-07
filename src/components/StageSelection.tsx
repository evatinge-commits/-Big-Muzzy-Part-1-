import { motion } from 'motion/react';
import { STAGES } from '../data/lines';

interface StageSelectionProps {
  onSelectStage: (stageId: number) => void;
  onViewReport: () => void;
  completedStages: number[];
}

export default function StageSelection({ onSelectStage, onViewReport, completedStages }: StageSelectionProps) {
  return (
    <div className="flex flex-col items-center py-8 px-4 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500 mb-2">
          🏝️ Muzzy 英语探险岛
        </h1>
        <p className="text-gray-500 font-medium tracking-wide">
          完成五个关卡，成为英语小达人！
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {STAGES.map((stage, index) => {
          const isLocked = index > 0 && !completedStages.includes(STAGES[index-1].id);
          const isCompleted = completedStages.includes(stage.id);

          return (
            <motion.button
              key={stage.id}
              whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
              whileTap={!isLocked ? { scale: 0.95 } : {}}
              onClick={() => !isLocked && onSelectStage(stage.id)}
              className={`
                relative p-6 rounded-3xl flex flex-col items-center gap-4 shadow-xl border-4 transition-all
                ${isLocked ? 'bg-gray-100 border-gray-200 grayscale cursor-not-allowed' : 'bg-white border-white cursor-pointer'}
                ${isCompleted ? 'ring-4 ring-green-300' : ''}
              `}
            >
              <div className="text-6xl mb-2">{stage.icon}</div>
              <div className="text-center">
                <h3 className={`text-xl font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                  第{stage.id}关: {stage.title}
                </h3>
                <p className="text-sm text-gray-400 font-medium mt-1">{stage.desc}</p>
              </div>
              
              {isCompleted && (
                <div className="absolute -top-3 -right-3 bg-green-500 text-white p-2 rounded-full shadow-lg">
                  ✅
                </div>
              )}
              {isLocked && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-3xl flex items-center justify-center">
                  <span className="text-4xl">🔒</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        onClick={onViewReport}
        className="mt-16 bg-white px-8 py-4 rounded-full shadow-lg border-2 border-brand-pink text-pink-600 font-bold flex items-center gap-2 kawaii-btn"
      >
        📊 查看我的学习报告
      </motion.button>
    </div>
  );
}
