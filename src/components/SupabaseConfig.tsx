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
    <div className="min-h-screen bg-[#050b1a] flex items-center justify-center p-6">
      <div className="max-w-md w-full card-glass p-10 border-maple/20">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-maple/10 rounded-3xl flex items-center justify-center text-maple border border-maple/20">
            <Shield size={40} />
          </div>
        </div>

        <h2 className="text-3xl font-display text-center text-white mb-2 uppercase tracking-tight">Database Config</h2>
        <p className="text-white/40 text-center text-sm mb-10">Connect your UCSF Supabase instance.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <LinkIcon size={12} /> Supabase URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-maple/50 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <Key size={12} /> Anon Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="your-anon-key"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-maple/50 outline-none transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-3 py-4"
          >
            <Save size={18} /> Connect Database
          </button>
        </form>

        <div className="mt-8 p-4 bg-cedar/10 border border-cedar/20 rounded-2xl flex gap-3">
          <AlertCircle size={18} className="text-cedar shrink-0 mt-0.5" />
          <p className="text-[10px] text-cedar/80 leading-relaxed uppercase font-bold tracking-widest">
            These keys are stored locally in your browser for this session.
          </p>
        </div>
      </div>
    </div>
  );
}
