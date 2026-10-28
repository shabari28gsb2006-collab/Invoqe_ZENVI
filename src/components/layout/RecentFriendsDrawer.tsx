import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MessageCircle, Search, Check, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RecentFriendsDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { isRecentFriendsOpen, setRecentFriendsOpen, conversations, users, markConversationAsRead } =
    useApp();

  if (!isRecentFriendsOpen) return null;

  const handleOpenChat = (conversationId: string) => {
    markConversationAsRead(conversationId);
    setRecentFriendsOpen(false);
    navigate('/messages');
  };

  // Curate active friends from conversations and users
  const recentFriends = conversations.map((c) => ({
    conversationId: c.id,
    participant: c.participant,
    lastMessage: c.lastMessage,
    unreadCount: c.unreadCount,
  }));

  const onlineUsers = users.filter((u) => u.id !== 'user_current').slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#12182B] h-full shadow-2xl flex flex-col border-l border-slate-200/80 dark:border-slate-800/80 animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#7667FF]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Friends</h2>
          </div>
          <button
            onClick={() => setRecentFriendsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Online friends horizontal strip */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Active Now
          </span>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {onlineUsers.map((user, idx) => (
              <div
                key={user.id}
                onClick={() => {
                  setRecentFriendsOpen(false);
                  navigate('/messages');
                }}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-emerald-400 to-[#7667FF]">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-full h-full rounded-full object-cover bg-slate-200"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12182B]" />
                </div>
                <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[54px] text-center">
                  {user.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block px-3 py-1">
            Direct Messages
          </span>

          {recentFriends.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No recent messages. Start a conversation with a friend!
            </div>
          ) : (
            recentFriends.map((chat) => (
              <div
                key={chat.conversationId}
                onClick={() => handleOpenChat(chat.conversationId)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  chat.unreadCount > 0
                    ? 'bg-[#7667FF]/10 hover:bg-[#7667FF]/15'
                    : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={chat.participant.avatar}
                    alt={chat.participant.name}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12182B]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {chat.participant.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tabular-nums shrink-0">
                      {chat.lastMessage.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-0.5">
                    <p
                      className={`text-xs truncate max-w-[200px] ${
                        chat.unreadCount > 0
                          ? 'font-bold text-[#7667FF] dark:text-[#A78BFA]'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {chat.lastMessage.text}
                    </p>

                    {chat.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-[#7667FF] text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <button
            onClick={() => {
              setRecentFriendsOpen(false);
              navigate('/messages');
            }}
            className="w-full py-2.5 rounded-xl bg-[#7667FF] hover:bg-[#6352ff] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open All Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
};
