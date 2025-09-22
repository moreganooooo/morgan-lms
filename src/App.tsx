import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { BookOpen, ClipboardList, Brain, Layers, BarChart3, Flame, FileDown, StickyNote, Palette, Play, Pause, RotateCcw, Clock } from 'lucide-react'
import { PRESETS, applyTheme } from './theme'
import { NS, INK, BORDER, safeGet, safeSet, formatTime, tsInsert, exportTextFile } from './utils'
import StatChip from './components/StatChip'
import SparklineMini from './components/SparklineMini'
import NotesDock from './components/NotesDock'
import BootcampView from './views/BootcampView'
import PlannerView from './views/PlannerView'
import FlashcardsView from './views/FlashcardsView'
import AnalyticsView from './views/AnalyticsView'
import SkillsView from './views/SkillsView'

export default function App(){
  const [activeTab, setActiveTab] = useState<'bootcamp'|'planner'|'flashcards'|'skills'|'analytics'>('bootcamp')
  const [selectedThemeKey, setSelectedThemeKey] = useState(()=> safeGet(`${NS}:themeKey`, 'ocean'))
  const theme = PRESETS[selectedThemeKey] || PRESETS.ocean
  useEffect(()=>{ applyTheme(theme); safeSet(`${NS}:themeKey`, selectedThemeKey) },[selectedThemeKey])

  const card = { background:'white', border:`1px solid ${BORDER}` } as const
  const [currentDay] = useState(1)

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

  const bootcampData: Record<number, any> = {
    1: { title:'Technical Foundation + HubSpot Certification', timeEstimate:'9-10 hours', modules:[
      { id:'1a', title:'HubSpot Email Marketing Certification', time:'4 hours', type:'certification', skill:'platform',
        resources:[{label:'HubSpot Academy',href:'https://academy.hubspot.com'},{label:'Syllabus PDF',href:'https://example.com/syllabus.pdf'}],
        knowledgeCheck:[{q:'Two core email KPIs?', a:'Open rate, CTR (or CTOR).'}],
        activities:['Create/confirm HubSpot Academy account','Enroll in Email Marketing Certification','Skim syllabus + outline notes in Notes panel','Complete 3 modules + quizzes','Download/export certificate (add to Achievements)'] },
      { id:'1b', title:'Advanced Deliverability Mastery', time:'2.5 hours', type:'technical', skill:'deliverability',
        resources:[{label:'Google Postmaster Tools',href:'https://postmaster.google.com'}],
        knowledgeCheck:[{q:'What is a seed list?', a:'A set of test inboxes to monitor placement.'}],
        activities:['Verify domain in Postmaster Tools','Audit SPF/DKIM/DMARC records','Draft warm-up plan by segment','Build seed list for Gmail/Outlook/Yahoo','Send test + log placement results'] },
      { id:'1c', title:'Platform Mastery Strategy', time:'2.5 hours', type:'practical', skill:'lifecycle',
        resources:[{label:'Miro Template',href:'https://example.com/miro-template'}],
        knowledgeCheck:[{q:'Lifecycle stages?', a:'Acquire → Onboard → Activate → Retain → Reactivate.'}],
        activities:['Map lifecycle in Miro using template','Define entry/exit criteria per stage','Pick 3 core KPIs (one per stage)','Draft 30/60/90 rollout checklist','List top 5 experiments to test'] },
    ]},
    2: { title:'Creative Systems + Copy Power-Ups', timeEstimate:'6-8 hours', modules:[
      {id:'2a',title:'Subject Line Lab',time:'2 hours',type:'creative',skill:'copy'},
      {id:'2b',title:'Lifecycle Mapping',time:'2 hours',type:'practical',skill:'lifecycle'},
      {id:'2c',title:'Analytics Deep Dive',time:'2 hours',type:'technical',skill:'analytics'}]},
    3: { title:'Automation + Optimization Day', timeEstimate:'6-7 hours', modules:[
      {id:'3a',title:'Journeys & Branching',time:'2.5 hours',type:'technical',skill:'automation'},
      {id:'3b',title:'Testing Playbook',time:'2 hours',type:'practical',skill:'analytics'},
      {id:'3c',title:'Maintenance & QA',time:'1.5 hours',type:'practical',skill:'platform'}]},
  }

  const [tasks, setTasks] = useState(()=> safeGet(`${NS}:tasks`, [
    { id: Math.random().toString(36).slice(2), title:'Day 1: HubSpot Email Cert — Section 1', status:'backlog', impact:{ platform: .3 } },
    { id: Math.random().toString(36).slice(2), title:'Write 10 subject lines', status:'progress', impact:{ copy: .3, deliverability: .1 } },
    { id: Math.random().toString(36).slice(2), title:'Salesforce report: cohort retention', status:'backlog', impact:{ analytics: .3 } },
  ]))
  useEffect(()=> safeSet(`${NS}:tasks`, tasks), [tasks])

  // timers & activity
  const [studyTimer, setStudyTimer] = useState({ isRunning:false, time:0 })
  const [totalTimeSpent, setTotalTimeSpent] = useState(()=> safeGet(`${NS}:totalTime`, 0))
  const [activity, setActivity] = useState<Record<string,number>>(()=> safeGet(`${NS}:activity`, {}))
  const [studyStreak, setStudyStreak] = useState(()=> safeGet(`${NS}:streak`, 0))
  const [lastStudyDate, setLastStudyDate] = useState(()=> safeGet(`${NS}:lastStudy`, ''))
  useEffect(()=> safeSet(`${NS}:totalTime`, totalTimeSpent), [totalTimeSpent])
  useEffect(()=> safeSet(`${NS}:activity`, activity), [activity])
  useEffect(()=> safeSet(`${NS}:streak`, studyStreak), [studyStreak])
  useEffect(()=> safeSet(`${NS}:lastStudy`, lastStudyDate), [lastStudyDate])

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

  useEffect(()=>{ if(studyTimer.isRunning){
    const today=new Date().toDateString();
    if(lastStudyDate!==today){ setStudyStreak(p=>p+1); setLastStudyDate(today) }
  }},[studyTimer.isRunning, lastStudyDate, setStudyStreak, setLastStudyDate])

  // activities checklist
  const [activitiesDone, setActivitiesDone] = useState<Record<string,boolean>>(()=> safeGet(`${NS}:activities`, {}))
  useEffect(()=> safeSet(`${NS}:activities`, activitiesDone), [activitiesDone])
  const actKey = (d:number, mid:string, i:number)=> `${d}-${mid}-a${i}`
  const toggleActivity = (d:number, mid:string, i:number)=>{ const k=actKey(d,mid,i); setActivitiesDone(p=>({...p,[k]:!p[k]})) }

  // expanded modules state for animations
  const [expanded, setExpanded] = useState<Record<string,boolean>>(()=> safeGet(`${NS}:expanded`, {}))
  useEffect(()=> safeSet(`${NS}:expanded`, expanded), [expanded])
  const toggleExpanded = (key:string)=> setExpanded(p=>({...p,[key]:!p[key]}))

  // flashcards
  const [decks, setDecks] = useState(()=> safeGet(`${NS}:decks`, [
    { id:'deck1', title:'Email Foundations', cards:[
      { id:'c1', front:'What does deliverability measure?', back:'Inbox placement likelihood (not just send success).', easeFactor:2.5, interval:0, repetitions:0, dueISO:new Date().toISOString() },
      { id:'c2', front:'Define CTOR', back:'Click-to-open rate: clicks / opens.', easeFactor:2.5, interval:0, repetitions:0, dueISO:new Date().toISOString() },
      { id:'c3', front:'Lifecycle stages?', back:'Acquire → Onboard → Activate → Retain → Reactivate.', easeFactor:2.5, interval:0, repetitions:0, dueISO:new Date().toISOString() },
    ] }
  ]))
  useEffect(()=> safeSet(`${NS}:decks`, decks), [decks])
  const [activeDeckId, setActiveDeckId] = useState('deck1')

  // notes dock
  const [notes, setNotes] = useState<Record<string,string>>(()=> safeGet(`${NS}:notes`, {}))
  const [notesOpen, setNotesOpen] = useState(false)
  const [notesKey, setNotesKey] = useState('day-1')
  const [notesLabel, setNotesLabel] = useState('Day 1')
  const [draftHtml, setDraftHtml] = useState('')
  const dirtyRef = useRef(false)
  useEffect(()=> safeSet(`${NS}:notes`, notes), [notes])
  useEffect(()=>{ if(!notesOpen) return; const id=setInterval(()=>{ if(dirtyRef.current){ setNotes(p=>({...p,[notesKey]:draftHtml})); dirtyRef.current=false } },1000); return ()=> clearInterval(id) },[notesOpen,notesKey,draftHtml])
  const openNotes=(key:string,label:string)=>{ setNotesKey(key); setNotesLabel(label); setDraftHtml(notes[key]||''); setNotesOpen(true) }
  const insertTemplate=(type:string)=>{
    const stamp = tsInsert();
    const map:Record<string,string>={
      action:`<div>${stamp}<strong>Action:</strong> </div>`,
      decision:`<div>${stamp}<strong>Decision:</strong> </div>`,
      follow:`<div>${stamp}<strong>Follow-up:</strong> </div>`,
      til:`<div>${stamp}<strong>TIL:</strong> </div>`,
      resource:`<div>${stamp}<strong>Resource:</strong> <a href=\"\" target=\"_blank\" rel=\"noreferrer\">link</a> — </div>`
    };
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const fragment = range.createContextualFragment(map[type]||`<div>${stamp}</div>`);
      range.deleteContents();
      range.insertNode(fragment);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  // derived
  const overallProgress = useMemo(()=>{ const total=(Object.values(bootcampData) as any[]).reduce((a,d)=>a+d.modules.length,0); const done=Object.keys(progress).filter(k=>progress[k]).length; return Math.round((done/total)*100) },[progress])
  const dayPercent=(d:number)=>{ const t=bootcampData[d].modules.length; const done=bootcampData[d].modules.filter((m:any)=>progress[`${d}-${m.id}`]).length; return Math.round((done/t)*100) }
  const getCompletedCertifications=()=>{ const certs:string[]=[]; Object.entries(bootcampData).forEach(([dn,day]:any)=> day.modules.forEach((m:any)=>{ if(m.type==='certification' && progress[`${dn}-${m.id}`]) certs.push(m.title) })) ; return certs }

  const [dailyGoal, setDailyGoal] = useState(2)

  const velocity14 = useMemo(()=> Array.from({length:14}, (_,i)=>{ const d=new Date(); d.setDate(d.getDate()-(13-i)); const k=d.toISOString().slice(0,10); return Math.round((activity[k]||0)/60) }), [activity])

  const exportAllData=()=>{ 
    const lines=[
      `Ultimate Email Marketing LMS — Report (${new Date().toLocaleString()})`,
      '',
      `Overall Progress: ${overallProgress}%`,
      `Study Streak: ${studyStreak} day(s)`,
      `Study Time: ${formatTime(totalTimeSpent)}`,
      `Achievements Earned: ${achievements.length}/4`,
      '',
      'Completed Certifications:',
      ...(getCompletedCertifications().length?getCompletedCertifications():['— none yet —']).map(s=>`  • ${s}`)
    ].join('\n');
    exportTextFile(`LMS_Report_${new Date().toISOString().slice(0,10)}.txt`, lines)
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className={`theme-animate`}>
      {/* Header */}
      <div className="header">
        <div className="container flex items-center justify-between" id="header-root">
          <div>
            <h1 className="text-2xl font-bold inline-flex items-center gap-2"><BarChart3 style={{ color: theme.accent }} /> Morgan LMS — Phase 1</h1>
            <div className="text-sm" style={{ color: theme.gray }}>Custom themes, micro-animations, and playful 3D — plus your core LMS</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-sm" style={{ color: theme.gray }}>Daily Goal</div>
              <select
                value={dailyGoal}
                onChange={(e)=> setDailyGoal(parseInt(e.target.value))}
                className="p-2 rounded border"
                style={card}
                aria-label="Set daily module goal"
              >
                <option value={1}>1 module</option>
                <option value={2}>2 modules</option>
                <option value={3}>3 modules</option>
                <option value={4}>4 modules</option>
              </select>
            </div>
            <StatChip label="Study Streak" value={<><Flame className="w-4 h-4"/> {studyStreak}</>} color={theme.warning} />
            <div className="text-center" style={{ display:'none' }}>
              <div className="text-sm" style={{ color: theme.gray }}>Velocity (14d)</div>
              <SparklineMini data={velocity14} />
            </div>
            <button type="button" onClick={exportAllData} className="p-2 rounded-lg border inline-flex items-center gap-2 btn-hover" style={card}><FileDown className="w-4 h-4"/> Export</button>
            <button type="button" onClick={()=> openNotes(`day-${currentDay}`, `Day ${currentDay}`)} className="p-2 rounded-lg border inline-flex items-center gap-2 btn-hover" style={card}><StickyNote className="w-4 h-4"/> Notes</button>
            <button type="button" onClick={()=> setSelectedThemeKey(selectedThemeKey==='ocean'?'cyber':'ocean')} className="p-2 rounded-lg border inline-flex items-center gap-2 btn-hover" style={card}><Palette className="w-4 h-4"/> Theme</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container" style={{ paddingTop: 16 }}>
        <div className="flex gap-3" style={{ flexWrap:'wrap', marginBottom: 16 }}>
          {([['bootcamp','Bootcamp', <BookOpen key="i" className="w-4 h-4"/>],
             ['planner','Planner', <ClipboardList key="i" className="w-4 h-4"/>],
             ['flashcards','Flashcards', <Brain key="i" className="w-4 h-4"/>],
             ['skills','Skills', <Layers key="i" className="w-4 h-4"/>],
             ['analytics','Analytics', <BarChart3 key="i" className="w-4 h-4"/>]] as any[])
             .map(([id,label,icon])=> (
              <button key={id}
                type="button"
                onClick={()=> setActiveTab(id)}
                className={`p-2 rounded-lg border btn-hover ${activeTab===id?'shadow-md':''}`}
                style={card}>
                <span className="inline-flex items-center gap-2">{icon}<span className="text-sm font-medium">{label}</span></span>
              </button>
          ))}
        </div>

        {activeTab==='bootcamp' && (
          <BootcampView
            data={bootcampData}
            currentDay={currentDay}
            progress={progress}
            setProgress={setProgress}
            openNotes={openNotes}
            bumpSkill={bumpSkill}
            achievements={achievements}
            setAchievements={setAchievements}
            theme={theme}
            BORDER={BORDER}
            card={card}
            INK={INK}
            actKey={actKey}
            activitiesDone={activitiesDone}
            toggleActivity={toggleActivity}
            dayPercent={dayPercent}
            expanded={expanded}
            toggleExpanded={toggleExpanded}
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

        {/* Floating timer controls */}
        <div className="flex gap-2" style={{ position:'fixed', bottom: 16, right: 16 }}>
          <button type="button" onClick={()=> setStudyTimer(p=>({...p,isRunning:!p.isRunning}))} className="p-3 rounded text-white btn-hover" style={{ background: studyTimer.isRunning? theme.warning : theme.success }}>
            {studyTimer.isRunning? <Pause className="w-5 h-5"/>: <Play className="w-5 h-5"/>}
          </button>
          <button
            type="button"
            onClick={()=> setStudyTimer({ isRunning:false, time:0 })}
            className="p-3 rounded btn-hover card-style"
            title="Reset Study Timer"
          >
            <RotateCcw className="w-5 h-5"/>
          </button>
          <div className="card p-2" style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
            <div className="text-sm" style={{ color: theme.gray }}><Clock className="w-3 h-3"/> Study Time</div>
            <div className="text-lg font-mono" style={{ color: theme.primary }}>{formatTime(studyTimer.time)}</div>
          </div>
        </div>
      </div>

      <NotesDock open={notesOpen} label={notesLabel} html={draftHtml}
        setHtml={(s: string)=>{ dirtyRef.current=true; setDraftHtml(s) }}
        onClose={()=> setNotesOpen(false)} insertTemplate={insertTemplate} />
      </div>
    </MotionConfig>
  )
}
