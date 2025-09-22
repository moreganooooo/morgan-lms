import { CheckCircle2, X, Wand2, Palette } from 'lucide-react';
import { PRESETS, Theme } from '../theme';

interface ThemeGalleryProps {
  showThemeGallery: boolean;
  setShowThemeGallery: (show: boolean) => void;
  selectedTheme: string;
  onThemeChange: (themeKey: string) => void;
  currentTheme: Theme;
}

export default function ThemeGallery({ 
  showThemeGallery, 
  setShowThemeGallery, 
  selectedTheme, 
  onThemeChange,
  currentTheme 
}: ThemeGalleryProps) {
  if (!showThemeGallery) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="max-w-4xl w-full rounded-xl p-6 shadow-2xl border-2 max-h-[90vh] overflow-y-auto"
        style={{ 
          background: currentTheme.cardGradient,
          borderColor: currentTheme.primary,
          boxShadow: currentTheme.glowEffect
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Palette className="w-6 h-6" style={{ color: currentTheme.accent }} />
              Theme Gallery
            </h2>
            <p className="text-sm text-white opacity-75">
              Choose your perfect learning environment
            </p>
          </div>
          <button
            onClick={() => setShowThemeGallery(false)}
            className="p-2 rounded-lg hover:scale-110 transition-all duration-300 bg-white bg-opacity-20"
            title="Close Theme Gallery"
            aria-label="Close Theme Gallery"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(PRESETS).map(([key, themeData]) => (
            <button
              key={key}
              onClick={() => onThemeChange(key)}
              className={`relative group rounded-xl p-4 transition-all duration-300 hover:scale-105 border-2 ${
                selectedTheme === key ? 'ring-2 ring-offset-2' : ''
              }`}
              style={{
                background: themeData.gradientBg,
                borderColor: selectedTheme === key ? themeData.primary : 'transparent',
                boxShadow: selectedTheme === key ? themeData.glowEffect : 'none'
              }}
            >
              {/* Theme Preview */}
              <div className="space-y-3">
                <div 
                  className="h-8 rounded-lg flex items-center justify-between px-3"
                  style={{ background: themeData.cardGradient }}
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeData.accent }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeData.success }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeData.warning }}></div>
                  </div>
                  <div className="w-8 h-2 rounded" style={{ backgroundColor: themeData.primary }}></div>
                </div>

                <div className="space-y-2">
                  <div 
                    className="h-6 rounded-lg"
                    style={{ background: themeData.cardGradient }}
                  ></div>
                  <div 
                    className="h-4 rounded-lg w-3/4"
                    style={{ backgroundColor: themeData.primary }}
                  ></div>
                  <div 
                    className="h-3 rounded w-1/2"
                    style={{ backgroundColor: themeData.success }}
                  ></div>
                </div>

                <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 group-hover:w-full"
                    style={{ 
                      background: themeData.accentGradient,
                      width: selectedTheme === key ? '100%' : '60%'
                    }}
                  ></div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="text-sm font-medium text-white text-center bg-black bg-opacity-50 rounded-lg py-1 backdrop-blur-sm">
                  {themeData.name}
                </div>
              </div>

              {selectedTheme === key && (
                <div className="absolute top-2 right-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: themeData.success }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg border-2 border-dashed border-white border-opacity-30">
          <div className="text-center text-white opacity-75">
            <Wand2 className="w-8 h-8 mx-auto mb-2" style={{ color: currentTheme.accent }} />
            <div className="font-medium">Custom Theme Builder</div>
            <div className="text-sm">Coming Soon! Create your own perfect theme.</div>
          </div>
        </div>
      </div>
    </div>
  );
}