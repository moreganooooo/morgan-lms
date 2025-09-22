import { useMemo } from 'react'
import { sm2, CardT } from '../utils'

export default function FlashcardsView({
  decks,setDecks,activeDeckId,setActiveDeckId
}:{ decks:any[]; setDecks:any; activeDeckId:string; setActiveDeckId:any }){
  const activeDeck = useMemo(()=> decks.find(d=>d.id===activeDeckId), [decks,activeDeckId])
  const dueCards = useMemo(()=> (activeDeck?.cards??[]).filter((c:CardT)=> new Date(c.dueISO) <= new Date()), [activeDeck])
  const current = dueCards[0]
  const grade=(g:number)=>{ if(!activeDeck||!current) return; const up=sm2(current,g); setDecks((prev:any)=> prev.map((d:any)=> d.id===activeDeck.id?{...d, cards: d.cards.map((c:CardT)=> c.id===current.id?up:c)}:d)) }
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between"><div className="font-bold">Deck: {activeDeck?.title}</div><div className="text-sm" style={{ color:'#64748b' }}>Due: {dueCards.length}</div></div>
      {current? (
        <div>
          <div className="text-xl" style={{ margin:'16px 0' }}>{current.front}</div>
          <details className="card p-2"><summary>Answer</summary><div style={{ marginTop:8 }}>{current.back}</div></details>
          <div className="flex gap-2" style={{ marginTop:12 }}>
            {[0,1,2,3,4,5].map(g=> <button key={g} type="button" onClick={()=>grade(g)} className="btn-hover p-2 border rounded">{g}</button>)}
          </div>
        </div>
      ) : (<div style={{ marginTop:12 }}>No cards due. 🎉</div>)}
    </div>
  )
}
