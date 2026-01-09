
import React, { useEffect, useState, useRef } from 'react';
import { NewsletterData, SectionInstance, QuickLink, FeatureCard, EntertainmentKitItem, SportMatch, PortalView, WidgetCard } from '../types';

interface GuestPortalProps {
  data: NewsletterData;
  onSwitchView: (view: PortalView) => void;
}

const GuestPortal: React.FC<GuestPortalProps> = ({ data, onSwitchView }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [activeCards, setActiveCards] = useState<WidgetCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Prevent background scrolling and touch interactions when widget is active
  useEffect(() => {
    if (showWidget) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showWidget]);

  useEffect(() => {
    if (data.widgetCards) {
      const now = new Date();
      const filtered = data.widgetCards.filter(card => {
        if (!card.isActive) return false;
        const start = new Date(card.startTime);
        const end = new Date(card.endTime);
        return now >= start && now <= end;
      });
      setActiveCards(filtered);
    }
  }, [data.widgetCards]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < activeCards.length) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    // Only flip if it's not the "All Caught Up" card
    if (currentIndex < activeCards.length) {
      setIsFlipped(!isFlipped);
    }
  };

  if (!data || !data.sections) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-navy text-white">
        <p className="font-serif italic animate-pulse">Initializing experience...</p>
      </div>
    );
  }

  const renderSection = (section: SectionInstance) => {
    if (!section || !section.content) return null;
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
                <div className="inline-block px-6 py-1.5 mb-4">
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
            <p className="text-[11px] md:text-sm font-semibold tracking-[0.3em] text-gray-400 uppercase leading-relaxed max-w-4xl mx-auto">
              {content.text}
            </p>
            <div className="w-16 h-[1px] bg-gold mx-auto mt-6"></div>
          </div>
        );

      case 'quickLinks':
        if (!Array.isArray(content)) return null;
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
        if (!Array.isArray(content)) return null;
        return (
          <div key={id} className="w-full mb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-12 overflow-x-auto no-scrollbar scroll-smooth">
              <div className="flex flex-row items-center gap-8 md:gap-16 min-w-max pb-10 pr-20 md:pr-32">
                {content.map((card: FeatureCard) => (
                  <div key={card.id} className="w-[320px] md:w-[500px] bg-white p-6 md:p-12 rounded-[3rem] shadow-[0_35px_80px_-15px_rgba(0,46,66,0.12)] flex flex-col items-center text-center border border-gray-50 flex-shrink-0">
                    <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden mb-8 shadow-inner">
                      <img src={card.imageUrl} alt={card.heading} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif italic text-navy mb-4 lowercase tracking-tight leading-none whitespace-nowrap">{card.heading}</h2>
                    <h3 className="text-[9px] font-bold tracking-[0.3em] text-gold mb-8 uppercase">{card.title}</h3>
                    <p className="text-xs md:text-base leading-relaxed text-gray-400 mb-10 font-light max-w-sm px-4">{card.description}</p>
                    <a 
                      href={card.ctaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-auto inline-block px-8 md:px-12 py-3.5 md:py-4 border border-gold text-gold bg-transparent rounded-full text-[9px] md:text-[10px] font-bold tracking-[0.35em] uppercase transition-all duration-500 hover:bg-gold hover:text-white hover:scale-105 hover:shadow-2xl hover:shadow-gold/20"
                    >
                      {card.ctaLabel || 'Explore More'}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'entertainmentKit':
        const kitItems = Array.isArray(content) ? content : (content.items || []);
        const bannerUrl = !Array.isArray(content) ? content.bannerImageUrl : null;

        return (
          <section key={id} className="w-full mb-12">
            {bannerUrl && (
              <div className="max-w-7xl mx-auto px-6 mb-8">
                <div className="w-full aspect-[21/9] md:aspect-[4/1] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl border border-gray-100">
                   <img src={bannerUrl} alt="Experience" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {kitItems.map((item: EntertainmentKitItem) => (
                <a 
                  key={item.id} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white p-8 rounded-[2rem] flex flex-col items-center text-center group hover:bg-gold transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="mb-5 bg-navy p-4 rounded-full group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 shadow-lg flex items-center justify-center">
                    {item.iconUrl ? (
                      <img 
                        src={item.iconUrl} 
                        alt="" 
                        className="w-8 h-8 object-contain brightness-0 invert" 
                      />
                    ) : (
                      <div className="w-8 h-8 border-2 border-white/20 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-[11px] font-black tracking-[0.1em] text-navy uppercase group-hover:text-white transition-colors duration-500">{item.label}</span>
                </a>
              ))}
            </div>
          </section>
        );

      case 'sportsSchedule':
        if (!Array.isArray(content)) return null;
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
            <div className="bg-navy rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border border-gold/10">
              <div className="lg:w-1/2 relative min-h-[350px]">
                <img src={content.imageUrl} alt="Info" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-navy/30 to-transparent"></div>
              </div>
              <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center text-white">
                {content.headingLogoUrl ? (
                  <img src={content.headingLogoUrl} alt={content.heading} className="h-10 md:h-14 w-auto object-contain mb-6 opacity-90" />
                ) : (
                  <h4 className="text-[10px] font-black tracking-[0.5em] text-gold uppercase mb-6">{content.heading}</h4>
                )}
                <h3 className="text-3xl md:text-5xl font-serif mb-8 leading-tight italic">{content.title}</h3>
                <p className="text-base text-white/70 mb-6 font-light leading-relaxed">{content.description}</p>
                {content.subtext && (
                   <p className="text-xs italic text-gold/80 mb-10 font-serif leading-relaxed opacity-90">{content.subtext}</p>
                )}
                <div className="flex flex-col gap-10">
                   {content.ctaUrl && content.ctaLabel && (
                     <a 
                      href={content.ctaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full md:w-max px-8 md:px-14 py-4 md:py-5 border border-gold text-gold bg-transparent rounded-full text-[10px] md:text-[11px] font-bold tracking-[0.35em] uppercase transition-all duration-500 hover:bg-gold hover:text-white hover:scale-105 hover:shadow-2xl hover:shadow-gold/20 text-center"
                     >
                      {content.ctaLabel}
                     </a>
                   )}
                   {content.footerText && (
                     <div className="pt-8 border-t border-white/10">
                        <p className="text-[9px] text-white/40 leading-relaxed font-medium uppercase tracking-widest">{content.footerText}</p>
                     </div>
                   )}
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const footer = data.footer || { connectLabel: 'CONNECT', socialLinks: [], copyrightText: '© 2025 RIXOS' };
  const header = data.header || { logoUrl: 'Diamond_white.png', linkUrl: 'https://www.rixos.com/hotel-resort/rixos-premium-saadiyat-island' };

  // Combine active offers with the final "All Caught Up" card
  const stackSize = activeCards.length + 1;

  const widgetConfig = data.widgetConfig || { buttonLabel: "WHAT'S ON", buttonIconUrl: "", enableBounce: true };

  return (
    <div className="w-full bg-white shadow-2xl min-h-screen pb-20 overflow-x-hidden relative">
      {/* Floating Pill Button Widget */}
      {data.widgetEnabled && activeCards.length > 0 && (
        <button 
          onClick={() => { setShowWidget(true); setCurrentIndex(0); }}
          className={`fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[100] h-12 md:h-16 w-auto px-6 md:px-8 bg-navy border-2 border-gold rounded-full shadow-[0_15px_45px_rgba(0,33,71,0.25)] flex items-center gap-3 md:gap-4 transition-all hover:scale-105 active:scale-95 group ${widgetConfig.enableBounce ? 'animate-subtle-bounce' : ''}`}
        >
          {widgetConfig.buttonIconUrl && (
            <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
              <img 
                src={widgetConfig.buttonIconUrl} 
                alt="" 
                className="w-full h-full object-contain brightness-0 invert" 
              />
            </div>
          )}
          <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-white uppercase whitespace-nowrap">
            {widgetConfig.buttonLabel || "WHAT'S ON"}
          </span>
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
        </button>
      )}

      {/* Centered Overlay Widget */}
      {showWidget && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-4 md:p-10 bg-navy/95 backdrop-blur-3xl animate-in fade-in duration-500">
          {/* Close button */}
          <button 
            onClick={() => setShowWidget(false)}
            className="absolute top-6 right-6 text-white/40 text-2xl hover:text-white transition-colors p-4 z-[250]"
          >
            ✕
          </button>

          {/* Navigation tap zones for left/right switching */}
          <div 
            className="absolute inset-y-0 left-0 w-1/4 z-[240] cursor-pointer" 
            onClick={handlePrev}
            title="Previous"
          ></div>
          <div 
            className="absolute inset-y-0 right-0 w-1/4 z-[240] cursor-pointer" 
            onClick={handleNext}
            title="Next"
          ></div>

          {/* Card Stack Container */}
          <div className="relative w-full max-w-[340px] md:max-w-[440px] aspect-[4/5] flex items-center justify-center perspective-1000 overflow-visible">
            {[...Array(stackSize)].map((_, idx) => {
              const diff = idx - currentIndex;
              
              // Only render immediate neighbors to keep it clean and smooth
              if (Math.abs(diff) > 2) return null;

              const isCurrent = idx === currentIndex;
              const isAllCaughtUp = idx === activeCards.length;
              const cardData = isAllCaughtUp ? null : activeCards[idx];

              // Cinematic fanning transition logic
              let zIndex = 100 - Math.abs(diff);
              let opacity = 0;
              let scale = 0.95;
              let translateX = 0;
              let translateY = 0;
              let rotateZ = 0;
              let blurLevel = isCurrent ? 0 : 4; 

              if (isCurrent) {
                opacity = 1;
                scale = 1;
                translateX = 0;
                translateY = 0;
                rotateZ = 0;
              } else if (diff > 0) {
                opacity = Math.max(0, 0.4 - (diff - 1) * 0.3);
                scale = 0.95 - (diff - 1) * 0.05;
                translateX = 80 * diff;
                translateY = 20 * diff; 
                rotateZ = 10 * diff;    
              } else {
                opacity = Math.max(0, 0.4 - (Math.abs(diff) - 1) * 0.3);
                scale = 0.95 - (Math.abs(diff) - 1) * 0.05;
                translateX = -80 * Math.abs(diff);
                translateY = 20 * Math.abs(diff);
                rotateZ = -10 * Math.abs(diff);
              }

              return (
                <div 
                  key={idx}
                  className="absolute inset-0 transition-all duration-[800ms] custom-bezier preserve-3d"
                  style={{
                    zIndex,
                    opacity,
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotateZ(${rotateZ}deg)`,
                    filter: `blur(${blurLevel}px)`,
                    transformOrigin: 'bottom center',
                    pointerEvents: isCurrent ? 'auto' : 'none'
                  }}
                >
                  {isAllCaughtUp ? (
                    /* Final "All Caught Up" Card */
                    <div className="w-full h-full bg-navy border-2 border-gold/40 rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl relative">
                       <div className="w-20 h-20 md:w-28 md:h-28 bg-gold rounded-full flex items-center justify-center mb-8 shadow-2xl">
                          <div className="w-10 h-10 md:w-14 md:h-14 border-4 border-navy rounded-full"></div>
                       </div>
                       <h3 className="text-3xl md:text-5xl font-serif italic text-white mb-6 lowercase">all caught up</h3>
                       <p className="text-sm md:text-lg font-light text-white/60 mb-10 px-6 leading-relaxed">You've explored all of our current weekly highlights. We hope to see you soon.</p>
                       <button 
                        onClick={() => setShowWidget(false)}
                        className="w-full py-5 bg-gold text-navy rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-white hover:text-navy transition-all duration-500"
                       >
                        Explore Newsletter
                       </button>
                    </div>
                  ) : (
                    /* Interactive Swiping/Flipping Card */
                    <div 
                      className={`w-full h-full relative transition-all duration-[800ms] preserve-3d ${(isCurrent && isFlipped) ? 'rotate-y-180' : ''}`}
                      onClick={handleFlip}
                    >
                      {/* Front Side */}
                      <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 flex flex-col">
                        <div className="h-[65%] relative">
                           <img src={cardData?.imageUrl} className="w-full h-full object-cover" alt="" />
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                        </div>
                        <div className="h-[35%] p-8 flex flex-col justify-center text-center bg-white">
                           <h3 className="text-2xl md:text-3xl font-serif text-navy italic leading-tight mb-2">{cardData?.title}</h3>
                           <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-gold uppercase mb-4">{cardData?.subtitle}</span>
                           <div className="flex justify-center items-center gap-2 opacity-30 mt-auto">
                              <span className="text-[9px] font-black uppercase tracking-widest">Tap to reveal details</span>
                           </div>
                        </div>
                      </div>

                      {/* Back Side */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-navy text-white rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-2xl border border-gold/30">
                        <h3 className="text-xl md:text-2xl font-serif italic text-gold mb-6">{cardData?.title}</h3>
                        <p className="text-sm md:text-base font-light text-white/80 leading-relaxed mb-10">{cardData?.description}</p>
                        
                        {cardData?.ctaUrl && cardData?.ctaLabel && (
                          <a 
                            href={cardData.ctaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-5 bg-gold text-navy rounded-full font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl hover:scale-105 transition-transform"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {cardData.ctaLabel}
                          </a>
                        )}
                        
                        <button className="mt-8 text-[9px] text-white/40 uppercase font-black tracking-widest hover:text-gold transition-colors">Tap to Flip Back</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Indicator Dots */}
          <div className="mt-12 flex justify-center gap-3 z-[250]">
            {[...Array(stackSize)].map((_, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); setIsFlipped(false); }}
                className={`h-1.5 rounded-full transition-all duration-700 ${i === currentIndex ? 'w-10 bg-gold' : 'w-2 bg-white/20'}`}
              ></button>
            ))}
          </div>

          {/* Navigation Instructions */}
          <div className="absolute bottom-6 flex justify-between w-full px-12 pointer-events-none opacity-20 text-white text-[9px] font-black uppercase tracking-[0.3em]">
             <span>← Previous</span>
             <span>Next →</span>
          </div>
        </div>
      )}

      {/* Main Guest Sticky Header - Centered Logo */}
      <div className="bg-navy text-white sticky top-0 z-[100] shadow-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-center items-center py-6 px-6 md:px-12 h-16 md:h-24">
           <a 
            href={header.linkUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="h-8 md:h-12 flex items-center justify-center transition-transform hover:scale-110"
           >
             <img 
               src={header.logoUrl} 
               alt="Rixos Logo" 
               className="h-full w-auto object-contain" 
               onError={(e) => {
                 (e.target as HTMLImageElement).src = "https://static.wixstatic.com/shapes/31813a_2928f300b32746d08f4e2ba5ce2e989d.svg";
               }}
             />
           </a>
        </div>
      </div>

      <div className="w-full">
        {data.sections.map((section) => renderSection(section))}
      </div>

      <footer className="bg-white pt-24 pb-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-navy font-bold tracking-[0.4em] uppercase text-xs mb-10">{footer.connectLabel}</h4>
          
          <div className="flex justify-center items-center gap-6 mb-16">
            {footer.socialLinks && footer.socialLinks.map((sl) => (
              <a 
                key={sl.id} 
                href={sl.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-300 hover:border-gold hover:scale-110 group"
              >
                {sl.iconUrl ? (
                  <img 
                    src={sl.iconUrl} 
                    alt="Social" 
                    className="w-5 h-5 object-contain opacity-40 group-hover:opacity-100 transition-opacity" 
                  />
                ) : (
                  <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                )}
              </a>
            ))}
          </div>
          
          <div className="flex flex-col items-center gap-8 border-t border-gray-50 pt-16">
            <button 
              onClick={() => onSwitchView('admin')}
              className="text-[9px] font-black tracking-[0.3em] text-gray-300 uppercase hover:text-navy transition-colors flex items-center gap-2 group"
            >
              <div className="w-1.5 h-1.5 bg-gray-200 group-hover:bg-gold rounded-full transition-colors"></div>
              Admin CMS
            </button>
            <div className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.4em] opacity-60">
              {footer.copyrightText}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes subtleBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-subtle-bounce {
          animation: subtleBounce 2.5s infinite ease-in-out;
        }
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .custom-bezier { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
};

export default GuestPortal;
