import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  PlusSquare,
  Film,
  MessageCircle,
  Bell,
  Bookmark,
  Users,
  User as UserIcon,
  Settings,
  SunMoon,
  LogOut,
  MoreHorizontal,
} from 'lucide-react';
import { ZenviLogo } from '../common/ZenviLogo';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { VerifiedBadge } from '../common/VerifiedBadge';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    notifications,
    conversations,
    setCreatePostModalOpen,
    setAppearanceModalOpen,
    logoutMock,
    isAuthenticated,
    markAllNotificationsAsRead,
    markAllMessagesAsRead,
  } = useApp();
  const { effectiveTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    {
      name: 'Create',
      path: '#create',
      icon: PlusSquare,
      isAction: true,
      onClick: () => setCreatePostModalOpen(true),
    },
    { name: 'Reels', path: '/reels', icon: Film },
    {
      name: 'Messages',
      path: '/messages',
      icon: MessageCircle,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      onClick: () => markAllMessagesAsRead(),
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
      onClick: () => markAllNotificationsAsRead(),
    },
    { name: 'Saved', path: '/saved', icon: Bookmark },
    { name: 'Communities', path: '/communities', icon: Users },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 h-screen sticky top-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B1020]/90 backdrop-blur-md px-4 py-5 select-none z-30 shrink-0 justify-between">
      {/* Brand & Nav */}
      <div className="flex flex-col space-y-6">
        {/* Brand Header */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer px-3 py-1.5 flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <ZenviLogo size="md" />
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.isAction && location.pathname === item.path;

            if (item.isAction) {
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  type="button"
                  className="flex items-center justify-between w-full px-3.5 py-3 rounded-xl font-medium text-sm text-slate-700 dark:text-slate-200 hover:bg-[#7667FF]/10 hover:text-[#7667FF] dark:hover:text-[#A78BFA] transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-1 rounded-lg bg-[#7667FF]/10 text-[#7667FF] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">Create Post</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#7667FF]/15 text-[#7667FF] dark:text-[#A78BFA]">
                    New
                  </span>
                </button>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={item.onClick}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all relative ${
                  isActive
                    ? 'bg-[#7667FF]/10 dark:bg-[#7667FF]/15 text-[#7667FF] dark:text-[#A78BFA] font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                      isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && item.badge > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-[#7667FF] rounded-full tabular-nums shadow-sm">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute right-0 top-2.5 bottom-2.5 w-1 rounded-l-full bg-[#7667FF]" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Account & Appearance Area */}
      <div className="flex flex-col space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 relative" ref={menuRef}>
        {/* Quick Appearance Shortcut Button */}
        <button
          onClick={() => setAppearanceModalOpen(true)}
          type="button"
          className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <SunMoon className="w-4 h-4 text-[#7667FF]" />
            <span>Theme: <strong className="font-semibold capitalize text-slate-900 dark:text-white">{effectiveTheme}</strong></span>
          </div>
          <span className="text-[11px] text-[#7667FF] dark:text-[#A78BFA] font-semibold hover:underline">
            Change
          </span>
        </button>

        {/* User Card with dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="flex items-center justify-between w-full p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-all text-left"
            aria-expanded={menuOpen}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#7667FF]/30"
                  onError={(e) => {
                    // Styled avatar fallback
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {currentUser.name}
                  </span>
                  {currentUser.isVerified && (
                    <VerifiedBadge className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  @{currentUser.username}
                </span>
              </div>
            </div>
            <MoreHorizontal className="w-5 h-5 text-slate-400 shrink-0" />
          </button>

          {/* Quick Menu Popup */}
          {menuOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/profile');
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>View Profile</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/settings');
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setAppearanceModalOpen(true);
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <SunMoon className="w-4 h-4 text-[#7667FF]" />
                <span>Appearance Theme</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logoutMock();
                    navigate('/login');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out @{currentUser.username}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/login');
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium text-[#7667FF] hover:bg-[#7667FF]/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log in / Sign up</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
