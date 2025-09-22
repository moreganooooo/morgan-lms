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
    <div className="grid" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
      {cols.map(c=> (
        <div key={c} className="card p-3">
          <div className="text-lg font-bold" style={{ marginBottom:8, textTransform:'capitalize' }}>{c}</div>
          {(tasks.filter(t=>t.status===c)).map(t=> (
            <div key={t.id} className="card p-2" style={{ marginBottom:8 }}>
              <div className="font-medium">{t.title}</div>
              <div className="text-sm opacity-60">Impact: {t.impact? Object.keys(t.impact).join(', '): '—'}</div>
              <div className="flex gap-2" style={{ marginTop:8 }}>
                <button type="button" onClick={()=>move(t.id)} className="btn-hover p-1 border rounded">Move →</button>
                <button type="button" onClick={()=>del(t.id)} className="btn-hover p-1 border rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
