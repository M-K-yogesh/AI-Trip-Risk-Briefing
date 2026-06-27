import React, { useState } from 'react';
import TemplateSelector from '../components/TemplateSelector';
import AIForm from '../components/AIForm';
import OutputCard from '../components/OutputCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { aiService } from '../services/api';
import { ShieldAlert, Info, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [generation, setGeneration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Store last submitted payload for regeneration support
  const [lastPayload, setLastPayload] = useState(null);

  const handleGenerate = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setGeneration(null);
      setLastPayload(formData);

      const response = await aiService.generateBriefing(formData);
      setGeneration(response.generation);
    } catch (err) {
      console.error('Generation failed:', err);
      const errorMsg = err.response?.data?.error || 'Briefing generation timed out or failed. Please check your network and API configurations.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!lastPayload) return;
    await handleGenerate(lastPayload);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5.5 h-5.5 text-brand-500 fill-brand-500/25" />
            Safety Briefing Dispatch
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate outstation risk briefs using multi-model AIs</p>
        </div>
      </div>

      {/* Preset selector */}
      <div className="glass-panel p-5 rounded-2xl">
        <TemplateSelector onSelectTemplate={(tmpl) => setSelectedPreset(tmpl)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Form Column */}
        <div className="lg:col-span-5">
          <AIForm
            initialData={selectedPreset}
            onSubmit={handleGenerate}
            loading={loading}
          />
        </div>

        {/* Output & Loader Column */}
        <div className="lg:col-span-7 space-y-4">
          {loading && (
            <div className="glass-panel rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="glass-panel p-6 rounded-2xl border border-red-200/50 dark:border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 space-y-3">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-red-500 shrink-0" />
                <h3 className="font-bold text-sm">Briefing Computation Warning</h3>
              </div>
              <p className="text-xs leading-relaxed">{error}</p>
              <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800">
                <Info className="w-3.5 h-3.5" />
                <span>Note: Free API endpoints are subject to rate limiting or connection sleep factors.</span>
              </div>
            </div>
          )}

          {generation && !loading && !error && (
            <OutputCard
              generation={generation}
              onRegenerate={handleRegenerate}
              loadingRegen={loading}
            />
          )}

          {!generation && !loading && !error && (
            <div className="glass-panel rounded-2xl p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 min-h-[350px] flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Briefing Output Panel</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                Fill out the outstation trip details or load a preloaded template route on the left to generate the risk reports.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
