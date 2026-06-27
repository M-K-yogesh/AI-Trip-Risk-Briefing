import React, { useState, useEffect } from 'react';
import { templateService } from '../services/api';
import { Plus, Tag, MapPin, Truck, Calendar } from 'lucide-react';

const TemplateSelector = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for creating a custom preset inline
  const [showAddForm, setShowAddForm] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [season, setSeason] = useState('Summer');
  const [vehicleType, setVehicleType] = useState('Sedan Car');
  const [saving, setSaving] = useState(false);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplates();
      setTemplates(data.templates || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError('Could not load templates presets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    if (!presetName || !routeFrom || !routeTo || !vehicleType) return;
    
    try {
      setSaving(true);
      const payload = {
        templateName: presetName,
        routeFrom,
        routeTo,
        season,
        vehicleType
      };
      
      await templateService.createTemplate(payload);
      
      // Reset form and reload
      setPresetName('');
      setRouteFrom('');
      setRouteTo('');
      setSeason('Summer');
      setVehicleType('Sedan Car');
      setShowAddForm(false);
      await fetchTemplates();
    } catch (err) {
      console.error('Failed to save template:', err);
      alert('Error saving custom template. Please verify all inputs.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-500" />
            Outstation Preset Templates
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Quickly load route presets to save typing time</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 text-xs bg-brand-500 hover:bg-brand-600 text-white font-medium py-1.5 px-3 rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" />
          {showAddForm ? 'Close Add Form' : 'New Preset'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateTemplate} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Create New Route Preset</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Preset Title</label>
              <input
                type="text"
                placeholder="e.g. Hyderabad to Pune Express"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                required
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:border-brand-500 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Route From</label>
              <input
                type="text"
                placeholder="Hyderabad"
                value={routeFrom}
                onChange={(e) => setRouteFrom(e.target.value)}
                required
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:border-brand-500 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Route To</label>
              <input
                type="text"
                placeholder="Pune"
                value={routeTo}
                onChange={(e) => setRouteTo(e.target.value)}
                required
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:border-brand-500 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Season</label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:border-brand-500 dark:text-slate-100"
              >
                <option value="Summer">Summer</option>
                <option value="Monsoon">Monsoon</option>
                <option value="Winter">Winter</option>
                <option value="Spring">Spring</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">Vehicle Type</label>
              <input
                type="text"
                placeholder="Innova SUV / Coach"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:border-brand-500 dark:text-slate-100"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full text-xs bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium py-2 rounded-lg transition"
              >
                {saving ? 'Saving...' : 'Add Template'}
              </button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="min-w-[200px] h-20 bg-slate-100 dark:bg-slate-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-xs text-red-500">{error}</div>
      ) : templates.length === 0 ? (
        <div className="text-xs text-slate-500">No preset templates found. Add one above!</div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="text-left min-w-[220px] max-w-[220px] p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50/10 dark:hover:bg-brand-950/10 transition group cursor-pointer"
            >
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate group-hover:text-brand-500 transition-colors">
                {template.templateName}
              </h3>
              
              <div className="mt-2 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{template.routeFrom} ➔ {template.routeTo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{template.vehicleType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{template.season} Season</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
