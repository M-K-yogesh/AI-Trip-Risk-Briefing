import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';
import { ShieldCheck, BarChart2, Star, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getAnalytics();
      setData(res);
      setError(null);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Could not compile analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-3">Compiling fleet dispatch statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-200/50 bg-red-500/10 text-red-500 text-xs flex justify-between items-center">
        <span>{error}</span>
        <button onClick={fetchAnalytics} className="p-1 hover:bg-red-500/20 rounded transition">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Fallback structures if empty lists returned
  const modelStats = data?.models || [];
  const riskFactors = data?.riskFactors || { low: 0, moderate: 0, high: 0 };

  // Pie Chart Config for Risk Level Distribution
  const riskChartData = {
    labels: ['Low Risk', 'Moderate Risk', 'High Risk'],
    datasets: [
      {
        data: [riskFactors.low, riskFactors.moderate, riskFactors.high],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',  // Emerald Green / Soft Mint
          'rgba(245, 158, 11, 0.8)',  // Warm Amber
          'rgba(244, 63, 94, 0.8)'    // Coral Rose
        ],
        borderColor: 'transparent'
      }
    ]
  };

  const riskChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Doughnut Chart for AI models usage
  const modelChartData = {
    labels: modelStats.length > 0 ? modelStats.map(m => m.model) : ['No Models Used'],
    datasets: [
      {
        data: modelStats.length > 0 ? modelStats.map(m => m.count) : [1],
        backgroundColor: [
          'rgba(139, 92, 246, 0.75)',  // Violet
          'rgba(59, 130, 246, 0.75)',  // Blue
          'rgba(16, 185, 129, 0.75)',  // Green
          'rgba(245, 158, 11, 0.75)',  // Amber
          'rgba(239, 68, 68, 0.75)'    // Red
        ],
        borderColor: 'transparent'
      }
    ]
  };

  const modelChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Runs */}
        <div className="glass-panel p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-brand-500/10 text-brand-500 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Briefings</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">{data?.totalGenerations || 0}</span>
          </div>
        </div>

        {/* Performance (Latencies) */}
        <div className="glass-panel p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Avg AI Response</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">
              {data?.avgResponseTimeMs || 0} <span className="text-xs font-normal text-slate-400">ms</span>
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Level breakdown */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Trip Risk Distribution</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Briefing safety classifications (Low vs Moderate vs High Risk)</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Pie data={riskChartData} options={riskChartOptions} />
          </div>
        </div>

        {/* Model breakdown */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Engines Distribution</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Relative usage of different models chosen</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={modelChartData} options={modelChartOptions} />
          </div>
        </div>
      </div>

      {/* Routes list */}
      <div className="glass-panel p-5 rounded-2xl">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Most Frequently Dispatched Routes</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Trip frequencies logged by outstation admins</p>
        </div>

        {data?.routes && data.routes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                  <th className="py-2 font-semibold">Rank</th>
                  <th className="py-2 font-semibold">Route (Origin ➔ Destination)</th>
                  <th className="py-2 font-semibold text-right">Runs Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {data.routes.map((r, index) => (
                  <tr key={index} className="text-slate-600 dark:text-slate-300">
                    <td className="py-3 font-semibold text-slate-400"># {index + 1}</td>
                    <td className="py-3 font-medium">{r.route}</td>
                    <td className="py-3 text-right font-bold text-slate-700 dark:text-slate-200">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500">No route statistics compiled yet.</div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
