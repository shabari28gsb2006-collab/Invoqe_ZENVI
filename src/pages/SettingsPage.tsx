import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SunMoon,
  User,
  Shield,
  Bell,
  Eye,
  LogOut,
  Laptop,
  Sun,
  Moon,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { ThemeMode } from '../types';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { themeMode, effectiveTheme, setThemeMode } = useTheme();
  const { settings, updateSettings, logoutMock, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'appearance' | 'account' | 'privacy' | 'notifications' | 'accessibility'>('appearance');
  const [showSignoutModal, setShowSignoutModal] = useState(false);

  // Form states for account
  const [accountForm, setAccountForm] = useState(settings.account);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings('account', accountForm);
  };

  const themeOptions: {
    id: ThemeMode;
    title: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'system',
      title: 'System (Default)',
      description: 'Synchronizes automatically with your operating system or browser color scheme.',
      icon: <Laptop className="w-5 h-5 text-indigo-500" />,
    },
    {
      id: 'light',
      title: 'Light Theme',
      description: 'Clean off-white canvases with crisp typographic contrast for bright environments.',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      description: 'Deep obsidian and midnight indigo tones designed for relaxed viewing.',
      icon: <Moon className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your appearance, profile details, privacy, and accessibility controls.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[520px]">
        {/* Navigation Sidebar Tabs */}
        <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-3 space-y-1 shrink-0">
          {[
            { id: 'appearance', label: 'Appearance', icon: SunMoon },
            { id: 'account', label: 'Account Info', icon: User },
            { id: 'privacy', label: 'Privacy & Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'accessibility', label: 'Accessibility', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-[#7667FF] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setShowSignoutModal(true)}
              className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 p-5 sm:p-7">
          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Appearance & Theme
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose how ZENVI looks on this device. Switching updates the interface immediately without page reload.
                </p>
              </div>

              {/* Theme Choices */}
              <div className="space-y-3">
                {themeOptions.map((opt) => {
                  const isSelected = themeMode === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setThemeMode(opt.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#7667FF] bg-[#7667FF]/5 dark:bg-[#7667FF]/10 ring-1 ring-[#7667FF]'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-3 rounded-xl ${
                            isSelected
                              ? 'bg-[#7667FF]/15 text-[#7667FF]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {opt.title}
                            </span>
                            {opt.id === 'system' && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                Active: {effectiveTheme}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-md">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0 ml-3 ${
                          isSelected
                            ? 'border-[#7667FF] bg-[#7667FF] text-white'
                            : 'border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Theme Behavior Note:
                </p>
                <p>
                  System is active by default. If your operating system switches between daylight and dusk dark mode, ZENVI will adapt in real-time.
                </p>
              </div>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-4 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Account Details
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your personal account and contact credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={accountForm.displayName}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, displayName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Username
                  </label>
                  <input
                    type="text"
                    value={accountForm.username}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, username: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={accountForm.email}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={accountForm.phone}
                    onChange={(e) =>
                      setAccountForm({ ...accountForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#7667FF] text-white text-xs font-semibold hover:bg-[#6352ff] transition-all shadow-xs"
                >
                  Save Account Information
                </button>
              </div>
            </form>
          )}

          {/* PRIVACY TAB */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Privacy & Safety Controls
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Control who sees your moments and interaction statuses.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Private Account
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      When active, only approved followers can see your moments and highlights.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.isPrivateAccount}
                    onChange={(e) =>
                      updateSettings('privacy', { isPrivateAccount: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#7667FF] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Show Activity Status
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Allow accounts you follow to see when you were last active.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.showActivityStatus}
                    onChange={(e) =>
                      updateSettings('privacy', { showActivityStatus: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#7667FF] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Read Receipts in Messages
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Show when messages have been opened in direct chats.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.privacy.readReceipts}
                    onChange={(e) =>
                      updateSettings('privacy', { readReceipts: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#7667FF] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Notification Preferences
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Decide what updates you receive while using ZENVI.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'pushLikes', title: 'Likes on your posts', sub: 'Receive notice when someone likes your moment' },
                  { key: 'pushComments', title: 'Comments & replies', sub: 'Receive notice when someone joins your conversation' },
                  { key: 'pushFollowers', title: 'New followers', sub: 'Receive notice when a creator begins following you' },
                  { key: 'pushMessages', title: 'Direct chat messages', sub: 'Notify when you receive private messages' },
                  { key: 'emailDigests', title: 'Weekly email digest', sub: 'Summary of trending community spaces' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">{item.sub}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(settings.notifications as any)[item.key]}
                      onChange={(e) =>
                        updateSettings('notifications', { [item.key]: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#7667FF] rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCESSIBILITY TAB */}
          {activeTab === 'accessibility' && (
            <div className="space-y-5 max-w-xl">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Accessibility & Motion
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fine-tune tactile feedback, contrast, and motion behavior.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Reduce Motion
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Minimizes animations, transitions, and reel auto-zooms.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.accessibility.reduceMotion}
                    onChange={(e) =>
                      updateSettings('accessibility', { reduceMotion: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#7667FF] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      High Contrast Mode
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Amplifies hairline borders and surface contrasts for visual clarity.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.accessibility.highContrast}
                    onChange={(e) =>
                      updateSettings('accessibility', { highContrast: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#7667FF] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sign Out Modal */}
      {showSignoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Sign Out?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You will be returned to the login screen. You can log back in at any time with mock credentials.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSignoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignoutModal(false);
                  logoutMock();
                  navigate('/login');
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
