// Type definitions for JSON modules
declare module '*.json' {
  const value: unknown;
  export default value;
}

interface App {
  id: string;
  name: string;
  description: string;
  image: string;
  link: string;
  type: 'game' | 'puzzle' | 'productivity' | 'development' | 'tools';
  dateAdded: string;
  timesPlayed: number;
  minutesPlayed: number;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

declare module '../data/apps.json' {
  const data: {
    apps: App[];
  };
  export default data;
}
