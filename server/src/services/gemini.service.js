/**
 * Gemini AI Plant Pathology Service
 * Connects to Google Gemini API using @google/genai SDK.
 * Sends crop photos along with specialized plant pathologist system instructions,
 * requesting guaranteed structured JSON output with practical advice tailored for
 * smallholder farmers across Nigeria.
 */

const { GoogleGenAI } = require('@google/genai');
const { SUPPORTED_CROPS } = require('../config/crops.config');

// Initialize Gemini client with provided API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('[Gemini Warning] GEMINI_API_KEY is not defined in environment variables.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// System instruction specifying the AI's exact role, constraints, and Nigerian agricultural context
const PLANT_PATHOLOGIST_SYSTEM_INSTRUCTION = `
You are Dr. Amina Bello, a senior tropical plant pathologist and extension specialist with over 20 years of field experience in Nigeria and West Africa (working closely with IITA Ibadan, ICRISAT Kano, NCRI Badeggi, and NIHORT).

Your task is to analyze agricultural photos submitted by smallholder farmers and extension officers.

SCOPE AND GUIDELINES:
1. TARGET CROPS ONLY:
   You exclusively diagnose the following 5 target crops:
   - Maize (Zea mays)
   - Pearl Millet (Pennisetum glaucum)
   - Sorghum / Guinea corn (Sorghum bicolor)
   - Rice (Oryza sativa)
   - Tomato (Solanum lycopersicum)

2. PLANT PARTS TO EXAMINE:
   You carefully inspect all visible plant organs:
   - Leaves (foliar lesions, spots, blights, streaks, rust pustules, curling)
   - Cobs / Ears (maize ear rots, smut galls, insect boring)
   - Heads / Panicles (millet green ear, ergot honeydew, sorghum grain mold, rice panicle blast, false smut)
   - Fruits (tomato early/late blight rot, blossom end rot, bacterial spots, anthracnose)
   - Stems / Sheaths (sheath blight, stem borers, stalk rot)

3. CONDITIONS TO IDENTIFY:
   - Target diseases for the 5 crops (e.g. Northern leaf blight, common rust, maize streak virus, fall armyworm, downy mildew, ergot, anthracnose, grain mold, rice blast, bacterial leaf blight, sheath blight, tomato blights, Septoria, TYLCV, blossom end rot).
   - Healthy plants (vigorous, no disease lesions or pest symptoms).
   - Nutrient deficiencies (Nitrogen chlorosis, Phosphorus purpling, Potassium marginal scorch, Calcium blossom end rot).
   - Pest and insect damage (armyworm frass/holes, stem borers, leaf miners, spider mites).

4. HONESTY AND UNCERTAINTY:
   - If the image does not show a plant, set "isPlant": false and clearly explain why.
   - If the plant is clearly not one of the 5 supported crops (e.g., cassava, yam, banana, weed), set "isSupportedCrop": false, name the visible plant if recognizable, and advise the farmer.
   - If the photo is too blurry, too dark, out-of-focus, or low quality, note this in "imageQualityNote", lower the confidence, and advise how to retake the photo.
   - If confidence is below 60, mark status as "uncertain", list other possibilities in "otherPossibilities", and advise consulting a local extension officer.

5. NIGERIAN FARMING CONTEXT & PRACTICAL SOLUTIONS:
   - Recommendations must be immediately practical, culturally accessible, and affordable for smallholder farmers in Nigeria.
   - For chemical treatments: list common active ingredients available in local agro-dealer shops (e.g., Mancozeb, Ridomil Gold [Metalaxyl+Mancozeb], Apron Star, Tricyclazole, Emamectin benzoate, Imidacloprid, Lambda-cyhalothrin).
   - For organic / low-cost options: provide actionable low-cost remedies (e.g., neem seed/leaf oil extract, wood ash dusting into maize whorls, rogueing and burning infected stalks, companion planting, boiling water seed dips, brine floating for ergot sclerotia, improved drainage).
   - Recommend resistant local cultivars developed by Nigerian institutes (e.g., SAMMAZ maize series, SOSAT millet, FARO rice varieties).

6. OUTPUT FORMAT:
   Return strictly valid JSON adhering exactly to the requested JSON schema.
`;

