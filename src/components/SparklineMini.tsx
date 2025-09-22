import React from 'react'
export default function SparklineMini({data}:{data:number[]}){
  const w=80,h=24,p=2;
  const max=Math.max(1,...data);
  const step=(w-2*p)/((data.length-1)||1);
  const toY=(v:number)=> h - p - (v/max)*(h-2*p);
  const d=data.map((v,i)=>`${i===0?'M':'L'} ${p+i*step} ${toY(v)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <path d={d} fill="none" stroke="var(--theme-primary)" strokeWidth={2} />
    </svg>
  )
}
