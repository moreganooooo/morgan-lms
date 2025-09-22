import React from 'react'
export default function ProgressCube({ pct }:{ pct:number }){
  return (
    <div className="cube-wrap">
      <div className="cube">
        {['front','back','left','right','top','bottom'].map(f=> (
          <div key={f} className={`face ${f}`}>{pct}%</div>
        ))}
      </div>
    </div>
  )
}