// JSON Schema definition for controlled structured output
const PATHOLOGY_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    isPlant: { type: 'BOOLEAN' },
    isSupportedCrop: { type: 'BOOLEAN' },
    crop: {
      type: 'STRING',
      enum: ['Maize', 'Millet', 'Sorghum', 'Rice', 'Tomato', 'Unknown']
    },
    plantPart: {
      type: 'STRING',
      enum: ['leaf', 'cob', 'head', 'panicle', 'fruit', 'stem', 'whole_plant', 'unknown']
    },
    status: {
      type: 'STRING',
      enum: ['healthy', 'diseased', 'uncertain']
    },
    diseaseName: { type: 'STRING' },
    causalAgent: { type: 'STRING' },
    category: {
      type: 'STRING',
      enum: ['fungal', 'bacterial', 'viral', 'pest', 'nutrient', 'none']
    },
    confidence: { type: 'INTEGER' },
    severity: {
      type: 'STRING',
      enum: ['mild', 'moderate', 'severe', 'none']
    },
    symptomsObserved: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    description: { type: 'STRING' },
    causes: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    immediateActions: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    chemicalTreatment: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    organicTreatment: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    prevention: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    otherPossibilities: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          confidence: { type: 'INTEGER' }
        },
        required: ['name', 'confidence']
      }
    },
    imageQualityNote: { type: 'STRING' }
  },
  required: [
    'isPlant',
    'isSupportedCrop',
    'crop',
    'plantPart',
    'status',
    'diseaseName',
    'causalAgent',
    'category',
    'confidence',
    'severity',
    'symptomsObserved',
    'description',
    'causes',
    'immediateActions',
    'chemicalTreatment',
    'organicTreatment',
    'prevention',
    'otherPossibilities',
    'imageQualityNote'
  ]
};

/**
 * Validates and normalizes the parsed pathology JSON result
 * @param {Object} rawJson
 * @param {string|null} preferredCrop
 * @returns {Object} normalized result
 */
function validateAndNormalizeResult(rawJson, preferredCrop = null) {
  if (!rawJson || typeof rawJson !== 'object') {
    throw new Error('Analysis result is empty or not an object');
  }

  // Ensure default boolean flags
  const isPlant = Boolean(rawJson.isPlant !== false);
  let isSupportedCrop = Boolean(rawJson.isSupportedCrop);

  // If farmer selected a preferred crop, cross-check
  let crop = rawJson.crop || 'Unknown';
  if (preferredCrop && preferredCrop !== 'auto' && preferredCrop !== 'Auto Detect') {
    const matched = SUPPORTED_CROPS.find(
      (c) => c.name.toLowerCase() === preferredCrop.toLowerCase() || c.id === preferredCrop.toLowerCase()
    );
    if (matched && (!isSupportedCrop || crop === 'Unknown')) {
      crop = matched.name;
      isSupportedCrop = true;
    }
  }

  // Validate status
  let status = rawJson.status;
  if (!['healthy', 'diseased', 'uncertain'].includes(status)) {
    if (!isPlant || !isSupportedCrop) {
      status = 'uncertain';
    } else if (rawJson.confidence < 60) {
      status = 'uncertain';
    } else if (rawJson.diseaseName && rawJson.diseaseName.toLowerCase().includes('healthy')) {
      status = 'healthy';
    } else {
      status = 'diseased';
    }
  }

  // Sanitize confidence
  let confidence = Number(rawJson.confidence);
  if (isNaN(confidence) || confidence < 0) confidence = 0;
  if (confidence > 100) confidence = 100;

  // If plant is not supported or not a plant, ensure friendly user message
  let description = rawJson.description || '';
  if (!isPlant) {
    description = description || 'The uploaded photo does not appear to contain a plant. Please take a clear photo of a crop leaf, fruit, cob, or stem.';
  } else if (!isSupportedCrop) {
    description = description || `This plant appears to be outside our 5 supported crops (Maize, Millet, Sorghum, Rice, Tomato). Detected plant: ${crop}. Please submit one of our supported crops.`;
  }

  return {
    isPlant,
    isSupportedCrop,
    crop,
    plantPart: rawJson.plantPart || 'leaf',
    status,
    diseaseName: rawJson.diseaseName || (status === 'healthy' ? 'Healthy Crop' : 'Undetermined Condition'),
    causalAgent: rawJson.causalAgent || 'N/A',
    category: rawJson.category || (status === 'healthy' ? 'none' : 'fungal'),
    confidence: Math.round(confidence),
    severity: rawJson.severity || (status === 'healthy' ? 'none' : 'mild'),
    symptomsObserved: Array.isArray(rawJson.symptomsObserved) ? rawJson.symptomsObserved : [],
    description,
    causes: Array.isArray(rawJson.causes) ? rawJson.causes : [],
    immediateActions: Array.isArray(rawJson.immediateActions) ? rawJson.immediateActions : [],
    chemicalTreatment: Array.isArray(rawJson.chemicalTreatment) ? rawJson.chemicalTreatment : [],
    organicTreatment: Array.isArray(rawJson.organicTreatment) ? rawJson.organicTreatment : [],
    prevention: Array.isArray(rawJson.prevention) ? rawJson.prevention : [],
    otherPossibilities: Array.isArray(rawJson.otherPossibilities) ? rawJson.otherPossibilities : [],
    imageQualityNote: rawJson.imageQualityNote || 'Image quality adequate for visual inspection.'
  };
}

