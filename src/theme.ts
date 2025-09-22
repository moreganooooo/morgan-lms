export type Theme = {
  name:string; primary:string; success:string; accent:string; warning:string; gray:string;
  gradientBg:string; accentGradient:string
}

export const PRESETS: Record<string, Theme> = {
  ocean:  { name:'Ocean Depths', primary:'#06b6d4', success:'#10b981', accent:'#8b5cf6', warning:'#f59e0b', gray:'#64748b',
            gradientBg:'linear-gradient(135deg,#10b981 0%,#22d3ee 50%,#a78bfa 100%)',
            accentGradient:'linear-gradient(135deg,#22d3ee 0%,#10b981 50%,#a78bfa 100%)' },
  sunset: { name:'Sunset Blaze', primary:'#f97316', success:'#84cc16', accent:'#ec4899', warning:'#eab308', gray:'#78716c',
            gradientBg:'linear-gradient(135deg,#22c55e 0%,#34d399 25%,#f59e0b 60%,#f97316 80%,#ec4899 100%)',
            accentGradient:'linear-gradient(135deg,#f97316 0%,#ea580c 50%,#ec4899 100%)' },
  forest: { name:'Forest Mystique', primary:'#059669', success:'#84cc16', accent:'#10b981', warning:'#f59e0b', gray:'#6b7280',
            gradientBg:'linear-gradient(135deg,#86efac 0%,#34d399 50%,#10b981 100%)',
            accentGradient:'linear-gradient(135deg,#10b981 0%,#34d399 50%,#86efac 100%)' },
  cosmic: { name:'Cosmic Purple', primary:'#8b5cf6', success:'#22c55e', accent:'#a78bfa', warning:'#fbbf24', gray:'#6b7280',
            gradientBg:'linear-gradient(135deg,#a78bfa 0%,#8b5cf6 50%,#22d3ee 100%)',
            accentGradient:'linear-gradient(135deg,#8b5cf6 0%,#a78bfa 50%,#22d3ee 100%)' },
  cyber:  { name:'Cyberpunk Neon', primary:'#06b6d4', success:'#00f5ff', accent:'#ff0080', warning:'#ffff00', gray:'#71717a',
            gradientBg:'linear-gradient(135deg,#22d3ee 0%,#00f5ff 50%,#ff0080 100%)',
            accentGradient:'linear-gradient(135deg,#06b6d4 0%,#00f5ff 50%,#ff0080 100%)' }
}

export const applyTheme = (t: Theme) => {
  document.documentElement.style.setProperty('--theme-primary', t.primary);
  document.documentElement.style.setProperty('--theme-accent', t.accent);
}
