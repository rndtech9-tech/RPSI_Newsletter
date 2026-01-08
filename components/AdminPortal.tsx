
import React, { useState } from 'react';
import { NewsletterData, SectionInstance, SectionType, QuickLink, FeatureCard, SportMatch, EntertainmentKitItem, PortalView } from '../types';

interface AdminPortalProps {
  data: NewsletterData;
  onUpdate: (newData: NewsletterData) => void;
  onLogout: () => void;
  onSwitchView: (view: PortalView) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ data, onUpdate, onLogout, onSwitchView }) => {
  const [localData, setLocalData] = useState<NewsletterData>(data);
  const [showAddMenu, setShowAddMenu] = useState(false);

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
      hero: { title: "NEW", subtitle: "highlights", bgImage: "https://picsum.photos/1200/600" },
      welcome: { text: "WELCOME TO RIXOS PREMIUM SAADIYAT ISLAND" },
      quickLinks: [{ id: Date.now().toString(), label: "NEW LINK", url: "#", imageUrl: "https://picsum.photos/400/300" }],
      featureCards: [{ id: Date.now().toString(), title: "TITLE", heading: "Heading", description: "Desc", imageUrl: "https://picsum.photos/800/600", ctaUrl: "#" }],
      entertainmentKit: {
        bannerImageUrl: "https://picsum.photos/1200/300",
        items: [{ id: Date.now().toString(), label: "NEW KIT", sublabel: "Click to explore", iconUrl: "", url: "#" }]
      },
      sportsSchedule: [{ id: Date.now().toString(), date: "07", month: "JAN", teamA: "Team A", teamB: "Team B", league: "Premier League", time: "20:00", location: "Sports Bar", logoA: "https://picsum.photos/50/50", logoB: "https://picsum.photos/51/51" }],
      charity: { title: "CHARITY TITLE", heading: "Org Name", description: "Main description goes here", subtext: "Additional context", imageUrl: "https://picsum.photos/800/600", ctaLabel: "Learn More", ctaUrl: "#", footerText: "Fine print info" }
    };

    const newSection: SectionInstance = {
      id: `sec_${type}_${Date.now()}`,
      type,
      content: templates[type]
    };

    setLocalData({ ...localData, sections: [...localData.sections, newSection] });
    setShowAddMenu(false);
  };

  const handleSave = () => {
    onUpdate(localData);
    alert('Portal updated successfully!');
  };

  const renderSectionEditor = (section: SectionInstance, index: number) => {
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
          <button onClick={() => removeSection(id)} className="p-2 bg-red-50 text-red-500 rounded shadow-sm hover:bg-red-500 hover:text-white transition-all">✕</button>
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
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">Background Image URL</label>
                <input value={content.bgImage} onChange={(e) => updateSection(id, { ...content, bgImage: e.target.value })} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">Title (Above)</label>
                <input value={content.title} onChange={(e) => updateSection(id, { ...content, title: e.target.value })} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-widest">Subtitle (Highlights)</label>
                <input value={content.subtitle} onChange={(e) => updateSection(id, { ...content, subtitle: e.target.value })} className="w-full p-2 border rounded" />
              </div>
            </div>
          </div>
        );

      case 'quickLinks':
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-4">
              {content.map((link: QuickLink, lIdx: number) => (
                <div key={link.id} className="p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input placeholder="Label" value={link.label} onChange={(e) => {
                    const newContent = [...content];
                    newContent[lIdx].label = e.target.value;
                    updateSection(id, newContent);
                  }} className="p-2 border rounded text-sm" />
                  <input placeholder="Link URL" value={link.url} onChange={(e) => {
                    const newContent = [...content];
                    newContent[lIdx].url = e.target.value;
                    updateSection(id, newContent);
                  }} className="p-2 border rounded text-sm" />
                  <input placeholder="Image URL" value={link.imageUrl} onChange={(e) => {
                    const newContent = [...content];
                    newContent[lIdx].imageUrl = e.target.value;
                    updateSection(id, newContent);
                  }} className="p-2 border rounded text-sm" />
                </div>
              ))}
              <button onClick={() => updateSection(id, [...content, { id: Date.now().toString(), label: "New Link", url: "#", imageUrl: "" }])} className="text-gold text-xs font-bold uppercase tracking-widest">+ ADD LINK</button>
            </div>
          </div>
        );

      case 'featureCards':
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-6">
              {content.map((card: FeatureCard, cIdx: number) => (
                <div key={card.id} className="p-4 border rounded-xl bg-gray-50 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Main Heading" value={card.heading} onChange={(e) => {
                      const newContent = [...content];
                      newContent[cIdx].heading = e.target.value;
                      updateSection(id, newContent);
                    }} className="p-2 border rounded text-sm" />
                    <input placeholder="Sub Title" value={card.title} onChange={(e) => {
                      const newContent = [...content];
                      newContent[cIdx].title = e.target.value;
                      updateSection(id, newContent);
                    }} className="p-2 border rounded text-sm" />
                  </div>
                  <textarea placeholder="Description" value={card.description} onChange={(e) => {
                    const newContent = [...content];
                    newContent[cIdx].description = e.target.value;
                    updateSection(id, newContent);
                  }} className="w-full p-2 border rounded text-sm" rows={2} />
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Image URL" value={card.imageUrl} onChange={(e) => {
                      const newContent = [...content];
                      newContent[cIdx].imageUrl = e.target.value;
                      updateSection(id, newContent);
                    }} className="p-2 border rounded text-sm" />
                    <input placeholder="CTA URL" value={card.ctaUrl} onChange={(e) => {
                      const newContent = [...content];
                      newContent[cIdx].ctaUrl = e.target.value;
                      updateSection(id, newContent);
                    }} className="p-2 border rounded text-sm" />
                  </div>
                  <button onClick={() => updateSection(id, content.filter((_: any, i: number) => i !== cIdx))} className="text-red-500 text-[10px] font-bold uppercase tracking-widest">REMOVE CARD</button>
                </div>
              ))}
              <button onClick={() => updateSection(id, [...content, { id: Date.now().toString(), title: "TITLE", heading: "Heading", description: "", imageUrl: "", ctaUrl: "#" }])} className="text-gold text-xs font-bold uppercase tracking-widest">+ ADD FEATURE CARD</button>
            </div>
          </div>
        );

      case 'entertainmentKit':
        const kitItems = Array.isArray(content) ? content : (content.items || []);
        const bannerImg = !Array.isArray(content) ? (content.bannerImageUrl || '') : '';

        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <label className="block text-xs font-bold text-navy mb-2 uppercase tracking-widest">Section Banner Image URL</label>
                <input 
                  placeholder="Banner Image URL (Optional)" 
                  value={bannerImg} 
                  onChange={(e) => {
                    const currentItems = Array.isArray(content) ? content : (content.items || []);
                    updateSection(id, { bannerImageUrl: e.target.value, items: currentItems });
                  }} 
                  className="w-full p-3 border rounded-lg text-sm bg-white" 
                />
              </div>

              <div className="space-y-4">
                {kitItems.map((item: EntertainmentKitItem, kIdx: number) => (
                  <div key={item.id} className="p-4 border rounded-xl bg-white shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="flex flex-col gap-1 md:col-span-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Label</label>
                      <input 
                        value={item.label} 
                        onChange={(e) => {
                          const newItems = [...kitItems];
                          newItems[kIdx].label = e.target.value;
                          updateSection(id, { ...(!Array.isArray(content) ? content : {}), items: newItems });
                        }} 
                        className="p-2 border rounded text-xs" 
                      />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL (External Link)</label>
                      <input 
                        value={item.url} 
                        onChange={(e) => {
                          const newItems = [...kitItems];
                          newItems[kIdx].url = e.target.value;
                          updateSection(id, { ...(!Array.isArray(content) ? content : {}), items: newItems });
                        }} 
                        className="p-2 border rounded text-xs" 
                      />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Icon URL (.svg/.png)</label>
                      <input 
                        placeholder="Paste Image/SVG URL"
                        value={item.iconUrl || ''} 
                        onChange={(e) => {
                          const newItems = [...kitItems];
                          newItems[kIdx].iconUrl = e.target.value;
                          updateSection(id, { ...(!Array.isArray(content) ? content : {}), items: newItems });
                        }} 
                        className="p-2 border rounded text-xs" 
                      />
                    </div>
                    <div className="flex justify-end md:col-span-1 pb-1">
                      <button 
                        onClick={() => {
                          const newItems = kitItems.filter((_: any, i: number) => i !== kIdx);
                          updateSection(id, { ...(!Array.isArray(content) ? content : {}), items: newItems });
                        }} 
                        className="p-2 bg-red-50 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase w-full md:w-auto tracking-widest"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => {
                  const newItem = { id: Date.now().toString(), label: "New Kit", sublabel: "Details", iconUrl: "", url: "#" };
                  const currentItems = Array.isArray(content) ? content : (content.items || []);
                  updateSection(id, { ...(!Array.isArray(content) ? content : {}), items: [...currentItems, newItem] });
                }} 
                className="text-gold text-xs font-bold hover:underline uppercase tracking-widest"
              >
                + ADD KIT ITEM
              </button>
            </div>
          </div>
        );

      case 'sportsSchedule':
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-4">
              {content.map((match: SportMatch, sIdx: number) => (
                <div key={match.id} className="p-4 border rounded-xl bg-gray-50 space-y-4 relative group">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date (DD / MMM)</label>
                      <div className="flex gap-2">
                        <input placeholder="Day" value={match.date} onChange={(e) => {
                          const newC = [...content]; newC[sIdx].date = e.target.value; updateSection(id, newC);
                        }} className="p-2 border rounded text-xs w-1/2" />
                        <input placeholder="Month" value={match.month} onChange={(e) => {
                          const newC = [...content]; newC[sIdx].month = e.target.value; updateSection(id, newC);
                        }} className="p-2 border rounded text-xs w-1/2" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">League</label>
                      <input placeholder="e.g. Premier League" value={match.league} onChange={(e) => {
                        const newC = [...content]; newC[sIdx].league = e.target.value; updateSection(id, newC);
                      }} className="p-2 border rounded text-xs" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</label>
                      <input placeholder="HH:MM" value={match.time} onChange={(e) => {
                        const newC = [...content]; newC[sIdx].time = e.target.value; updateSection(id, newC);
                      }} className="p-2 border rounded text-xs" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</label>
                      <input placeholder="Arena/Bar" value={match.location} onChange={(e) => {
                        const newC = [...content]; newC[sIdx].location = e.target.value; updateSection(id, newC);
                      }} className="p-2 border rounded text-xs" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-200">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Team A (Home)</label>
                      <div className="flex gap-2">
                        <input placeholder="Team Name" value={match.teamA} onChange={(e) => {
                          const newC = [...content]; newC[sIdx].teamA = e.target.value; updateSection(id, newC);
                        }} className="p-2 border rounded text-xs flex-1" />
                        <input placeholder="Logo URL" value={match.logoA} onChange={(e) => {
                          const newC = [...content]; newC[sIdx].logoA = e.target.value; updateSection(id, newC);
                        }} className="p-2 border rounded text-xs flex-1" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Team B (Away)</label>
                      <div className="flex gap-2">
                        <input placeholder="Team Name" value={match.teamB} onChange={(e) => {
                          const newC = [...content]; newC[sIdx].teamB = e.target.value; updateSection(id, newC);
                        }} className="p-2 border rounded text-xs flex-1" />
                        <input placeholder="Logo URL" value={match.logoB} onChange={(e) => {
                          const newC = [...content]; newC[sIdx].logoB = e.target.value; updateSection(id, newC);
                        }} className="p-2 border rounded text-xs flex-1" />
                      </div>
                    </div>
                  </div>

                  <button onClick={() => updateSection(id, content.filter((_: any, i: number) => i !== sIdx))} className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-600">✕</button>
                </div>
              ))}
              <button onClick={() => updateSection(id, [...content, { id: Date.now().toString(), date: "01", month: "JAN", teamA: "New Team", teamB: "Opponent", league: "League", time: "20:00", location: "Bar", logoA: "", logoB: "" }])} className="text-gold text-xs font-bold uppercase tracking-widest">+ ADD MATCH FIXTURE</button>
            </div>
          </div>
        );

      case 'welcome':
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Welcome Message</label>
              <textarea value={content.text} onChange={(e) => updateSection(id, { text: e.target.value })} className="w-full p-3 border rounded-lg text-sm" rows={2} />
            </div>
          </div>
        );

      case 'charity':
        return (
          <div key={id} className="bg-white rounded-xl shadow-sm border mb-8 overflow-hidden">
            {commonHeader}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Section Heading (Small)</label>
                  <input placeholder="e.g. Dubai Cares" value={content.heading} onChange={(e) => updateSection(id, { ...content, heading: e.target.value })} className="w-full p-2 border rounded text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Title (Large)</label>
                  <input placeholder="e.g. HELP US BUILD A SCHOOL" value={content.title} onChange={(e) => updateSection(id, { ...content, title: e.target.value })} className="w-full p-2 border rounded text-sm" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea placeholder="Main content text..." value={content.description} onChange={(e) => updateSection(id, { ...content, description: e.target.value })} className="w-full p-2 border rounded text-sm" rows={3} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtext (Emotional Hook)</label>
                <input placeholder="e.g. Together, we're laying the first brick..." value={content.subtext} onChange={(e) => updateSection(id, { ...content, subtext: e.target.value })} className="w-full p-2 border rounded text-sm" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image URL</label>
                <input placeholder="Feature Image Link" value={content.imageUrl} onChange={(e) => updateSection(id, { ...content, imageUrl: e.target.value })} className="w-full p-2 border rounded text-sm" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Button Label</label>
                  <input placeholder="e.g. Click • Give • Change a Life" value={content.ctaLabel} onChange={(e) => updateSection(id, { ...content, ctaLabel: e.target.value })} className="w-full p-2 border rounded text-sm bg-gray-50" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-widest">Button URL</label>
                  <input placeholder="Link to donation or info" value={content.ctaUrl} onChange={(e) => updateSection(id, { ...content, ctaUrl: e.target.value })} className="w-full p-2 border rounded text-sm bg-gray-50" />
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-4 border-t border-gray-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Footer Text (Legal/Small Print)</label>
                <textarea placeholder="Legal disclaimers or contact info..." value={content.footerText} onChange={(e) => updateSection(id, { ...content, footerText: e.target.value })} className="w-full p-2 border rounded text-[10px]" rows={2} />
              </div>
            </div>
          </div>
        );

      default:
        return <div key={id} className="p-4 border rounded mb-4 bg-gray-50">Editor for {type} coming soon.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 max-w-5xl mx-auto pb-40">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Newsletter</h1>
          <p className="text-gray-500 text-xs uppercase tracking-[0.3em] font-bold opacity-70">Content Management System</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogout} 
            className="px-6 py-3 rounded-lg font-bold text-navy border border-navy/20 hover:bg-navy hover:text-white transition-all text-[10px] tracking-[0.2em] uppercase"
          >
            Logout
          </button>
          <button 
            onClick={handleSave} 
            className="bg-gold text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 text-[10px] tracking-[0.2em] uppercase transition-all"
          >
            Save All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {localData.sections.map((section, index) => renderSectionEditor(section, index))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="bg-navy text-white p-3 text-[10px] font-bold uppercase tracking-widest">Footer Settings</div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Connect Label</label>
            <input value={localData.footer.connectLabel} onChange={(e) => updateFooter({ connectLabel: e.target.value })} className="w-full p-2 border rounded text-sm" />
          </div>
          
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Social Links (Icons)</label>
            {localData.footer.socialLinks.map((sl, idx) => (
              <div key={sl.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl relative">
                <div className="md:col-span-5">
                   <label className="text-[9px] text-gray-400 font-bold mb-1 block uppercase">Icon URL (.png/.svg)</label>
                   <input 
                    placeholder="Icon URL" 
                    value={sl.iconUrl} 
                    onChange={(e) => {
                      const newLinks = [...localData.footer.socialLinks];
                      newLinks[idx].iconUrl = e.target.value;
                      updateFooter({ socialLinks: newLinks });
                    }} 
                    className="w-full p-2 border rounded text-xs bg-white" 
                   />
                </div>
                <div className="md:col-span-5">
                   <label className="text-[9px] text-gray-400 font-bold mb-1 block uppercase">Redirect URL</label>
                   <input 
                    placeholder="Redirect URL" 
                    value={sl.url} 
                    onChange={(e) => {
                      const newLinks = [...localData.footer.socialLinks];
                      newLinks[idx].url = e.target.value;
                      updateFooter({ socialLinks: newLinks });
                    }} 
                    className="w-full p-2 border rounded text-xs bg-white" 
                   />
                </div>
                <div className="md:col-span-2">
                  <button 
                    onClick={() => {
                      const newLinks = localData.footer.socialLinks.filter((_, i) => i !== idx);
                      updateFooter({ socialLinks: newLinks });
                    }}
                    className="w-full p-2 bg-red-50 text-red-500 rounded text-[9px] font-bold uppercase tracking-widest border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => {
                const newLink = { id: Date.now().toString(), iconUrl: "", url: "#" };
                updateFooter({ socialLinks: [...localData.footer.socialLinks, newLink] });
              }}
              className="text-gold text-[10px] font-bold uppercase tracking-widest hover:underline"
            >
              + Add Social Link
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">Copyright Text</label>
            <input value={localData.footer.copyrightText} onChange={(e) => updateFooter({ copyrightText: e.target.value })} className="w-full p-2 border rounded text-sm" />
          </div>
        </div>
      </div>

      <div className="mt-12 relative flex flex-col items-center">
        <button 
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="bg-navy text-white px-10 py-4 rounded-full font-bold shadow-2xl flex items-center gap-3 hover:scale-105 transition-all text-[11px] tracking-[0.2em] uppercase"
        >
          <span className="text-xl">+</span> ADD NEW SECTION
        </button>
        
        {showAddMenu && (
          <div className="absolute bottom-full mb-4 bg-white shadow-2xl rounded-2xl border border-gold/20 p-4 grid grid-cols-2 gap-2 min-w-[300px] z-50 animate-scroll-up">
            {[
              { type: 'hero', label: 'Hero Image' },
              { type: 'welcome', label: 'Welcome Text' },
              { type: 'quickLinks', label: 'Quick Links Row' },
              { type: 'featureCards', label: 'Feature Cards Carousel' },
              { type: 'entertainmentKit', label: 'Digital Kits Grid' },
              { type: 'sportsSchedule', label: 'Sports Match List' },
              { type: 'charity', label: 'Charity/Info Block' }
            ].map((opt) => (
              <button 
                key={opt.type}
                onClick={() => addSectionFromTemplate(opt.type as SectionType)}
                className="text-left px-4 py-3 hover:bg-gold hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all text-navy"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-20 py-10 border-t flex flex-col items-center gap-4">
        <button 
          onClick={() => onSwitchView('guest')}
          className="text-[9px] font-black tracking-[0.3em] text-gray-300 uppercase hover:text-navy transition-colors flex items-center gap-2 group"
        >
          <div className="w-1.5 h-1.5 bg-gray-200 group-hover:bg-gold rounded-full transition-colors"></div>
          Guest Experience
        </button>
      </footer>
    </div>
  );
};

export default AdminPortal;
