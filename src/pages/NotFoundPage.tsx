import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { ZenviLogo } from '../components/common/ZenviLogo';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#F5F7FF] dark:bg-[#0B1020] text-slate-900 dark:text-slate-100">
      <div className="max-w-md space-y-6">
        <ZenviLogo size="lg" className="justify-center" />

        <div className="space-y-2">
          <span className="text-5xl font-mono font-extrabold text-[#7667FF] tracking-tight">
            404
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Moment Not Found
          </h1>
          <p className="text-xs text-slate-500">
            The page, profile, or connection you are searching for does not exist or may have drifted into a different orbit.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7667FF] text-white text-xs font-semibold hover:bg-[#6352ff] transition-all shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Return to Feed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
