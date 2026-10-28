import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, SunMoon, Plus, ChevronDown } from 'lucide-react';
import { ZenviLogo } from '../common/ZenviLogo';
import { useApp } from '../../context/AppContext';

export const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    conversations,
    setAppearanceModalOpen,
    setCreatePostModalOpen,
    setRecentFriendsOpen,
    markAllNotificationsAsRead,
    markAllMessagesAsRead,
  } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleNotificationsClick = () => {
    markAllNotificationsAsRead();
    navigate('/notifications');
  };

  const handleMessagesClick = () => {
    markAllMessagesAsRead();
    navigate('/messages');
  };

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-3.5 py-2.5 bg-white/95 dark:bg-[#0B1020]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
      {/* Left: Friends who recently chat/message */}
      <button
        onClick={() => setRecentFriendsOpen(true)}
        className="flex items-center gap-1.5 p-1 rounded-full text-slate-800 dark:text-slate-100 hover:text-[#7667FF] transition-all relative group"
        aria-label="Recent Friends"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#7667FF] via-purple-500 to-pink-500">
            <img
              src={
                conversations[0]?.participant?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
              }
              alt="Recent Friend"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
              className="w-full h-full rounded-full object-cover bg-slate-200"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#0B1020]" />
        </div>
      </button>

      {/* Center: Brand Wordmark with subtle dropdown chevron */}
      <div
        onClick={() => navigate('/')}
        className="cursor-pointer flex items-center gap-1.5 active:opacity-80 transition-opacity"
      >
        <ZenviLogo size="sm" />
        <ChevronDown className="w-4 h-4 text-slate-400 mt-0.5" />
      </div>

      {/* Right: Notifications, Messages, and Theme */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAppearanceModalOpen(true)}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#7667FF] transition-colors"
          aria-label="Appearance Theme"
        >
          <SunMoon className="w-5 h-5 text-[#7667FF]" />
        </button>

        {/* Notifications Heart */}
        <button
          onClick={handleNotificationsClick}
          className="p-1.5 text-slate-800 dark:text-slate-100 hover:text-rose-500 transition-colors relative"
          aria-label="Notifications"
        >
          <Heart className="w-6 h-6 stroke-[2px]" />
          {unreadNotifs > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#0B1020]" />
          )}
        </button>

        {/* Messages / Direct */}
        <button
          onClick={handleMessagesClick}
          className="p-1.5 text-slate-800 dark:text-slate-100 hover:text-[#7667FF] transition-colors relative"
          aria-label="Direct Messages"
        >
          <MessageCircle className="w-6 h-6 stroke-[2px]" />
          {unreadMessages > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#0B1020]">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
