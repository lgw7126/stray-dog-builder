export interface DogProfile {
  name: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  color: string;
  personality: string;
}

export interface PosterContent {
  title: string;
  subtitle: string;
  story: string;
  appealPoints: string[];
  callToAction: string;
  tagline: string;
}

export interface CardNewsItem {
  title: string;
  content: string;
  emoji: string;
  backgroundColor: string;
}

export interface AdoptionPageContent {
  headline: string;
  description: string;
  requirements: string[];
  process: string[];
  contactInfo: string;
  specialNotes: string;
}

export interface GeneratedContent {
  dogProfile: DogProfile;
  poster: PosterContent;
  cardNews: CardNewsItem[];
  adoptionPage: AdoptionPageContent;
}