/**
 * Analyzes a crop image buffer using Gemini API with structured JSON output and model fallbacks
 * @param {Buffer} imageBuffer - Raw image file buffer
 * @param {string} mimeType - e.g. 'image/jpeg' or 'image/png'
 * @param {string|null} preferredCrop - Farmer selected crop (optional, defaults to auto-detect)
 * @returns {Promise<Object>} Structured pathology result
 */
async function analyzeCropImage(imageBuffer, mimeType = 'image/jpeg', preferredCrop = null) {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) {
    throw new Error('Valid image buffer is required for analysis');
  }

  const base64Data = imageBuffer.toString('base64');

  // Candidate models: Primary is gemini-3.8-flash, fallback is gemini-3.5-flash
  const candidateModels = [
    process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-flash-latest'
  ];

  // Remove duplicates
  const uniqueModels = [...new Set(candidateModels)];

  const userPrompt = preferredCrop && preferredCrop !== 'auto' && preferredCrop !== 'Auto Detect'
    ? `The farmer indicates this crop is likely ${preferredCrop}. Please examine this photo thoroughly and provide full plant pathology diagnosis.`
    : `Please identify the crop from the 5 supported crops (Maize, Millet, Sorghum, Rice, Tomato), determine the plant organ visible (leaf, cob, head, panicle, fruit, stem), detect if it is healthy or diseased, and diagnose any condition with treatment advice for Nigerian smallholders.`;

  let lastError = null;

  // Try across available models with timeout & retry
  for (const model of uniqueModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Gemini Service] Sending image to model "${model}" (attempt ${attempt})...`);

        // We wrap in a 25-second timeout per attempt
        const callPromise = ai.models.generateContent({
          model,
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType
              }
            },
            {
              text: `${PLANT_PATHOLOGIST_SYSTEM_INSTRUCTION}\n\nTask: ${userPrompt}`
            }
          ],
          config: {
            temperature: 0.1, // Low temperature for high consistency and reproducibility
            responseMimeType: 'application/json',
            responseSchema: PATHOLOGY_RESPONSE_SCHEMA
          }
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout waiting for Gemini model ${model}`)), 25000)
        );

        const response = await Promise.race([callPromise, timeoutPromise]);

        if (!response || !response.text) {
          throw new Error('Empty response received from Gemini');
        }

        const rawText = response.text.trim();
        let parsed;

        try {
          parsed = JSON.parse(rawText);
        } catch (jsonErr) {
          console.warn('[Gemini Service] Direct JSON parse failed, attempting regex extraction...', jsonErr.message);
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error(`Failed to parse structured JSON from model: ${rawText.slice(0, 200)}...`);
          }
        }

        const validated = validateAndNormalizeResult(parsed, preferredCrop);
        console.log(`[Gemini Service] Diagnosis successful using model "${model}": ${validated.crop} - ${validated.diseaseName} (${validated.confidence}%)`);
        return validated;
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini Service] Model "${model}" attempt ${attempt} failed: ${err.message || err.status || err}`);

        // If rate limited or 503 high demand, short delay before next attempt
        if (err.status === 503 || err.status === 429) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        } else if (err.status === 404) {
          // Model does not exist, break to next model immediately
          break;
        }
      }
    }
  }

  // If all Gemini calls failed (e.g. offline during local defence or quota exceeded),
  // return a graceful diagnostic response rather than crashing the user's interface
  console.error('[Gemini Service] All Gemini model attempts failed:', lastError?.message);

  if (lastError && (lastError.status === 429 || lastError.message?.includes('quota'))) {
    const error = new Error('Gemini API quota exceeded. Please wait a moment and try again.');
    error.statusCode = 429;
    throw error;
  }

  throw new Error(
    lastError?.message ||
    'AI diagnosis service is currently unavailable. Please check your internet connection or verify your Gemini API key.'
  );
}

module.exports = {
  analyzeCropImage,
  validateAndNormalizeResult
};
