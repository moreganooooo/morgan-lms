import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { BookOpen, ClipboardList, Brain, Layers, BarChart3, Flame, FileDown, StickyNote, Palette, Play, Pause, RotateCcw, Clock, Target } from 'lucide-react'
import { PRESETS, applyTheme, Theme } from './theme'
import { NS, INK, BORDER, safeGet, safeSet, formatTime, tsInsert, exportTextFile } from './utils'
import StatChip from './components/StatChip'
import SparklineMini from './components/SparklineMini'
import NotesDock from './components/NotesDock'
import ThemeGallery from './components/ThemeGallery'
import Celebration from './components/Celebration'
import BootcampView from './views/BootcampView'
import PlannerView from './views/PlannerView'
import FlashcardsView from './views/FlashcardsView'
import AnalyticsView from './views/AnalyticsView'
import SkillsView from './views/SkillsView'

export type CelebrationType = 'module' | 'certification' | 'day' | 'theme' | 'achievement' | '';

export default function App(){
  const [activeTab, setActiveTab] = useState<'bootcamp'|'planner'|'flashcards'|'skills'|'analytics'>('bootcamp')
  const [selectedThemeKey, setSelectedThemeKey] = useState(()=> safeGet(`${NS}:themeKey`, 'ocean'))
  const theme = PRESETS[selectedThemeKey] || PRESETS.ocean
  
  // Theme gallery state
  const [showThemeGallery, setShowThemeGallery] = useState(false)
  const [themeTransitioning, setThemeTransitioning] = useState(false)
  
  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<CelebrationType>('')

  useEffect(()=>{ applyTheme(theme); safeSet(`${NS}:themeKey`, selectedThemeKey) },[selectedThemeKey, theme])

  const card = { background:'white', border:`1px solid ${BORDER}` } as const
  const [currentDay, setCurrentDay] = useState(1)

  const [progress, setProgress] = useState<Record<string,boolean>>(()=> safeGet(`${NS}:progress`, {}))
  useEffect(()=> safeSet(`${NS}:progress`, progress), [progress])

  const [achievements, setAchievements] = useState<string[]>(()=> safeGet(`${NS}:achs`, []))
  useEffect(()=> safeSet(`${NS}:achs`, achievements), [achievements])

  const [skills, setSkills] = useState([
    { id:'platform', label:'Platform', score:3.4 },
    { id:'deliverability', label:'Deliverability', score:2.9 },
    { id:'lifecycle', label:'Lifecycle/CRM', score:3.2 },
    { id:'analytics', label:'Data & Analytics', score:2.5 },
    { id:'copy', label:'Copywriting', score:3.7 },
  ])
  const bumpSkill = (id:string, delta=0.3)=> setSkills(prev=> prev.map(s=> s.id===id? { ...s, score: Math.min(5, s.score + delta)}: s))

  // Study timer and activities (keeping existing logic)
  const [tasks, setTasks] = useState(()=> safeGet(`${NS}:tasks`, [
    { id: Math.random().toString(36).slice(2), title:'HubSpot certification prep', status:'doing', impact:{ platform: .4, copy: .2 } },
    { id: Math.random().toString(36).slice(2), title:'A/B test subject lines', status:'next', impact:{ copy: .4, analytics: .3, deliverability: .1 } },
    { id: Math.random().toString(36).slice(2), title:'Salesforce report: cohort retention', status:'backlog', impact:{ analytics: .3 } },
  ]))
  useEffect(()=> safeSet(`${NS}:tasks`, tasks), [tasks])

  // Existing timer and activity logic
  const [studyTimer, setStudyTimer] = useState({ isRunning:false, time:0 })
  const [totalTimeSpent, setTotalTimeSpent] = useState(()=> safeGet(`${NS}:totalTime`, 0))
  const [activity, setActivity] = useState<Record<string,number>>(()=> safeGet(`${NS}:activity`, {}))
  const [studyStreak, setStudyStreak] = useState(()=> safeGet(`${NS}:streak`, 0))
  const [lastStudyDate, setLastStudyDate] = useState(()=> safeGet(`${NS}:lastStudy`, ''))
  
  // Existing timer effect
  useEffect(()=>{ let t: ReturnType<typeof setInterval> | null = null;
    if(studyTimer.isRunning){
      t=setInterval(()=>{
        setStudyTimer(p=>({...p,time:p.time+1}));
        setTotalTimeSpent(p=>p+1);
        const k=new Date().toISOString().slice(0,10);
        setActivity(p=>({...p,[k]:(p[k]||0)+1}))
      },1000)
    }
    return ()=> { if(t) clearInterval(t) }
  },[studyTimer.isRunning])

  // Enhanced daily goal tracking
  const [dailyGoal, setDailyGoal] = useState(()=> safeGet(`${NS}:dailyGoal`, 2))
  useEffect(()=> safeSet(`${NS}:dailyGoal`, dailyGoal), [dailyGoal])

  // Celebration trigger function
  const triggerCelebration = (type: CelebrationType) => {
    setCelebrationType(type)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 3000)
  }

  // Enhanced theme change function
  const changeTheme = async (themeKey: string) => {
    setThemeTransitioning(true)
    await new Promise(resolve => setTimeout(resolve, 150))
    setSelectedThemeKey(themeKey)
    setThemeTransitioning(false)
    setShowThemeGallery(false)
    triggerCelebration('theme')
  }

  // Existing bootcamp data and other state...
  const bootcampData: Record<number, any> = {
    1: { title:'Technical Foundation + HubSpot Certification', timeEstimate:'9-10 hours', modules:[
      { id:'1a', title:'HubSpot Email Marketing Certification', time:'4 hours', type:'certification', skill:'platform' },
      { id:'1b', title:'Advanced Deliverability Mastery', time:'2.5 hours', type:'technical', skill:'deliverability' },
      { id:'1c', title:'Platform Mastery Strategy', time:'2.5 hours', type:'practical', skill:'platform' },
    ]},
    2: { title:'Strategic Automation + Specialization', timeEstimate:'10-12 hours', modules:[
      { id:'2a', title:'Advanced Lifecycle Marketing Framework', time:'3 hours', type:'strategic', skill:'automation' },
      { id:'2b', title:'Behavioral Segmentation Excellence', time:'2.5 hours', type:'analytical', skill:'segmentation' },
    ]},
    3: { title:'Advanced Analytics + Career Portfolio', timeEstimate:'7-9 hours', modules:[
      { id:'3a', title:'Performance Analytics & ROI Attribution', time:'3 hours', type:'analytical', skill:'analytics' },
    ]}
  }

  // Rest of existing state management...
  const [decks, setDecks] = useState(()=> safeGet(`${NS}:decks`, []))
  const [activeDeckId, setActiveDeckId] = useState('')
  
  const [notesOpen, setNotesOpen] = useState(false)
  const [notesLabel, setNotesLabel] = useState('General')
  const [draftHtml, setDraftHtml] = useState('')
  const dirtyRef = useRef(false)

  // Enhanced progress calculation
  const overallProgress = useMemo(()=>{
    const total=(Object.values(bootcampData) as any[]).reduce((a,d)=>a+d.modules.length,0)
    const done=Object.keys(progress).filter(k=>progress[k]).length
    return Math.round((done/total)*100)
  },[progress])

  const openNotes = (ctx: string, label: string) => { setNotesLabel(label); setNotesOpen(true) }

  // Enhanced export function with better formatting
  const exportAllData=()=>{ 
    const lines=[
      `Morgan LMS — Complete Learning Report (${new Date().toLocaleString()})`,
      '='.repeat(60),
      '',
      `🎯 Overall Progress: ${overallProgress}%`,
      `🔥 Study Streak: ${studyStreak} day(s)`,
      `⏱️ Total Study Time: ${formatTime(totalTimeSpent)}`,
      `🏆 Achievements Earned: ${achievements.length}`,
      '',
      '📚 Skills Development:',
      ...skills.map(s => `  • ${s.label}: ${s.score.toFixed(1)}/5.0`),
      '',
      '📋 Task Summary:',
      `  • Next: ${tasks.filter(t=>t.status==='next').length}`,
      `  • Doing: ${tasks.filter(t=>t.status==='doing').length}`,
      `  • Done: ${tasks.filter(t=>t.status==='done').length}`,
      '',
      '🎨 Current Theme: ' + theme.name,
      '',
      'Generated by Morgan LMS — Phase 1',
      'Custom themes, micro-animations, and playful 3D — plus your core LMS',
    ].join('\n');
    exportTextFile(`Morgan_LMS_Report_${new Date().toISOString().slice(0,10)}.txt`, lines)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div 
        className={`theme-animate min-h-screen transition-all duration-500 ${themeTransitioning ? 'animate-pulse' : ''}`}
        style={{ 
          background: theme.gradientBg,
          backgroundSize: '400% 400%',
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .theme-transition { transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
          .theme-glow { animation: themeGlow 3s ease-in-out infinite; }
          @keyframes themeGlow {
            0%, 100% { filter: brightness(1) saturate(1); }
            50% { filter: brightness(1.1) saturate(1.2); }
          }
        `}} />

        {/* Components */}
        <Celebration 
          showCelebration={showCelebration} 
          celebrationType={celebrationType} 
          currentTheme={theme} 
        />
        
        <ThemeGallery 
          showThemeGallery={showThemeGallery}
          setShowThemeGallery={setShowThemeGallery}
          selectedTheme={selectedThemeKey}
          onThemeChange={changeTheme}
          currentTheme={theme}
        />

        {/* Enhanced Header */}
        <div className="header shadow-lg border-b backdrop-blur-sm" 
             style={{ backgroundColor: `${theme.cardGradient}90`, borderColor: theme.primary }}>
          <div className="container flex items-center justify-between" id="header-root">
            <div>
              <h1 className="text-2xl font-bold inline-flex items-center gap-2">
                <BarChart3 style={{ color: theme.accent }} className="w-6 h-6" />
                Morgan LMS — Phase 1
              </h1>
              <div className="text-sm" style={{ color: theme.gray }}>
                Custom themes, micro-animations, and playful 3D — plus your core LMS
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Enhanced Daily Goal */}
              <div className="text-center">
                <div className="text-sm" style={{ color: theme.gray }}>Daily Goal</div>
                <select
                  value={dailyGoal}
                  onChange={(e)=> setDailyGoal(parseInt(e.target.value))}
                  className="p-2 rounded border transition-all duration-300"
                  style={card}
                  aria-label="Set daily module goal"
                >
                  <option value={1}>1 module</option>
                  <option value={2}>2 modules</option>
                  <option value={3}>3 modules</option>
                  <option value={4}>4 modules</option>
                </select>
              </div>

              {/* Enhanced Study Streak */}
              <StatChip 
                label="Study Streak" 
                value={<><Flame className="w-4 h-4" style={{color: theme.warning}}/> {studyStreak}</>} 
                color={theme.warning} 
              />

              {/* Action Buttons */}
              <button type="button" onClick={exportAllData} 
                      className="p-2 rounded-lg border inline-flex items-center gap-2 btn-hover transition-all duration-300" 
                      style={card}>
                <FileDown className="w-4 h-4"/> Export
              </button>

              <button type="button" onClick={()=> openNotes(`day-${currentDay}`, `Day ${currentDay}`)} 
                      className="p-2 rounded-lg border inline-flex items-center gap-2 btn-hover transition-all duration-300" 
                      style={card}>
                <StickyNote className="w-4 h-4"/> Notes
              </button>

              {/* Enhanced Theme Button */}
              <button 
                type="button" 
                onClick={()=> setShowThemeGallery(true)} 
                className="p-2 rounded-lg inline-flex items-center gap-2 btn-hover transition-all duration-300 hover:scale-105"
                style={{ 
                  background: theme.accentGradient, 
                  color: 'white',
                  boxShadow: theme.glowEffect,
                  border: 'none'
                }}
              >
                <Palette className="w-4 h-4"/> Theme
              </button>
              
              {/* Enhanced Timer */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs" style={{ color: theme.gray }}>Study Time</div>
                  <div className="text-lg font-mono font-bold" style={{color: theme.primary}}>
                    {formatTime(studyTimer.time)}
                  </div>
                </div>
                <button
                  onClick={()=> setStudyTimer(prev => ({...prev, isRunning: !prev.isRunning}))}
                  className="p-2 rounded-lg text-white transition-all duration-300 hover:scale-110 shadow-lg"
                  style={{backgroundColor: studyTimer.isRunning ? theme.warning : theme.success}}
                  title={studyTimer.isRunning ? "Pause study timer" : "Start study timer"}
                  aria-label={studyTimer.isRunning ? "Pause study timer" : "Start study timer"}
                >
                  {studyTimer.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={()=> setStudyTimer({ isRunning: false, time: 0 })}
                  className="p-2 rounded-lg text-white transition-all duration-300 hover:scale-110 shadow-lg"
                  style={{ backgroundColor: theme.gray }}
                  title="Reset study timer"
                  aria-label="Reset study timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container" style={{ paddingTop: 16 }}>
          <div className="flex gap-3" style={{ flexWrap:'wrap', marginBottom: 16 }}>
            {([['bootcamp','Bootcamp', <BookOpen key="i" className="w-4 h-4"/>, `${overallProgress}%`],
               ['planner','Planner', <ClipboardList key="i" className="w-4 h-4"/>, tasks.filter(t=>t.status==='doing').length],
               ['flashcards','Flashcards', <Brain key="i" className="w-4 h-4"/>, null],
               ['skills','Skills', <Layers key="i" className="w-4 h-4"/>, null],
               ['analytics','Analytics', <BarChart3 key="i" className="w-4 h-4"/>, null]] as any[])
               .map(([id,label,icon,badge])=> (
                <button key={id}
                  type="button"
                  onClick={()=> setActiveTab(id)}
                  className={`p-2 rounded-lg border btn-hover transition-all duration-300 hover:scale-105 ${
                    activeTab===id ? 'shadow-lg scale-105' : 'hover:shadow-md'
                  }`}
                  style={{
                    background: activeTab === id ? theme.accentGradient : card.background,
                    borderColor: activeTab === id ? theme.primary : BORDER,
                    color: activeTab === id ? 'white' : INK
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    {icon}
                    <span className="font-medium">{label}</span>
                    {badge && (
                      <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-20">
                        {badge}
                      </span>
                    )}
                  </span>
                </button>
            ))}
          </div>

          {/* Tab Content */}
          <div 
            className="rounded-xl shadow-lg p-6 transition-all duration-500"
            style={{ 
              background: theme.cardGradient || 'rgba(255,255,255,0.95)',
              boxShadow: theme.glowEffect || '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
            {activeTab==='bootcamp' && (
              <BootcampView
                data={bootcampData}
                currentDay={currentDay}
                setCurrentDay={setCurrentDay}
                progress={progress}
                setProgress={setProgress}
                openNotes={openNotes}
                bumpSkill={bumpSkill}
                achievements={achievements}
                setAchievements={setAchievements}
                theme={theme}
                triggerCelebration={triggerCelebration}
                dailyGoal={dailyGoal}
              />
            )}

            {activeTab==='planner' && (
              <PlannerView tasks={tasks} setTasks={setTasks} bump={(k:string,v:number)=> bumpSkill(k,v)} />
            )}

            {activeTab==='flashcards' && (
              <FlashcardsView decks={decks} setDecks={setDecks} activeDeckId={activeDeckId} setActiveDeckId={setActiveDeckId} />
            )}

            {activeTab==='skills' && (
              <SkillsView skills={skills} theme={theme} />
            )}

            {activeTab==='analytics' && (
              <AnalyticsView activity={activity} theme={theme} />
            )}
          </div>
        </div>

        <NotesDock 
          open={notesOpen} 
          label={notesLabel} 
          html={draftHtml}
          setHtml={(s: string)=>{ dirtyRef.current=true; setDraftHtml(s) }}
          onClose={()=> setNotesOpen(false)} 
          insertTemplate={(template: string) => setDraftHtml(prev => prev + template)}
        />
      </div>
    </MotionConfig>
  )
}