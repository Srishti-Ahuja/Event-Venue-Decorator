import { GoogleGenAI } from '@google/genai';
import { sanitizeInput } from '../utils/sanitize';
import { VENUE_TEMPLATES } from './templates';
import { redecorateVenueImage } from './venueRenderer';
import { MIN_API_KEY_LENGTH } from '../constants/index.js';
import { validateSpecifications, validateChecklistItem } from '../types/index.js';

/**
 * Creates an instance of GoogleGenAI client
 * @param {string} apiKey 
 * @returns {GoogleGenAI}
 */
export function getGenAIClient(apiKey) {
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '' || apiKey.trim().length < MIN_API_KEY_LENGTH) {
    throw new Error('Please enter a valid Google Gemini API key to run live AI queries.');
  }
  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

/**
 * STAGE 1: Spatial Layout Analysis & Generative Prompt Expansion
 * Uses gemini-3.8-flash to inspect room geometry, ceiling height, architectural anchors,
 * and synthesize a photorealistic visual prompt plus itemized vendor checklist.
 */
export async function runStage1SpatialAnalysis({
  apiKey,
  imageBase64,
  mimeType = 'image/jpeg',
  specifications,
  venueTitle = 'Bare Event Venue',
  onProgress
}) {
  const { celebrationType, aestheticStyle, colorPalette, primaryLighting, customNotes } = specifications;
  
  if (onProgress) onProgress({ step: 'Scanning room architecture, ceilings, and anchor points...', percent: 20 });

  // If no API key is provided, use high-fidelity simulation
  if (!apiKey || apiKey.trim() === '') {
    await new Promise((r) => setTimeout(r, 600));
    if (onProgress) onProgress({ step: 'Evaluating lighting angles, material reflectivity, and floor space...', percent: 50 });
    await new Promise((r) => setTimeout(r, 500));
    
    return generateSimulatedStage1(venueTitle, specifications);
  }

  try {
    const ai = getGenAIClient(apiKey);

    if (onProgress) onProgress({ step: 'Submitting spatial vision analysis to gemini-3.8-flash...', percent: 45 });

    const systemPrompt = `You are an elite architectural spatial designer, event venue decorator, and master lighting engineer.
Analyze the provided empty/bare venue photo and the client's event vision.
Your task is to produce a JSON object with:
1. "spatialAnalysis": An object with:
   - "roomType": type of space identified (e.g. industrial warehouse, modern living room, barn, etc.)
   - "ceilingHeight": estimated vertical clearance and rigging possibilities
   - "architecturalAnchors": array of 3 key structural anchors found in THIS specific photo
   - "lightingAnalysis": analysis of existing natural/ambient light and recommendations for ${primaryLighting}
   - "surfaceMaterials": description of floors, walls, and pillars
2. "expandedPrompt": A single, dense, photorealistic, cinematic paragraph tailored specifically for text-to-image models. It must describe how THIS exact room is transformed with decor in ${colorPalette} and ${primaryLighting}.
3. "checklist": An array of 6-9 actionable vendor checklist items tailored to this specific space. Each item must have:
   - "id": string
   - "category": one of ["Lighting & Ambiance", "Florals & Greenery", "Furniture & Seating", "Tableware & Linens", "Structural & Backdrops"]
   - "name": descriptive vendor item name
   - "quantity": integer
   - "unitCost": estimated integer cost in USD
   - "notes": specific placement instruction in this room
   - "completed": boolean (set false)

Return ONLY valid raw JSON without markdown wraps if possible, or inside \`\`\`json blocks.`;

    const userPrompt = `
Client Event Vision:
- Celebration Type: ${sanitizeInput(celebrationType)}
- Aesthetic Theme: ${sanitizeInput(aestheticStyle)}
- Color Palette: ${sanitizeInput(colorPalette)}
- Primary Lighting Scheme: ${sanitizeInput(primaryLighting)}
- Custom Notes & Specific Demands: ${sanitizeInput(customNotes || 'Create an enchanting, breathtaking celebration ambiance')}

Analyze this venue space and generate the spatial assessment, the master image generation prompt, and the vendor decor checklist.`;

    const contents = [];
    if (imageBase64) {
      contents.push({
        role: 'user',
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType || 'image/jpeg'
            }
          },
          { text: `${systemPrompt}\n\n${userPrompt}` }
        ]
      });
    } else {
      contents.push({
        role: 'user',
        parts: [
          { text: `${systemPrompt}\n\nVenue Type: ${venueTitle}\n\n${userPrompt}` }
        ]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents
    });

    if (onProgress) onProgress({ step: 'Parsing architectural specifications and vendor budget...', percent: 80 });

    const rawText = response.text || '';
    const parsed = parseStage1JSON(rawText, specifications, venueTitle);

    return {
      ...parsed,
      isSimulated: false
    };
  } catch (error) {
    console.warn('Stage 1 spatial analysis failed, falling back to local engine:', error?.message || 'Unknown error');
    const simulated = generateSimulatedStage1(venueTitle, specifications);
    return {
      ...simulated,
      isSimulated: true,
      errorNotice: `Live API: ${error.message || 'Connecting'}. Switched to local visual simulation engine.`
    };
  }
}

