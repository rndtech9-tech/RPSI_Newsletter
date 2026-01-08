
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import GuestPortal from './components/GuestPortal';
import AdminPortal from './components/AdminPortal';
import { NewsletterData, PortalView } from './types';
import { INITIAL_DATA } from './constants';

// Initialize Supabase only if environment variables are provided
// Use process.env as per environment configuration and guidelines
const SB_URL = process.env.VITE_SUPABASE_URL || '';
const SB_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null;

const App: React.FC = () => {
  const [view, setView] = useState<PortalView>('guest');
  const [data, setData] = useState<NewsletterData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch initial data & set up Realtime
  useEffect(() => {
    const fetchData = async () => {
      if (supabase) {
        const { data: dbData, error } = await supabase
          .from('newsletter_content')
          .select('data')
          .limit(1)
          .single();

        if (dbData && dbData.data && Object.keys(dbData.data).length > 0) {
          setData(dbData.data);
        } else if (error) {
          console.warn("Supabase fetch error, using local/initial data:", error);
        }
      } else {
        const saved = localStorage.getItem('rixos_newsletter_data');
        if (saved) setData(JSON.parse(saved));
      }
      setLoading(false);
    };

    fetchData();

    // Subscribe to real-time updates for guests
    if (supabase) {
      const channel = supabase
        .channel('newsletter_changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'newsletter_content' },
          (payload) => {
            console.log("Real-time update received");
            setData(payload.new.data);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleUpdate = async (newData: NewsletterData) => {
    setIsSyncing(true);
    setData(newData);
    
    if (supabase) {
      const { error } = await supabase
        .from('newsletter_content')
        .update({ data: newData })
        .eq('id', 1); // Assumes we only use the first row for the newsletter
        
      if (error) {
        console.error("Cloud save failed:", error);
        alert("Cloud sync failed. Saving locally instead.");
      }
    }
    
    localStorage.setItem('rixos_newsletter_data', JSON.stringify(newData));
    setTimeout(() => setIsSyncing(false), 800);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use process.env as per environment configuration and guidelines
    const correctPassword = process.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (passwordInput === correctPassword) {
      setIsAdminAuthenticated(true);
    } else {
      alert("Invalid Password");
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-navy text-white font-serif italic text-2xl animate-pulse">
        rixos
      </div>
    );
  }

  return (
    <div className="relative font-sans text-gray-900 overflow-x-hidden min-h-screen bg-white">
      {/* View Switcher Overlay */}
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
          !isAdminAuthenticated ? (
            <div className="h-screen flex items-center justify-center bg-gray-50 px-6">
              <form onSubmit={handleAdminLogin} className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center">
                <div className="w-16 h-16 bg-navy mx-auto mb-8 rounded-full flex items-center justify-center">
                   <div className="w-6 h-6 border-2 border-gold rounded-full"></div>
                </div>
                <h2 className="text-3xl font-serif text-navy mb-2 italic">Admin Access</h2>
                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-8">Rixos Premium Saadiyat</p>
                <input 
                  type="password" 
                  placeholder="Enter Password" 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl mb-6 text-center focus:outline-none focus:border-gold transition-all"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="w-full bg-navy text-white py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-gold transition-all">
                  Authenticate
                </button>
              </form>
            </div>
          ) : (
            <>
              {isSyncing && (
                <div className="fixed top-4 right-4 z-[10000] bg-gold text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest animate-pulse shadow-lg">
                  SYNCING CLOUD...
                </div>
              )}
              <AdminPortal data={data} onUpdate={handleUpdate} />
            </>
          )
        )}
      </main>
    </div>
  );
};

export default App;
