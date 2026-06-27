import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5.5 h-5.5 text-brand-500" />
            Safety Fleet Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Dispatch statistics, model speed analytics, and popular corridors</p>
        </div>
      </div>

      <AnalyticsDashboard />
    </div>
  );
};

export default Analytics;
