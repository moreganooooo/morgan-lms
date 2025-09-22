export type Theme = {
  name: string;
  primary: string;
  success: string;
  accent: string;
  warning: string;
  gray: string;
  gradientBg: string; // Keep for gallery previews
  staticBg: string; // New static background
  accentGradient: string;
  // Enhanced theme properties for better visual effects
  cardGradient: string;
  glowEffect: string;
  particleColor: string;
  // New text contrast properties
  headerBg: string;
  headerText: string;
  headerSubtext: string;
  contentBg: string;
  contentText: string;
  buttonBg: string;
  buttonBorder: string;
  buttonText: string;
};

export const PRESETS: Record<string, Theme> = {
  ocean: {
    name: 'Ocean Depths',
    primary: '#06b6d4',
    success: '#10b981',
    accent: '#8b5cf6',
    warning: '#f59e0b',
    gray: '#64748b',
    gradientBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #06b6d4 50%, #0891b2 75%, #155e75 100%)',
    staticBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0891b2 100%)',
    accentGradient: 'linear-gradient(135deg, #06b6d4 0%, #10b981 50%, #8b5cf6 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.9) 100%)',
    glowEffect: '0 0 20px rgba(6,182,212,0.3)',
    particleColor: '#06b6d4',
    headerBg: 'rgba(15,23,42,0.95)',
    headerText: '#ffffff',
    headerSubtext: 'rgba(255,255,255,0.75)',
    contentBg: 'rgba(255,255,255,0.95)',
    contentText: '#0f172a',
    buttonBg: 'rgba(255,255,255,0.9)',
    buttonBorder: 'rgba(255,255,255,0.3)',
    buttonText: '#0f172a'
  },
  sunset: {
    name: 'Sunset Blaze',
    primary: '#f97316',
    success: '#84cc16',
    accent: '#ec4899',
    warning: '#eab308',
    gray: '#78716c',
    gradientBg: 'linear-gradient(135deg, #451a03 0%, #7c2d12 25%, #ea580c 50%, #f97316 75%, #ec4899 100%)',
    staticBg: 'linear-gradient(135deg, #451a03 0%, #7c2d12 50%, #ea580c 100%)',
    accentGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #ec4899 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(69,26,3,0.9) 0%, rgba(124,45,18,0.9) 100%)',
    glowEffect: '0 0 20px rgba(249,115,22,0.3)',
    particleColor: '#f97316',
    headerBg: 'rgba(69,26,3,0.95)',
    headerText: '#ffffff',
    headerSubtext: 'rgba(255,255,255,0.75)',
    contentBg: 'rgba(255,255,255,0.95)',
    contentText: '#451a03',
    buttonBg: 'rgba(255,255,255,0.9)',
    buttonBorder: 'rgba(255,255,255,0.3)',
    buttonText: '#451a03'
  },
  forest: {
    name: 'Forest Mystique',
    primary: '#059669',
    success: '#84cc16',
    accent: '#10b981',
    warning: '#f59e0b',
    gray: '#6b7280',
    gradientBg: 'linear-gradient(135deg, #064e3b 0%, #065f46 25%, #047857 50%, #059669 75%, #10b981 100%)',
    staticBg: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
    accentGradient: 'linear-gradient(135deg, #059669 0%, #047857 50%, #10b981 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(6,78,59,0.9) 0%, rgba(6,95,70,0.9) 100%)',
    glowEffect: '0 0 20px rgba(5,150,105,0.3)',
    particleColor: '#059669',
    headerBg: 'rgba(6,78,59,0.95)',
    headerText: '#ffffff',
    headerSubtext: 'rgba(255,255,255,0.75)',
    contentBg: 'rgba(255,255,255,0.95)',
    contentText: '#064e3b',
    buttonBg: 'rgba(255,255,255,0.9)',
    buttonBorder: 'rgba(255,255,255,0.3)',
    buttonText: '#064e3b'
  },
  cosmic: {
    name: 'Cosmic Purple',
    primary: '#8b5cf6',
    success: '#a855f7',
    accent: '#d946ef',
    warning: '#f59e0b',
    gray: '#6b7280',
    gradientBg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #6366f1 50%, #8b5cf6 75%, #d946ef 100%)',
    staticBg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #6366f1 100%)',
    accentGradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(30,27,75,0.9) 0%, rgba(49,46,129,0.9) 100%)',
    glowEffect: '0 0 20px rgba(139,92,246,0.3)',
    particleColor: '#8b5cf6',
    headerBg: 'rgba(30,27,75,0.95)',
    headerText: '#ffffff',
    headerSubtext: 'rgba(255,255,255,0.75)',
    contentBg: 'rgba(255,255,255,0.95)',
    contentText: '#1e1b4b',
    buttonBg: 'rgba(255,255,255,0.9)',
    buttonBorder: 'rgba(255,255,255,0.3)',
    buttonText: '#1e1b4b'
  },
  cyber: {
    name: 'Cyberpunk Neon',
    primary: '#06b6d4',
    success: '#00f5ff',
    accent: '#ff0080',
    warning: '#ffff00',
    gray: '#71717a',
    gradientBg: 'linear-gradient(135deg, #0c0a09 0%, #18181b 25%, #06b6d4 50%, #00f5ff 75%, #ff0080 100%)',
    staticBg: 'linear-gradient(135deg, #0c0a09 0%, #18181b 50%, #27272a 100%)',
    accentGradient: 'linear-gradient(135deg, #06b6d4 0%, #00f5ff 50%, #ff0080 100%)',
    cardGradient: 'linear-gradient(135deg, rgba(12,10,9,0.95) 0%, rgba(24,24,27,0.95) 100%)',
    glowEffect: '0 0 20px rgba(0,245,255,0.3)',
    particleColor: '#00f5ff',
    headerBg: 'rgba(12,10,9,0.95)',
    headerText: '#ffffff',
    headerSubtext: 'rgba(255,255,255,0.75)',
    contentBg: 'rgba(255,255,255,0.95)',
    contentText: '#0c0a09',
    buttonBg: 'rgba(255,255,255,0.9)',
    buttonBorder: 'rgba(255,255,255,0.3)',
    buttonText: '#0c0a09'
  }
};

export const applyTheme = (t: Theme) => {
  document.documentElement.style.setProperty('--theme-primary', t.primary);
  document.documentElement.style.setProperty('--theme-accent', t.accent);
  document.documentElement.style.setProperty('--theme-success', t.success);
  document.documentElement.style.setProperty('--theme-warning', t.warning);
};