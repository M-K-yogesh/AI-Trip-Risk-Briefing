import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, UserCheck, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
          M
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100 block">
            Manivtha Tours
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 font-mono tracking-wider block">
            AI OUTSTATION TRIP RISK BRIEFING
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-slate-500 dark:text-slate-400 cursor-pointer"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {isAuthenticated && (
          <div className="flex items-center gap-3">
            {/* User display */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 justify-end">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                {user.name}
              </span>
              <span className="text-[9px] text-slate-400">{user.email}</span>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 px-3 py-2 rounded-xl transition cursor-pointer"
              title="Log Out Session"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
