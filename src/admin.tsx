import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminPanel from './components/AdminPanel';
import './index.css';

// Standalone Admin Page
const AdminPage = () => {
  return (
    <div className="min-h-screen bg-bg-dark selection:bg-maple selection:text-black">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-maple/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cedar/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 p-6 md:p-12">
        <div className="max-w-[1600px] mx-auto">
          <AdminWrapper />
        </div>
      </div>
    </div>
  );
};

import { useUCSFData } from './hooks/useUCSFData';

const AdminWrapper = () => {
  const { houses, matches, schedule, settings, categories, refresh, loading, error } = useUCSFData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-maple/20 border-t-maple rounded-full animate-spin" />
        <p className="font-ui text-xs font-bold uppercase tracking-widest text-maple">Loading Admin Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-glass p-12 text-center border-cedar/20">
        <h2 className="text-2xl font-display text-white mb-4">Database Connection Error</h2>
        <p className="text-white/40 mb-6 font-ui text-sm uppercase tracking-widest">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <AdminPanel 
      matches={matches} 
      houses={houses} 
      schedule={schedule}
      categories={categories}
      settings={settings}
      refresh={refresh} 
    />
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminPage />
  </React.StrictMode>
);
