import React, { useState } from 'react';
import HistoryList from '../components/HistoryList';
import OutputCard from '../components/OutputCard';
import { historyService } from '../services/api';
import { CalendarRange, Shield, Trash2 } from 'lucide-react';

const History = () => {
  const [selectedGeneration, setSelectedGeneration] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleClearAll = async () => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete your entire briefing history? This action cannot be undone.')) {
      return;
    }

    try {
      await historyService.clearAllHistory();
      setSelectedGeneration(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error('Failed to clear history:', err);
      alert('Error clearing briefing logs. Please try again.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title & Clear All */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarRange className="w-5.5 h-5.5 text-brand-500" />
            Briefing Logs Archive
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Review, print, or delete previously dispatched driver documents</p>
        </div>

        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 text-xs bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white font-bold py-2 px-4 rounded-xl transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Clear All History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Logs List Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-4 rounded-xl">
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Saved Trips Records</h2>
            <HistoryList 
              onSelectGeneration={(item) => setSelectedGeneration(item)} 
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>

        {/* Selected Details Viewer */}
        <div className="lg:col-span-7">
          {selectedGeneration ? (
            <div className="space-y-4 animate-fadeIn">
              <OutputCard
                generation={selectedGeneration}
                onRegenerate={null} // disable regeneration on static history inspect
                loadingRegen={false}
                onDelete={() => {
                  setSelectedGeneration(null);
                  setRefreshTrigger(prev => prev + 1);
                }}
              />
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Briefing Inspector</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                Select any logged outstation trip card from the list on the left to inspect its generated safety sections, ratings, and export options.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
