
import React, { useState, useEffect } from 'react';
import { NewsletterData, SectionInstance, SectionType, QuickLink, FeatureCard, SportMatch, EntertainmentKitItem, PortalView, WidgetCard, WidgetConfig, HeaderData } from '../types';

interface AdminPortalProps {
  data: NewsletterData;
  onUpdate: (newData: NewsletterData) => void;
  onLogout: () => void;
  onSwitchView: (view: PortalView) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ data, onUpdate, onLogout, onSwitchView }) => {
  const [localData, setLocalData] = useState<NewsletterData>({
    sections: Array.isArray(data?.sections) ? data.sections : [],
    footer: data?.footer || { connectLabel: 'CONNECT', socialLinks: [], copyrightText: '' },
    header: data?.header || { logoUrl: 'Diamond_white.png', linkUrl: '' },
    widgetCards: Array.isArray(data?.widgetCards) ? data.widgetCards : [],
    widgetEnabled: data?.widgetEnabled ?? true,
    widgetConfig: data?.widgetConfig || { buttonLabel: "WHAT'S ON", buttonIconUrl: "", enableBounce: true }
  });
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'widget'>('content');

  useEffect(() => {
    if (data) {
      setLocalData({
        sections: Array.isArray(data.sections) ? data.sections : [],
        footer: data.footer || { connectLabel: 'CONNECT', socialLinks: [], copyrightText: '' },
        header: data.header || { logoUrl: 'Diamond_white.png', linkUrl: '' },
        widgetCards: Array.isArray(data.widgetCards) ? data.widgetCards : [],
        widgetEnabled: data.widgetEnabled ?? true,
        widgetConfig: data.widgetConfig || { buttonLabel: "WHAT'S ON", buttonIconUrl: "", enableBounce: true }
      });
    }
  }, [data]);

  const updateSection = (id: string, newContent: any) => {
    const updatedSections = localData.sections.map(sec => 
      sec.id === id ? { ...sec, content: newContent } : sec
    );
    setLocalData({ ...localData, sections: updatedSections });
  };

  const updateFooter = (newFooter: any) => {
    setLocalData({ ...localData, footer: { ...localData.footer, ...newFooter } });
  };

  const updateHeader = (newHeader: Partial<HeaderData>) => {
    setLocalData({ ...localData, header: { ...(localData.header as HeaderData), ...newHeader } });
  };

  const updateWidgetConfig = (updates: Partial<WidgetConfig>) => {
    setLocalData({
      ...localData,
      widgetConfig: { ...(localData.widgetConfig as WidgetConfig), ...updates }
    });
  };

  const updateWidgetCard = (id: string, updates: Partial<WidgetCard>) => {
    const updated = (localData.widgetCards || []).map(card => 
      card.id === id ? { ...card, ...updates } : card
    );
    setLocalData({ ...localData, widgetCards: updated });
  };

  const addWidgetCard = () => {
    const newCard: WidgetCard = {
      id: `wc_${Date.now()}`,
      title: "New Highlight",
      subtitle: "Brief Subtitle",
      description: "Detailed description goes here.",
      imageUrl: "",
      ctaUrl: "",
      ctaLabel: "Learn More",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000 * 30).toISOString(),
      isActive: true
    };
    setLocalData({ ...localData, widgetCards: [...(localData.widgetCards || []), newCard] });
  };

  const removeWidgetCard = (id: string) => {
    setLocalData({ ...localData, widgetCards: (localData.widgetCards || []).filter(c => c.id !== id) });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...localData.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      setLocalData({ ...localData, sections: newSections });
    }
  };

  const removeSection = (id: string) => {
    setLocalData({ ...localData, sections: localData.sections.filter(sec => sec.id !== id) });
  };

  const addSectionFromTemplate = (type: SectionType) => {
    const templates: Record<SectionType, any> = {
      hero: { title: "NEW", subtitle: "highlights", bgImage: "" },
      welcome: { text: "WELCOME" },
      quickLinks: [{ id: Date.now().toString(), label: "Link", url: "#", imageUrl: "" }],
      featureCards: [{ id: Date.now().toString(), title: "", heading: "", description: "", imageUrl: "", ctaUrl: "#", ctaLabel: "Explore More" }],
      entertainmentKit: { bannerImageUrl: "", items: [] },
      sportsSchedule: [],
      charity: { title: "", heading: "", headingLogoUrl: "", description: "", subtext: "", imageUrl: "", ctaLabel: "", ctaUrl: "#" }
    };

    const newSection: SectionInstance = {
      id: `sec_${type}_${Date.now()}`,
      type,
      content: templates[type]
    };

    setLocalData({ ...localData, sections: [...localData.sections, newSection] });
    setShowAddMenu(false);
  };

  const getCardStatus = (card: WidgetCard) => {
    const now = new Date();
    const start = new Date(card.startTime);
    const end = new Date(card.endTime);
    if (!card.isActive) return { label: 'Inactive', color: 'bg-gray-400' };
    if (now < start) return { label: 'Scheduled', color: 'bg-blue-500' };
    if (now > end) return { label: 'Expired', color: 'bg-red-400' };
    return { label: 'Live', color: 'bg-green-500' };
  };

  const renderSectionEditor = (section: SectionInstance, index: number) => {
    if (!section) return null;
    const { id, type, content } = section;

    const commonHeader = (
      <div className="flex justify-between items-center mb-6 bg-gray-100 p-3 rounded-t-xl border-b">
        <div className="flex items-center gap-3">
          <span className="bg-navy text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">{type}</span>
          <h3 className="text-sm font-bold text-navy opacity-60">ID: {id}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="p-2 bg-white rounded shadow-sm disabled:opacity-30">▲</button>
          <button onClick={() => moveSection(index, 'down')} disabled={index === localData.sections.length - 1} className="p-2 bg-white rounded shadow-sm disabled:opacity-30">▼</button>
          <button onClick={() => removeSection(id)} className="p-2 bg-red-50 text-red-500 rounded shadow-sm">✕</button>
        </div>
      </div>
    );

    switch (type) {
      case 'hero':
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Background Image URL</label>
                <input value={content?.bgImage || ''} onChange={(e) => updateSection(id, { ...content, bgImage: e.target.value })} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Title</label>
                <input value={content?.title || ''} onChange={(e) => updateSection(id, { ...content, title: e.target.value })} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Subtitle</label>
                <input value={content?.subtitle || ''} onChange={(e) => updateSection(id, { ...content, subtitle: e.target.value })} className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>
        );

      case 'quickLinks':
        const links = Array.isArray(content) ? content : [];
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-4">
              {links.map((link: QuickLink, lIdx: number) => (
                <div key={link.id} className="p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative">
                  <div className="md:col-span-3">
                    <input placeholder="Label" value={link.label || ''} onChange={(e) => {
                      const newContent = [...links];
                      newContent[lIdx].label = e.target.value;
                      updateSection(id, newContent);
                    }} className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="md:col-span-3">
                    <input placeholder="Link URL" value={link.url || ''} onChange={(e) => {
                      const newContent = [...links];
                      newContent[lIdx].url = e.target.value;
                      updateSection(id, newContent);
                    }} className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="md:col-span-5">
                    <input placeholder="Image URL" value={link.imageUrl || ''} onChange={(e) => {
                      const newContent = [...links];
                      newContent[lIdx].imageUrl = e.target.value;
                      updateSection(id, newContent);
                    }} className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button 
                      onClick={() => {
                        const newContent = links.filter((_, i) => i !== lIdx);
                        updateSection(id, newContent);
                      }} 
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove Link"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => updateSection(id, [...links, { id: Date.now().toString(), label: "New Link", url: "#", imageUrl: "" }])} className="text-gold text-xs font-bold uppercase tracking-widest">+ ADD LINK</button>
            </div>
          </div>
        );

      case 'featureCards':
        const cards = Array.isArray(content) ? content : [];
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-6">
              {cards.map((card: FeatureCard, cIdx: number) => (
                <div key={card.id} className="p-4 border rounded-xl bg-gray-50 space-y-4 relative">
                  <button 
                    onClick={() => {
                      const newContent = cards.filter((_: any, i: number) => i !== cIdx);
                      updateSection(id, newContent);
                    }} 
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-widest"
                  >
                    ✕ Remove Card
                  </button>
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <input placeholder="Main Heading" value={card.heading || ''} onChange={(e) => {
                      const newContent = [...cards];
                      newContent[cIdx].heading = e.target.value;
                      updateSection(id, newContent);
                    }} className="p-2 border rounded text-sm" />
                    <input placeholder="Sub Title" value={card.title || ''} onChange={(e) => {
                      const newContent = [...cards];
                      newContent[cIdx].title = e.target.value;
                      updateSection(id, newContent);
                    }} className="p-2 border rounded text-sm" />
                  </div>
                  <textarea placeholder="Description" value={card.description || ''} onChange={(e) => {
                    const newContent = [...cards];
                    newContent[cIdx].description = e.target.value;
                    updateSection(id, newContent);
                  }} className="w-full p-2 border rounded text-sm" rows={2} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input placeholder="Image URL" value={card.imageUrl || ''} onChange={(e) => {
                      const newContent = [...cards];
                      newContent[cIdx].imageUrl = e.target.value;
                      updateSection(id, newContent);
                    }} className="p-2 border rounded text-sm" />
                    <input placeholder="CTA URL" value={card.ctaUrl || ''} onChange={(e) => {
                      const newContent = [...cards];
                      newContent[cIdx].ctaUrl = e.target.value;
                      updateSection(id, newContent);
                    }} className="p-2 border rounded text-sm" />
                    <input placeholder="CTA Label (Button Text)" value={card.ctaLabel || ''} onChange={(e) => {
                      const newContent = [...cards];
                      newContent[cIdx].ctaLabel = e.target.value;
                      updateSection(id, newContent);
                    }} className="p-2 border rounded text-sm" />
                  </div>
                </div>
              ))}
              <button onClick={() => updateSection(id, [...cards, { id: Date.now().toString(), title: "", heading: "", description: "", imageUrl: "", ctaUrl: "#", ctaLabel: "Explore More" }])} className="text-gold text-xs font-bold uppercase tracking-widest">+ ADD CARD</button>
            </div>
          </div>
        );

      case 'entertainmentKit':
        const kitItems = Array.isArray(content?.items) ? content.items : (Array.isArray(content) ? content : []);
        const bannerImg = content?.bannerImageUrl || '';
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-6">
              <input 
                placeholder="Banner Image URL" 
                value={bannerImg} 
                onChange={(e) => updateSection(id, { ...content, bannerImageUrl: e.target.value, items: kitItems })} 
                className="w-full p-3 border rounded text-sm" 
              />
              <div className="space-y-4">
                {kitItems.map((item: EntertainmentKitItem, kIdx: number) => (
                  <div key={item.id} className="p-4 border rounded-xl bg-white grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <input placeholder="Label" value={item.label || ''} onChange={(e) => {
                      const newItems = [...kitItems]; newItems[kIdx].label = e.target.value;
                      updateSection(id, { ...content, items: newItems });
                    }} className="p-2 border rounded text-xs" />
                    <input placeholder="URL" value={item.url || ''} onChange={(e) => {
                      const newItems = [...kitItems]; newItems[kIdx].url = e.target.value;
                      updateSection(id, { ...content, items: newItems });
                    }} className="p-2 border rounded text-xs" />
                    <input placeholder="Icon URL" value={item.iconUrl || ''} onChange={(e) => {
                      const newItems = [...kitItems]; newItems[kIdx].iconUrl = e.target.value;
                      updateSection(id, { ...content, items: newItems });
                    }} className="p-2 border rounded text-xs" />
                    <button onClick={() => {
                      const newItems = kitItems.filter((_: any, i: number) => i !== kIdx);
                      updateSection(id, { ...content, items: newItems });
                    }} className="p-2 bg-red-50 text-red-500 rounded text-[10px] uppercase">Delete</button>
                  </div>
                ))}
              </div>
              <button onClick={() => updateSection(id, { ...content, items: [...kitItems, { id: Date.now().toString(), label: "New", url: "#", iconUrl: "" }] })} className="text-gold text-xs font-bold uppercase tracking-widest">+ ADD ITEM</button>
            </div>
          </div>
        );

      case 'sportsSchedule':
        const matches = Array.isArray(content) ? content : [];
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-6">
              {matches.map((match: SportMatch, sIdx: number) => (
                <div key={match.id} className="p-5 border rounded-2xl bg-gray-50 space-y-4 relative">
                  <button 
                    onClick={() => {
                      const newC = matches.filter((m: any) => m.id !== match.id);
                      updateSection(id, newC);
                    }} 
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-widest"
                  >
                    ✕ Remove Match
                  </button>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</label>
                      <input placeholder="e.g. 07" value={match.date || ''} onChange={(e) => {
                        const newC = [...matches]; newC[sIdx].date = e.target.value; updateSection(id, newC);
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Month</label>
                      <input placeholder="e.g. JAN" value={match.month || ''} onChange={(e) => {
                        const newC = [...matches]; newC[sIdx].month = e.target.value; updateSection(id, newC);
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Time</label>
                      <input placeholder="e.g. 23:30" value={match.time || ''} onChange={(e) => {
                        const newC = [...matches]; newC[sIdx].time = e.target.value; updateSection(id, newC);
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Venue</label>
                      <input placeholder="Venue" value={match.location || ''} onChange={(e) => {
                        const newC = [...matches]; newC[sIdx].location = e.target.value; updateSection(id, newC);
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Team A Name</label>
                      <input placeholder="Team A" value={match.teamA || ''} onChange={(e) => {
                        const newC = [...matches]; newC[sIdx].teamA = e.target.value; updateSection(id, newC);
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Team A Logo URL</label>
                      <input placeholder="Logo URL" value={match.logoA || ''} onChange={(e) => {
                        const newC = [...matches]; newC[sIdx].logoA = e.target.value; updateSection(id, newC);
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Team B Name</label>
                      <input placeholder="Team B" value={match.teamB || ''} onChange={(e) => {
                        const newC = [...matches]; newC[sIdx].teamB = e.target.value; updateSection(id, newC);
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Team B Logo URL</label>
                      <input placeholder="Logo URL" value={match.logoB || ''} onChange={(e) => {
                        const newC = [...matches]; newC[sIdx].logoB = e.target.value; updateSection(id, newC);
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">League Name</label>
                    <input placeholder="League" value={match.league || ''} onChange={(e) => {
                      const newC = [...matches]; newC[sIdx].league = e.target.value; updateSection(id, newC);
                    }} className="w-full p-2 border rounded text-xs" />
                  </div>
                </div>
              ))}
              <button onClick={() => updateSection(id, [...matches, { id: Date.now().toString(), date: "01", month: "JAN", teamA: "Team A", teamB: "Team B", league: "", time: "", location: "Savanna Sol", logoA: "", logoB: "" }])} className="text-gold text-[10px] font-black uppercase tracking-[0.2em] border-b border-gold pb-1">+ ADD MATCH TO SCHEDULE</button>
            </div>
          </div>
        );

      case 'welcome':
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Message</label>
              <textarea value={content?.text || ''} onChange={(e) => updateSection(id, { text: e.target.value })} className="w-full p-3 border rounded-lg text-sm" rows={2} />
            </div>
          </div>
        );

      case 'charity':
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Main Title</label>
                   <input placeholder="Title" value={content?.title || ''} onChange={(e) => updateSection(id, { ...content, title: e.target.value })} className="w-full p-2 border rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Logo URL (Heading)</label>
                   <input placeholder="Heading Logo URL" value={content?.headingLogoUrl || ''} onChange={(e) => updateSection(id, { ...content, headingLogoUrl: e.target.value })} className="w-full p-2 border rounded text-sm" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Charity Image URL</label>
                 <input placeholder="Image URL" value={content?.imageUrl || ''} onChange={(e) => updateSection(id, { ...content, imageUrl: e.target.value })} className="w-full p-2 border rounded text-sm" />
               </div>
               <textarea placeholder="Description" value={content?.description || ''} onChange={(e) => updateSection(id, { ...content, description: e.target.value })} className="w-full p-2 border rounded text-sm" rows={3} />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Button Text</label>
                   <input placeholder="CTA Label" value={content?.ctaLabel || ''} onChange={(e) => updateSection(id, { ...content, ctaLabel: e.target.value })} className="w-full p-2 border rounded text-sm" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Button URL</label>
                   <input placeholder="CTA URL" value={content?.ctaUrl || ''} onChange={(e) => updateSection(id, { ...content, ctaUrl: e.target.value })} className="w-full p-2 border rounded text-sm" />
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Subtext (Italic)</label>
                 <input placeholder="Subtext" value={content?.subtext || ''} onChange={(e) => updateSection(id, { ...content, subtext: e.target.value })} className="w-full p-2 border rounded text-sm" />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Disclaimer / Footer Text</label>
                 <textarea placeholder="Footer text" value={content?.footerText || ''} onChange={(e) => updateSection(id, { ...content, footerText: e.target.value })} className="w-full p-2 border rounded text-sm" rows={2} />
               </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 max-w-5xl mx-auto pb-40">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Management</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest opacity-70">Rixos Digital CMS</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogout} className="px-6 py-3 rounded-lg border text-navy text-[10px] uppercase font-black">Logout</button>
          <button onClick={() => onUpdate(localData)} className="bg-gold text-white px-8 py-3 rounded-lg text-[10px] uppercase font-black shadow-lg hover:bg-[#b08b49] transition-colors">Save All Changes</button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('content')}
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-navy text-white' : 'bg-white text-navy border'}`}
        >
          Page 1: Newsletter Content
        </button>
        <button 
          onClick={() => setActiveTab('widget')}
          className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'widget' ? 'bg-navy text-white' : 'bg-white text-navy border'}`}
        >
          Page 2: Interactive Widget
        </button>
      </div>

      {activeTab === 'content' ? (
        <div className="space-y-4">
          {/* Header Settings Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 overflow-hidden">
            <div className="bg-navy text-white p-3 -m-6 mb-6 text-[10px] font-bold uppercase tracking-widest">Header Settings</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logo Image URL</label>
                <input 
                  value={localData.header?.logoUrl || ''} 
                  onChange={(e) => updateHeader({ logoUrl: e.target.value })} 
                  className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-gold outline-none" 
                  placeholder="e.g. Diamond_white.png"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Logo Redirect URL</label>
                <input 
                  value={localData.header?.linkUrl || ''} 
                  onChange={(e) => updateHeader({ linkUrl: e.target.value })} 
                  className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-gold outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {(localData.sections || []).map((section, index) => renderSectionEditor(section, index))}
          
          <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="bg-navy text-white p-3 text-[10px] font-bold uppercase tracking-widest">Footer Settings</div>
            <div className="p-6 space-y-6">
              <input value={localData.footer?.connectLabel || ''} onChange={(e) => updateFooter({ connectLabel: e.target.value })} className="w-full p-2 border rounded text-sm" />
              <div className="space-y-4">
                {(localData.footer?.socialLinks || []).map((sl, idx) => (
                  <div key={sl.id || idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl">
                    <div className="md:col-span-5 space-y-1">
                      <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest">Icon URL</label>
                      <input placeholder="Icon URL" value={sl.iconUrl || ''} onChange={(e) => {
                        const newLinks = [...localData.footer.socialLinks]; newLinks[idx].iconUrl = e.target.value; updateFooter({ socialLinks: newLinks });
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <div className="md:col-span-5 space-y-1">
                      <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest">Social URL</label>
                      <input placeholder="Social Link URL" value={sl.url || ''} onChange={(e) => {
                        const newLinks = [...localData.footer.socialLinks]; newLinks[idx].url = e.target.value; updateFooter({ socialLinks: newLinks });
                      }} className="w-full p-2 border rounded text-xs" />
                    </div>
                    <button onClick={() => {
                      const newLinks = localData.footer.socialLinks.filter((_, i) => i !== idx); updateFooter({ socialLinks: newLinks });
                    }} className="md:col-span-2 p-2 bg-red-50 text-red-500 rounded text-[9px] uppercase font-bold h-[34px]">Delete</button>
                  </div>
                ))}
                <button onClick={() => updateFooter({ socialLinks: [...(localData.footer.socialLinks || []), { id: Date.now().toString(), iconUrl: "", url: "#" }] })} className="text-gold text-[10px] font-bold uppercase tracking-widest">+ Add Link</button>
              </div>
            </div>
          </div>

          <div className="mt-12 relative flex flex-col items-center">
            <button onClick={() => setShowAddMenu(!showAddMenu)} className="bg-navy text-white px-10 py-4 rounded-full font-bold shadow-2xl uppercase text-[11px] tracking-widest">+ Add Section</button>
            {showAddMenu && (
              <div className="absolute bottom-full mb-4 bg-white shadow-2xl rounded-2xl border p-4 grid grid-cols-2 gap-2 min-w-[300px] z-50">
                {['hero', 'welcome', 'quickLinks', 'featureCards', 'entertainmentKit', 'sportsSchedule', 'charity'].map((type) => (
                  <button key={type} onClick={() => addSectionFromTemplate(type as SectionType)} className="text-left px-4 py-3 hover:bg-gold hover:text-white rounded-xl text-[10px] font-bold uppercase transition-all">{type}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif italic text-navy">Widget Status</h2>
              <p className="text-xs text-gray-400">Enable or disable the interactive hovering widget entirely.</p>
            </div>
            <button 
              onClick={() => setLocalData({ ...localData, widgetEnabled: !localData.widgetEnabled })}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${localData.widgetEnabled ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              {localData.widgetEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Button Config Section on Page 2 (Widget Management) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border mb-8 overflow-hidden">
            <div className="bg-navy text-white p-3 -m-6 mb-6 text-[10px] font-bold uppercase tracking-widest">Floating Widget Appearance</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Widget Button Label</label>
                <input 
                  value={localData.widgetConfig?.buttonLabel || ''} 
                  onChange={(e) => updateWidgetConfig({ buttonLabel: e.target.value })} 
                  className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-gold outline-none" 
                  placeholder="e.g. WHAT'S ON"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Widget Button Icon URL</label>
                <input 
                  value={localData.widgetConfig?.buttonIconUrl || ''} 
                  onChange={(e) => updateWidgetConfig({ buttonIconUrl: e.target.value })} 
                  className="w-full p-2 border rounded text-sm focus:ring-1 focus:ring-gold outline-none" 
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-xl mt-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-navy uppercase tracking-widest">Enable Bounce Animation</span>
                  <p className="text-[9px] text-gray-400">Makes the button gently bounce to attract attention.</p>
                </div>
                <button 
                  onClick={() => updateWidgetConfig({ enableBounce: !localData.widgetConfig?.enableBounce })}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${localData.widgetConfig?.enableBounce ? 'bg-navy text-white' : 'bg-gray-200 text-gray-500'}`}
                >
                  {localData.widgetConfig?.enableBounce ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-[10px] font-black text-navy uppercase tracking-widest mb-2 px-2">Card Contents</h2>
            {(localData.widgetCards || []).map((card) => {
              const status = getCardStatus(card);
              return (
                <div key={card.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                  <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className={`${status.color} text-white text-[8px] font-black px-2 py-1 rounded-full uppercase`}>{status.label}</span>
                      <h3 className="font-bold text-navy text-sm uppercase tracking-tight">{card.title}</h3>
                    </div>
                    <button onClick={() => removeWidgetCard(card.id)} className="text-red-400 text-xs">✕ Remove</button>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Display Title</label>
                        <input value={card.title} onChange={(e) => updateWidgetCard(card.id, { title: e.target.value })} className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subtitle (Badge)</label>
                        <input value={card.subtitle} onChange={(e) => updateWidgetCard(card.id, { subtitle: e.target.value })} className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Description (Flipped Side)</label>
                        <textarea value={card.description} onChange={(e) => updateWidgetCard(card.id, { description: e.target.value })} className="w-full p-2 border rounded text-sm" rows={3} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Image URL</label>
                        <input value={card.imageUrl} onChange={(e) => updateWidgetCard(card.id, { imageUrl: e.target.value })} className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Start Date/Time</label>
                          <input type="datetime-local" value={card.startTime.slice(0, 16)} onChange={(e) => updateWidgetCard(card.id, { startTime: new Date(e.target.value).toISOString() })} className="w-full p-2 border rounded text-xs" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">End Date/Time</label>
                          <input type="datetime-local" value={card.endTime.slice(0, 16)} onChange={(e) => updateWidgetCard(card.id, { endTime: new Date(e.target.value).toISOString() })} className="w-full p-2 border rounded text-xs" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Action Label (Button Text)</label>
                          <input value={card.ctaLabel || ''} onChange={(e) => updateWidgetCard(card.id, { ctaLabel: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="e.g. Inquire Now" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Action URL (Link)</label>
                          <input value={card.ctaUrl || ''} onChange={(e) => updateWidgetCard(card.id, { ctaUrl: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="https://..." />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t mt-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Card Visibility</span>
                        <button 
                          onClick={() => updateWidgetCard(card.id, { isActive: !card.isActive })}
                          className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${card.isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                        >
                          {card.isActive ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <button 
              onClick={addWidgetCard}
              className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 hover:text-navy hover:border-navy transition-all font-black uppercase text-[10px] tracking-widest"
            >
              + Create New Card for Swipe Widget
            </button>
          </div>
        </div>
      )}

      <footer className="mt-20 py-10 border-t flex justify-center">
        <button onClick={() => onSwitchView('guest')} className="text-[9px] font-black tracking-widest text-gray-300 uppercase hover:text-navy">View Guest Experience</button>
      </footer>
    </div>
  );
};

export default AdminPortal;
