/**
 * CropScan AI - Central Configuration
 * Project metadata, supported crops, plant parts, and target disease conditions.
 * Easily customize or add more crops and diseases here.
 */

const APP_CONFIG = {
  projectName: 'CropScan AI',
  tagline: 'AI-Powered Crop Disease Detection for Smallholder Farmers',
  version: '1.0.0',
  author: 'Musa Musa',
  projectType: 'Final Year Computer Science / Agritech Project'
};

const SUPPORTED_CROPS = [
  {
    id: 'maize',
    name: 'Maize',
    scientificName: 'Zea mays',
    localNames: ['Corn', 'Masara (Hausa)', 'Oka (Yoruba)', 'Ọka (Igbo)'],
    description: 'One of the most important staple cereals grown across Nigeria and West Africa, susceptible to foliar blights, rusts, ear rots, and stem borers.',
    parts: ['leaf', 'cob', 'stem', 'tassel', 'whole_plant'],
    diseases: [
      {
        id: 'northern_leaf_blight',
        name: 'Northern Leaf Blight',
        causalAgent: 'Exserohilum turcicum',
        category: 'fungal',
        affectedParts: ['leaf'],
        typicalSymptoms: 'Long, elliptical, grayish-green to tan lesions parallel to leaf veins.',
        organicTreatment: 'Crop rotation, remove crop residues after harvest, apply neem seed oil or copper fungicide.',
        chemicalTreatment: 'Azoxystrobin or Mancozeb sprays at early disease onset.',
        prevention: 'Plant resistant hybrids; ensure wide plant spacing for airflow; avoid overhead irrigation.'
      },
      {
        id: 'gray_leaf_spot',
        name: 'Gray Leaf Spot',
        causalAgent: 'Cercospora zeae-maydis',
        category: 'fungal',
        affectedParts: ['leaf'],
        typicalSymptoms: 'Rectangular, narrow tan-to-gray lesions restricted by leaf veins.',
        organicTreatment: 'Deep ploughing of stubble, intercropping with legumes, bio-fungicides.',
        chemicalTreatment: 'Pyraclostrobin or Propiconazole foliar sprays.',
        prevention: 'Rotate fields with non-host crops like cowpea or groundnut for at least 2 seasons.'
      },
      {
        id: 'common_rust',
        name: 'Common Rust',
        causalAgent: 'Puccinia sorghi',
        category: 'fungal',
        affectedParts: ['leaf'],
        typicalSymptoms: 'Small, powdery golden-brown to cinnamon pustules on both upper and lower leaf surfaces.',
        organicTreatment: 'Sulfur dust dusting, botanical extracts from garlic or neem.',
        chemicalTreatment: 'Foliar triazole fungicides (Tebuconazole) if infection appears prior to silking.',
        prevention: 'Early planting; utilize certified rust-resistant maize seeds.'
      },
      {
        id: 'maize_streak_virus',
        name: 'Maize Streak Virus',
        causalAgent: 'Maize streak virus (MSV) vectored by leafhoppers (Cicadulina spp.)',
        category: 'viral',
        affectedParts: ['leaf', 'whole_plant'],
        typicalSymptoms: 'Continuous narrow chlorotic (yellow/white) streaks uniformly spaced along leaf veins, stunted growth.',
        organicTreatment: 'Rogue (uproot and burn) infected plants immediately; spray neem oil to repel leafhoppers.',
        chemicalTreatment: 'Insecticidal seed treatments (Imidacloprid) or pyrethroid sprays to control vector leafhoppers.',
        prevention: 'Plant MSV-tolerant open-pollinated varieties (OPVs) such as SAMMAZ series.'
      },
      {
        id: 'ear_rot',
        name: 'Ear Rot',
        causalAgent: 'Fusarium verticillioides / Stenocarpella maydis',
        category: 'fungal',
        affectedParts: ['cob'],
        typicalSymptoms: 'White, pinkish, or gray cottony mold growing between kernels; shriveled or discolored kernels.',
        organicTreatment: 'Harvest early as soon as physiological maturity is reached; dry cobs quickly to below 13% moisture on tarpaulins.',
        chemicalTreatment: 'Fungicidal seed treatments with Thiram or Fludioxonil.',
        prevention: 'Control ear-damaging insects; store grain in hermetic bags (PICS bags) to avoid mycotoxin buildup.'
      },
      {
        id: 'common_smut',
        name: 'Common Smut',
        causalAgent: 'Ustilago maydis',
        category: 'fungal',
        affectedParts: ['cob', 'tassel', 'stem', 'leaf'],
        typicalSymptoms: 'Large, fleshy white-to-silvery galls that rupture to release powdery black spores.',
        organicTreatment: 'Cut off and bury or burn galls before they rupture and release black spore dust.',
        chemicalTreatment: 'No chemical cure once galls appear; seed treatment helps reduce seedling entry.',
        prevention: 'Avoid mechanical damage during weeding; balance soil fertility (avoid excessive nitrogen).'
      },
      {
        id: 'fall_armyworm_damage',
        name: 'Fall Armyworm Damage',
        causalAgent: 'Spodoptera frugiperda (larvae)',
        category: 'pest',
        affectedParts: ['leaf', 'stem', 'cob'],
        typicalSymptoms: 'Ragged ragged leaf margins, shot-holes in whorls, thick moist frass (sawdust-like excrement) inside leaf whorl.',
        organicTreatment: 'Hand-pick caterpillars; pour fine sand or wood ash into whorls; spray Bacillus thuringiensis (Bt) or neem oil.',
        chemicalTreatment: 'Emamectin benzoate, Chlorantraniliprole, or Spinetoram applied directly into leaf whorls.',
        prevention: 'Early planting; push-pull companion cropping with Desmodium and Napier grass.'
      }
    ]
  },
  {
    id: 'millet',
    name: 'Pearl Millet',
    scientificName: 'Pennisetum glaucum',
    localNames: ['Millet', 'Gero / Maiwa (Hausa)', 'Jero (Yoruba)'],
    description: 'Drought-tolerant cereal widely cultivated in the Sudano-Sahelian belt of northern Nigeria, crucial for food security.',
    parts: ['leaf', 'head', 'stem', 'whole_plant'],
    diseases: [
      {
        id: 'downy_mildew',
        name: 'Downy Mildew (Green Ear)',
        causalAgent: 'Sclerospora graminicola',
        category: 'fungal',
        affectedParts: ['head', 'leaf'],
        typicalSymptoms: 'Floral parts of the ear head transform into leafy brush-like green structures (green ear); chlorotic streaks on leaves.',
        organicTreatment: 'Uproot and burn diseased plants before ear formation; soak seeds in hot water (55°C for 10 min) before sowing.',
        chemicalTreatment: 'Seed dressing with Metalaxyl-M (Apron Star) prior to sowing.',
        prevention: 'Plant certified downy mildew resistant cultivars (e.g., SOSAT-C88); rotate with groundnuts.'
      },
      {
        id: 'ergot',
        name: 'Ergot',
        causalAgent: 'Claviceps squamata / Claviceps africana',
        category: 'fungal',
        affectedParts: ['head'],
        typicalSymptoms: 'Sticky honeydew pinkish-brown droplets oozing from florets, later forming dark hard sclerotia resting bodies.',
        organicTreatment: 'Float seeds in 10% brine (salt solution) to skim off sclerotia before planting; wash seeds with clean water.',
        chemicalTreatment: 'Foliar sprays of Mancozeb or Benomyl during flowering if high humidity is forecast.',
        prevention: 'Synchronize sowing so flowering occurs uniformly; deep ploughing to bury sclerotia.'
      },
      {
        id: 'smut',
        name: 'Millet Smut',
        causalAgent: 'Moesziomyces penicillariae',
        category: 'fungal',
        affectedParts: ['head'],
        typicalSymptoms: 'Grain ovaries turn into swollen, oval, greenish-brown sori containing dark spore masses that break open.',
        organicTreatment: 'Remove affected heads carefully in a sack and destroy away from field.',
        chemicalTreatment: 'Seed treatment with Carboxin + Thiram.',
        prevention: 'Use disease-free seed; plant resistant open-pollinated varieties.'
      },
      {
        id: 'rust',
        name: 'Millet Rust',
        causalAgent: 'Puccinia substriata',
        category: 'fungal',
        affectedParts: ['leaf'],
        typicalSymptoms: 'Reddish-orange to brown powdery pustules scattered over both leaf surfaces, leading to premature leaf drying.',
        organicTreatment: 'Spray aqueous wood ash or neem leaves extract.',
        chemicalTreatment: 'Triazole fungicide spray if weather is wet and cool during vegetative stage.',
        prevention: 'Optimum plant population; timely weed sanitation around farm boundaries.'
      },
      {
        id: 'blast',
        name: 'Millet Blast',
        causalAgent: 'Magnaporthe grisea (Pyricularia)',
        category: 'fungal',
        affectedParts: ['leaf', 'head'],
        typicalSymptoms: 'Diamond-shaped, grayish-centered eye lesions with brown borders on leaves and neck lesions.',
        organicTreatment: 'Foliar application of fermented cow urine / botanical extracts; maintain balanced potassium.',
        chemicalTreatment: 'Tricyclazole or Carbendazim foliar treatment.',
        prevention: 'Avoid dense planting; plant blast-tolerant local lines.'
      }
    ]
  },
  {
    id: 'sorghum',
    name: 'Sorghum',
    scientificName: 'Sorghum bicolor',
    localNames: ['Guinea corn', 'Dawa (Hausa)', 'Oka Baba (Yoruba)'],
    description: 'Major food and brewing grain across the Nigerian savannahs, prized for drought tolerance.',
    parts: ['leaf', 'head', 'stem', 'panicle', 'grain'],
    diseases: [
      {
        id: 'anthracnose',
        name: 'Anthracnose',
        causalAgent: 'Colletotrichum sublineolum',
        category: 'fungal',
        affectedParts: ['leaf', 'stem', 'panicle'],
        typicalSymptoms: 'Circular to elliptical spots with defined dark reddish-purple borders and black fruiting bodies (acervuli) in centers.',
        organicTreatment: 'Burn infected stalks post-harvest; rotate crops with non-gramineous crops like soybean or cowpea.',
        chemicalTreatment: 'Foliar applications of Mancozeb or Azoxystrobin.',
        prevention: 'Use certified anthracnose-resistant hybrids; practice 2-year crop rotation.'
      },
      {
        id: 'leaf_blight',
        name: 'Sorghum Leaf Blight',
        causalAgent: 'Exserohilum turcicum',
        category: 'fungal',
        affectedParts: ['leaf'],
        typicalSymptoms: 'Elongate reddish-purple or tan spindle-shaped lesions along leaf blades, coalescing into blighted leaves.',
        organicTreatment: 'Prompt removal of infected lower leaves; apply sulfur sprays.',
        chemicalTreatment: 'Foliar fungicides like Chlorothalonil or Propiconazole.',
        prevention: 'Use certified clean seeds; destroy volunteer sorghum and wild grasses.'
      },
      {
        id: 'grain_mold',
        name: 'Grain Mold',
        causalAgent: 'Fusarium, Curvularia, and Alternaria complex',
        category: 'fungal',
        affectedParts: ['head', 'grain'],
        typicalSymptoms: 'Pink, black, or white powdery discolored coating over developing grains, causing chalky, brittle seeds.',
        organicTreatment: 'Harvest as soon as grain matures; dry promptly on raised mats or tarpaulins.',
        chemicalTreatment: 'Spray Benomyl or Mancozeb during anthesis in wet years.',
        prevention: 'Plant varieties matching local rainfall duration so ripening occurs after the main rains cease.'
      },
      {
        id: 'head_smut',
        name: 'Head Smut',
        causalAgent: 'Sporisorium reilianum',
        category: 'fungal',
        affectedParts: ['head'],
        typicalSymptoms: 'Complete replacement of floral head by a large fungal gall covered with a thin white membrane that ruptures.',
        organicTreatment: 'Rogue out infected smutted heads in plastic bags before rupture; burn completely.',
        chemicalTreatment: 'Systemic seed dressing fungicides (Triadimenol or Flutriafol).',
        prevention: 'Long crop rotation (4-5 years) because spores survive in soil for years.'
      },
      {
        id: 'downy_mildew',
        name: 'Sorghum Downy Mildew',
        causalAgent: 'Peronosclerospora sorghi',
        category: 'fungal',
        affectedParts: ['leaf', 'head'],
        typicalSymptoms: 'Vivid pale-yellow striping on leaves, white downy growth on underside of leaves in morning, barren heads.',
        organicTreatment: 'Uproot systemic infected seedlings immediately.',
        chemicalTreatment: 'Metalaxyl seed treatment (Apron Plus).',
        prevention: 'Plant resistant cultivars; avoid planting near infected maize fields.'
      }
    ]
  },
  {
    id: 'rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    localNames: ['Rice', 'Shinkafa (Hausa)', 'Iresi (Yoruba)', 'Osikapa (Igbo)'],
    description: 'Vital national staple cultivated across lowland swamps, fadamas, and uplands throughout Nigeria.',
    parts: ['leaf', 'neck', 'panicle', 'sheath', 'stem'],
    diseases: [
      {
        id: 'blast',
        name: 'Rice Blast (Leaf and Neck)',
        causalAgent: 'Magnaporthe oryzae (Pyricularia oryzae)',
        category: 'fungal',
        affectedParts: ['leaf', 'neck', 'panicle'],
        typicalSymptoms: 'Diamond-shaped, spindle-like lesions with gray centers and reddish-brown borders; black rotting at panicle neck causing empty heads.',
        organicTreatment: 'Avoid excessive nitrogen; apply silica supplements or wood ash; water management (keep paddy flooded).',
        chemicalTreatment: 'Tricyclazole, Isoprothiolane, or Kasugamycin foliar spray at tillering and heading.',
        prevention: 'Use blast-resistant varieties (such as FARO 44, FARO 52); avoid nitrogen overdose.'
      },
      {
        id: 'brown_spot',
        name: 'Brown Spot',
        causalAgent: 'Bipolaris oryzae (Cochliobolus miyabeanus)',
        category: 'fungal',
        affectedParts: ['leaf', 'grain'],
        typicalSymptoms: 'Small circular to oval dark-brown spots with yellow halo evenly distributed across leaf surface; discolored grains.',
        organicTreatment: 'Soil fertility improvement: brown spot is an indicator of poor nutrient status (potassium, silicon, iron deficiency).',
        chemicalTreatment: 'Mancozeb or Edifenphos sprays.',
        prevention: 'Correct soil nutrient deficiencies; soak seeds in hot water (52°C for 10 min) before sowing.'
      },
      {
        id: 'bacterial_leaf_blight',
        name: 'Bacterial Leaf Blight',
        causalAgent: 'Xanthomonas oryzae pv. oryzae',
        category: 'bacterial',
        affectedParts: ['leaf'],
        typicalSymptoms: 'Water-soaked wavy lesions starting from leaf tips and margins, turning yellow-white, with milky bacterial ooze beads on humid mornings.',
        organicTreatment: 'Drain excessive flood water temporarily; apply neem seed kernel extract; balance potassium fertilizer.',
        chemicalTreatment: 'Copper oxychloride or Streptomycin + Tetracycline spray.',
        prevention: 'Plant certified resistant varieties (FARO series); clean irrigation channels.'
      },
      {
        id: 'sheath_blight',
        name: 'Sheath Blight',
        causalAgent: 'Rhizoctonia solani',
        category: 'fungal',
        affectedParts: ['sheath', 'stem', 'leaf'],
        typicalSymptoms: 'Oval, grayish-green lesions with dark brown borders on lower leaf sheaths near the water line, spreading upwards.',
        organicTreatment: 'Maintain wider spacing to decrease canopy humidity; remove infected lower sheaths.',
        chemicalTreatment: 'Validamycin, Hexaconazole, or Azoxystrobin.',
        prevention: 'Avoid high plant density; drain stagnant water periodically.'
      },
      {
        id: 'false_smut',
        name: 'False Smut',
        causalAgent: 'Ustilaginoidea virens',
        category: 'fungal',
        affectedParts: ['panicle', 'grain'],
        typicalSymptoms: 'Individual rice grains transform into velvety yellow-green balls that turn olive-green to black, twice normal grain size.',
        organicTreatment: 'Carefully hand-pick and remove infected smut balls before they burst; avoid high nitrogen during panicle emergence.',
        chemicalTreatment: 'Copper hydroxide or Propiconazole at boot leaf stage.',
        prevention: 'Certified clean seed; avoid excessive chemical nitrogen fertilizer.'
      },
      {
        id: 'rice_yellow_mottle_virus',
        name: 'Rice Yellow Mottle Virus (RYMV)',
        causalAgent: 'Rice yellow mottle sobemovirus (spread by beetles Chaetocnema spp.)',
        category: 'viral',
        affectedParts: ['leaf', 'whole_plant'],
        typicalSymptoms: 'Mottled yellow or light-green discolored leaves, severe stunting, reduced tillering, spiraled emergence of panicles.',
        organicTreatment: 'Uproot infected plants immediately; spray neem oil to manage flea beetle vectors.',
        chemicalTreatment: 'Insecticides (Cypermethrin) directed at vector flea beetles.',
        prevention: 'Plant RYMV-resistant varieties (such as FARO 51, NERICA varieties); clear wild rices around bunds.'
      }
    ]
  },
  {
    id: 'tomato',
    name: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    localNames: ['Tomato', 'Tumatur (Hausa)', 'Tomato (Yoruba)', 'Tomato (Igbo)'],
    description: 'High-value horticultural vegetable crop grown under irrigation and rainfed across Kano, Kaduna, Plateau, and southern Nigeria.',
    parts: ['leaf', 'fruit', 'stem', 'flower'],
    diseases: [
      {
        id: 'early_blight',
        name: 'Early Blight',
        causalAgent: 'Alternaria solani',
        category: 'fungal',
        affectedParts: ['leaf', 'stem', 'fruit'],
        typicalSymptoms: 'Concentric ring "target-board" brown spots on older lower leaves, surrounded by yellow halos; dark sunken stem lesions.',
        organicTreatment: 'Mulch soil to prevent rain splash; prune lower leaves; spray baking soda solution or copper soap.',
        chemicalTreatment: 'Mancozeb, Chlorothalonil, or Difenoconazole.',
        prevention: 'Drip or furrow irrigation instead of overhead watering; 3-year crop rotation away from Solanaceae.'
      },
      {
        id: 'late_blight',
        name: 'Late Blight',
        causalAgent: 'Phytophthora infestans',
        category: 'fungal',
        affectedParts: ['leaf', 'stem', 'fruit'],
        typicalSymptoms: 'Large irregular greasy water-soaked grayish lesions that turn brown quickly, white fuzzy fungal mold on leaf underside in moist conditions, firm brown fruit rot.',
        organicTreatment: 'Remove and destroy blighted foliage immediately; apply copper sulfate or Bordeaux mixture.',
        chemicalTreatment: 'Metalaxyl + Mancozeb (Ridomil Gold) or Dimethomorph.',
        prevention: 'Provide adequate spacing for air circulation; avoid overhead watering; stake plants off wet ground.'
      },
      {
        id: 'septoria_leaf_spot',
        name: 'Septoria Leaf Spot',
        causalAgent: 'Septoria lycopersici',
        category: 'fungal',
        affectedParts: ['leaf'],
        typicalSymptoms: 'Numerous small circular spots with grayish-white centers and dark brown margins, dotted with tiny black pinprick fruiting structures.',
        organicTreatment: 'Stake plants; mulch soil surface; remove infected lower leaves.',
        chemicalTreatment: 'Mancozeb or Chlorothalonil foliar spray every 7-10 days.',
        prevention: 'Clean cultivation; avoid working among wet plants.'
      },
      {
        id: 'bacterial_spot',
        name: 'Bacterial Spot',
        causalAgent: 'Xanthomonas vesicatoria',
        category: 'bacterial',
        affectedParts: ['leaf', 'fruit', 'stem'],
        typicalSymptoms: 'Small water-soaked dark spots that become angular and purplish-black; raised blister-like scab lesions on green fruits.',
        organicTreatment: 'Spray copper hydroxide mixed with neem; sanitize tools with bleach.',
        chemicalTreatment: 'Copper bactericide combined with Mancozeb.',
        prevention: 'Use hot-water treated or certified disease-free seeds; avoid overhead sprinkler watering.'
      },
      {
        id: 'yellow_leaf_curl_virus',
        name: 'Yellow Leaf Curl Virus (TYLCV)',
        causalAgent: 'Tomato yellow leaf curl begomovirus (transmitted by Whiteflies Bemisia tabaci)',
        category: 'viral',
        affectedParts: ['leaf', 'whole_plant'],
        typicalSymptoms: 'Severe upward cupping/curling of leaves, bright yellow interveinal chlorosis, stunted bushy top, premature flower dropping.',
        organicTreatment: 'Install yellow sticky traps to catch whiteflies; spray neem oil or soap spray; cover young seedlings with insect netting.',
        chemicalTreatment: 'Acetamiprid or Imidacloprid to control vector whitefly populations.',
        prevention: 'Use TYLCV-resistant tomato cultivars; destroy nearby weed hosts.'
      },
      {
        id: 'blossom_end_rot',
        name: 'Blossom End Rot',
        causalAgent: 'Physiological disorder (Calcium deficiency exacerbated by inconsistent watering)',
        category: 'nutrient',
        affectedParts: ['fruit'],
        typicalSymptoms: 'Water-soaked sunken, leathery, flat black patch at the blossom end (bottom) of the fruit.',
        organicTreatment: 'Maintain consistent soil moisture through regular mulching; apply agricultural lime or crushed eggshell slurry to soil.',
        chemicalTreatment: 'Foliar spray of Calcium chloride or Calcium nitrate during fruit set.',
        prevention: 'Avoid letting soil dry out completely between irrigations; avoid excessive ammoniacal nitrogen fertilizer.'
      },
      {
        id: 'fruit_rot',
        name: 'Fruit Rot (Anthracnose / Buckeye Rot)',
        causalAgent: 'Colletotrichum coccodes / Phytophthora nicotianae',
        category: 'fungal',
        affectedParts: ['fruit'],
        typicalSymptoms: 'Circular, sunken water-soaked spots with dark centers on ripe fruit; concentric brown and light brown rings (buckeye rot).',
        organicTreatment: 'Mulch beds so fruits do not touch bare soil; harvest ripe fruit without delay.',
        chemicalTreatment: 'Azoxystrobin or Chlorothalonil.',
        prevention: 'Stake and trellis plants; avoid soil splash onto lower fruit trusses.'
      }
    ]
  }
];

const GENERAL_CONDITIONS = [
  {
    id: 'healthy',
    name: 'Healthy Plant',
    category: 'none',
    description: 'Plant shows vigorous foliage, normal coloration, robust growth, and no visible lesions, pathogen signs, or pest injury.'
  },
  {
    id: 'nutrient_deficiency',
    name: 'Nutrient Deficiency',
    category: 'nutrient',
    description: 'Chlorosis, purpling, stunting, or leaf tip scorch due to deficiency of Nitrogen (N), Phosphorus (P), Potassium (K), Magnesium (Mg), or micronutrients.'
  },
  {
    id: 'pest_damage',
    name: 'Pest Damage',
    category: 'pest',
    description: 'Chewing, piercing-sucking injury, defoliation, galling, or stem boring caused by insects, mites, or larvae.'
  }
];

module.exports = {
  APP_CONFIG,
  SUPPORTED_CROPS,
  GENERAL_CONDITIONS
};
