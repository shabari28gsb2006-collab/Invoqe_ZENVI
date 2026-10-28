import React, { useState, useEffect } from 'react';
import {
  Search,
  Send,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Image as ImageIcon,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MessagesPage: React.FC = () => {
  const { conversations, sendMessage, currentUser, showToast, markAllMessagesAsRead, markConversationAsRead } = useApp();

  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.id || ''
  );
  const [chatSearch, setChatSearch] = useState('');
  const [inputText, setInputText] = useState('');
  const [showMobileThread, setShowMobileThread] = useState(false);

  // Automatically mark all messages read when opening messages
  useEffect(() => {
    markAllMessagesAsRead();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      markConversationAsRead(activeConvId);
    }
  }, [activeConvId]);

  const activeConversation =
    conversations.find((c) => c.id === activeConvId) || conversations[0];

  const filteredConversations = conversations.filter(
    (c) =>
      c.participant.name.toLowerCase().includes(chatSearch.toLowerCase()) ||
      c.participant.username.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && activeConversation) {
      sendMessage(activeConversation.id, inputText.trim());
      setInputText('');
    }
  };

  const simulateCall = (type: 'audio' | 'video') => {
    showToast(`Starting simulated ${type} call with ${activeConversation.participant.name}...`, 'info');
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] md:h-screen flex flex-col overflow-hidden">
      {/* Simulation banner */}
      <div className="bg-[#7667FF]/10 border-b border-[#7667FF]/20 px-4 py-1.5 flex items-center justify-between text-[11px] text-[#7667FF] dark:text-[#A78BFA] shrink-0">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local UI Simulation • Messages update client-side temporary state</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col bg-white dark:bg-[#12182B] shrink-0 ${
            showMobileThread ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Messages</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#7667FF]"
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setShowMobileThread(true);
                  }}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#7667FF]/10 dark:bg-[#7667FF]/15'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.participant.avatar}
                      alt={conv.participant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conv.participant.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12182B]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {conv.participant.name}
                      </span>
                      <span className="text-[10px] text-slate-400 tabular-nums">
                        {conv.lastMessage.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">
                        {conv.lastMessage.text}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#7667FF] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Chat Thread */}
        <div
          className={`flex-1 flex flex-col bg-slate-50/50 dark:bg-[#0B1020]/50 ${
            !showMobileThread ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-3.5 px-4 bg-white dark:bg-[#12182B] border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setShowMobileThread(false)}
                    className="md:hidden p-1 text-slate-500 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative shrink-0">
                    <img
                      src={activeConversation.participant.avatar}
                      alt={activeConversation.participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {activeConversation.participant.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#12182B]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {activeConversation.participant.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {activeConversation.participant.isOnline
                        ? 'Active now'
                        : `Last active ${activeConversation.participant.lastSeen || 'recently'}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => simulateCall('audio')}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#7667FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Simulate audio call"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => simulateCall('video')}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#7667FF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Simulate video call"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showToast(`Participant info: @${activeConversation.participant.username}`)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Thread info"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Bubbles Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {activeConversation.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[78%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMe
                            ? 'bg-[#7667FF] text-white rounded-br-xs shadow-xs'
                            : 'bg-white dark:bg-[#151D33] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer Input */}
              <form
                onSubmit={handleSend}
                className="p-3 bg-white dark:bg-[#12182B] border-t border-slate-200/80 dark:border-slate-800/80 flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => showToast('Image attachment simulated', 'info')}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setInputText((prev) => prev + ' ✨')}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeConversation.participant.name.split(' ')[0]}...`}
                  className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#7667FF]"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-[#7667FF] hover:bg-[#6352ff] text-white disabled:opacity-40 transition-all shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-slate-500">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
