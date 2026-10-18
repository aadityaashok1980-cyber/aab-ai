export type ActiveTab = 'home' | 'chat' | 'story' | 'content' | 'photo' | 'video';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  provider?: string;
}

export interface HindiStory {
  title: string;
  genre: string;
  characters: string[];
  synopsis: string;
  storyParagraphs: string[];
  moral: string;
  readingTimeMinutes: number;
  audioScript?: string;
}

export interface ContentResult {
  title: string;
  hook: string;
  sections: Array<{ heading: string; body: string }>;
  callToAction: string;
  hashtags: string[];
  seoMetaDescription: string;
  tips: string;
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  enhancedPrompt?: string;
  style: string;
  aspectRatio: string;
  timestamp: string;
  seed?: number;
}

export interface VideoScene {
  sceneNumber: number;
  duration: number;
  shotType: string;
  visualDescription: string;
  imagePrompt: string;
  frameImageUrl: string;
  voiceover: string;
  sfx: string;
  cameraMotion: string;
}

export interface VideoProject {
  title: string;
  logline: string;
  mood: string;
  backgroundMusicSuggestion: string;
  totalDurationSeconds: number;
  aspectRatio: string;
  scenes: VideoScene[];
  creatorSignature: string;
  veoPromptExport?: string;
}

export interface ServerStatus {
  status: string;
  appName: string;
  creator: string;
  hasApiKey: boolean;
  model: string;
}
