
import React, { useState, useEffect } from 'react';
import { NewsletterData, SectionInstance, SectionType, QuickLink, FeatureCard, SportMatch, EntertainmentKitItem, PortalView } from '../types';

interface AdminPortalProps {
  data: NewsletterData;
  onUpdate: (newData: NewsletterData) => void;
  onLogout: () => void;
  onSwitchView: (view: PortalView) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ data, onUpdate, onLogout, onSwitchView }) => {
  // Defensive initialization
  const [localData, setLocalData] = useState<NewsletterData>({
    sections: Array.isArray(data?.sections) ? data.sections : [],
    footer: data?.footer || { connectLabel: 'CONNECT', socialLinks: [], copyrightText: '' }
  });
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Sync state if data changes from parent (remote update)
  useEffect(() => {
    if (data) {
      setLocalData({
        sections: Array.isArray(data.sections) ? data.sections : [],
        footer: data.footer || { connectLabel: 'CONNECT', socialLinks: [], copyrightText: '' }
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
      featureCards: [{ id: Date.now().toString(), title: "", heading: "", description: "", imageUrl: "", ctaUrl: "#" }],
      entertainmentKit: { bannerImageUrl: "", items: [] },
      sportsSchedule: [],
      charity: { title: "", heading: "", description: "", subtext: "", imageUrl: "", ctaLabel: "", ctaUrl: "#" }
    };

    const newSection: SectionInstance = {
      id: `sec_${type}_${Date.now()}`,
      type,
      content: templates[type]
    };

    setLocalData({ ...localData, sections: [...localData.sections, newSection] });
    setShowAddMenu(false);
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
                <div key={link.id} className="p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input placeholder="Label" value={link.label || ''} onChange={(e) => {
                    const newContent = [...links];
                    newContent[lIdx].label = e.target.value;
                    updateSection(id, newContent);
                  }} className="p-2 border rounded text-sm" />
                  <input placeholder="Link URL" value={link.url || ''} onChange={(e) => {
                    const newContent = [...links];
                    newContent[lIdx].url = e.target.value;
                    updateSection(id, newContent);
                  }} className="p-2 border rounded text-sm" />
                  <input placeholder="Image URL" value={link.imageUrl || ''} onChange={(e) => {
                    const newContent = [...links];
                    newContent[lIdx].imageUrl = e.target.value;
                    updateSection(id, newContent);
                  }} className="p-2 border rounded text-sm" />
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
                <div key={card.id} className="p-4 border rounded-xl bg-gray-50 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                </div>
              ))}
              <button onClick={() => updateSection(id, [...cards, { id: Date.now().toString(), title: "", heading: "", description: "", imageUrl: "", ctaUrl: "#" }])} className="text-gold text-xs font-bold uppercase tracking-widest">+ ADD CARD</button>
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
            <div className="p-6 space-y-4">
              {matches.map((match: SportMatch, sIdx: number) => (
                <div key={match.id} className="p-4 border rounded-xl bg-gray-50 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <input placeholder="Day" value={match.date || ''} onChange={(e) => {
                      const newC = [...matches]; newC[sIdx].date = e.target.value; updateSection(id, newC);
                    }} className="p-2 border rounded text-xs" />
                    <input placeholder="Month" value={match.month || ''} onChange={(e) => {
                      const newC = [...matches]; newC[sIdx].month = e.target.value; updateSection(id, newC);
                    }} className="p-2 border rounded text-xs" />
                    <input placeholder="League" value={match.league || ''} onChange={(e) => {
                      const newC = [...matches]; newC[sIdx].league = e.target.value; updateSection(id, newC);
                    }} className="p-2 border rounded text-xs" />
                    <input placeholder="Time" value={match.time || ''} onChange={(e) => {
                      const newC = [...matches]; newC[sIdx].time = e.target.value; updateSection(id, newC);
                    }} className="p-2 border rounded text-xs" />
                  </div>
                </div>
              ))}
              <button onClick={() => updateSection(id, [...matches, { id: Date.now().toString(), date: "01", month: "JAN", teamA: "Team", teamB: "Opp", league: "", time: "", location: "", logoA: "", logoB: "" }])} className="text-gold text-xs font-bold uppercase tracking-widest">+ ADD MATCH</button>
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
               <input placeholder="Title" value={content?.title || ''} onChange={(e) => updateSection(id, { ...content, title: e.target.value })} className="w-full p-2 border rounded text-sm" />
               <textarea placeholder="Description" value={content?.description || ''} onChange={(e) => updateSection(id, { ...content, description: e.target.value })} className="w-full p-2 border rounded text-sm" rows={3} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const footer = localData.footer || { connectLabel: 'CONNECT', socialLinks: [], copyrightText: '' };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 max-w-5xl mx-auto pb-40">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Management</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest opacity-70">Rixos Digital CMS</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogout} className="px-6 py-3 rounded-lg border text-navy text-[10px] uppercase font-black">Logout</button>
          <button onClick={() => onUpdate(localData)} className="bg-gold text-white px-8 py-3 rounded-lg text-[10px] uppercase font-black shadow-lg">Save All</button>
        </div>
      </div>

      <div className="space-y-4">
        {(localData.sections || []).map((section, index) => renderSectionEditor(section, index))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-navy text-white p-3 text-[10px] font-bold uppercase tracking-widest">Footer Settings</div>
        <div className="p-6 space-y-6">
          <input value={footer.connectLabel || ''} onChange={(e) => updateFooter({ connectLabel: e.target.value })} className="w-full p-2 border rounded text-sm" />
          <div className="space-y-4">
            {(footer.socialLinks || []).map((sl, idx) => (
              <div key={sl.id || idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl">
                <input placeholder="Icon URL" value={sl.iconUrl || ''} onChange={(e) => {
                  const newLinks = [...footer.socialLinks]; newLinks[idx].iconUrl = e.target.value; updateFooter({ socialLinks: newLinks });
                }} className="md:col-span-10 p-2 border rounded text-xs" />
                <button onClick={() => {
                  const newLinks = footer.socialLinks.filter((_, i) => i !== idx); updateFooter({ socialLinks: newLinks });
                }} className="md:col-span-2 p-2 bg-red-50 text-red-500 rounded text-[9px] uppercase font-bold">Delete</button>
              </div>
            ))}
            <button onClick={() => updateFooter({ socialLinks: [...(footer.socialLinks || []), { id: Date.now().toString(), iconUrl: "", url: "#" }] })} className="text-gold text-[10px] font-bold uppercase">+ Add Link</button>
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

      <footer className="mt-20 py-10 border-t flex justify-center">
        <button onClick={() => onSwitchView('guest')} className="text-[9px] font-black tracking-widest text-gray-300 uppercase hover:text-navy">View Guest Experience</button>
      </footer>
    </div>
  );
};

export default AdminPortal;
