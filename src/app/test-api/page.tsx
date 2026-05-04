'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.118:8000';

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Testing API at:', `${API_URL}/api/admin/dashboard/stats`);
      
      const response = await axios.get(`${API_URL}/api/admin/dashboard/stats`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response.data);
      setResult(response.data);
    } catch (err: any) {
      console.error('API Error:', err);
      
      if (axios.isAxiosError(err)) {
        setError(JSON.stringify({
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          url: err.config?.url,
        }, null, 2));
      } else {
        setError(err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">API Connection Test</h1>
        
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <p className="text-slate-300">
              <span className="text-slate-500">API URL:</span>{' '}
              <span className="text-purple-400 font-mono">{API_URL}</span>
            </p>
            <p className="text-slate-300">
              <span className="text-slate-500">Endpoint:</span>{' '}
              <span className="text-purple-400 font-mono">/api/admin/dashboard/stats</span>
            </p>
            <p className="text-slate-300">
              <span className="text-slate-500">Full URL:</span>{' '}
              <span className="text-purple-400 font-mono break-all">
                {API_URL}/api/admin/dashboard/stats
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={testAPI}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white rounded-lg transition-colors mb-6"
        >
          {loading ? 'Testing...' : 'Test API Connection'}
        </button>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
            <pre className="text-sm text-red-300 overflow-auto">{error}</pre>
          </div>
        )}

        {result && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Success!</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Statistics:</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-slate-400 text-xs">Total Users</p>
                    <p className="text-white text-2xl font-bold">{result.stats?.totalUsers || 0}</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-slate-400 text-xs">Total Games</p>
                    <p className="text-white text-2xl font-bold">{result.stats?.totalGames || 0}</p>
                  </div>
                  <div className="bg-slate-800 p-3 rounded">
                    <p className="text-slate-400 text-xs">Active Players</p>
                    <p className="text-white text-2xl font-bold">{result.stats?.activePlayers || 0}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Full Response:</h4>
                <pre className="text-sm text-slate-300 overflow-auto bg-slate-800 p-4 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
