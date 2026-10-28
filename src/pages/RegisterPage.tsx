import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { ZenviLogo } from '../components/common/ZenviLogo';
import { useApp } from '../context/AppContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Please enter your email or username', 'error');
      return;
    }
    if (password.length < 10) {
      showToast('Password should be at least 10 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!agreed) {
      showToast('Please accept terms of service to continue', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const generatedUsername = email.includes('@')
        ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
        : email.toLowerCase().replace(/[^a-z0-9_]/g, '');

      const userEmail = email.includes('@') ? email.trim() : `${generatedUsername}@zenvi.social`;

      const res = await register({
        name: name.trim(),
        username: generatedUsername || `user_${Date.now().toString().slice(-4)}`,
        email: userEmail,
        password,
      });

      if (res.success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F5F7FF] dark:bg-[#0B1020] text-slate-900 dark:text-slate-100">
      {/* Form Container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        <div>
          <ZenviLogo size="md" />
        </div>

        <div className="my-auto py-8 space-y-5">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Join the ZENVI creator and social network today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Full name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#7667FF] text-slate-900 dark:text-white shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Email or username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@domain.com or @alex"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#7667FF] text-slate-900 dark:text-white shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#7667FF] text-slate-900 dark:text-white shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Confirm password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-white dark:bg-[#12182B] border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-[#7667FF] text-slate-900 dark:text-white shadow-xs"
                />
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 leading-snug">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 accent-[#7667FF] rounded mt-0.5"
                />
                <span>
                  I agree to the Community Guidelines, Terms of Service, and Privacy Policy.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#7667FF] hover:bg-[#6352ff] text-white font-semibold text-sm transition-all shadow-md shadow-[#7667FF]/25 flex items-center justify-center gap-2 group active:scale-[0.99] mt-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-3">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#7667FF] hover:underline">
              Log in
            </Link>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>ZENVI © 2026</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7667FF]" />
            Local client-side simulation
          </span>
        </div>
      </div>

      {/* Right Editorial Banner */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80"
          alt="ZENVI exploration"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-16 text-white space-y-4">
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
            &ldquo;Your story<br />matters here.&rdquo;
          </h2>
          <p className="text-sm text-white/80 max-w-md leading-relaxed">
            Create moments that resonate. Discover people who inspire. Shape community spaces without algorithm fatigue.
          </p>
        </div>
      </div>
    </div>
  );
};
