import { FitCheckResult, ClosetItem } from '../types';

export interface PresetOutfit {
  id: string;
  title: string;
  vibe: string;
  imageUrl: string;
  description: string;
  result: FitCheckResult;
}

export const PRESET_OUTFITS: PresetOutfit[] = [
  {
    id: 'preset-y2k-streetwear',
    title: 'Downtown Y2K Grunge',
    vibe: 'Y2K Streetwear · 94% Match',
    imageUrl: '/src/assets/images/fit_streetwear_y2k_1794248672804.jpg',
    description: 'Washed graphic band tee, slouchy olive cargo pants, chunky skate low-tops & layered silver chains.',
    result: {
      id: 'fit-y2k-01',
      timestamp: 'Today at 10:14 AM',
      imageUrl: '/src/assets/images/fit_streetwear_y2k_1794248672804.jpg',
      userNote: 'Casual campus & thrift shopping fit',
      overallScore: 89,
      verdict: 'Certified Heat 🔥',
      verdictDescription: 'Effortless proportion balance with strong street silhouette and coordinated hardware accents.',
      vibeTitle: 'Downtown Y2K Skater Grunge',
      aestheticTags: [
        { name: 'Streetwear', confidence: 95 },
        { name: 'Y2K Grunge', confidence: 91 },
        { name: 'Skatercore', confidence: 84 },
        { name: 'Neo-Vintage', confidence: 78 },
      ],
      colorStory: {
        palette: [
          { name: 'Washed Charcoal', hex: '#2C2E33' },
          { name: 'Faded Moss Olive', hex: '#4C5549' },
          { name: 'Off-White Chalk', hex: '#EDEBE4' },
          { name: 'Metallic Chrome', hex: '#C2C7CC' },
          { name: 'Raw Black', hex: '#161719' },
        ],
        harmonyType: 'Tonal Muted Contrast',
        harmonyScore: 92,
        notes: 'Muted earthy base tones anchor the dark graphic upper with balanced contrast at the shoes.',
      },
      outfitBreakdown: {
        upper: {
          name: 'Distressed Nirvana Graphic Tee',
          detail: 'Boxy drop-shoulder cut with acid-washed charcoal cotton and cracked vintage front print',
          color: 'Washed Charcoal',
        },
        lower: {
          name: 'Slouchy Wide-Leg Cargo Pants',
          detail: 'Heavyweight utility pocket construction with stacked ankle drape over shoes',
          color: 'Faded Olive Sage',
        },
        shoes: {
          name: 'Chunky Skate Low-Tops',
          detail: 'Padded two-tone retro skate silhouette with black suede overlays and white laces',
          color: 'Black / Off-White',
        },
        layeringAndAccessories: [
          { name: 'Layered Silver Cable Chain', detail: 'Chunky metallic hardware brightening the collarbone neckline' },
          { name: 'Stainless Link Chrono Watch', detail: 'Subtle wrist hardware balancing the right arm' },
          { name: 'Sticker Bomb Phone Case', detail: 'Pop culture graphic element adding playful street authenticity' },
        ],
      },
      scoreBreakdown: {
        silhouetteAndProportions: {
          score: 94,
          comment: 'Boxy drop-shoulder tee effortlessly flows into the wide-leg cargo puddle break.',
        },
        colorHarmony: {
          score: 88,
          comment: 'Charcoal and faded moss green create an earthy, cohesive 90s aesthetic.',
        },
        layeringAndDepth: {
          score: 82,
          comment: 'Solid base outfit; an open lightweight layer or textured sling bag would take this to 95+.',
        },
        vibeCohesion: {
          score: 93,
          comment: 'Every piece from footwear to jewelry commits to the relaxed skate-grunge vibe.',
        },
      },
      oneSwapRule: {
        action: 'swap',
        currentPiece: 'Heavy black skate sneakers',
        suggestedPiece: 'Silver Metallic Low-Top Sambas',
        reasoning: 'Swapping to silver metallic sneakers reflects the silver chain around your neck, creating visual symmetry between top and bottom while giving the fit a razor-sharp modern Blokecore edge.',
        closetMatch: {
          itemId: 'closet-silver-sambas',
          itemName: 'Silver Metallic Retro Sambas',
          why: 'Found in your Digital Closet: provides the exact chrome pop needed to tie in your necklace hardware.',
        },
      },
      proTips: [
        'Give the cargo leg openings a loose single roll if you want to showcase the sneaker profile more cleanly.',
        'Layer an unbuttoned vintage washed flannel or olive cropped bomber for breezy evening sessions.',
      ],
    },
  },
  {
    id: 'preset-old-money',
    title: 'Minimalist Old Money',
    vibe: 'Old Money / Quiet Luxury · 96% Match',
    imageUrl: '/src/assets/images/fit_old_money_preppy_1794248673288.jpg',
    description: 'Cream cable-knit crewneck sweater, collared white under-shirt, tailored charcoal pleated trousers & leather penny loafers.',
    result: {
      id: 'fit-om-02',
      timestamp: 'Yesterday at 3:42 PM',
      imageUrl: '/src/assets/images/fit_old_money_preppy_1794248673288.jpg',
      userNote: 'Coffee study date & campus library',
      overallScore: 94,
      verdict: 'Elite Quiet Luxury ✨',
      verdictDescription: 'Masterclass in tailored proportions, clean collegiate color palette, and timeless textures.',
      vibeTitle: 'New England Ivy / Neo-Prep',
      aestheticTags: [
        { name: 'Old Money', confidence: 96 },
        { name: 'Quiet Luxury', confidence: 93 },
        { name: 'Dark Academia Lite', confidence: 85 },
        { name: 'Minimalist Classic', confidence: 89 },
      ],
      colorStory: {
        palette: [
          { name: 'Warm Cream Ecru', hex: '#F4EFEA' },
          { name: 'Charcoal Heather', hex: '#4A4F55' },
          { name: 'Crisp Oxford White', hex: '#FFFFFF' },
          { name: 'Cognac Saddle Leather', hex: '#7D472B' },
          { name: 'Light Camel Oat', hex: '#D6C5B3' },
        ],
        harmonyType: 'Analogous Neutral Warmth',
        harmonyScore: 97,
        notes: 'Rich contrast between warm cream knitwear and cold heathered charcoal trousers.',
      },
      outfitBreakdown: {
        upper: {
          name: 'Chunky Cable-Knit Crewneck',
          detail: 'Thick ribbed cuffs and collar layered over crisp white button-down collar points',
          color: 'Warm Cream Ecru',
        },
        lower: {
          name: 'Tailored Single-Pleat Trousers',
          detail: 'High-waisted straight leg with sharp front crease and tailored ankle hem',
          color: 'Heather Charcoal',
        },
        shoes: {
          name: 'Leather Penny Loafers',
          detail: 'Polished burnished leather with minimal saddle strap worn with ribbed oatmeal socks',
          color: 'Cognac Saddle Brown',
        },
        layeringAndAccessories: [
          { name: 'Minimalist Gold Coin Pendant', detail: 'Subtle warm metallic shine tucked against the collar' },
          { name: 'Slim Tank-Style Leather Watch', detail: 'Classic rectangular bezel with brown leather band' },
          { name: 'Ribbed Cashmere Socks', detail: 'Oatmeal ribbed texture bridging trouser hem and loafer vamp' },
        ],
      },
      scoreBreakdown: {
        silhouetteAndProportions: {
          score: 96,
          comment: 'Perfect high-waist trouser line elongates legs while the cable knit adds cozy upper volume.',
        },
        colorHarmony: {
          score: 97,
          comment: 'Flawless neutral palette: cream, crisp white, charcoal, and warm cognac leather.',
        },
        layeringAndDepth: {
          score: 92,
          comment: 'Collar reveal under crewneck plus tactile cable knit creates rich tactile interest.',
        },
        vibeCohesion: {
          score: 95,
          comment: 'Zero conflicting signals; embodies the aspirational understated prep aesthetic.',
        },
      },
      oneSwapRule: {
        action: 'add',
        currentPiece: 'No outerwear layer',
        suggestedPiece: 'Draped dark brown wool coat or boxy vintage leather flight jacket',
        reasoning: 'Draping a heavy tailored wool coat over the shoulders adds architectural drama without concealing the knitwear textures.',
        closetMatch: {
          itemId: 'closet-olive-bomber',
          itemName: 'Vintage Washed MA-1 Olive Bomber',
          why: 'In your closet: thrown open over this fit it creates a high-fashion high-low prep tension.',
        },
      },
      proTips: [
        'Push the sweater sleeves up slightly toward the mid-forearm to reveal the leather watch strap.',
        'Carry a structured canvas tote or leather portfolio to amplify the academic aesthetic.',
      ],
    },
  },
  {
    id: 'preset-downtown-girl',
    title: 'Indie Sleaze / Downtown Girl',
    vibe: 'Downtown Girl · 92% Match',
    imageUrl: '/src/assets/images/fit_downtown_girl_1794248675495.jpg',
    description: 'Distressed oversized leather bomber, graphic band tee, pleated mini skirt, sheer tights, lug-sole loafers & over-ear headphones.',
    result: {
      id: 'fit-dt-03',
      timestamp: '2 days ago',
      imageUrl: '/src/assets/images/fit_downtown_girl_1794248675495.jpg',
      userNote: 'Vinyl record digging & city weekend hangout',
      overallScore: 92,
      verdict: 'Effortless Main Character Vibe 🖤',
      verdictDescription: 'Textured oversized leather jacket paired with pleated mini creates the quintessential New York indie aesthetic.',
      vibeTitle: 'Downtown Girl Indie Sleaze',
      aestheticTags: [
        { name: 'Downtown Girl', confidence: 96 },
        { name: 'Indie Sleaze', confidence: 91 },
        { name: 'Grunge Chic', confidence: 87 },
        { name: 'Coquette Edge', confidence: 76 },
      ],
      colorStory: {
        palette: [
          { name: 'Worn Black Leather', hex: '#1C1C1E' },
          { name: 'Shadow Charcoal', hex: '#313338' },
          { name: 'Sheer Smoke Black', hex: '#44464D' },
          { name: 'Clean Athletic White', hex: '#F8F9FA' },
        ],
        harmonyType: 'Monochromatic Tonal Darks',
        harmonyScore: 94,
        notes: 'Dominated by deep blacks and dark charcoals, punctuated with crisp white ribbed crew socks.',
      },
      outfitBreakdown: {
        upper: {
          name: 'Vintage Distressed Leather Bomber',
          detail: 'Boxy drop-shoulder silhouette with heavy natural patina and worn ribbed waistband',
          color: 'Faded Black Leather',
        },
        lower: {
          name: 'Pleated Knife Mini Skirt',
          detail: 'High-waisted structured pleats resting at mid-thigh over semi-opaque sheer black tights',
          color: 'Dark Slate Grey',
        },
        shoes: {
          name: 'Chunky Lug-Sole Penny Loafers',
          detail: 'Glossy polished black leather with heavy cleated lug platform sole and white crew socks',
          color: 'Black with White Socks',
        },
        layeringAndAccessories: [
          { name: 'Over-Ear Studio Headphones', detail: 'Matte black audio gear resting around collar as a key fashion prop' },
          { name: 'Layered Sterling Silver Chains', detail: 'Subtle metallic glint peeked over the band tee neckline' },
          { name: 'Vintage Leather Shoulder Bag', detail: 'Compact retro baguette bag tucked under the arm' },
        ],
      },
      scoreBreakdown: {
        silhouetteAndProportions: {
          score: 95,
          comment: 'Oversized boxy jacket contrasted against bare/tights leg silhouette is peak Gen Z proportion styling.',
        },
        colorHarmony: {
          score: 91,
          comment: 'All-black textural palette broken up by white socks and silver chain highlights.',
        },
        layeringAndDepth: {
          score: 94,
          comment: 'Worn leather, soft cotton tee, crisp skirt pleats, sheer nylon, and ribbed cotton socks provide rich texture layering.',
        },
        vibeCohesion: {
          score: 96,
          comment: 'Flawless execution of the East Village / Brooklyn indie revival aesthetic.',
        },
      },
      oneSwapRule: {
        action: 'swap',
        currentPiece: 'Heavy lug-sole loafers',
        suggestedPiece: 'Tall vintage lace-up combat boots or red patent Mary Janes',
        reasoning: 'If you want to shift the vibe from indie casual to elevated grunge, a knee-high distressed lace-up boot adds intense vertical drama.',
        closetMatch: {
          itemId: 'closet-silver-sambas',
          itemName: 'Silver Metallic Retro Sambas',
          why: 'Alternatively, try your Silver Sambas to instantly transform this into a trending Blokecore/Coquette mashup!',
        },
      },
      proTips: [
        'Let one headphone earcup sit slightly tilted for that candid unposed street-style energy.',
        'Add a dark cherry lip tint or messy ribbon clip to subtly flirt with the coquette-grunge microtrend.',
      ],
    },
  },
];

