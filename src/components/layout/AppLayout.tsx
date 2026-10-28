import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { RightSidebar } from './RightSidebar';
import { MobileHeader } from './MobileHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from '../common/Toast';
import { CreatePostModal } from '../feed/CreatePostModal';
import { EditPostModal } from '../feed/EditPostModal';
import { DeletePostConfirmModal } from '../feed/DeletePostConfirmModal';
import { StoryViewerModal } from '../feed/StoryViewerModal';
import { ShareModal } from '../feed/ShareModal';
import { AppearanceModal } from '../dialogs/AppearanceModal';
import { CreateHighlightModal } from '../profile/CreateHighlightModal';
import { HighlightViewerModal } from '../profile/HighlightViewerModal';
import { RecentFriendsDrawer } from './RecentFriendsDrawer';

interface AppLayoutProps {
  showRightSidebar?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ showRightSidebar = true }) => {
  return (
    <div className="min-h-screen bg-[#F5F7FF] dark:bg-[#0B1020] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row justify-center selection:bg-[#7667FF]/20 selection:text-[#7667FF]">
      {/* Mobile Header (Hidden on md+) */}
      <MobileHeader />

      {/* Persistent Desktop Sidebar */}
      <Sidebar />

      {/* Central Content Area */}
      <main className="flex-1 min-w-0 max-w-4xl min-h-screen pb-20 md:pb-8 border-x border-slate-200/50 dark:border-slate-800/60 bg-transparent flex flex-col">
        <Outlet />
      </main>

      {/* Right Discovery Sidebar (Only on wide desktop) */}
      {showRightSidebar && <RightSidebar />}

      {/* Mobile Bottom Navigation (Hidden on md+) */}
      <MobileBottomNav />

      {/* Global Modals & Notifications */}
      <CreatePostModal />
      <EditPostModal />
      <DeletePostConfirmModal />
      <StoryViewerModal />
      <CreateHighlightModal />
      <HighlightViewerModal />
      <ShareModal />
      <AppearanceModal />
      <RecentFriendsDrawer />
      <ToastContainer />
    </div>
  );
};
