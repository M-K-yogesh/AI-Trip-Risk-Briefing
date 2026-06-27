import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, Compass, Zap } from 'lucide-react';

const AIForm = ({ initialData, onSubmit, loading }) => {
  const { user } = useAuth();
  
  const [adminName, setAdminName] = useState(user?.name || '');
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [season, setSeason] = useState('Monsoon');
  const [vehicleType, setVehicleType] = useState('Volvo AC Sleeper');
  const [duration, setDuration] = useState('8 Hours');
  const [notes, setNotes] = useState('');
  
  // AI Configs
  const [selectedModel, setSelectedModel] = useState('gemini'); // Default to Gemini
  const [lowTokenMode, setLowTokenMode] = useState(false);

  // Mic state
  const [activeMicField, setActiveMicField] = useState(null); // 'from', 'to', 'vehicle', 'duration', 'notes'
  const [isListening, setIsListening] = useState(false);

  // Sync state if preset loaded
  useEffect(() => {
    if (initialData) {
      if (initialData.routeFrom) setRouteFrom(initialData.routeFrom);
      if (initialData.routeTo) setRouteTo(initialData.routeTo);
      if (initialData.season) setSeason(initialData.season);
      if (initialData.vehicleType) setVehicleType(initialData.vehicleType);
      if (initialData.duration) setDuration(initialData.duration);
    }
  }, [initialData]);

  // Sync user name when user loaded
  useEffect(() => {
    if (user && !adminName) {
      setAdminName(user.name);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminName || !routeFrom || !routeTo || !season || !vehicleType || !duration) return;

    onSubmit({
      adminName,
      routeFrom,
      routeTo,
      season,
      vehicleType,
      duration,
      notes,
      selectedModel,
      lowTokenMode
    });
  };

  const handleVoiceInput = (fieldName, setter) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      setActiveMicField(null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN'; // Standard English dictation
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setActiveMicField(fieldName);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setter(prev => prev ? `${prev} ${transcript}` : transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      setActiveMicField(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      setActiveMicField(null);
    };

    recognition.start();
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl shadow-glass-light dark:shadow-glass-dark space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2 bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 rounded-lg">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Trip Factors</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure parameters to calculate safety warnings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Admin Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Administrator Name</label>
          <input
            type="text"
            required
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:border-brand-500 dark:text-slate-100 focus:ring-1 focus:ring-brand-500/30"
            placeholder="Name of Dispatch Admin"
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Vehicle Type</label>
          <div className="relative">
            <input
              type="text"
              required
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full text-sm p-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:border-brand-500 dark:text-slate-100 focus:ring-1 focus:ring-brand-500/30"
              placeholder="e.g. Volvo AC Multi-Axle / Innova SUV"
            />
            <button
              type="button"
              onClick={() => handleVoiceInput('vehicle', setVehicleType)}
              className={`absolute right-3 top-3.5 text-slate-400 hover:text-brand-500 transition ${activeMicField === 'vehicle' && isListening ? 'text-red-500 animate-pulse' : ''}`}
            >
              {activeMicField === 'vehicle' && isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Route From */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Departure Origin</label>
          <div className="relative">
            <input
              type="text"
              required
              value={routeFrom}
              onChange={(e) => setRouteFrom(e.target.value)}
              className="w-full text-sm p-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:border-brand-500 dark:text-slate-100 focus:ring-1 focus:ring-brand-500/30"
              placeholder="e.g. Hyderabad Office"
            />
            <button
              type="button"
              onClick={() => handleVoiceInput('from', setRouteFrom)}
              className={`absolute right-3 top-3.5 text-slate-400 hover:text-brand-500 transition ${activeMicField === 'from' && isListening ? 'text-red-500 animate-pulse' : ''}`}
            >
              {activeMicField === 'from' && isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Route To */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Destination Target</label>
          <div className="relative">
            <input
              type="text"
              required
              value={routeTo}
              onChange={(e) => setRouteTo(e.target.value)}
              className="w-full text-sm p-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:border-brand-500 dark:text-slate-100 focus:ring-1 focus:ring-brand-500/30"
              placeholder="e.g. Bangalore Majestic"
            />
            <button
              type="button"
              onClick={() => handleVoiceInput('to', setRouteTo)}
              className={`absolute right-3 top-3.5 text-slate-400 hover:text-brand-500 transition ${activeMicField === 'to' && isListening ? 'text-red-500 animate-pulse' : ''}`}
            >
              {activeMicField === 'to' && isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Season */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Departure Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:border-brand-500 dark:text-slate-100 focus:ring-1 focus:ring-brand-500/30"
          >
            <option value="Monsoon">Monsoon (Rain & Ghat Hazards)</option>
            <option value="Summer">Summer (Tyre Pressure & Heat Risks)</option>
            <option value="Winter">Winter (Morning Fog & Poor Visibility)</option>
            <option value="Spring">Spring (High Passenger Traffic)</option>
          </select>
        </div>

        {/* Trip Duration */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Estimated Duration</label>
          <div className="relative">
            <input
              type="text"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full text-sm p-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:border-brand-500 dark:text-slate-100 focus:ring-1 focus:ring-brand-500/30"
              placeholder="e.g. 9 Hours / 2 Days"
            />
            <button
              type="button"
              onClick={() => handleVoiceInput('duration', setDuration)}
              className={`absolute right-3 top-3.5 text-slate-400 hover:text-brand-500 transition ${activeMicField === 'duration' && isListening ? 'text-red-500 animate-pulse' : ''}`}
            >
              {activeMicField === 'duration' && isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400">Additional Dispatch Instructions / Notes</label>
          <button
            type="button"
            onClick={() => handleVoiceInput('notes', setNotes)}
            className={`text-xs text-slate-400 hover:text-brand-500 flex items-center gap-1 font-medium ${activeMicField === 'notes' && isListening ? 'text-red-500 font-semibold' : ''}`}
          >
            {activeMicField === 'notes' && isListening ? <MicOff className="w-3.5 h-3.5 animate-pulse" /> : <Mic className="w-3.5 h-3.5" />}
            {activeMicField === 'notes' && isListening ? 'Listening...' : 'Voice Input'}
          </button>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="3"
          className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 focus:outline-none focus:border-brand-500 dark:text-slate-100 focus:ring-1 focus:ring-brand-500/30"
          placeholder="Specify driver name, highway preference, cargo weight, or custom warning guidelines..."
        />
      </div>

      <div className="p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          AI Generation Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Model selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">AI Provider Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-brand-500"
            >
              <option value="gemini">Gemini</option>
              <option value="chatgpt">OpenAI ChatGPT</option>
              <option value="pollinations">Pollination AI</option>
            </select>
          </div>

          {/* Low Token Mode Toggle */}
          <div className="flex items-center justify-between md:justify-center gap-3 pt-4 md:pt-0">
            <div className="text-left md:text-center">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">Low-Token Mode</label>
              <p className="text-[10px] text-slate-500">Generate fast, concise briefs</p>
            </div>
            <button
              type="button"
              onClick={() => setLowTokenMode(!lowTokenMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${lowTokenMode ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${lowTokenMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full glow-primary bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Analyzing Risks...
          </>
        ) : (
          'Generate Safety Briefing Report'
        )}
      </button>
    </form>
  );
};

export default AIForm;
