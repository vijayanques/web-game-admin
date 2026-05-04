'use client';

import { useState } from 'react';

export default function TestActivityPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const trackActivity = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          gameId: 1,
          categoryId: 1
        })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error);
    }
    setLoading(false);
  };

  const getTopPicks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/top-picks?userId=1');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test User Activity</h1>
      
      <div className="space-x-4 mb-6">
        <button
          onClick={trackActivity}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Track Activity
        </button>
        
        <button
          onClick={getTopPicks}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          Get Top Picks
        </button>
      </div>

      {result && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {result}
        </pre>
      )}
    </div>
  );
}
