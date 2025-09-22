import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Clock, Layers, StickyNote, ChevronDown, ChevronRight } from 'lucide-react'
import ProgressCube from '../components/ProgressCube'
import { CardMotion, spring } from '../animations'

export default function BootcampView({
  data, currentDay, progress, setProgress, openNotes, bumpSkill, achievements, setAchievements, theme,
  BORDER, card, INK, actKey, activitiesDone, toggleActivity, dayPercent, expanded, toggleExpanded
}:{
  data:any; currentDay:number; progress:Record<string,boolean>; setProgress:any; openNotes:(k:string,label:string)=>void; bumpSkill:(id:string,delta:number)=>void;
  achievements:string[]; setAchievements:any; theme:any; BORDER:string; card:any; INK:string;
  actKey:(d:number,mid:string,i:number)=>string; activitiesDone:Record<string,boolean>; toggleActivity:(d:number,mid:string,i:number)=>void; dayPercent:(d:number)=>number;
  expanded:Record<string,boolean>; toggleExpanded:(key:string)=>void;
}){
  return (
    <div className="space-y-3">
      <div className="card p-4" style={{ background:'linear-gradient(180deg,#ecfdf5 0%,#f5f3ff 100%)' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm" style={{ color: theme.gray }}>Today’s Progress</div>
            <div className="text-3xl font-bold" style={{ color: INK }}>
              {Object.keys(progress).filter(k=>k.startsWith(`${currentDay}-`) && progress[k]).length}
              {' '} / {data[currentDay].modules.length}
            </div>
          </div>
          <ProgressCube pct={dayPercent(currentDay)} />
        </div>
      </div>

      {data[currentDay].modules.map((m:any)=>{
        const key = `${currentDay}-${m.id}`;
        const done = !!progress[key];
        const open = !!expanded[key];
        return (
          <CardMotion key={key} className="p-4 rounded-xl" style={card}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={()=>{
                    const was=!!progress[key];
                    setProgress((p:any)=>({...p,[key]:!p[key]}));
                    if(!was){
                      if(m?.skill) bumpSkill(m.skill,0.5);
                      if(m?.type==='certification'&&!achievements.includes('first-cert')) setAchievements((a:string[])=>[...a,'first-cert']);
                      if(!achievements.includes('first-module')) setAchievements((a:string[])=>[...a,'first-module']);
                    }
                  }}
                  className="p-1 rounded border btn-hover"
                  aria-label={done? 'Mark incomplete':'Mark complete'}
                >
                  {done? <CheckCircle2 className="w-5 h-5" style={{ color: theme.success }}/> : <Circle className="w-5 h-5" style={{ color:'#94a3b8' }}/>}
                </button>
                <div>
                  <div className="font-medium" style={{ color: INK }}>{m.title}</div>
                  <div className="text-sm flex items-center gap-3" style={{ color: theme.gray }}>
                    <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3"/> {m.time}</span>
                    <span className="inline-flex items-center gap-1"><Layers className="w-3 h-3"/> {m.type}</span>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2">
                <button type="button" onClick={()=>toggleExpanded(key)} className="px-2 py-1 text-sm rounded-lg border inline-flex items-center gap-1 btn-hover">
                  {open ? <ChevronDown className="w-3 h-3"/> : <ChevronRight className="w-3 h-3"/>}
                  Details
                </button>
                <button type="button" onClick={()=>openNotes(`module-${key}`, m.title)} className="px-2 py-1 text-sm rounded-lg border inline-flex items-center gap-1 btn-hover">
                  <StickyNote className="w-3 h-3"/> Notes
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
                    <div>
                      <div className="font-semibold" style={{ color: INK, marginBottom:4 }}>Resources</div>
                      <ul className="list-disc" style={{ paddingLeft:18 }}>
                        {(m.resources||[]).map((r:any)=>(<li key={r.href}><a className="underline" href={r.href} target="_blank" rel="noreferrer">{r.label}</a></li>))}
                        {(!m.resources||m.resources.length===0)&&<li className="opacity-60">None</li>}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: INK, marginBottom:4 }}>Knowledge Check</div>
                      <ul className="list-disc" style={{ paddingLeft:18 }}>
                        {(m.knowledgeCheck||[]).map((k:any,i:number)=>(<li key={i}><b>Q:</b> {k.q}<div className="opacity-80"><b>A:</b> {k.a}</div></li>))}
                        {(!m.knowledgeCheck||m.knowledgeCheck.length===0)&&<li className="opacity-60">None</li>}
                      </ul>
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: INK, marginBottom:4 }}>Activities</div>
                      <ul className="list-disc" style={{ paddingLeft:18 }}>
                        {(m.activities||[]).map((a:string,i:number)=>{
                          const ak=actKey(currentDay,m.id,i); const ad=!!activitiesDone[ak];
                          return (
                            <li key={ak} className="flex items-center gap-2">
                              <input type="checkbox" checked={ad} onChange={()=>toggleActivity(currentDay,m.id,i)} aria-label={`Activity: ${a}`} />
                              <span className={ad? 'opacity-60':''} style={{ textDecoration: ad?'line-through':'none' }}>{a}</span>
                            </li>
                          )
                        })}
                        {(!m.activities||m.activities.length===0)&&<li className="opacity-60">None</li>}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardMotion>
        )
      })}
    </div>
  )
}
