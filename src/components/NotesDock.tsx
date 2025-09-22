import { X } from 'lucide-react'

export default function NotesDock({
  open, label, html, setHtml, onClose, insertTemplate
}:{
  open:boolean; label:string; html:string; setHtml:(s:string)=>void; onClose:()=>void; insertTemplate:(t:string)=>void;
}){
  return (
    <div className={`notes-dock ${open?'open':''}`}>
      <div className="notes-header">
        <strong>{label}</strong>
        <button type="button" onClick={onClose} className="btn-hover" aria-label="Close notes"><X className="w-4 h-4"/></button>
      </div>
      <div className="notes-body">
        <div
          contentEditable
          className="notes-editor"
          onInput={(e)=> setHtml((e.target as HTMLElement).innerHTML)}
          dangerouslySetInnerHTML={{__html: html}}
        />
      </div>
      <div className="notes-footer">
        <button type="button" onClick={()=>insertTemplate('action')} className="card p-2 btn-hover">+ Action</button>
        <button type="button" onClick={()=>insertTemplate('decision')} className="card p-2 btn-hover">+ Decision</button>
        <button type="button" onClick={()=>insertTemplate('follow')} className="card p-2 btn-hover">+ Follow-up</button>
        <button type="button" onClick={()=>insertTemplate('til')} className="card p-2 btn-hover">+ TIL</button>
        <button type="button" onClick={()=>insertTemplate('resource')} className="card p-2 btn-hover">+ Resource</button>
      </div>
    </div>
  )
}
