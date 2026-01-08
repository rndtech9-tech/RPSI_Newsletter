
import React, { useEffect, useState } from 'react';
import { NewsletterData, SectionInstance, QuickLink, FeatureCard, EntertainmentKitItem, SportMatch } from '../types';
import { SportsIcon, KidsIcon, MatchesIcon, EntertainmentIcon } from './Icons';

interface GuestPortalProps {
  data: NewsletterData;
}

const GuestPortal: React.FC<GuestPortalProps> = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderSection = (section: SectionInstance) => {
    const { id, type, content } = section;

    switch (type) {
      case 'hero':
        return (
          <div key={id} className="max-w-7xl mx-auto md:px-6 mt-0 md:mt-6 relative mb-12">
            <div 
              className="relative aspect-square md:aspect-video w-full bg-cover bg-center flex flex-col items-center justify-end pb-32 md:pb-48 text-white text-center md:rounded-3xl overflow-hidden shadow-2xl"
              style={{ backgroundImage: `url(${content.bgImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50"></div>
              <div className={`relative z-10 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <div className="inline-block bg-navy/60 backdrop-blur-sm px-6 py-1.5 mb-4 rounded-sm">
                  <h2 className="text-xl md:text-2xl font-light tracking-[0.4em] opacity-95 uppercase">{content.title}</h2>
                </div>
                <h1 className="text-7xl md:text-9xl font-serif italic font-medium lowercase tracking-tight leading-none drop-shadow-2xl">
                  {content.subtitle}
                </h1>
              </div>
            </div>
          </div>
        );

      case 'welcome':
        return (
          <div key={id} className="max-w-7xl mx-auto py-8 text-center px-4 mb-8">
            <p className="text-[10px] md:text-sm font-semibold tracking-[0.3em] text-gray-400 uppercase max-w-2xl mx-auto leading-relaxed">
              {content.text}
            </p>
            <div className="w-16 h-[1px] bg-gold mx-auto mt-4"></div>
          </div>
        );

      case 'quickLinks':
        return (
          <div key={id} className="max-w-7xl mx-auto px-4 md:px-12 mb-20 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="flex flex-row items-center gap-6 md:gap-10 min-w-max py-8 md:py-12 px-6 md:px-0 pr-20 md:pr-32">
              {content.map((link: QuickLink) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="relative group flex items-center bg-white/40 backdrop-blur-xl border border-white/50 rounded-[1.5rem] md:rounded-full h-20 md:h-32 w-[280px] md:w-[320px] overflow-visible shadow-[0_8px_32px_rgba(0,46,66,0.08)] transition-all duration-500 hover:scale-[1.03]">
                  <div className="pl-6 md:pl-10 pr-28 md:pr-40 z-10">
                    <span className="text-[9px] md:text-[13px] font-black tracking-[0.18em] text-[#042e42] uppercase leading-snug group-hover:text-gold transition-colors block">{link.label}</span>
                  </div>
                  <div className="absolute right-[-6px] md:right-[-12px] top-[-12px] md:top-[-18px] bottom-[-12px] md:bottom-[-18px] w-24 md:w-36 z-20 overflow-hidden rounded-2xl md:rounded-3xl border-[3px] md:border-[5px] border-white shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
                    <img src={link.imageUrl} alt={link.label} className="w-full h-full object-cover" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        );

      case 'featureCards':
        return (
          <div key={id} className="w-full mb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-12 overflow-x-auto no-scrollbar scroll-smooth">
              <div className="flex flex-row items-center gap-8 md:gap-16 min-w-max pb-10 pr-20 md:pr-32">
                {content.map((card: FeatureCard) => (
                  <div key={card.id} className="w-[320px] md:w-[500px] bg-white p-6 md:p-12 rounded-[3rem] shadow-[0_35px_80px_-15px_rgba(0,46,66,0.12)] flex flex-col items-center text-center border border-gray-50 flex-shrink-0">
                    <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden mb-8 shadow-inner">
                      <img src={card.imageUrl} alt={card.heading} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif italic text-navy mb-4 lowercase tracking-tight leading-none">{card.heading}</h2>
                    <h3 className="text-[9px] font-bold tracking-[0.3em] text-gold mb-8 uppercase">{card.title}</h3>
                    <p className="text-xs md:text-base leading-relaxed text-gray-400 mb-10 font-light max-w-sm px-4">{card.description}</p>
                    <a href={card.ctaUrl} target="_blank" rel="noopener noreferrer" className="mt-auto inline-block px-10 py-3 border border-gold text-gold rounded-full text-[9px] font-bold tracking-[0.3em] uppercase transition-all hover:bg-gold hover:text-white">Explore More</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'entertainmentKit':
        return (
          <section key={id} className="bg-gray-50 py-12 mb-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {content.map((item: EntertainmentKitItem) => (
                <a key={item.id} href={item.url} className="bg-white p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-gold transition-all">
                  <div className="mb-4 bg-navy p-3 rounded-full group-hover:scale-110">
                    {item.iconType === 'sports' && <SportsIcon />}
                    {item.iconType === 'kids' && <KidsIcon />}
                    {item.iconType === 'matches' && <MatchesIcon />}
                    {item.iconType === 'live' && <EntertainmentIcon />}
                  </div>
                  <span className="text-[10px] font-bold text-navy uppercase group-hover:text-white">{item.label}</span>
                </a>
              ))}
            </div>
          </section>
        );

      case 'sportsSchedule':
        return (
          <section key={id} className="w-full mb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-12 mb-6">
               <h3 className="text-[10px] font-black tracking-[0.4em] text-gold uppercase mb-2">Sports Matches</h3>
               <div className="w-12 h-0.5 bg-navy/20"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 md:px-12 overflow-x-auto no-scrollbar scroll-smooth">
              <div className="flex flex-row items-stretch gap-6 min-w-max pb-8 pr-20 md:pr-32">
                {content.map((match: SportMatch) => (
                  <div key={match.id} className="w-[300px] md:w-[360px] flex flex-col bg-white p-6 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,46,66,0.06)] border border-gray-100 flex-shrink-0">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                        <span className="text-3xl font-serif text-navy font-bold">{match.date}</span>
                        <span className="text-[10px] text-gold font-black tracking-widest uppercase">{match.month}</span>
                      </div>
                      <span className="px-3 py-1 bg-gray-50 rounded-full text-[8px] font-bold text-gray-400 uppercase tracking-[0.1em] border border-gray-100">{match.league}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-8 bg-gray-50/50 p-5 rounded-3xl border border-gray-50">
                      <div className="flex flex-col items-center flex-1 gap-2">
                         <img src={match.logoA || 'https://picsum.photos/40/40'} alt={match.teamA} className="w-10 h-10 object-contain drop-shadow-sm" />
                         <span className="text-[9px] font-bold text-navy text-center uppercase tracking-tight max-w-[80px] leading-tight">{match.teamA}</span>
                      </div>
                      <div className="flex flex-col items-center px-4">
                         <span className="text-[10px] text-gray-300 font-black italic">VS</span>
                      </div>
                      <div className="flex flex-col items-center flex-1 gap-2">
                         <img src={match.logoB || 'https://picsum.photos/41/41'} alt={match.teamB} className="w-10 h-10 object-contain drop-shadow-sm" />
                         <span className="text-[9px] font-bold text-navy text-center uppercase tracking-tight max-w-[80px] leading-tight">{match.teamB}</span>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-between items-center text-[9px] font-bold text-navy/40 border-t border-gray-50 pt-4">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                         <span className="tracking-widest uppercase">{match.time}</span>
                      </div>
                      <span className="text-gray-300 uppercase tracking-widest">{match.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'charity':
        return (
          <section key={id} className="max-w-7xl mx-auto px-6 mb-32">
            <div className="bg-navy rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl">
              <div className="lg:w-1/2 relative min-h-[300px]">
                <img src={content.imageUrl} alt="Info" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="lg:w-1/2 p-10 flex flex-col justify-center text-white">
                <h3 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">{content.title}</h3>
                <p className="text-base text-white/70 mb-10 font-light">{content.description}</p>
                <a href={content.ctaUrl} className="w-max px-12 py-5 bg-gold text-white rounded-full text-[10px] font-bold tracking-[0.3em] uppercase">{content.ctaLabel}</a>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-white shadow-2xl min-h-screen pb-20 overflow-x-hidden">
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-6 px-6 md:px-12">
           <div className="text-[10px] md:text-xs tracking-[0.3em] font-light opacity-80 uppercase leading-none">Rixos Premium Saadiyat Island</div>
           <div className="h-6 md:h-10 bg-white/10 rounded px-6 flex items-center justify-center text-[8px] tracking-widest opacity-50 uppercase">Rixos</div>
        </div>
      </div>

      <div className="w-full">
        {data.sections.map((section) => renderSection(section))}
      </div>

      <footer className="bg-white pt-24 pb-12 px-6 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-navy font-bold tracking-[0.4em] uppercase text-xs mb-6">Connect</h4>
          <div className="flex justify-center gap-10 text-navy/40 mb-12">
            <span className="text-sm uppercase tracking-widest cursor-pointer hover:text-gold">Instagram</span>
            <span className="text-sm uppercase tracking-widest cursor-pointer hover:text-gold">Facebook</span>
          </div>
          <div className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em]">© 2025 Rixos Hotels • Sustainability</div>
        </div>
      </footer>
    </div>
  );
};

export default GuestPortal;
