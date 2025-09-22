import React from 'react'
export default function StatChip({label,value,color}:{label:string;value:React.ReactNode;color:string}){
  return (
    <div className="text-center">
      <div className="text-sm" style={{ color:'#64748b' }}>{label}</div>
      <div className="text-lg font-bold inline-flex items-center justify-center gap-1" style={{ color }}>{value}</div>
    </div>
  )
}
