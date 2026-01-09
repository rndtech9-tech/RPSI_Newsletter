
import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import GuestPortal from './components/GuestPortal';
import AdminPortal from './components/AdminPortal';
import { NewsletterData, PortalView } from './types';
import { INITIAL_DATA } from './constants';

const getEnv = (key: string): string => {
  return ((import.meta as any).env?.[key] || (process.env as any)?.[key] || '');
};

const SB_URL = getEnv('VITE_SUPABASE_URL');
const SB_KEY = getEnv('VITE_SUPABASE_ANON_KEY');
const supabase = SB_URL && SB_KEY ? createClient(SB_URL, SB_KEY) : null;

const App: React.FC = () => {
  const [view, setView] = useState<PortalView>('guest');
  const [data, setData] = useState<NewsletterData>(() => {
    // Immediate hydration from local cache for instant performance
    const saved = localStorage.getItem('rixos_newsletter_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = useCallback(async (retryCount = 0) => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const response = await supabase
        .from('newsletter_content')
        .select('data')
        .eq('id', 1)
        .maybeSingle();

      if (response.data?.data) {
        const remoteData = response.data.data as NewsletterData;
        const mergedData = {
          ...INITIAL_DATA,
          ...remoteData,
          sections: Array.isArray(remoteData.sections) ? remoteData.sections : INITIAL_DATA.sections,
        };
        setData(mergedData);
        localStorage.setItem('rixos_newsletter_data', JSON.stringify(mergedData));
      }
    } catch (err) {
      console.warn(`Attempt ${retryCount + 1} failed. Retrying...`);
      if (retryCount < 3) {
        setTimeout(() => fetchData(retryCount + 1), 1000 * Math.pow(2, retryCount));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    if (supabase) {
      const channel = supabase
        .channel('newsletter_changes')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'newsletter_content', filter: 'id=eq.1' },
          (payload) => {
            const newData = payload.new?.data as NewsletterData | undefined;
            if (newData) {
              setData(prev => {
                const merged = { ...prev, ...newData };
                localStorage.setItem('rixos_newsletter_data', JSON.stringify(merged));
                return merged;
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchData]);

  const handleUpdate = async (newData: NewsletterData) => {
    setIsSyncing(true);
    setData(newData);
    localStorage.setItem('rixos_newsletter_data', JSON.stringify(newData));
    
    if (supabase) {
      const { error } = await supabase
        .from('newsletter_content')
        .upsert({ 
          id: 1, 
          data: newData, 
          updated_at: new Date().toISOString() 
        }, { onConflict: 'id' });
        
      if (error) {
        console.error("Cloud save failed:", error.message);
      }
    }
    
    setTimeout(() => setIsSyncing(false), 500);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = getEnv('VITE_ADMIN_PASSWORD') || 'admin123';
    if (passwordInput === correctPassword) {
      setIsAdminAuthenticated(true);
    } else {
      alert("Access Denied");
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setPasswordInput('');
  };

  if (loading && !data) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-navy text-white">
        <div className="font-serif italic text-4xl mb-4 animate-pulse">rixos</div>
        <div className="w-12 h-[1px] bg-gold"></div>
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
              <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center relative">
                <button onClick={() => setView('guest')} className="absolute top-8 right-8 text-[9px] font-black tracking-[0.2em] text-gray-300 uppercase">Cancel</button>
                <div className="w-20 h-20 bg-navy mx-auto mb-10 rounded-full flex items-center justify-center shadow-xl">
                   <div className="w-8 h-8 border-2 border-gold rounded-full"></div>
                </div>
                <h2 className="text-4xl font-serif text-navy mb-3 italic">Management</h2>
                <form onSubmit={handleAdminLogin}>
                  <input 
                    type="password" 
                    placeholder="Security Key" 
                    className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl mb-6 text-center focus:outline-none"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="w-full bg-navy text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase">Authenticate</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="relative">
              {isSyncing && (
                <div className="fixed top-6 right-6 z-[10000] bg-gold text-white px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] animate-pulse">SYNCING...</div>
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
