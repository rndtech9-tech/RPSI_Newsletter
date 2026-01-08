
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import GuestPortal from './components/GuestPortal';
import AdminPortal from './components/AdminPortal';
import { NewsletterData, PortalView } from './types';
import { INITIAL_DATA } from './constants';

// Helper to get env vars reliably
const getEnv = (key: string): string => {
  return ((import.meta as any).env?.[key] || (process.env as any)?.[key] || '');
};

const SB_URL = getEnv('VITE_SUPABASE_URL');
const SB_KEY = getEnv('VITE_SUPABASE_ANON_KEY');
const supabase = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null;

const App: React.FC = () => {
  const [view, setView] = useState<PortalView>('guest');
  const [data, setData] = useState<NewsletterData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        console.warn("Supabase client not initialized. Check your environment variables.");
        setLoading(false);
        return;
      }

      try {
        const response = await supabase
          .from('newsletter_content')
          .select('data')
          .eq('id', 1)
          .maybeSingle();

        const remoteData = response.data?.data as NewsletterData | undefined;
        
        // Ensure remote data has the required structure before committing to state
        if (remoteData && Array.isArray(remoteData.sections)) {
          setData(remoteData);
        } else if (response.error) {
          console.error("Supabase fetch error:", response.error.message);
        } else {
          console.log("No valid remote data found, staying with local initial data.");
        }
      } catch (err) {
        console.warn("Connection to cloud failed, using local fallback.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (supabase) {
      const channel = supabase
        .channel('newsletter_changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'newsletter_content', filter: 'id=eq.1' },
          (payload) => {
            console.log("Cloud Update Received");
            const newData = payload.new?.data as NewsletterData | undefined;
            if (newData && Array.isArray(newData.sections)) {
              setData(newData);
            }
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
        .upsert({ 
          id: 1, 
          data: newData, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'id' });
        
      if (error) {
        console.error("Cloud save failed detail:", error.message, error.details, error.hint);
        alert(`Cloud sync failed: ${error.message}. Check your Supabase table setup.`);
      }
    }
    
    localStorage.setItem('rixos_newsletter_data', JSON.stringify(newData));
    setTimeout(() => setIsSyncing(false), 800);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getEnv('VITE_ADMIN_PASSWORD') || 'admin123';
    if (passwordInput === correctPassword) {
      setIsAdminAuthenticated(true);
    } else {
      alert("Access Denied: Invalid Credentials");
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setPasswordInput('');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#002147] text-white">
        <div className="font-serif italic text-4xl mb-4 animate-pulse">rixos</div>
        <div className="w-12 h-[1px] bg-[#C5A059] transition-all duration-1000"></div>
      </div>
    );
  }

  return (
    <div className="relative font-sans text-gray-900 overflow-x-hidden min-h-screen bg-white">
      <main className="w-full">
        {view === 'guest' ? (
          <GuestPortal data={data} onSwitchView={setView} />
        ) : (
          !isAdminAuthenticated ? (
            <div className="h-screen flex items-center justify-center bg-gray-50 px-6">
              <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center animate-scroll-up relative">
                <button 
                  onClick={() => setView('guest')}
                  className="absolute top-8 right-8 text-[9px] font-black tracking-[0.2em] text-gray-300 uppercase hover:text-navy transition-colors"
                >
                  Cancel
                </button>
                <div className="w-20 h-20 bg-[#002147] mx-auto mb-10 rounded-full flex items-center justify-center shadow-xl">
                   <div className="w-8 h-8 border-2 border-[#C5A059] rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-4xl font-serif text-[#002147] mb-3 italic">Management</h2>
                <p className="text-[10px] text-gray-400 font-black tracking-[0.3em] uppercase mb-10">Secure Access Portal</p>
                <form onSubmit={handleAdminLogin}>
                  <input 
                    type="password" 
                    placeholder="Security Key" 
                    className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl mb-6 text-center focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] transition-all"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="w-full bg-[#002147] text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase hover:bg-[#C5A059] hover:shadow-xl transition-all duration-300">
                    Authenticate
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="relative animate-scroll-up">
              {isSyncing && (
                <div className="fixed top-6 right-6 z-[10000] bg-[#C5A059] text-white px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] animate-pulse shadow-2xl border border-white/20">
                  SYNCING TO CLOUD
                </div>
              )}
              <AdminPortal data={data} onUpdate={handleUpdate} onLogout={handleLogout} onSwitchView={setView} />
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default App;
