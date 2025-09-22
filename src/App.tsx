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
import { INITIAL_SKILLS, MODULE_SKILL_MAPPING } from './skillsData';

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

// Enhanced Skills System
const calculateSkillProgression = (baseSkills: any[], progress: Record<string, boolean>) => {
  const updatedSkills = baseSkills.map(skill => ({ ...skill }));
  
  // Apply skill gains for completed modules
  Object.keys(progress).forEach(moduleKey => {
    if (progress[moduleKey]) {
      const skillGains = MODULE_SKILL_MAPPING[moduleKey];
      if (skillGains) {
        Object.entries(skillGains).forEach(([skillId, gain]) => {
          const skillIndex = updatedSkills.findIndex(s => s.id === skillId);
          if (skillIndex !== -1) {
            updatedSkills[skillIndex] = {
              ...updatedSkills[skillIndex],
              score: Math.min(5.0, updatedSkills[skillIndex].score + (gain as number))
            };
          }
        });
      }
    }
  });
  
  return updatedSkills;
};

// Replace your skills state initialization:
const [skills, setSkills] = useState(() => {
  const savedProgress = safeGet(`${NS}:progress`, {});
  return calculateSkillProgression(INITIAL_SKILLS, savedProgress);
});

// Update skills whenever progress changes (add this useEffect):
useEffect(() => {
  const updatedSkills = calculateSkillProgression(INITIAL_SKILLS, progress);
  setSkills(updatedSkills);
}, [progress]);

// Enhanced bumpSkill function (keep for manual skill adjustments if needed):
const bumpSkill = (id: string, delta = 0.3) => {
  setSkills(prev => prev.map(s => 
    s.id === id ? { ...s, score: Math.min(5, s.score + delta) } : s
  ));
};

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

