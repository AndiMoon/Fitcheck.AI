export interface AestheticTag {
  name: string;
  confidence: number;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ColorStory {
  palette: ColorSwatch[];
  harmonyType: string;
  harmonyScore: number;
  notes: string;
}

export interface ClothingPiece {
  name: string;
  detail: string;
  color: string;
}

export interface AccessoryPiece {
  name: string;
  detail: string;
}

export interface OutfitBreakdown {
  upper: ClothingPiece;
  lower: ClothingPiece;
  shoes: ClothingPiece;
  layeringAndAccessories: AccessoryPiece[];
}

export interface ScorePillar {
  score: number;
  comment: string;
}

export interface ScoreBreakdown {
  silhouetteAndProportions: ScorePillar;
  colorHarmony: ScorePillar;
  layeringAndDepth: ScorePillar;
  vibeCohesion: ScorePillar;
}

export interface OneSwapRule {
  action: 'swap' | 'add' | 'remove';
  currentPiece: string;
  suggestedPiece: string;
  reasoning: string;
  closetMatch?: {
    itemId: string;
    itemName: string;
    why: string;
  };
}

export interface DailyChallenge {
  id: string;
  garmentType: string;
  title: string;
  aestheticTarget: string;
  stylingPrompt: string;
  proTip: string;
  tags: string[];
  suggestedClosetCategory: 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Accessories';
  bonusStreak: number;
}

export interface FitCheckResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  userNote?: string;
  overallScore: number;
  verdict: string;
  verdictDescription: string;
  vibeTitle: string;
  aestheticTags: AestheticTag[];
  colorStory: ColorStory;
  outfitBreakdown: OutfitBreakdown;
  scoreBreakdown: ScoreBreakdown;
  oneSwapRule: OneSwapRule;
  proTips: string[];
  fallback?: boolean;
  completedChallenge?: {
    id: string;
    garmentType: string;
    title: string;
  };
}

export interface ClosetItem {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear' | 'Accessories';
  aestheticTags: string[];
  primaryColor: {
    name: string;
    hex: string;
  };
  stylingNote: string;
  imageUrl: string;
  dateAdded: string;
}

export interface TrendingAesthetic {
  id: string;
  name: string;
  city?: 'Milan' | 'Paris' | 'London' | 'New York';
  cityName?: string;
  category: string;
  growthIndex: string;
  rank: number;
  summary: string;
  viralHashtags: string[];
  keyPieces: string[];
  colorPalette: ColorSwatch[];
  stylingRule: string;
  imageUrl?: string;
  groundingSources?: {
    title: string;
    url: string;
  }[];
}

export interface StyleEvolutionReport {
  progressSummary: string;
  evolutionVerdict: string;
  scoreDelta: number;
  keyImprovements: string[];
  colorEvolution: string;
  silhouetteEvolution: string;
  nextLevelTip: string;
}

export type ActiveTab = 'scanner' | 'trending' | 'closet' | 'history';


