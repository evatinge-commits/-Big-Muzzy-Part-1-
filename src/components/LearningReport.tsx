import { motion } from 'motion/react';
import { MUZZY_LINES, STAGES } from '../data/lines';
import { ArrowLeft, Award, BookOpen, Clock, Zap } from 'lucide-react';

interface LearningReportProps {
  completedStages: number[];
  masteredCount: number;
  totalStudySeconds: number;
  onBack: () => void;
}

export default function LearningReport({ completedStages, masteredCount, totalStudySeconds, onBack }: LearningReportProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const progressPercent = (completedStages.length / STAGES.length) * 100;

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12 px-4 h-screen">
       <div className="w-full flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-md kawaii-btn">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">📊 探险岛学习报告</h2>
      </div>

      {/* Main Stats Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] shadow-2xl border-t-8 border-brand-pink p-8"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-gray-400 font-bold uppercase tracking-wider text-sm mb-1">当前进度</h3>
            <div className="text-5xl font-black text-gray-800">{Math.round(progressPercent)}%</div>
          </div>
          <div className="bg-brand-yellow p-4 rounded-full shadow-lg">
            <Award className="w-10 h-10 text-yellow-600" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="flex flex-col items-center p-4 bg-brand-blue/20 rounded-3xl">
            <BookOpen className="w-6 h-6 text-blue-500 mb-2" />
            <div className="text-xl font-bold text-gray-700">{masteredCount}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">熟练掌握</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-3xl">
            <Clock className="w-6 h-6 text-purple-500 mb-2" />
            <div className="text-xl font-bold text-gray-700">{formatTime(totalStudySeconds)}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">学习时长</div>
          </div>
          <div className="flex flex-col items-center p-4 bg-brand-pink/20 rounded-3xl">
            <Zap className="w-6 h-6 text-pink-500 mb-2" />
            <div className="text-xl font-bold text-gray-700">{completedStages.length}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase">通关数</div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            关卡完成状态
          </h4>
          <div className="space-y-4">
            {STAGES.map(stage => (
              <div key={stage.id} className="flex items-center gap-4">
                <div className="text-2xl w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full">
                  {stage.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span className={completedStages.includes(stage.id) ? 'text-gray-800' : 'text-gray-300'}>
                      {stage.title}
                    </span>
                    <span className={completedStages.includes(stage.id) ? 'text-green-500' : 'text-gray-300'}>
                      {completedStages.includes(stage.id) ? '已通关' : '未解锁'}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: completedStages.includes(stage.id) ? '100%' : '0%' }}
                      className="h-full bg-green-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="text-center">
        <p className="text-gray-400 font-medium">✨ 继续加油，Big Muzzy 就在前面等着你哦！</p>
      </div>
    </div>
  );
}
