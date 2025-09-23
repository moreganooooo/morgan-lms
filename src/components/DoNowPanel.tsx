// src/components/DoNowPanel.tsx
import React, { useMemo } from 'react'
import { getNextActions, type NBAction, type TabId } from '../lib/nextBestAction'
import type { Theme } from '../theme'

type Props = {
  theme: Theme;
  decks: any[];
  tasks: any[];
  activity: Record<string, number>;
  lastStudyDate: string;
  studyStreak: number;
  onNavigate: (tab: TabId) => void;
}

const Pill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span className="text-xs px-2 py-1 rounded-full border" style={{ borderColor:'#e5e7eb' }}>{children}</span>
)

export default function DoNowPanel(props: Props){
  const actions = useMemo(()=> getNextActions({
    decks: props.decks,
    tasks: props.tasks,
    activity: props.activity,
    lastStudyDate: props.lastStudyDate,
    studyStreak: props.studyStreak,
  }), [props.decks, props.tasks, props.activity, props.lastStudyDate, props.studyStreak])

  if (actions.length === 0) return null;

  return (
    <div className="card p-4 mb-4 rounded-xl border" style={{ borderColor:'#e5e7eb', background:'white' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold" style={{ color: props.theme.headerText }}>Do now</div>
        <Pill>auto-prioritized</Pill>
      </div>
      <div className="grid" style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:12 }}>
        {actions.map((a: NBAction, i) => (
          <button
            key={i}
            type="button"
            onClick={()=> props.onNavigate(a.tab)}
            className="p-3 rounded-lg border btn-hover text-left transition-all duration-300 hover:scale-[1.01]"
            style={{
              background: 'white',
              borderColor: props.theme.buttonBorder,
              color: props.theme.contentText, // was bodyText; Theme defines contentText
            }}
            aria-label={`${a.kind}: ${a.title}`} // a11y: announces intent clearly
          >
            <div className="text-sm opacity-60 capitalize">{a.kind}</div>
            <div className="font-medium mt-1">{a.title}</div>
            <div className="text-sm mt-1 opacity-70">{a.detail}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
