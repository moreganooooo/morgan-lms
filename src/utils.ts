export const NS = 'ultimate-email-lms';
export const INK = '#0f172a';
export const BORDER = '#e5e7eb';

export const safeGet = <T,>(k:string,f:T):T=>{
  try{ const r= typeof window!=='undefined'?localStorage.getItem(k):null; return r?JSON.parse(r):f; }
  catch{ return f; }
};
export const safeSet = (k:string,v:any)=>{ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} };

export const formatTime=(s:number)=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;

export type CardT = { id:string; front:string; back:string; easeFactor:number; interval:number; repetitions:number; dueISO:string };

export const sm2=(card:CardT,grade:number):CardT=>{
  let {easeFactor,interval,repetitions}=card;
  if(grade>=3){
    interval = repetitions===0?1: repetitions===1?6: Math.round(interval*easeFactor);
    repetitions+=1;
  } else { repetitions=0; interval=1; }
  easeFactor=Math.max(1.3, easeFactor+(0.1-(5-grade)*(0.08+(5-grade)*0.02)));
  const due=new Date(); due.setDate(due.getDate()+interval);
  return {...card,easeFactor,interval,repetitions,dueISO:due.toISOString()};
};

export const tsInsert = () => {
  const iso = new Date().toISOString().slice(0,19) + 'Z';
  return `\n[${iso}] `;
};

export const exportTextFile = (filename:string, text:string) => {
  const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
};
