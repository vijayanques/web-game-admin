'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Send, User, Smartphone, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FirebaseToken {
  id: number;
  token: string;
  userId: number | null;
  deviceInfo: any;
  isActive: boolean;
  user?: {
    username: string;
    email: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function NotificationTestPanel() {
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [title, setTitle] = useState('New Game Available!');
  const [message, setMessage] = useState('Check out our latest trending game and start playing now.');
  const [isSending, setIsSending] = useState(false);

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['firebaseTokensAdmin'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/firebase-tokens/list`);
      const result = await response.json();
      return result.data || [];
    },
  });

  const handleSendNotification = async () => {
    if (!selectedToken) {
      toast.error('Please select a device/token first');
      return;
    }

    try {
      setIsSending(true);
      // We would need a backend route for sending FCM messages.
      const response = await fetch(`${API_BASE_URL}/firebase-tokens/test-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: selectedToken,
          title,
          message,
          data: {
            redirectUrl: 'https://theplayfree.com/trending',
          }
        }),
      });

      if (response.ok) {
        toast.success('🚀 Notification sent successfully!');
      } else {
        const err = await response.json();
        toast.error(`Error: ${err.message || 'Failed to send'}`);
      }
    } catch (error) {
      toast.error('Network error while sending notification');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Bell className="text-orange-500" />
          Push Notifications
        </h1>
        <p className="text-slate-400 mt-1">Test and manage Firebase Cloud Messaging (FCM) push notifications.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left: Configuration Form */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-orange-500" />
              Test Push Notification
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Target Device/Token</label>
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="">Select a registered device...</option>
                  {tokens.map((t: FirebaseToken) => (
                    <option key={t.id} value={t.token}>
                      {t.user?.username || 'Guest'} - {t.deviceInfo?.platform || 'Unknown Device'} ({t.token.substring(0, 15)}...)
                    </option>
                  ))}
                </select>
                {tokens.length === 0 && !isLoading && (
                  <p className="text-xs text-orange-400 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    No registered devices found. Visit the site and grant notification permission.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Notification Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter title..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Message Content</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter message body..."
                />
              </div>

              <button
                onClick={handleSendNotification}
                disabled={isSending || !selectedToken}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-lg transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl">
            <div className="flex gap-4">
              <Info className="w-6 h-6 text-orange-500 shrink-0" />
              <div>
                <h4 className="font-bold text-orange-500">How it works</h4>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                  Notifications are sent using Firebase Cloud Messaging (FCM). The selected user will receive a system-level notification even if the tab is closed, provided they have granted permission.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Registered Devices List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-500" />
              Registered Devices ({tokens.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px] p-4 space-y-3">
            {tokens.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <Smartphone className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No devices registered yet.</p>
              </div>
            ) : (
              tokens.map((t: FirebaseToken) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedToken(t.token)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${selectedToken === t.token
                    ? 'bg-orange-500/10 border-orange-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-white">{t.user?.username || 'Guest'}</span>
                    </div>
                    {t.isActive ? (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate mb-2">Token: {t.token}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">
                      {t.deviceInfo?.platform || 'Unknown'}
                    </span>
                    <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">
                      {t.deviceInfo?.language || 'en'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
