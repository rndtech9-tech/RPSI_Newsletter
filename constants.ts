
import { NewsletterData } from './types';

export const INITIAL_DATA: NewsletterData = {
  widgetEnabled: true,
  widgetConfig: {
    buttonLabel: "WHAT'S ON",
    buttonIconUrl: "https://cdn-icons-png.flaticon.com/512/1041/1041844.png",
    enableBounce: true
  },
  header: {
    logoUrl: "Diamond_white.png",
    linkUrl: "https://www.rixos.com/hotel-resort/rixos-premium-saadiyat-island"
  },
  widgetCards: [
    {
      id: 'wc1',
      title: "Thanksgiving Made Special",
      subtitle: "Turkey Buffet, Today at 7 PM",
      description: "Enjoy a sumptuous dinner at Turquoise Restaurant with traditional trimmings. 7 PM - 11 PM.",
      imageUrl: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&q=80&w=600",
      ctaUrl: "https://wa.me/971500000000",
      ctaLabel: "Reserve via WhatsApp",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000 * 30).toISOString(),
      isActive: true
    },
    {
      id: 'wc2',
      title: "Sunrise Yoga",
      subtitle: "Beachfront, Tomorrow at 6 AM",
      description: "Start your day with mindfulness. Meet at the Saadiyat Beach Club entrance.",
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
      ctaUrl: "https://wa.me/971500000000",
      ctaLabel: "Inquire Now",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000 * 30).toISOString(),
      isActive: true
    }
  ],
  sections: [
    {
      id: 'sec_hero_1',
      type: 'hero',
      content: {
        title: "WEEKLY",
        subtitle: "highlights",
        bgImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200",
      }
    },
    {
      id: 'sec_welcome_1',
      type: 'welcome',
      content: {
        text: "WELCOME TO RIXOS PREMIUM SAADIYAT ISLAND"
      }
    },
    {
      id: 'sec_ql_1',
      type: 'quickLinks',
      content: [
        { id: '1', label: "INTERACTIVE RESORT MAP", url: "#", imageUrl: "https://picsum.photos/id/10/400/300" },
        { id: '2', label: "WELCOME LETTER", url: "#", imageUrl: "https://picsum.photos/id/20/400/300" },
        { id: '3', label: "ANJANA SPA MENU", url: "#", imageUrl: "https://picsum.photos/id/30/400/300" }
      ]
    },
    {
      id: 'sec_fc_1',
      type: 'featureCards',
      content: [
        {
          id: 'fc1',
          title: "YOUR NEXT DESTINATION - ALIÉE ISTANBUL",
          heading: "aliée",
          description: "See Istanbul through Aliée's eye, the House of Curious Minds, where refinement is not possessed, but lived. The breeze of the Golden Horn carries whispers of history, weaving heritage with the pulse of today.",
          imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
          ctaUrl: "#",
          ctaLabel: "Explore More"
        },
        {
          id: 'fc2',
          title: "101 THINGS TO DO IN ABU DHABI",
          heading: "experience abu dhabi",
          description: "Get ready for the holiday of a lifetime in Abu Dhabi with our hot list of 101 things to do. Whether you're here to soak up the sun, dive into adventure, or just relax with your family.",
          imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
          ctaUrl: "#",
          ctaLabel: "Explore More"
        }
      ]
    },
    {
      id: 'sec_ek_1',
      type: 'entertainmentKit',
      content: {
        bannerImageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1200",
        items: [
          { id: 'ek1', label: "EXCLUSIVE SPORTS CLUB", sublabel: "View and download schedule", iconUrl: 'https://cdn-icons-png.flaticon.com/512/1041/1041844.png', url: "#" },
          { id: 'ek2', label: "RIXY KIDS CLUB", sublabel: "View and download weekly program", iconUrl: 'https://cdn-icons-png.flaticon.com/512/3082/3082042.png', url: "#" },
          { id: 'ek3', label: "SPORTS MATCHES", sublabel: "View and download program", iconUrl: 'https://cdn-icons-png.flaticon.com/512/1165/1165187.png', url: "#" },
          { id: 'ek4', label: "LIVE ENTERTAINMENT", sublabel: "View and download program", iconUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233514.png', url: "#" }
        ]
      }
    },
    {
      id: 'sec_ss_1',
      type: 'sportsSchedule',
      content: [
        { id: 's1', date: "07", month: "JAN", teamA: "West Ham United", teamB: "Nottingham Forest", league: "English Premier League", time: "00:00", location: "Savanna Sol", logoA: "https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg", logoB: "https://upload.wikimedia.org/wikipedia/en/e/e3/Nottingham_Forest_F.C._logo.svg" },
        { id: 's2', date: "07", month: "JAN", teamA: "Fulham", teamB: "Chelsea", league: "English Premier League", time: "23:30", location: "Savanna Sol", logoA: "https://upload.wikimedia.org/wikipedia/en/7/70/Fulham_FC_%282001%29.svg", logoB: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" }
      ]
    },
    {
      id: 'sec_ch_1',
      type: 'charity',
      content: {
        title: "HELP US BUILD A SCHOOL IN MALAWI",
        heading: "Dubai Cares",
        headingLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Dubai_Cares_Logo.svg",
        description: "Donate at checkout or scan the QR code below to help build a school in Malawi, in collaboration with Dubai Cares.",
        subtext: "Together, we're laying the first brick for brighter futures.",
        imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
        ctaLabel: "Click • Give • Change a Life",
        ctaUrl: "#",
        footerText: "100% of proceeds will be directed to Dubai Cares to support the organization's 'Adopt a School' initiative in Malawi. For enquiries, please contact ozgul.aktolga@rixos.com"
      }
    }
  ],
  footer: {
    connectLabel: "CONNECT",
    socialLinks: [
      { id: 'sl1', iconUrl: "https://cdn-icons-png.flaticon.com/512/174/174855.png", url: "#" },
      { id: 'sl2', iconUrl: "https://cdn-icons-png.flaticon.com/512/733/733547.png", url: "#" },
      { id: 'sl3', iconUrl: "https://cdn-icons-png.flaticon.com/512/3536/3536505.png", url: "#" }
    ],
    copyrightText: "© 2025 RIXOS Premium Saadiyat Island"
  }
};
