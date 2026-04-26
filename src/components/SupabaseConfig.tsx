import React, { useState } from 'react';
import { Shield, Key, Link as LinkIcon, Save, AlertCircle } from 'lucide-react';

interface SupabaseConfigProps {
  onConfigured: (url: string, key: string) => void;
}

export default function SupabaseConfig({ onConfigured }: SupabaseConfigProps) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && key) {
      onConfigured(url, key);
    }
  };

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-border p-12 rounded-[2.5rem] shadow-2xl">
        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 bg-primary-muted rounded-3xl flex items-center justify-center text-primary border border-primary/20">
            <Shield size={40} />
          </div>
        </div>

        <h2 className="text-4xl font-display text-center text-text mb-2 uppercase tracking-tight">Database Config</h2>
        <p className="text-text-muted text-center text-sm mb-12 uppercase tracking-widest font-bold">Connect your UCSF Supabase instance.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <LinkIcon size={12} /> Supabase URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full bg-bg-alt border border-border rounded-2xl px-6 py-4 text-sm text-text focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-2">
              <Key size={12} /> Anon Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="your-anon-key"
              className="w-full bg-bg-alt border border-border rounded-2xl px-6 py-4 text-sm text-text focus:border-primary outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest transition-all hover:bg-primary/90 shadow-xl shadow-primary/20"
          >
            Connect Database
          </button>
        </form>

        <div className="mt-10 p-5 bg-yellow-50 border border-yellow-100 rounded-2xl flex gap-4">
          <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-yellow-700 leading-relaxed uppercase font-bold tracking-widest">
            These keys are stored locally in your browser for this session.
          </p>
        </div>
      </div>
    </div>
  );
}
