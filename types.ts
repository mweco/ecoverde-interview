export enum AppState {
  INTRO = 'INTRO',
  CONSENT = 'CONSENT',
  CHAT = 'CHAT',
  EMAIL_INPUT = 'EMAIL_INPUT',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface PartnerDetails {
  companyName: string;
  contactName: string;
  email?: string;
}

export interface TestimonialData {
  headline: string;
  quote: string;
  fullStory: string;
  tags: string[];
}