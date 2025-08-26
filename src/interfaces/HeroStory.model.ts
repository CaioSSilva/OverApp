import { Role } from './Hero.model';

export interface HeroDetails {
  name: string;
  description: string;
  portrait: string;
  role: Role;
  location: string;
  age: number;
  birthday: string;
  hitpoints: {
    health: number;
    armor: number;
    shields: number;
    total: number;
  };
  abilities: Ability[];
  story: Story;
}

export interface Ability {
  name: string;
  description: string;
  icon: string;
  video: {
    thumbnail: string;
    link: {
      mp4: string;
      webm: string;
    };
  };
}

export interface Story {
  summary: string;
  media: {
    type: string;
    link: string;
  };
  chapters: Chapter[];
}

export interface Chapter {
  title: string;
  content: string;
  picture: string;
}
