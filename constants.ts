
import { NewsletterData } from './types';

export const INITIAL_DATA: NewsletterData = {
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
          ctaUrl: "#"
        },
        {
          id: 'fc2',
          title: "101 THINGS TO DO IN ABU DHABI",
          heading: "experience abu dhabi",
          description: "Get ready for the holiday of a lifetime in Abu Dhabi with our hot list of 101 things to do. Whether you're here to soak up the sun, dive into adventure, or just relax with your family.",
          imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
          ctaUrl: "#"
        }
      ]
    },
    {
      id: 'sec_ek_1',
      type: 'entertainmentKit',
      content: [
        { id: 'ek1', label: "EXCLUSIVE SPORTS CLUB", sublabel: "View and download schedule", iconType: 'sports', url: "#" },
        { id: 'ek2', label: "RIXY KIDS CLUB", sublabel: "View and download weekly program", iconType: 'kids', url: "#" },
        { id: 'ek3', label: "SPORTS MATCHES", sublabel: "View and download program", iconType: 'matches', url: "#" },
        { id: 'ek4', label: "LIVE ENTERTAINMENT", sublabel: "View and download program", iconType: 'live', url: "#" }
      ]
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
        description: "Donate at checkout or scan the QR code below to help build a school in Malawi, in collaboration with Dubai Cares.",
        subtext: "Together, we're laying the first brick for brighter futures.",
        imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
        ctaLabel: "Click • Give • Change a Life",
        ctaUrl: "#",
        footerText: "100% of proceeds will be directed to Dubai Cares to support the organization's 'Adopt a School' initiative in Malawi. For enquiries, please contact ozgul.aktolga@rixos.com"
      }
    }
  ]
};
