// src/lib/nextBestAction.ts
import type { CardT } from '../utils'

export type TabId = 'bootcamp'|'planner'|'flashcards'|'skills'|'analytics';

export interface NBAction {
  kind: 'review'|'task'|'study';
  title: string;
  detail: string;
  score: number;
  tab: TabId;
  meta?: Record<string, unknown>;
}

type Deck = { id: string; name?: string; cards?: CardT[] };
type Task = { id: string; title: string; status: string; impact?: Record<string, number> };

export interface NBInput {
  decks: Deck[];
  tasks: Task[];
  activity: Record<string, number>;
  lastStudyDate: string;
  studyStreak: number;
  now?: Date;
}

const STATUS_WEIGHT: Record<string, number> = {
  doing: 1.0, next: 0.8, progress: 0.7, backlog: 0.5, todo: 0.5, started: 0.6, blocked: 0.4, done: 0,
};

const clamp = (n: number, min=0, max=100) => Math.max(min, Math.min(max, n));

const countDue = (deck?: Deck, nowISO?: string) => {
  if (!deck || !Array.isArray(deck.cards)) return 0;
  const now = nowISO ? new Date(nowISO) : new Date();
  let c = 0;
  for (const card of deck.cards as CardT[]) {
    try { if (new Date(card.dueISO) <= now) c++; }
    catch { c++; } // treat malformed as due (avoid starving review)
  }
  return c;
};

const minutesToday = (activity: Record<string, number>, nowISO?: string) => {
  const d = nowISO ? new Date(nowISO) : new Date();
  const k = d.toISOString().slice(0,10);
  return Math.round((activity[k] || 0)/60);
};

const sumImpact = (impact?: Record<string, number>) =>
  clamp(Math.round(Object.values(impact ?? {}).reduce((a,v)=> a + (typeof v === 'number' ? v : 0), 0) * 100), 0, 100);

/** Deterministic ranking of “what to do now”—simple by design for reviewer clarity. */
export function getNextActions(input: NBInput) {
  const nowISO = (input.now ?? new Date()).toISOString();
  const minToday = minutesToday(input.activity, nowISO);

  // Review (flashcards)
  const dueTotal = (input.decks || []).reduce((acc, d) => acc + countDue(d, nowISO), 0);
  const review = dueTotal > 0 ? {
    kind: 'review', title: `Review ${dueTotal} due card${dueTotal===1?'':'s'}`,
    detail: 'Spaced repetition keeps knowledge durable; knock these out first.',
    score: clamp(50 + Math.min(dueTotal, 50)), tab: 'flashcards',
  } as NBAction : null;

  // Task (planner)
  const cand = (input.tasks || []).filter(t => t.status !== 'done').sort((a,b)=>{
    const wa = STATUS_WEIGHT[a.status] ?? 0.5, wb = STATUS_WEIGHT[b.status] ?? 0.5;
    const ia = sumImpact(a.impact), ib = sumImpact(b.impact);
    return (wb + ib/100) - (wa + ia/100);
  });
  const topTask = cand[0];
  const task = topTask ? {
    kind: 'task', title: `Resume: ${topTask.title}`,
    detail: topTask.status === 'doing' ? 'You left this in progress—finish while context is fresh.' : 'High-impact item queued up.',
    score: clamp(40 + (STATUS_WEIGHT[topTask.status] ?? 0.5)*40 + sumImpact(topTask.impact)*0.2),
    tab: 'planner', meta: { taskId: topTask.id },
  } as NBAction : null;

  // Study (bootcamp)
  const needsFocus = minToday < 15;
  const streakBonus = input.studyStreak > 0 ? Math.min(input.studyStreak, 7) * 2 : 0;
  const study = needsFocus ? {
    kind: 'study', title: 'Start a 15-min focus session',
    detail: minToday === 0 ? 'Protect the streak with a quick win.' : 'Top up today’s focus for momentum.',
    score: clamp(35 + (15 - minToday)*2 + streakBonus), tab: 'bootcamp',
  } as NBAction : null;

  return [review, task, study].filter(Boolean).sort((a,b)=> (b as NBAction).score - (a as NBAction).score).slice(0,3) as NBAction[];
}
