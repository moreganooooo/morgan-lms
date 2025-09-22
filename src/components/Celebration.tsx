import { Trophy, Target, Award, Palette, CheckCircle2 } from 'lucide-react';
import { Theme } from '../theme';

type CelebrationType = 'module' | 'certification' | 'day' | 'theme' | 'achievement' | '';

interface CelebrationProps {
  showCelebration: boolean;
  celebrationType: CelebrationType;
  currentTheme: Theme;
}

const Celebration = ({ 
  showCelebration, 
  celebrationType, 
  currentTheme 
}: CelebrationProps) => {
  if (!showCelebration || !celebrationType) return null;

  const celebrations = {
    module: { 
      message: "Module Completed!", 
      icon: Target, 
      color: currentTheme.success 
    },
    certification: { 
      message: "Certification Earned!", 
      icon: Trophy, 
      color: currentTheme.accent 
    },
    day: { 
      message: "Day Completed!", 
      icon: Award, 
      color: currentTheme.primary 
    },
    theme: { 
      message: "Theme Changed!", 
      icon: Palette, 
      color: currentTheme.primary 
    },
    achievement: { 
      message: "Achievement Unlocked!", 
      icon: CheckCircle2, 
      color: currentTheme.accent 
    },
  };

  const celebration = celebrations[celebrationType] || celebrations.module;
  const IconComponent = celebration.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentTheme.particleColor }}
            />
          </div>
        ))}
      </div>

      <div 
        className="rounded-xl p-8 text-center shadow-2xl transition-all duration-500 transform animate-bounce border-2" 
        style={{ 
          background: currentTheme.cardGradient,
          borderColor: celebration.color,
          boxShadow: currentTheme.glowEffect
        }}
      >
        <div className="mb-4">
          <IconComponent 
            className="w-16 h-16 mx-auto animate-pulse" 
            style={{ color: celebration.color }}
          />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-white">
          {celebration.message}
        </h3>
        <p className="text-white opacity-75">
          Keep up the amazing work!
        </p>
      </div>
    </div>
  );
};

export default Celebration;