/**
 * CropScan AI - Client Crop Configuration
 * Single source of truth for Project Name, 5 Supported Crops, Target Diseases, and Nigerian Context.
 * Change project name or add crops easily here.
 */

export const APP_CONFIG = {
  projectName: 'CropScan AI',
  tagline: 'AI Crop Disease Detection for Smallholder Farmers',
  author: 'Musa Musa',
  projectYear: '2026',
  institution: 'Department of Computer Science',
  maxUploadSizeBytes: 5 * 1024 * 1024, // 5MB
  targetImageDimension: 1280 // px max edge for client resize
};

export const SUPPORTED_CROPS = [
  {
    id: 'maize',
    name: 'Maize',
    scientificName: 'Zea mays',
    localNames: 'Corn · Masara (Hausa) · Oka (Yoruba) · Ọka (Igbo)',
    tag: 'Cereal / Staple',
    color: 'from-amber-500 to-yellow-600',
    lightColor: 'bg-amber-50 text-amber-800 border-amber-200',
    iconEmoji: '🌽',
    parts: ['Leaf', 'Cob', 'Stem', 'Tassel'],
    description: 'Vital grain across northern and middle belt Nigeria. Vulnerable to foliar blights, rusts, and armyworm.',
    diseases: [
      {
        id: 'northern_leaf_blight',
        name: 'Northern Leaf Blight',
        category: 'fungal',
        summary: 'Long cigar-shaped grayish lesions on leaves that reduce photosynthesis and grain fill.'
      },
      {
        id: 'gray_leaf_spot',
        name: 'Gray Leaf Spot',
        category: 'fungal',
        summary: 'Rectangular tan spots bounded by leaf veins; severe in humid, cloudy seasons.'
      },
      {
        id: 'common_rust',
        name: 'Common Rust',
        category: 'fungal',
        summary: 'Powdery cinnamon-brown pustules on both upper and lower leaf surfaces.'
      },
      {
        id: 'maize_streak_virus',
        name: 'Maize Streak Virus',
        category: 'viral',
        summary: 'Uniform yellow-white chlorotic streaks parallel to veins, spread by leafhopper vectors.'
      },
      {
        id: 'ear_rot',
        name: 'Ear Rot',
        category: 'fungal',
        summary: 'Pink or white mold covering cob kernels; causes deadly mycotoxin contamination.'
      },
      {
        id: 'common_smut',
        name: 'Common Smut',
        category: 'fungal',
        summary: 'Large silvery-white fleshy galls on cobs and tassels that burst into black spore clouds.'
      },
      {
        id: 'fall_armyworm_damage',
        name: 'Fall Armyworm Damage',
        category: 'pest',
        summary: 'Chewed ragged leaf whorls with moist sawdust-like frass and windowpaned leaves.'
      }
    ]
  },
  {
    id: 'millet',
    name: 'Pearl Millet',
    scientificName: 'Pennisetum glaucum',
    localNames: 'Gero / Maiwa (Hausa) · Jero (Yoruba)',
    tag: 'Drought Cereal',
    color: 'from-emerald-600 to-teal-700',
    lightColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconEmoji: '🌾',
    parts: ['Leaf', 'Head', 'Stem'],
    description: 'Essential drought-hardy staple grown throughout the Nigerian Sudano-Sahelian zone.',
    diseases: [
      {
        id: 'downy_mildew',
        name: 'Downy Mildew (Green Ear)',
        category: 'fungal',
        summary: 'Ear heads transform into brush-like leafy structures with zero grain formation.'
      },
      {
        id: 'ergot',
        name: 'Ergot',
        category: 'fungal',
        summary: 'Sticky honeydew drops oozing from florets, hardening into toxic dark sclerotia.'
      },
      {
        id: 'smut',
        name: 'Millet Smut',
        category: 'fungal',
        summary: 'Grain ovaries enlarge into green-brown sacs filled with dark powdery fungal spores.'
      },
      {
        id: 'rust',
        name: 'Millet Rust',
        category: 'fungal',
        summary: 'Tiny reddish-orange pustules causing rapid premature foliage drying.'
      },
      {
        id: 'blast',
        name: 'Millet Blast',
        category: 'fungal',
        summary: 'Diamond-shaped gray eye spots on leaves causing leaf blight and neck breakage.'
      }
    ]
  },
  {
    id: 'sorghum',
    name: 'Sorghum',
    scientificName: 'Sorghum bicolor',
    localNames: 'Guinea Corn · Dawa (Hausa) · Oka Baba (Yoruba)',
    tag: 'Savannah Grain',
    color: 'from-orange-600 to-red-700',
    lightColor: 'bg-orange-50 text-orange-800 border-orange-200',
    iconEmoji: '🌾',
    parts: ['Leaf', 'Head', 'Panicle', 'Stem'],
    description: 'Key food and brewing crop across Nigeria, valued for deep roots and drought resilience.',
    diseases: [
      {
        id: 'anthracnose',
        name: 'Anthracnose',
        category: 'fungal',
        summary: 'Circular spots with dark red borders and tiny black spore clusters; attacks leaves and stalks.'
      },
      {
        id: 'leaf_blight',
        name: 'Sorghum Leaf Blight',
        category: 'fungal',
        summary: 'Spindle-shaped reddish-purple blights merging to scorch entire leaf canopies.'
      },
      {
        id: 'grain_mold',
        name: 'Grain Mold',
        category: 'fungal',
        summary: 'Black, pink, or gray fungal crusts on mature grains when rains linger during ripening.'
      },
      {
        id: 'head_smut',
        name: 'Head Smut',
        category: 'fungal',
        summary: 'Entire seed head replaced by a large swollen gall packed with black powdery spores.'
      },
      {
        id: 'downy_mildew',
        name: 'Sorghum Downy Mildew',
        category: 'fungal',
        summary: 'Bright yellow-green leaf striping with white downy growth beneath; causes barren heads.'
      }
    ]
  },
  {
    id: 'rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    localNames: 'Shinkafa (Hausa) · Iresi (Yoruba) · Osikapa (Igbo)',
    tag: 'National Staple',
    color: 'from-green-600 to-emerald-700',
    lightColor: 'bg-green-50 text-green-800 border-green-200',
    iconEmoji: '🍚',
    parts: ['Leaf', 'Neck', 'Panicle', 'Sheath'],
    description: 'Cultivated in wetlands, swamps, and fadama plains across Nigeria (e.g. Kebbi, Niger, Ebonyi).',
    diseases: [
      {
        id: 'blast',
        name: 'Rice Blast (Leaf & Neck)',
        category: 'fungal',
        summary: 'Diamond lesions on leaves; rotting neck node causing blank empty white heads.'
      },
      {
        id: 'brown_spot',
        name: 'Brown Spot',
        category: 'fungal',
        summary: 'Oval dark-brown spots with yellow rings; signal of low soil potassium or drought stress.'
      },
      {
        id: 'bacterial_leaf_blight',
        name: 'Bacterial Leaf Blight',
        category: 'bacterial',
        summary: 'Wavy yellow water-soaked margins starting at leaf tips; drops of bacterial ooze in dew.'
      },
      {
        id: 'sheath_blight',
        name: 'Sheath Blight',
        category: 'fungal',
        summary: 'Green-gray snake-skin lesions on lower sheaths near water line creeping upward.'
      },
      {
        id: 'false_smut',
        name: 'False Smut',
        category: 'fungal',
        summary: 'Velvety orange-to-green balls replacing grains, bursting into dusty spore powder.'
      },
      {
        id: 'rice_yellow_mottle_virus',
        name: 'Rice Yellow Mottle Virus (RYMV)',
        category: 'viral',
        summary: 'Mottled yellow streaks, severe stunting, and reduced tillers spread by flea beetles.'
      }
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    localNames: 'Tumatur (Hausa) · Tomato (Yoruba/Igbo)',
    tag: 'Horticulture',
    color: 'from-red-600 to-rose-700',
    lightColor: 'bg-red-50 text-red-800 border-red-200',
    iconEmoji: '🍅',
    parts: ['Leaf', 'Fruit', 'Stem'],
    description: 'Key cash vegetable across Kano, Kaduna, and southern farms; highly vulnerable to blights and viruses.',
    diseases: [
      {
        id: 'early_blight',
        name: 'Early Blight',
        category: 'fungal',
        summary: 'Concentric ring target-board brown spots on older lower leaves with yellow halos.'
      },
      {
        id: 'late_blight',
        name: 'Late Blight',
        category: 'fungal',
        summary: 'Greasy water-soaked patches turning black; white fuzz underneath; hard brown fruit rot.'
      },
      {
        id: 'septoria_leaf_spot',
        name: 'Septoria Leaf Spot',
        category: 'fungal',
        summary: 'Circular spots with whitish-gray centers and dark borders peppered with black dots.'
      },
      {
        id: 'bacterial_spot',
        name: 'Bacterial Spot',
        category: 'bacterial',
        summary: 'Small dark water-soaked spots with yellow halos; scabbed blisters on green fruits.'
      },
      {
        id: 'yellow_leaf_curl_virus',
        name: 'Yellow Leaf Curl Virus (TYLCV)',
        category: 'viral',
        summary: 'Upward curled leaves, bright yellow interveinal chlorosis, stunting, caused by whiteflies.'
      },
      {
        id: 'blossom_end_rot',
        name: 'Blossom End Rot',
        category: 'nutrient',
        summary: 'Sunken leathery black flat patch at bottom of fruit due to calcium & moisture imbalance.'
      },
      {
        id: 'fruit_rot',
        name: 'Fruit Rot (Anthracnose)',
        category: 'fungal',
        summary: 'Soft sunken water-soaked target rings rotting ripe fruit; aggravated by wet soil contact.'
      }
    ]
  }
];

export const GENERAL_CONDITIONS = [
  {
    id: 'healthy',
    name: 'Healthy Crop',
    badge: 'Healthy',
    badgeColor: 'bg-green-100 text-green-800 border-green-300',
    description: 'Leaves and crop organs are vigorous, showing uniform deep green color and zero lesions.'
  },
  {
    id: 'nutrient_deficiency',
    name: 'Nutrient Deficiency',
    badge: 'Nutrient Deficiency',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Yellowing (N), purpling (P), or marginal leaf scorching (K) due to nutrient starvation.'
  },
  {
    id: 'pest_damage',
    name: 'Pest Damage',
    badge: 'Pest Damage',
    badgeColor: 'bg-red-100 text-red-800 border-red-300',
    description: 'Insect chewing, boring, defoliation, or piercing caused by caterpillars, beetles, or mites.'
  }
];
