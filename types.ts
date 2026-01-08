
export interface QuickLink {
  id: string;
  label: string;
  url: string;
  imageUrl: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  heading: string;
  description: string;
  imageUrl: string;
  ctaUrl: string;
}

export interface SportMatch {
  id: string;
  date: string;
  month: string;
  teamA: string;
  teamB: string;
  league: string;
  time: string;
  location: string;
  logoA: string;
  logoB: string;
}

export interface EntertainmentKitItem {
  id: string;
  label: string;
  sublabel: string;
  iconUrl: string;
  url: string;
}

export interface SocialLink {
  id: string;
  iconUrl: string;
  url: string;
}

export interface FooterData {
  connectLabel: string;
  socialLinks: SocialLink[];
  copyrightText: string;
}

export type SectionType = 
  | 'hero' 
  | 'welcome' 
  | 'quickLinks' 
  | 'featureCards' 
  | 'entertainmentKit' 
  | 'sportsSchedule' 
  | 'charity';

export interface SectionInstance {
  id: string;
  type: SectionType;
  content: any;
}

export interface NewsletterData {
  sections: SectionInstance[];
  footer: FooterData;
}

export type PortalView = 'guest' | 'admin';
