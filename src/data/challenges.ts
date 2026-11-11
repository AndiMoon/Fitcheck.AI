import { DailyChallenge } from '../types';

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'challenge-cargo-pants',
    garmentType: 'Baggy Cargo Pants',
    title: 'Style the Heavy Cargo Silhouette',
    aestheticTarget: 'Y2K Streetwear / Gorpcore',
    stylingPrompt: 'Ground your fit with slouchy or utility cargo trousers. Contrast the bottom volume with a fitted baby tee, cropped knit, or boxy drop-shoulder tee.',
    proTip: 'Ensure the hem breaks cleanly over chunky skate sneakers or lug-sole shoes.',
    tags: ['Streetwear', 'Y2K', 'Gorpcore'],
    suggestedClosetCategory: 'Bottoms',
    bonusStreak: 1,
  },
  {
    id: 'challenge-silver-sneakers',
    garmentType: 'Retro Metallic / Silver Sneakers',
    title: 'Chrome Footwear Pop',
    aestheticTarget: 'Blokecore / Modern Y2K',
    stylingPrompt: 'Build your entire fit around a metallic or silver sneaker (like Sambas or metallic runners). Echo the metallic shine with jewelry or hardware.',
    proTip: 'Silver kicks turn ordinary neutral or dark pants into high-fashion streetwear.',
    tags: ['Blokecore', 'Y2K', 'RetroSneakers'],
    suggestedClosetCategory: 'Footwear',
    bonusStreak: 1,
  },
  {
    id: 'challenge-distressed-leather',
    garmentType: 'Vintage Distressed Leather Bomber',
    title: 'The Downtown Girl Outerwear Flex',
    aestheticTarget: 'Downtown Girl / Grunge Revival',
    stylingPrompt: 'Layer a worn oversized leather jacket or bomber. Pair with pleated textures (mini skirt or trousers) and sheer tights or chunky shoes.',
    proTip: 'Let the distressed patina do the talking—keep the base layers monochromatic.',
    tags: ['DowntownGirl', 'IndieSleaze', 'Grunge'],
    suggestedClosetCategory: 'Outerwear',
    bonusStreak: 1,
  },
  {
    id: 'challenge-cable-knit',
    garmentType: 'Chunky Cable-Knit Sweater',
    title: 'Textured Quiet Luxury Knit',
    aestheticTarget: 'Old Money / Neo-Prep',
    stylingPrompt: 'Style a heavy cream or oatmeal cable-knit crewneck. Layer over an Oxford collar or style tucked loosely into tailored pleated trousers.',
    proTip: 'Tactile knit patterns add tier-1 depth without needing loud colors.',
    tags: ['OldMoney', 'QuietLuxury', 'DarkAcademia'],
    suggestedClosetCategory: 'Tops',
    bonusStreak: 1,
  },
  {
    id: 'challenge-layered-chain',
    garmentType: 'Layered Chunky Silver Chains',
    title: 'Hardware Elevation Challenge',
    aestheticTarget: 'Y2K / High Streetwear',
    stylingPrompt: 'Make metallic jewelry the focal anchor of your neckline. Pair multiple chain widths against a dark crewneck or unbuttoned collar.',
    proTip: 'Match your necklace metal temperature (silver/chrome vs warm gold) with your belt buckle or shoe eyelets.',
    tags: ['Jewelry', 'Streetwear', 'Accessories'],
    suggestedClosetCategory: 'Accessories',
    bonusStreak: 1,
  },
  {
    id: 'challenge-pleated-trousers',
    garmentType: 'Tailored Wide-Leg Pleated Trousers',
    title: 'Effortless Drape & Tailoring',
    aestheticTarget: 'Minimalist Clean Fit',
    stylingPrompt: 'Style high-waisted single or double-pleat trousers. Contrast the formal tailoring with casual kicks or a relaxed cropped hoodie.',
    proTip: 'The high-low contrast between formal trousers and street footwear is the signature Gen Z styling formula.',
    tags: ['Minimalist', 'OldMoney', 'CleanFit'],
    suggestedClosetCategory: 'Bottoms',
    bonusStreak: 1,
  },
  {
    id: 'challenge-boxy-flannel',
    garmentType: 'Boxy Washed Flannel or Overshirt',
    title: 'The Open-Layer Masterclass',
    aestheticTarget: 'Skatercore / Grunge',
    stylingPrompt: 'Wear an open plaid flannel or heavy twill overshirt as a moving architectural layer over a plain ribbed tank or graphic tee.',
    proTip: 'Leave the front completely unbuttoned to create long vertical proportion lines.',
    tags: ['Grunge', 'Skatercore', 'Layering'],
    suggestedClosetCategory: 'Tops',
    bonusStreak: 1,
  },
];

/**
 * Returns today's challenge deterministically based on date.
 */
export function getTodayChallenge(): DailyChallenge {
  const now = new Date();
  // Use day of the year to cycle through challenges
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = Math.abs(dayOfYear) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[index];
}
