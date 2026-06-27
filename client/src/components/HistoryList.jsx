import React, { useState, useEffect } from 'react';
import { historyService } from '../services/api';
import { Calendar, MapPin, Truck, ChevronRight, RefreshCw, Star, Trash2 } from 'lucide-react';

const HistoryList = ({ onSelectGeneration, refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await historyService.getAllHistory();
      setHistory(data.history || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError('Could not load briefing history logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this trip safety briefing?')) {
      return;
    }
    
    try {
      await historyService.deleteHistoryById(id);
      fetchHistory();
      if (onSelectGeneration) {
        onSelectGeneration(null); // Clear active inspector if it was deleted
      }
    } catch (err) {
      console.error('Failed to delete briefing:', err);
      alert('Error deleting safety briefing. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-16 w-full bg-slate-100 dark:bg-slate-800/40 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-200/50 bg-red-500/10 text-red-500 text-xs flex justify-between items-center">
        <span>{error}</span>
        <button onClick={fetchHistory} className="p-1 hover:bg-red-500/20 rounded transition">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-10 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
        <p className="text-sm text-slate-500 dark:text-slate-400">No previous briefing safety reports found.</p>
        <p className="text-xs text-slate-400 mt-1">Configure your trip details above to generate your first briefing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
      {history.map((item) => {
        const hasFeedback = !!item.feedback;
        const rating = item.feedback?.rating || 0;
        
        return (
          <div
            key={item.id}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-white dark:hover:bg-slate-900 transition flex items-center justify-between group"
          >
            {/* Clickable details section */}
            <div 
              onClick={() => onSelectGeneration(item)}
              className="space-y-2 flex-1 min-w-0 pr-4 cursor-pointer"
            >
              {/* Route */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate group-hover:text-brand-500 transition-colors">
                  {item.routeFrom} ➔ {item.routeTo}
                </span>
                
                {/* Rating indicators */}
                {hasFeedback && (
                  <div className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    {rating}
                  </div>
                )}
              </div>

              {/* Attributes */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{item.vehicleType}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>

            {/* Actions: Individual Delete */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => handleDelete(e, item.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                title="Delete Safety Briefing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div 
                onClick={() => onSelectGeneration(item)}
                className="flex items-center text-slate-400 group-hover:text-brand-500 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryList;
