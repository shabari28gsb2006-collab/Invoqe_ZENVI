import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DeletePostConfirmModal: React.FC = () => {
  const { deletingPostId, setDeletingPostId, deletePost } = useApp();

  if (!deletingPostId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-sm bg-white dark:bg-[#12182B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete this post?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            This action cannot be undone. It will be permanently removed from your profile and feed.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setDeletingPostId(null)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deletePost(deletingPostId)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
