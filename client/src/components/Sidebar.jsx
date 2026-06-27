import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, BarChart3, Compass, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Briefing History', path: '/history', icon: History },
    { name: 'Analytics Control', path: '/analytics', icon: BarChart3 }
  ];

  return (
    <aside className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f19] md:min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between transition-colors">
      <div className="space-y-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-brand-500 text-white glow-primary'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-slate-500">
          <Compass className="w-3.5 h-3.5" />
          Manivtha Safety Protocols
        </div>
        <p>This system generates AI road briefings. Keep copy of generated instructions in the vehicle glovebox.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
