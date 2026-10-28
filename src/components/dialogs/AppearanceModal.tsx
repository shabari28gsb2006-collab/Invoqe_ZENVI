import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { X, Laptop, Sun, Moon, Check } from 'lucide-react';
import { ThemeMode } from '../../types';

export const AppearanceModal: React.FC = () => {
  const { themeMode, effectiveTheme, setThemeMode } = useTheme();
  const { appearanceModalOpen, setAppearanceModalOpen } = useApp();

  if (!appearanceModalOpen) return null;

  const options: {
    id: ThemeMode;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'system',
      label: 'System',
      sublabel: 'Automatically adapts to your device settings (Default)',
      icon: <Laptop className="w-5 h-5 text-indigo-500" />,
    },
    {
      id: 'light',
      label: 'Light',
      sublabel: 'Crisp, bright interfaces with gentle contrast',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'dark',
      label: 'Dark',
      sublabel: 'Deep obsidian and midnight indigo tones for reduced eye strain',
      icon: <Moon className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        role="dialog"
        aria-labelledby="appearance-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 id="appearance-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Appearance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Currently active: <span className="font-semibold capitalize text-[#7667FF]">{effectiveTheme} mode</span> {themeMode === 'system' ? '(via System)' : ''}
            </p>
          </div>
          <button
            onClick={() => setAppearanceModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Choose your theme
          </p>

          <div className="space-y-2.5">
            {options.map((option) => {
              const isSelected = themeMode === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setThemeMode(option.id)}
                  type="button"
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#7667FF] bg-[#7667FF]/5 dark:bg-[#7667FF]/10 ring-1 ring-[#7667FF]'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isSelected
                          ? 'bg-[#7667FF]/15 dark:bg-[#7667FF]/20'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {option.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {option.label}
                        </span>
                        {option.id === 'system' && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {option.sublabel}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors shrink-0 ml-3 ${
                      isSelected
                        ? 'border-[#7667FF] bg-[#7667FF] text-white'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setAppearanceModalOpen(false)}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#7667FF] hover:bg-[#6352ff] rounded-xl transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
