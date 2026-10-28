import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { FollowersFollowingPage } from './pages/FollowersFollowingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { MessagesPage } from './pages/MessagesPage';
import { ReelsPage } from './pages/ReelsPage';
import { SavedPostsPage } from './pages/SavedPostsPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Standalone Auth Routes without Main App Navigation */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Core Applet Routes wrapped with Master Layout */}
            <Route element={<AppLayout showRightSidebar={true} />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/search" element={<ExplorePage />} />
              <Route path="/create" element={<CreatePostPage />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/post/:id/edit" element={<PostDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<EditProfilePage />} />
              <Route path="/followers" element={<FollowersFollowingPage />} />
              <Route path="/following" element={<FollowersFollowingPage />} />
              <Route path="/profile/:username/network" element={<FollowersFollowingPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/saved" element={<SavedPostsPage />} />
              <Route path="/communities" element={<CommunitiesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Custom Layout routes (e.g. Messages & Reels utilize full space) */}
            <Route element={<AppLayout showRightSidebar={false} />}>
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/reels" element={<ReelsPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}
