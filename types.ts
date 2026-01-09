
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
  ctaLabel?: string;
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

export interface HeaderData {
  logoUrl: string;
  linkUrl: string;
}

export interface WidgetCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaUrl?: string;
  ctaLabel?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isActive: boolean;
}

export interface WidgetConfig {
  buttonLabel: string;
  buttonIconUrl: string;
  enableBounce: boolean;
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
  header?: HeaderData;
  widgetCards?: WidgetCard[];
  widgetEnabled?: boolean;
  widgetConfig?: WidgetConfig;
}

export type PortalView = 'guest' | 'admin';