// Enhanced bootcamp data with comprehensive, realistic content
  const bootcampData: Record<number, any> = {
    1: { 
      title:'Technical Foundation + HubSpot Certification', 
      timeEstimate:'9-10 hours', 
      modules:[
        { 
          id:'1a', 
          title:'HubSpot Email Marketing Certification', 
          time:'4 hours', 
          type:'certification', 
          skill:'platform',
          objective: 'Master HubSpot\'s email marketing tools and best practices',
          resources: [
            { title: 'HubSpot Email Marketing Certification', url: 'https://academy.hubspot.com/courses/email-marketing', type: 'course' },
            { title: 'Email Marketing Planning Template', url: 'https://offers.hubspot.com/email-marketing-planning-template', type: 'template' },
            { title: 'Email Design Guide + Examples', url: 'https://blog.hubspot.com/marketing/email-design-guide', type: 'guide' },
            { title: 'HubSpot Email Tool Documentation', url: 'https://knowledge.hubspot.com/email', type: 'documentation' },
            { title: '50 Email Templates (Free)', url: 'https://offers.hubspot.com/email-templates', type: 'templates' }
          ],
          knowledgeCheck: {
            question: 'What are the two most important email KPIs for measuring engagement?',
            answer: 'Open rate (measures subject line effectiveness) and Click-through rate/CTR (measures content relevance and CTA effectiveness).'
          },
          activities: [
            'Create HubSpot Academy account and enroll in Email Marketing Certification',
            'Download and review the Email Marketing Planning Template',
            'Complete modules 1-3 of the certification course',
            'Take practice quiz and review any weak areas',
            'Complete final certification exam (passing score required)',
            'Download certificate and add to LinkedIn/professional portfolio'
          ]
        },
        { 
          id:'1b', 
          title:'Advanced Deliverability Mastery', 
          time:'2.5 hours', 
          type:'technical', 
          skill:'deliverability',
          objective: 'Ensure your emails reach the inbox, not spam folders',
          resources: [
            { title: 'Google Postmaster Tools', url: 'https://www.gmail.com/postmaster/', type: 'tool' },
            { title: 'Microsoft SNDS (Smart Network Data Services)', url: 'https://sendersupport.olc.protection.outlook.com/snds/', type: 'tool' },
            { title: 'MXToolbox Email Deliverability Test', url: 'https://mxtoolbox.com/deliverability/', type: 'tool' },
            { title: 'Deliverability Guide by Mailchimp', url: 'https://mailchimp.com/resources/email-deliverability-guide/', type: 'guide' },
            { title: 'SPF, DKIM, DMARC Setup Guide', url: 'https://www.validity.com/blog/email-authentication/', type: 'tutorial' },
            { title: 'Email Warming Strategy Template', url: 'https://docs.google.com/spreadsheets/d/1example', type: 'template' }
          ],
          knowledgeCheck: {
            question: 'What is a seed list and why is it critical for deliverability monitoring?',
            answer: 'A seed list is a collection of test email addresses across major ISPs (Gmail, Outlook, Yahoo, etc.) used to monitor where emails land (inbox, spam, promotions). It\'s critical because it provides real-time placement data before sending to your main list.'
          },
          activities: [
            'Set up Google Postmaster Tools for your sending domain',
            'Run deliverability audit using MXToolbox for current domain',
            'Verify SPF, DKIM, and DMARC records are properly configured',
            'Create seed list with 10+ addresses across major ISPs',
            'Build 30-day email warming plan with gradual volume increases',
            'Document baseline deliverability metrics and set monitoring schedule'
          ]
        },
        { 
          id:'1c', 
          title:'Platform Mastery Strategy', 
          time:'2.5 hours', 
          type:'practical', 
          skill:'platform',
          objective: 'Navigate and optimize email marketing platforms like a pro',
          resources: [
            { title: 'Email Platform Comparison Matrix', url: 'https://www.campaignmonitor.com/blog/email-marketing/best-email-marketing-software/', type: 'comparison' },
            { title: 'Customer Journey Mapping Template', url: 'https://miro.com/templates/customer-journey-map/', type: 'template' },
            { title: 'Email Automation Workflow Builder', url: 'https://www.lucidchart.com/pages/examples/email-workflow-template', type: 'tool' },
            { title: 'Platform Migration Checklist', url: 'https://blog.mailchimp.com/switching-email-providers/', type: 'checklist' },
            { title: 'Advanced Segmentation Strategies', url: 'https://blog.hubspot.com/marketing/advanced-email-segmentation', type: 'guide' },
            { title: 'Platform ROI Calculator', url: 'https://calculator.net/investment-calculator.html', type: 'calculator' }
          ],
          knowledgeCheck: {
            question: 'What are the 5 key lifecycle stages in email marketing?',
            answer: 'Acquire (lead generation) → Onboard (welcome series) → Activate (first value/purchase) → Retain (ongoing engagement) → Reactivate (win-back campaigns).'
          },
          activities: [
            'Audit current email platform capabilities and gaps',
            'Map customer lifecycle stages using Miro template',
            'Define entry/exit criteria for each lifecycle stage',
            'Identify 3 core KPIs for each stage (acquisition, engagement, revenue)',
            'Create 90-day platform optimization roadmap',
            'List top 5 A/B tests to run in next quarter'
          ]
        },
      ]
    },
    2: { 
      title:'Strategic Automation + Specialization', 
      timeEstimate:'10-12 hours', 
      modules:[
        { 
          id:'2a', 
          title:'Advanced Lifecycle Marketing Framework', 
          time:'3 hours', 
          type:'strategic', 
          skill:'lifecycle',
          objective: 'Create nurture campaigns that guide customers through every stage',
          resources: [
            { title: 'Lifecycle Marketing Masterclass (HubSpot)', url: 'https://academy.hubspot.com/courses/lifecycle-marketing', type: 'course' },
            { title: 'Automated Email Workflow Templates', url: 'https://blog.klaviyo.com/email-automation-templates', type: 'templates' },
            { title: 'Customer Lifecycle Analytics Dashboard', url: 'https://www.klipfolio.com/resources/articles/what-is-a-customer-lifecycle-dashboard', type: 'tool' },
            { title: 'Lifecycle Stage Definitions Guide', url: 'https://blog.hubspot.com/service/what-does-it-mean-to-be-lifecycle-stage-customer', type: 'guide' },
            { title: 'Trigger-Based Email Strategy', url: 'https://www.campaignmonitor.com/blog/email-marketing/behavioral-triggered-emails/', type: 'strategy' },
            { title: 'Lifecycle Metrics Tracking Template', url: 'https://docs.google.com/spreadsheets/d/lifecycle-example', type: 'template' }
          ],
          knowledgeCheck: {
            question: 'What triggers should move a contact from "Lead" to "Marketing Qualified Lead" status?',
            answer: 'Combination of engagement (email opens/clicks, content downloads) + demographic fit (company size, role) + behavioral triggers (pricing page visits, demo requests, multiple touchpoints within set timeframe).'
          },
          activities: [
            'Map detailed customer journey from awareness to advocacy',
            'Set up automated workflows for each lifecycle transition',
            'Create behavioral trigger logic for stage progression',
            'Build welcome series with 5-7 touchpoints over 2 weeks',
            'Design win-back campaign for dormant subscribers',
            'Implement lead scoring model with lifecycle criteria'
          ]
        },
        { 
          id:'2b', 
          title:'Behavioral Segmentation Excellence', 
          time:'2.5 hours', 
          type:'analytical', 
          skill:'analytics',
          objective: 'Segment audiences based on behavior for maximum engagement',
          resources: [
            { title: 'Advanced Segmentation Strategies', url: 'https://blog.mailchimp.com/advanced-email-segmentation/', type: 'guide' },
            { title: 'Customer Data Platform Guide', url: 'https://blog.hubspot.com/service/what-is-a-customer-data-platform', type: 'guide' },
            { title: 'RFM Analysis Template (Excel)', url: 'https://www.kaggle.com/datasets/puneetbhaya/rfm-analysis', type: 'template' },
            { title: 'Google Analytics 4 for Email', url: 'https://support.google.com/analytics/answer/9267735', type: 'tutorial' },
            { title: 'Predictive Analytics for Email', url: 'https://blog.klaviyo.com/predictive-analytics-email-marketing', type: 'advanced' },
            { title: 'Segment Performance Tracking', url: 'https://help.mailchimp.com/en/articles/360034378371', type: 'documentation' }
          ],
          knowledgeCheck: {
            question: 'What are the three dimensions of RFM analysis and why are they powerful for email segmentation?',
            answer: 'Recency (how recently they engaged), Frequency (how often they engage), Monetary (how much they spend). Powerful because it identifies your best customers, at-risk customers, and optimal messaging frequency for each segment.'
          },
          activities: [
            'Perform RFM analysis on current subscriber base',
            'Create behavioral segments based on engagement patterns',
            'Set up dynamic segments that update automatically',
            'Build targeted campaigns for each behavioral segment',
            'A/B test messaging for high-value vs. at-risk segments',
            'Implement predictive scoring for churn risk'
          ]
        },
      ]
    },
    3: { 
      title:'Advanced Analytics + Career Portfolio', 
      timeEstimate:'7-9 hours', 
      modules:[
        { 
          id:'3a', 
          title:'Performance Analytics & ROI Attribution', 
          time:'3 hours', 
          type:'analytical', 
          skill:'analytics',
          objective: 'Track, measure, and prove the value of your email campaigns',
          resources: [
            { title: 'Google Analytics 4 Email Tracking Setup', url: 'https://support.google.com/analytics/answer/9267735', type: 'tutorial' },
            { title: 'Email ROI Calculator Template', url: 'https://blog.hubspot.com/marketing/how-to-calculate-email-marketing-roi', type: 'calculator' },
            { title: 'Marketing Attribution Models Guide', url: 'https://blog.google/products/ads/marketing-attribution-models/', type: 'guide' },
            { title: 'Looker Studio Email Dashboard Template', url: 'https://datastudio.google.com/gallery', type: 'template' },
            { title: 'UTM Parameter Best Practices', url: 'https://support.google.com/analytics/answer/1033867', type: 'guide' },
            { title: 'Email Performance Benchmarks', url: 'https://www.campaignmonitor.com/resources/guides/email-marketing-benchmarks/', type: 'benchmarks' },
            { title: 'Advanced Email Analytics (Klaviyo)', url: 'https://help.klaviyo.com/hc/en-us/articles/115005248128', type: 'documentation' }
          ],
          knowledgeCheck: {
            question: 'How do you calculate true email marketing ROI and what attribution model should you use?',
            answer: 'ROI = (Revenue - Cost) / Cost × 100. Use multi-touch attribution (not last-click) since email often plays an assist role. Track both direct conversions and influenced conversions within 7-30 day windows.'
          },
          activities: [
            'Set up UTM tracking for all email campaigns',
            'Create custom email dashboard in Google Analytics 4',
            'Build comprehensive ROI tracking spreadsheet',
            'Implement multi-touch attribution reporting',
            'Set up automated performance alerts for key metrics',
            'Create executive-level performance report template',
            'Document case studies showing email marketing impact'
          ]
        },
      ]
    }
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
          background: theme.staticBg, // Using static background instead of animated
        }}
      >
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

        {/* Enhanced Header with Better Layout and Contrast */}
        <div className="shadow-lg border-b backdrop-blur-sm" 
             style={{ 
               backgroundColor: theme.headerBg,
               borderColor: theme.primary,
               padding: '24px 0'
             }}>
          <div className="container" id="header-root">
            {/* Top Row: Title and Theme/Export Actions */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold inline-flex items-center gap-3" 
                    style={{ color: theme.headerText }}>
                  <BarChart3 style={{ color: theme.accent }} className="w-8 h-8" />
                  Morgan LMS — Phase 1
                </h1>
                <div className="text-sm mt-1" style={{ color: theme.headerSubtext }}>
                  Custom themes, micro-animations, and playful 3D — plus your core LMS
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button type="button" onClick={exportAllData} 
                        className="p-3 rounded-lg border inline-flex items-center gap-2 btn-hover transition-all duration-300" 
                        style={{
                          background: theme.buttonBg,
                          borderColor: theme.buttonBorder,
                          color: theme.buttonText
                        }}>
                  <FileDown className="w-4 h-4"/> Export
                </button>

                <button type="button" onClick={()=> openNotes(`day-${currentDay}`, `Day ${currentDay}`)} 
                        className="p-3 rounded-lg border inline-flex items-center gap-2 btn-hover transition-all duration-300" 
                        style={{
                          background: theme.buttonBg,
                          borderColor: theme.buttonBorder,
                          color: theme.buttonText
                        }}>
                  <StickyNote className="w-4 h-4"/> Notes
                </button>

                {/* Enhanced Theme Button */}
                <button 
                  type="button" 
                  onClick={()=> setShowThemeGallery(true)} 
                  className="p-3 rounded-lg inline-flex items-center gap-2 btn-hover transition-all duration-300 hover:scale-105"
                  style={{ 
                    background: theme.accentGradient, 
                    color: 'white',
                    boxShadow: theme.glowEffect,
                    border: 'none'
                  }}
                >
                  <Palette className="w-4 h-4"/> Theme
                </button>
              </div>
            </div>

            {/* Bottom Row: Stats and Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Daily Goal */}
                <StatChip
                  label="Daily Goal"
                  value={<><Target className="w-4 h-4" style={{color: theme.primary}}/> {dailyGoal} modules</>}
                  color={theme.primary}
                />

                {/* Study Streak */}
                <StatChip 
                  label="Study Streak" 
                  value={<><Flame className="w-4 h-4" style={{color: theme.warning}}/> {studyStreak}</>} 
                  color={theme.warning} 
                />

                {/* Overall Progress */}
                <StatChip 
                  label="Overall Progress" 
                  value={`${overallProgress}%`} 
                  color={theme.primary} 
                />
              </div>
              
              {/* Timer Controls */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs mb-1" style={{ color: theme.headerSubtext }}>Study Time</div>
                  <div className="text-xl font-mono font-bold" style={{color: theme.primary}}>
                    {formatTime(studyTimer.time)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={()=> setStudyTimer(prev => ({...prev, isRunning: !prev.isRunning}))}
                    className="p-3 rounded-lg text-white transition-all duration-300 hover:scale-110 shadow-lg"
                    style={{backgroundColor: studyTimer.isRunning ? theme.warning : theme.success}}
                    title={studyTimer.isRunning ? "Pause study timer" : "Start study timer"}
                    aria-label={studyTimer.isRunning ? "Pause study timer" : "Start study timer"}
                  >
                    {studyTimer.isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={()=> setStudyTimer({ isRunning: false, time: 0 })}
                    className="p-3 rounded-lg text-white transition-all duration-300 hover:scale-110 shadow-lg"
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
        </div>

        {/* Tabs */}
        <div className="container" style={{ paddingTop: 24 }}>
          <div className="flex gap-3" style={{ flexWrap:'wrap', marginBottom: 24 }}>
            {([['bootcamp','Bootcamp', <BookOpen key="i" className="w-4 h-4"/>, `${overallProgress}%`],
               ['planner','Planner', <ClipboardList key="i" className="w-4 h-4"/>, tasks.filter(t=>t.status==='doing').length],
               ['flashcards','Flashcards', <Brain key="i" className="w-4 h-4"/>, null],
               ['skills','Skills', <Layers key="i" className="w-4 h-4"/>, null],
               ['analytics','Analytics', <BarChart3 key="i" className="w-4 h-4"/>, null]] as any[])
               .map(([id,label,icon,badge])=> (
                <button key={id}
                  type="button"
                  onClick={()=> setActiveTab(id)}
                  className={`p-3 rounded-lg border btn-hover transition-all duration-300 hover:scale-105 ${
                    activeTab===id ? 'shadow-lg scale-105' : 'hover:shadow-md'
                  }`}
                  style={{
                    background: activeTab === id ? theme.accentGradient : theme.buttonBg,
                    borderColor: activeTab === id ? theme.primary : theme.buttonBorder,
                    color: activeTab === id ? 'white' : theme.buttonText
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    {icon}
                    <span className="font-medium">{label}</span>
                    {badge && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray bg-opacity-20">
                        {badge}
                      </span>
                    )}
                  </span>
                </button>
            ))}
          </div>

          {/* Tab Content */}
          <div 
            className="rounded-xl shadow-lg p-8 transition-all duration-500"
            style={{ 
              background: theme.contentBg,
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