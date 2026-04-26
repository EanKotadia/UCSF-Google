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
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full card-glass p-12 shadow-2xl">
        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-accent border border-accent/20">
            <Shield size={40} />
          </div>
        </div>

        <h2 className="text-4xl font-display text-center text-text mb-2 uppercase tracking-tight">Database</h2>
        <p className="text-muted text-center text-[10px] mb-12 uppercase tracking-widest font-bold">UCSF Setup</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <LinkIcon size={12} /> Supabase URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="form-input"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <Key size={12} /> Anon Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="your-anon-key"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full justify-center py-4"
          >
            <Save size={18} /> Connect Database
          </button>
        </form>

        <div className="mt-10 p-5 bg-white/5 border border-white/10 rounded-2xl flex gap-4">
          <AlertCircle size={20} className="text-accent shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted leading-relaxed uppercase font-bold tracking-widest">
            Keys are stored locally for this session.
          </p>
        </div>
      </div>
    </div>
  );
}
