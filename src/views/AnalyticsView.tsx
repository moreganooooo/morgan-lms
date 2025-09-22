import React, { useMemo } from 'react'

export default function AnalyticsView({activity, theme}:{activity:Record<string,number>; theme:any}){
  const last30 = useMemo(()=> Array.from({length:30}, (_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(29-i));
    const k=d.toISOString().slice(0,10); const seconds=activity[k]||0;
    let lvl=0; if(seconds>0&&seconds<900) lvl=1; else if(seconds>=900&&seconds<1800) lvl=2; else if(seconds>=1800) lvl=3;
    const opacity=[.15,.35,.6,.9][lvl]; const bg=lvl===0?'#e5e7eb':theme.primary;
    return {k, minutes:Math.round(seconds/60), bg, opacity}
  }), [activity, theme])
  return (
    <div className="card p-4">
      <div className="font-bold">Activity — last 30 days</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(10, 1fr)', gap:4, marginTop:12 }}>
        {last30.map(x=> <div key={x.k} title={`${x.k}: ${x.minutes} min`} style={{ height:20, borderRadius:6, background:x.bg, opacity:x.opacity }} />)}
      </div>
    </div>
  )
}
