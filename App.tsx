
import React, { useState, useEffect } from 'react';
import GuestPortal from './components/GuestPortal';
import AdminPortal from './components/AdminPortal';
import { NewsletterData, PortalView } from './types';
import { INITIAL_DATA } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<PortalView>('guest');
  const [data, setData] = useState<NewsletterData>(INITIAL_DATA);

  // Load from local storage if available to simulate a DB
  useEffect(() => {
    const saved = localStorage.getItem('rixos_newsletter_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  const handleUpdate = (newData: NewsletterData) => {
    setData(newData);
    localStorage.setItem('rixos_newsletter_data', JSON.stringify(newData));
  };

  return (
    <div className="relative font-sans text-gray-900 overflow-x-hidden min-h-screen bg-white">
      {/* View Switcher Overlay - Refined for professional look */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-navy/90 backdrop-blur-md text-white rounded-full shadow-2xl p-1.5 flex items-center border border-gold/40">
        <button 
          onClick={() => setView('guest')}
          className={`px-8 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${view === 'guest' ? 'bg-gold text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
        >
          Guest View
        </button>
        <button 
          onClick={() => setView('admin')}
          className={`px-8 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-300 ${view === 'admin' ? 'bg-gold text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
        >
          Admin Panel
        </button>
      </div>

      <main className="w-full">
        {view === 'guest' ? (
          <GuestPortal data={data} />
        ) : (
          <AdminPortal data={data} onUpdate={handleUpdate} />
        )}
      </main>
    </div>
  );
};

export default App;
