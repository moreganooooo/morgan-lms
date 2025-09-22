import { motion } from 'framer-motion'
import { spring } from '../animations'

export default function PlannerView({tasks, setTasks, bump}:{tasks:any[]; setTasks:any; bump:(k:string,v:number)=>void}){
  const cols = ['backlog','progress','done'] as const
  const move=(id:string)=> setTasks((prev:any[])=>prev.map(t=>{
    if(t.id!==id) return t;
    const idx=cols.indexOf(t.status);
    const next=cols[Math.min(cols.length-1, idx+1)];
    if(next==='done'&&t.status!=='done'&&t.impact){ Object.entries(t.impact).forEach(([k,v]:any)=> bump(k,v)) }
    return {...t, status:next}
  }))
  const del=(id:string)=> setTasks((prev:any[])=>prev.filter(t=>t.id!==id))
  return (
    <motion.div layout className="grid" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
      {cols.map(c=> (
        <motion.div key={c} layout className="card p-3">
          <div className="text-lg font-bold" style={{ marginBottom:8, textTransform:'capitalize' }}>{c}</div>
          <div className="space-y-3">
            {(tasks.filter(t=>t.status===c)).map(t=> (
              <motion.div
                key={t.id}
                layout
                transition={spring}
                className="card p-3 rounded-lg border cursor-pointer btn-hover"
                onClick={()=>move(t.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium">{t.title}</div>
                <div className="text-sm opacity-60">Impact: {t.impact? Object.keys(t.impact).join(', '): '—'}</div>
                <div className="flex gap-2" style={{ marginTop:8 }}>
                  <button type="button" onClick={(e)=>{e.stopPropagation(); move(t.id)}} className="btn-hover p-1 border rounded text-xs">Move →</button>
                  <button type="button" onClick={(e)=>{e.stopPropagation(); del(t.id)}} className="btn-hover p-1 border rounded text-xs">Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
