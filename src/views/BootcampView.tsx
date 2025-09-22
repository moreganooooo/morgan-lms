import { CheckCircle2, Circle, Clock, Trophy, Target, Award, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Theme } from '../theme';
import React, { useState } from 'react';
import { CelebrationType } from '../App';

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
  data, 
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
  
  // State for expanded module details
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  
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

  return (
    <div className="space-y-6">
      {/* Enhanced Today's Progress Widget with 3D Cube */}
      <div 
        className="p-6 rounded-xl transition-all duration-300 hover:scale-105" 
        style={{ 
          background: `${theme.success}15`, 
          border: `1px solid ${theme.success}30`,
          color: theme.contentText
        }}
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2" 
            style={{ color: theme.contentText }}>
          <Target className="w-5 h-5" style={{ color: theme.success }} />
          Today's Progress
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-3xl font-bold mb-1" style={{ color: theme.success }}>
              {Object.keys(progress).filter(key => {
                const savedToday = localStorage.getItem(`completion-${key}-date`);
                return progress[key] && savedToday === new Date().toDateString();
              }).length} / {dailyGoal}
            </div>
            <div className="text-sm" style={{ color: theme.contentText, opacity: 0.75 }}>
              modules completed today
            </div>
            <div className="text-xs mt-1" style={{ color: theme.contentText, opacity: 0.6 }}>
              Keep the momentum going!
            </div>
          </div>
          
          {/* 3D Cube Progress Indicator like reference */}
          <div className="flex-shrink-0 ml-6">
            <div className="cube-wrap">
              <div className="cube" style={{
                '--theme-primary': theme.primary
              } as React.CSSProperties}>
                <div className="face front">{Math.round(getTodayProgress())}%</div>
                <div className="face back">{Math.round(getTodayProgress())}%</div>
                <div className="face left">{Math.round(getTodayProgress())}%</div>
                <div className="face right">{Math.round(getTodayProgress())}%</div>
                <div className="face top">{Math.round(getTodayProgress())}%</div>
                <div className="face bottom">{Math.round(getTodayProgress())}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Day Header with Perfect Alignment */}
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
          <p className="text-white opacity-90 mb-4">
            Estimated Time: {data[currentDay].timeEstimate}
          </p>
          
          <div className="flex items-end justify-between">
            <div className="text-white opacity-75 text-sm">
              Progress for this day
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">
                {getDayProgress(currentDay)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Pattern - Fixed positioning */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full border border-white"></div>
        </div>
      </div>

      {/* Enhanced Modules Grid - DETAILED EXPANSION LIKE REFERENCE */}
      <div className="grid gap-4">
        {data[currentDay].modules.map((module: any) => {
          const moduleKey = `${currentDay}-${module.id}`;
          const isCompleted = progress[moduleKey];
          const isExpanded = expandedModule === moduleKey;
          
          return (
            <div 
              key={module.id}
              className={`rounded-xl transition-all duration-300 ${
                isCompleted 
                  ? 'opacity-75' 
                  : 'hover:shadow-lg'
              }`}
              style={{
                background: 'white',
                border: `1px solid ${isCompleted ? theme.success : '#e5e7eb'}`,
                boxShadow: isCompleted ? `0 0 20px ${theme.success}20` : '0 4px 6px rgba(0,0,0,0.05)',
                color: '#0f172a'
              }}
            >
              {/* Module Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedModule(isExpanded ? null : moduleKey)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markComplete(currentDay, module.id);
                      }}
                      className="transition-all duration-300 hover:scale-110"
                    >
                      {isCompleted ? (
                        <CheckCircle2 
                          className="w-7 h-7" 
                          style={{color: theme.success}} 
                        />
                      ) : (
                        <Circle 
                          className="w-7 h-7 opacity-60 hover:opacity-100" 
                          style={{color: '#6b7280'}}
                        />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${
                        isCompleted ? 'line-through opacity-75' : ''
                      }`} style={{color: '#0f172a'}}>
                        {module.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-sm mb-3 flex-wrap gap-2" 
                           style={{color: '#6b7280'}}>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {module.time}
                        </span>
                        
                        <span className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {module.type}
                        </span>
                        
                        {module.skill && (
                          <span className="flex items-center px-2 py-1 rounded-full text-xs" 
                                style={{backgroundColor: `${theme.primary}20`, color: theme.primary}}>
                            {module.skill}
                          </span>
                        )}
                        
                        {module.type === 'certification' && (
                          <span className="flex items-center px-2 py-1 rounded-full text-xs text-white" 
                                style={{backgroundColor: theme.accent}}>
                            <Trophy className="w-3 h-3 mr-1" />
                            Certification
                          </span>
                        )}
                      </div>

                      {module.objective && (
                        <p className="text-sm italic" 
                           style={{color: '#6b7280'}}>
                          <strong>Objective:</strong> {module.objective}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-4">
                    {isCompleted && (
                      <span className="text-xs px-3 py-1 rounded-full text-white"
                            style={{ backgroundColor: theme.success }}>
                        Complete
                      </span>
                    )}
                    
                    <button className="text-gray-400 hover:text-gray-600">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content - Like Reference Image */}
              {isExpanded && (
                <div className="border-t bg-gray-50 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Resources Section */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">Resources</h4>
                      <div className="space-y-2">
                        {module.resources?.map((resource: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-blue-500" />
                            <a 
                              href={resource.url} 
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {resource.title}
                            </a>
                          </div>
                        )) || (
                          <p className="text-sm text-gray-500">No resources available</p>
                        )}
                      </div>
                    </div>

                    {/* Knowledge Check Section */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">Knowledge Check</h4>
                      {module.knowledgeCheck ? (
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium text-sm text-gray-700">Q: </span>
                            <span className="text-sm text-gray-600">{module.knowledgeCheck.question}</span>
                          </div>
                          <div>
                            <span className="font-medium text-sm text-gray-700">A: </span>
                            <span className="text-sm text-gray-600">{module.knowledgeCheck.answer}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No knowledge check available</p>
                      )}
                    </div>

                    {/* Activities Section */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">Activities</h4>
                      <div className="space-y-2">
                        {module.activities?.map((activity: string, idx: number) => (
                          <label key={idx} className="flex items-start gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="mt-1 rounded border-gray-300"
                              style={{accentColor: theme.primary}}
                            />
                            <span className="text-sm text-gray-600">{activity}</span>
                          </label>
                        )) || (
                          <p className="text-sm text-gray-500">No activities available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <button 
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                      onClick={() => setExpandedModule(null)}
                    >
                      ▼ Details
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                      onClick={() => openNotes(`module-${moduleKey}`, `${module.title} Notes`)}
                    >
                      📝 Notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Enhanced Achievements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: 'first-module', name: 'First Steps', desc: 'Complete first module', icon: Target },
          { id: 'streak-3', name: 'On Fire!', desc: '3-day streak', icon: Trophy },
          { id: 'hour-spent', name: 'Dedicated', desc: '1+ hours studied', icon: Clock },
          { id: 'first-cert', name: 'Certified!', desc: 'First certification', icon: Award },
        ].map((achievement) => {
          const earned = achievements.includes(achievement.id);
          const IconComponent = achievement.icon;
          
          return (
            <div 
              key={achievement.id}
              className={`p-4 rounded-lg border text-center transition-all duration-300 ${
                earned ? 'hover:scale-105' : 'hover:opacity-75'
              }`}
              style={{
                backgroundColor: earned ? `${theme.accent}20` : 'white',
                borderColor: earned ? theme.accent : '#e5e7eb',
                color: '#0f172a'
              }}
            >
              <div className="mb-2">
                <IconComponent 
                  className="w-8 h-8 mx-auto" 
                  style={{ color: earned ? theme.accent : '#9ca3af' }}
                />
              </div>
              <div className="text-sm font-medium" 
                   style={{ color: earned ? theme.accent : '#6b7280' }}>
                {achievement.name}
              </div>
              <div className="text-xs" style={{color: '#9ca3af'}}>
                {achievement.desc}
              </div>
              {earned && (
                <div className="text-xs mt-2" style={{ color: theme.accent }}>
                  <CheckCircle2 className="w-4 h-4 mx-auto" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Day Navigation */}
      <div className="flex justify-center gap-4">
        {[1, 2, 3].map(day => (
          <button
            key={day}
            onClick={() => setCurrentDay(day)}
            className={`flex flex-col items-center justify-center px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 ${
              currentDay === day ? 'shadow-lg' : 'hover:shadow-md'
            }`}
            style={{
              background: currentDay === day ? theme.accentGradient : 'white',
              color: currentDay === day ? 'white' : '#0f172a',
              border: `1px solid ${currentDay === day ? 'transparent' : '#e5e7eb'}`,
              boxShadow: currentDay === day ? theme.glowEffect : 'none'
            }}
          >
            <div className="text-center">
              <div className="font-bold text-lg">Day {day}</div>
              <div className="text-sm" style={{ color: currentDay === day ? 'white' : '#0f172a', opacity: 0.75 }}>
                {getDayProgress(day)}% Complete
              </div>
              <div className="text-xs" style={{ color: currentDay === day ? 'white' : '#0f172a', opacity: 0.6 }}>
                {data[day].modules.length} modules
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}