/**
 * STAGE 2: In-Place Venue Redecoration & Visual Rendering
 * Redecorates the user's ACTUAL uploaded venue image, preserving the room's exact
 * architecture, perspective, walls, windows, and floors while synthesizing photorealistic decor.
 * 
 * @param {object} params
 * @returns {Promise<{ imageUrl: string, isSimulated: boolean, errorNotice?: string }>}
 */
export async function runStage2VisualGeneration({
  apiKey,
  prompt,
  originalImageSrc,
  venueTemplateId,
  specifications,
  renderMode = 'inPlace', // 'inPlace' (redecorates exact uploaded room) | 'imagen3' (concept text-to-image)
  onProgress
}) {
  if (onProgress) onProgress({ step: 'Initializing in-place venue redecoration engine...', percent: 20 });

  // Mode 1: In-Place Venue Redecoration (DEFAULT & RECOMMENDED)
  // Transforms the EXACT uploaded image by synthesizing decor onto its architecture!
  if (renderMode === 'inPlace' || !apiKey || apiKey.trim() === '') {
    if (onProgress) onProgress({ step: 'Mapping room perspective, rafters, and focal coordinates...', percent: 45 });
    await new Promise((r) => setTimeout(r, 400));

    if (onProgress) onProgress({ step: `Synthesizing ${specifications.primaryLighting} and ${specifications.colorPalette} decor onto the space...`, percent: 75 });

    try {
      // If user uploaded a custom image OR requested in-place redecoration of a template:
      if (originalImageSrc) {
        const redecoratedDataUrl = await redecorateVenueImage({
          imageSrc: originalImageSrc,
          specifications,
          promptModifiers: prompt
        });

        if (onProgress) onProgress({ step: 'Finalizing atmospheric lighting and volumetric glow...', percent: 100 });

        return {
          imageUrl: redecoratedDataUrl,
          isSimulated: !apiKey || apiKey.trim() === ''
        };
      }
    } catch (renderErr) {
      console.warn('In-place redecoration canvas failed, checking template fallback:', renderErr);
    }

    // Template fallback if originalImageSrc was somehow unavailable
    const template = VENUE_TEMPLATES.find((t) => t.id === venueTemplateId);
    if (template && template.decoratedImage) {
      return {
        imageUrl: template.decoratedImage,
        isSimulated: true
      };
    }
  }

  // Mode 2: Imagen 3 Generative Concept (Optional when API Key is supplied and user explicitly chose Imagen 3)
  try {
    const ai = getGenAIClient(apiKey);
    if (onProgress) onProgress({ step: 'Generating conceptual render with Imagen 3...', percent: 50 });

    const imageResponse = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: `${prompt}, wide-angle architectural event interior photography, 8k resolution, cinematic realistic lighting, sharp focus, magazine quality`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9'
      }
    });

    if (onProgress) onProgress({ step: 'Post-processing volumetric lighting...', percent: 90 });

    if (imageResponse && imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
      const imgBytes = imageResponse.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${imgBytes}`;
      return {
        imageUrl,
        isSimulated: false
      };
    }

    throw new Error('No image returned from Imagen API.');
  } catch (error) {
    console.warn('Imagen 3 generation fallback to in-place redecoration:', error?.message || 'Unknown error');
    
    // Always fall back to redecorating the user's actual image!
    if (originalImageSrc) {
      const redecoratedDataUrl = await redecorateVenueImage({
        imageSrc: originalImageSrc,
        specifications,
        promptModifiers: prompt
      });
      return {
        imageUrl: redecoratedDataUrl,
        isSimulated: true,
        errorNotice: `Imagen 3: ${error.message || 'Restricted'}. Transformed your uploaded photo via In-Place Redecoration Engine.`
      };
    }

    return {
      imageUrl: originalImageSrc,
      isSimulated: true,
      errorNotice: error.message
    };
  }
}

/**
 * Robust JSON extraction helper from LLM response
 */
function parseStage1JSON(rawText, specifications, venueTitle) {
  try {
    let clean = rawText.trim();
    const jsonMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      clean = jsonMatch[1];
    } else {
      const firstBrace = clean.indexOf('{');
      const lastBrace = clean.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        clean = clean.slice(firstBrace, lastBrace + 1);
      }
    }

    const data = JSON.parse(clean);

    // Defensively sanitize prompt (indirect prompt injection defense)
    const expandedPrompt = data.expandedPrompt
      ? sanitizeInput(data.expandedPrompt, 1500)
      : buildFallbackPrompt(specifications, venueTitle);

    // Defensively sanitize spatial layout assessment
    const rawSpatial = data.spatialAnalysis || {};
    const spatialAnalysis = {
      roomType: sanitizeInput(rawSpatial.roomType) || venueTitle,
      ceilingHeight: sanitizeInput(rawSpatial.ceilingHeight) || 'Spacious high ceilings with rigging capability',
      architecturalAnchors: Array.isArray(rawSpatial.architecturalAnchors)
        ? rawSpatial.architecturalAnchors.map(a => sanitizeInput(a)).filter(Boolean)
        : ['Main perimeter walls', 'Central focal area', 'Entry walkway'],
      lightingAnalysis: sanitizeInput(rawSpatial.lightingAnalysis) || 'Ambient diffuse lighting suitable for layered accent illumination',
      surfaceMaterials: sanitizeInput(rawSpatial.surfaceMaterials) || 'Architectural structural finishes with clean sightlines'
    };

    // Defensively validate and sanitize all vendor checklist items
    const rawChecklist = Array.isArray(data.checklist) && data.checklist.length > 0
      ? data.checklist
      : generateFallbackChecklist(specifications);

    const checklist = rawChecklist.map((item, idx) => validateChecklistItem(item, idx + 1));

    return {
      expandedPrompt,
      spatialAnalysis,
      checklist
    };
  } catch (err) {
    console.warn('Could not parse raw JSON from Gemini Stage 1, using structured fallback:', err);
    return generateSimulatedStage1(venueTitle, specifications);
  }
}

/**
 * Builds a simulated Stage 1 output tailored to the user's specific selections
 */
export function generateSimulatedStage1(venueTitle, specifications) {
  const safeSpecs = validateSpecifications(specifications);
  const safeTitle = sanitizeInput(venueTitle) || 'Event Space & Reception Hall';
  const prompt = buildFallbackPrompt(safeSpecs, safeTitle);
  const checklist = generateFallbackChecklist(safeSpecs);

  return {
    expandedPrompt: prompt,
    spatialAnalysis: {
      roomType: safeTitle,
      ceilingHeight: '28-foot expansive ceiling structure with load-bearing rigging beams',
      architecturalAnchors: ['Central ceremonial focal point', 'Symmetrical side columns', 'Main guest entry axis'],
      lightingAnalysis: `Natural ambient baseline with optimal dark zones for dramatic ${safeSpecs.primaryLighting}. High contrast potential with glowing warm-gold and hot-pink highlights.`,
      surfaceMaterials: 'Polished architectural floors with light-reflective sheen, neutral textured walls'
    },
    checklist,
    isSimulated: true
  };
}

/**
 * Generates an articulate, photorealistic prompt for Stage 2
 */
function buildFallbackPrompt(specifications, venueTitle) {
  const safeSpecs = validateSpecifications(specifications);
  const safeTitle = sanitizeInput(venueTitle) || 'Venue';
  const { celebrationType, aestheticStyle, colorPalette, primaryLighting, customNotes } = safeSpecs;
  
  return `A breathtaking, lavishly decorated ${celebrationType} inside this ${safeTitle}, designed in a ${aestheticStyle} aesthetic. The room is bathed in the warm, magical glow of ${primaryLighting}, casting soft amber and hot-pink bokeh highlights across the space. Sophisticated floral arrangements in ${colorPalette} tones cascade from structural beams and line long banquet tables dressed in floor-length textured linens. Polished surfaces catch warm reflections, crystal glassware sparkles under fairy-light canopies, and the background glows with romantic depth. ${customNotes ? `Special accent details: ${customNotes}.` : ''} Photorealistic architectural interior photography, hyper-detailed textures, volumetric lighting, 8k resolution.`;
}

/**
 * Generates an itemized checklist customized to specs
 */
function generateFallbackChecklist(specifications) {
  const { aestheticStyle, colorPalette, primaryLighting } = specifications;

  return [
    {
      id: 'item-1',
      category: 'Lighting & Ambiance',
      name: `${primaryLighting} Rigging & DMX Dimmer Setup`,
      quantity: 1,
      unitCost: 1150,
      completed: true,
      notes: 'Calibrated to warm 2400K color temperature with dimmer controls'
    },
    {
      id: 'item-2',
      category: 'Lighting & Ambiance',
      name: 'Wireless LED Uplighting Pods (Hot Pink & Gold wash)',
      quantity: 24,
      unitCost: 45,
      completed: true,
      notes: 'Positioned every 10ft along perimeter walls and columns'
    },
    {
      id: 'item-3',
      category: 'Florals & Greenery',
      name: `Signature Floral Altar / Backdrop Arch (${colorPalette})`,
      quantity: 1,
      unitCost: 1450,
      completed: false,
      notes: 'Featuring garden roses, blooming peonies, and Italian ruscus greens'
    },
    {
      id: 'item-4',
      category: 'Florals & Greenery',
      name: 'Low Lush Floral Table Garlands (7ft long)',
      quantity: 16,
      unitCost: 110,
      completed: false,
      notes: 'Interspersed with micro tea-lights and votive candle glasses'
    },
    {
      id: 'item-5',
      category: 'Furniture & Seating',
      name: 'Luxury Event Seating (Chiavari / Cross-back Chairs)',
      quantity: 160,
      unitCost: 12,
      completed: true,
      notes: 'Coordinated cushions with velvet ribbon accents'
    },
    {
      id: 'item-6',
      category: 'Tableware & Linens',
      name: 'Floor-Length Velvet & Sateen Table Linens',
      quantity: 16,
      unitCost: 55,
      completed: false,
      notes: 'Complementing the primary event color palette'
    },
    {
      id: 'item-7',
      category: 'Tableware & Linens',
      name: 'Metallic Gold Rim Charger Plates & Cutlery Sets',
      quantity: 160,
      unitCost: 8,
      completed: true,
      notes: 'Polished gold finish with crystal wine goblets'
    },
    {
      id: 'item-8',
      category: 'Structural & Backdrops',
      name: 'Custom Acrylic Welcome Mirror & Floral Pedestal',
      quantity: 1,
      unitCost: 450,
      completed: false,
      notes: 'Personalized calligraphy lettering with hot-pink neon glow halo'
    }
  ];
}
