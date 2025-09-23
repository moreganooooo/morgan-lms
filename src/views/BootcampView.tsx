// Enhanced BootcampView.tsx - Integrating your career-focused data
import { CheckCircle2, Circle, Clock, Trophy, Target, Award, TrendingUp, DollarSign, Briefcase, ExternalLink } from 'lucide-react';
import { Theme } from '../theme';
import React from 'react';
import { CelebrationType } from '../App';

// Import your enhanced data
import { ENHANCED_BOOTCAMP_DATA, BOOTCAMP_CAREER_PROGRESSION, BOOTCAMP_MARKET_DATA } from '../enhanced-bootcamp-data';

interface BootcampViewProps {
  data: Record<number, any>;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  progress: Record<string, boolean>;
  setProgress: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openNotes: (ctx: string, label: string) => void;
  bumpSkill: (id: string, delta?: number) => void;
  achievements: string[];
  setAchievements: (achievements: string[]) => void;
  theme: Theme;
  triggerCelebration: (type: CelebrationType) => void;
  dailyGoal: number;
}

export default function BootcampView({ 
  currentDay, 
  setCurrentDay, 
  progress, 
  setProgress, 
  openNotes,
  bumpSkill,
  achievements,
  setAchievements,
  theme,
  triggerCelebration,
  dailyGoal
}: BootcampViewProps) {
  
  // Use enhanced data instead of generic data
  const data = ENHANCED_BOOTCAMP_DATA;
  
  const markComplete = (dayNum: number, moduleId: string) => {
    const moduleKey = `${dayNum}-${moduleId}`;
    const wasCompleted = progress[moduleKey];
    
    setProgress(prev => ({
      ...prev,
      [moduleKey]: !prev[moduleKey]
    }));

    if (!wasCompleted) {
      const today = new Date().toDateString();
      localStorage.setItem(`completion-${moduleKey}-date`, today);
      
      const module = data[dayNum].modules.find((m: any) => m.id === moduleId);
      
      // Auto-level skill on first completion
      if (module?.skill) {
        bumpSkill(module.skill, 0.5);
      }
      
      if (module?.type === 'certification') {
        triggerCelebration('certification');
      } else {
        triggerCelebration('module');
      }
      
      // Check if day is complete
      const dayModules = data[dayNum].modules;
      const completedInDay = dayModules.filter((m: any) => 
        m.id === moduleId ? true : progress[`${dayNum}-${m.id}`]
      ).length;
      
      if (completedInDay === dayModules.length) {
        setTimeout(() => triggerCelebration('day'), 1000);
      }
    }
  };

  const getTodayProgress = () => {
    const today = new Date().toDateString();
    const todayCompleted = Object.keys(progress).filter(key => {
      const savedToday = localStorage.getItem(`completion-${key}-date`);
      return progress[key] && savedToday === today;
    }).length;
    
    return Math.min(100, (todayCompleted / dailyGoal) * 100);
  };

  const getDayProgress = (day: number) => {
    const dayModules = data[day].modules;
    const completed = dayModules.filter((m: any) => progress[`${day}-${m.id}`]).length;
    return Math.round((completed / dayModules.length) * 100);
  };

  const getTotalSalaryImpact = () => {
    let total = 0;
    Object.values(data).forEach((day: any) => {
      day.modules.forEach((module: any) => {
        if (module.salaryImpact && progress[`${Object.keys(data).find(k => data[parseInt(k)] === day)}-${module.id}`]) {
          total += parseInt(module.salaryImpact.replace(/[+$K]/g, ''));
        }
      });
    });
    return total;
  };

  return (
    <div className="space-y-6">
      {/* NEW: Career Impact Dashboard */}
      <div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-xl"
        style={{ 
          background: `${theme.success}10`, 
          border: `1px solid ${theme.success}30` 
        }}
      >
        <div className="text-center">
          <DollarSign className="w-8 h-8 mx-auto mb-2" style={{ color: theme.success }} />
          <div className="text-2xl font-bold" style={{ color: theme.success }}>
            +${getTotalSalaryImpact()}K
          </div>
          <div className="text-sm text-white opacity-75">Potential Salary Impact</div>
        </div>
        
        <div className="text-center">
          <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: theme.primary }} />
          <div className="text-2xl font-bold" style={{ color: theme.primary }}>
            {BOOTCAMP_MARKET_DATA.jobMarketStats.emailMarketingGrowth}
          </div>
          <div className="text-sm text-white opacity-75">Market Growth</div>
        </div>
        
        <div className="text-center">
          <Briefcase className="w-8 h-8 mx-auto mb-2" style={{ color: theme.accent }} />
          <div className="text-2xl font-bold" style={{ color: theme.accent }}>
            {BOOTCAMP_MARKET_DATA.jobMarketStats.remoteOpportunities}
          </div>
          <div className="text-sm text-white opacity-75">Remote Opportunities</div>
        </div>
      </div>

      {/* Enhanced Today's Progress Widget */}
      <div 
        className="p-6 rounded-xl transition-all duration-300 hover:scale-105" 
        style={{ 
          background: `${theme.success}15`, 
          border: `1px solid ${theme.success}30` 
        }}
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
          <Target className="w-5 h-5" style={{ color: theme.success }} />
          Today's Progress
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: theme.success }}>
              {Object.keys(progress).filter(key => {
                const savedToday = localStorage.getItem(`completion-${key}-date`);
                return progress[key] && savedToday === new Date().toDateString();
              }).length} / {dailyGoal}
            </div>
            <div className="text-sm text-white opacity-75">
              certifications completed today
            </div>
            <div className="text-xs text-white opacity-60 mt-1">
              Building your career portfolio!
            </div>
          </div>
          
          {/* Circular Progress Indicator */}
          <div className="w-24 h-24 relative">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="40" 
                stroke="rgba(255,255,255,0.2)" 
                strokeWidth="8" 
                fill="none" 
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={theme.success}
                strokeWidth="8"
                strokeDasharray={`${getTodayProgress() * 2.51} 251`}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000"
                style={{ filter: `drop-shadow(0 0 8px ${theme.success}40)` }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{color: theme.success}}>
                {Math.round(getTodayProgress())}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Day Header with Career Context */}
      <div 
        className="p-6 rounded-xl relative overflow-hidden transition-all duration-300 hover:scale-105"
        style={{ 
          background: theme.accentGradient,
          boxShadow: theme.glowEffect 
        }}
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Day {currentDay}: {data[currentDay].title}
          </h2>
          <p className="text-white opacity-90 mb-2">
            {data[currentDay].subtitle}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-white opacity-75 mb-4">
            <span>⏱️ {data[currentDay].timeEstimate}</span>
            <span>💰 {data[currentDay].salaryImpact}</span>
            <span>🎯 {data[currentDay].careerStage}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-white opacity-75">
              Progress for this day
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">
                {getDayProgress(currentDay)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-4 border-white"></div>
          <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border-2 border-white"></div>
        </div>
      </div>

      {/* Enhanced Modules Grid with Real Certifications */}
      <div className="grid gap-4">
        {data[currentDay].modules.map((module: any) => {
          const moduleKey = `${currentDay}-${module.id}`;
          const isCompleted = progress[moduleKey];
          
          return (
            <div 
              key={module.id}
              className={`rounded-xl p-6 transition-all duration-300 ${
                isCompleted 
                  ? 'opacity-75 bg-white bg-opacity-10' 
                  : 'hover:shadow-lg hover:scale-105 bg-white bg-opacity-20 backdrop-blur-sm'
              }`}
              style={{
                border: `1px solid ${isCompleted ? theme.success : 'rgba(255,255,255,0.3)'}`,
                boxShadow: isCompleted ? `0 0 20px ${theme.success}20` : 'none'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <button
                    onClick={() => markComplete(currentDay, module.id)}
                    className="transition-all duration-300 hover:scale-110 mt-1"
                  >
                    {isCompleted ? (
                      <CheckCircle2 
                        className="w-7 h-7" 
                        style={{color: theme.success}} 
                      />
                    ) : (
                      <Circle 
                        className="w-7 h-7 text-white opacity-60 hover:opacity-100" 
                      />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-semibold text-white ${
                        isCompleted ? 'line-through opacity-75' : ''
                      }`}>
                        {module.title}
                      </h3>
                      {module.directLink && (
                        <a 
                          href={module.directLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:scale-110 transition-all duration-300"
                          style={{ backgroundColor: theme.accent }}
                          title="Open certification link"
                        >
                          <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-sm text-white opacity-75 mb-3">
                      {module.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 text-xs mb-3">
                      <span className="px-2 py-1 rounded-full bg-white bg-opacity-20 text-white">
                        ⏱️ {module.time}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-white bg-opacity-20 text-white">
                        📊 {module.difficulty}
                      </span>
                      {module.salaryImpact && (
                        <span 
                          className="px-2 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: theme.success }}
                        >
                          💰 {module.salaryImpact}
                        </span>
                      )}
                      {module.type === 'certification' && (
                        <span 
                          className="px-2 py-1 rounded-full text-white font-medium"
                          style={{ backgroundColor: theme.accent }}
                        >
                          🏆 Certification
                        </span>
                      )}
                    </div>

                    {module.marketValue && (
                      <p className="text-xs text-white opacity-60 italic">
                        📈 {module.marketValue}
                      </p>
                    )}
                  </div>
                </div>
                
                {isCompleted && (
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-2 h-2 rounded-full animate-pulse" 
                         style={{ backgroundColor: theme.success }}></div>
                    <span className="text-xs px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: theme.success }}>
                      Complete
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW: Career Progression Tracker */}
      <div 
        className="p-6 rounded-xl"
        style={{ 
          background: `${theme.primary}10`, 
          border: `1px solid ${theme.primary}30` 
        }}
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-white">
          <TrendingUp className="w-5 h-5" style={{ color: theme.primary }} />
          Your Career Progression Path
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BOOTCAMP_CAREER_PROGRESSION.careerPaths.map((path, index) => {
            const isUnlocked = getDayProgress(currentDay) >= (index + 1) * 33;
            return (
              <div 
                key={path.title}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  isUnlocked ? 'hover:scale-105' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: isUnlocked ? `${theme.primary}20` : 'rgba(255,255,255,0.1)',
                  borderColor: isUnlocked ? theme.primary : 'rgba(255,255,255,0.2)'
                }}
              >
                <div className="text-sm font-medium text-white mb-1">
                  {path.title}
                </div>
                <div className="text-xs text-white opacity-60 mb-2">
                  {path.timeframe}
                </div>
                <div className="text-xs text-white opacity-75">
                  {path.requirements.join(' • ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Enhanced Day Navigation */}
      <div className="flex justify-center gap-4">
        {[1, 2, 3].map(day => (
          <button
            key={day}
            onClick={() => setCurrentDay(day)}
            className={`px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 ${
              currentDay === day ? 'shadow-lg' : 'hover:shadow-md'
            }`}
            style={{
              background: currentDay === day ? theme.accentGradient : 'rgba(255,255,255,0.15)',
              color: 'white',
              border: `1px solid ${currentDay === day ? 'transparent' : 'rgba(255,255,255,0.3)'}`,
              boxShadow: currentDay === day ? theme.glowEffect : 'none'
            }}
          >
            <div className="text-center">
              <div className="font-bold text-lg">Day {day}</div>
              <div className="text-sm opacity-75">
                {getDayProgress(day)}% Complete
              </div>
              <div className="text-xs opacity-60">
                {data[day].salaryImpact} potential
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}