import React from 'react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function SkillsView({skills, theme}:{skills:{id:string;label:string;score:number}[]; theme:any}){
  const data = skills.map(s=> ({ subject:s.label, A:s.score, fullMark:5 }))
  return (
    <div className="card p-4">
      <div className="font-bold" style={{ marginBottom:8 }}>Skills Radar</div>
      <div style={{ width:'100%', height:300 }}>
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 5]} />
            <Radar name="You" dataKey="A" stroke={theme.primary} fill={theme.primary} fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
