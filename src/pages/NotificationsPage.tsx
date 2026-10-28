import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Film,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationType } from '../types';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

  useEffect(() => {
    // Automatically clear unread badge when viewing notifications page
    markAllNotificationsAsRead();
  }, []);

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'likes') return item.type === 'like' || item.type === 'reel_like';
    if (activeFilter === 'comments') return item.type === 'comment';
    if (activeFilter === 'follows') return item.type === 'follow';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationAsRead(item.id);
    if (item.postId) {
      navigate(`/post/${item.postId}`);
    } else {
      navigate(`/profile/${item.actorUsername}`);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
      case 'reel_like':
        return <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-[#7667FF]" />;
      case 'mention':
        return <AtSign className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getNotificationDescription = (item: (typeof notifications)[0]) => {
    switch (item.type) {
      case 'like':
        return 'liked your recent moment';
      case 'reel_like':
        return 'liked your reel video';
      case 'comment':
        return item.commentText ? `commented: "${item.commentText}"` : 'commented on your post';
      case 'follow':
        return 'started following your journey';
      case 'mention':
        return item.commentText ? `mentioned you: "${item.commentText}"` : 'mentioned you in a moment';
      default:
        return 'interacted with your profile';
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5 text-[#7667FF]" />
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#7667FF] text-white tabular-nums">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#7667FF] hover:underline"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {(['all', 'likes', 'comments', 'follows'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all shrink-0 ${
              activeFilter === tab
                ? 'bg-[#7667FF] text-white shadow-xs'
                : 'bg-white dark:bg-[#12182B] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-[#7667FF]/40'
            }`}
          >
            {tab === 'all' ? 'All Activity' : tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                !item.isRead
                  ? 'bg-[#7667FF]/5 dark:bg-[#7667FF]/10'
                  : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Avatar with type badge */}
                <div className="relative shrink-0">
                  <img
                    src={item.actorAvatar}
                    alt={item.actorName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-[#12182B] shadow-xs">
                    {getNotificationIcon(item.type)}
                  </div>
                </div>

                {/* Text Description */}
                <div className="text-xs min-w-0">
                  <p className="text-slate-800 dark:text-slate-200 leading-snug">
                    <strong className="font-bold text-slate-900 dark:text-white mr-1">
                      {item.actorName}
                    </strong>
                    <span>{getNotificationDescription(item)}</span>
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Right side preview thumbnail if applicable */}
              <div className="flex items-center gap-2 shrink-0">
                {item.postThumbnail && (
                  <img
                    src={item.postThumbnail}
                    alt="Post thumbnail"
                    className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                )}
                {!item.isRead && (
                  <div className="w-2 h-2 rounded-full bg-[#7667FF]" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