export const INITIAL_CLOSET_ITEMS: ClosetItem[] = [
  {
    id: 'closet-silver-sambas',
    name: 'Silver Metallic Retro Sambas',
    category: 'Footwear',
    aestheticTags: ['Y2K', 'Blokecore', 'Streetwear'],
    primaryColor: {
      name: 'Chrome Silver',
      hex: '#C8CCD0',
    },
    stylingNote: 'Adds instant metallic pop to dark baggy denim or softens sporty track pants.',
    imageUrl: '/src/assets/images/closet_silver_sambas_1794248674755.jpg',
    dateAdded: 'Nov 6, 2026',
  },
  {
    id: 'closet-olive-bomber',
    name: 'Vintage Washed MA-1 Olive Bomber',
    category: 'Outerwear',
    aestheticTags: ['Gorpcore', 'Military Vintage', 'Streetwear'],
    primaryColor: {
      name: 'Washed Olive Drab',
      hex: '#5A634E',
    },
    stylingNote: 'Boxy cropped silhouette that balances high-waisted wide trousers or mini skirts.',
    imageUrl: '/src/assets/images/closet_olive_bomber_1794248674915.jpg',
    dateAdded: 'Nov 5, 2026',
  },
  {
    id: 'closet-chain-necklace',
    name: 'Heavy Layered Curb Chain Necklace',
    category: 'Accessories',
    aestheticTags: ['Y2K', 'Streetwear', 'Grunge'],
    primaryColor: {
      name: 'Polished Stainless Silver',
      hex: '#D1D5DB',
    },
    stylingNote: 'Critical accent piece for crewneck tees and open collar shirts to anchor hardware styling.',
    imageUrl: '',
    dateAdded: 'Nov 3, 2026',
  },
  {
    id: 'closet-pleated-trousers',
    name: 'Charcoal Relaxed Wide-Leg Trousers',
    category: 'Bottoms',
    aestheticTags: ['Old Money', 'Minimalist', 'Downtown Girl'],
    primaryColor: {
      name: 'Heather Charcoal',
      hex: '#374151',
    },
    stylingNote: 'Versatile base that elevates casual hoodies or pairs seamlessly with tailored knitwear.',
    imageUrl: '',
    dateAdded: 'Oct 28, 2026',
  },
  {
    id: 'closet-oversized-flannel',
    name: 'Distressed Brown Plaid Boxy Flannel',
    category: 'Tops',
    aestheticTags: ['Grunge', 'Neo-Vintage', 'Skatercore'],
    primaryColor: {
      name: 'Espresso & Tan Plaid',
      hex: '#5D4037',
    },
    stylingNote: 'Ideal unbuttoned layering piece over a plain ribbed white tank or washed graphic tee.',
    imageUrl: '',
    dateAdded: 'Oct 22, 2026',
  },
];
