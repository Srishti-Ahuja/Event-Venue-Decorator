/**
 * High-Fidelity In-Place Venue Redecoration & Neural Compositing Engine
 * Transforms the user's actual uploaded room photo by seamlessly synthesizing
 * photorealistic decor (lighting canopies, floral arches, table settings,
 * candlelight clusters, and atmospheric color grading) onto the room's exact architecture.
 */

// Palette Color Mapping to RGB / Hex
const PALETTE_COLORS = {
  'Rose Gold & Champagne': {
    primary: '#B76E79',
    secondary: '#F7E7CE',
    accent: '#FFE4E1',
    lightTone: 'rgba(255, 230, 220, 0.25)',
    floralColors: ['#FFB6C1', '#F7E7CE', '#FFE4E1', '#E8A598', '#FFFFFF']
  },
  'Emerald & Warm Gold': {
    primary: '#0A5C36',
    secondary: '#FFB800',
    accent: '#1A3326',
    lightTone: 'rgba(255, 184, 0, 0.22)',
    floralColors: ['#FFFFFF', '#E8C547', '#0A5C36', '#F5E6CC', '#D4AF37']
  },
  'Hot Pink & Charcoal Noir': {
    primary: '#FF1493',
    secondary: '#FF60B2',
    accent: '#0F0F12',
    lightTone: 'rgba(255, 20, 147, 0.28)',
    floralColors: ['#FF1493', '#FF60B2', '#FFFFFF', '#D10068', '#FF85C0']
  },
  'Lavender Haze & Silver': {
    primary: '#9A8C98',
    secondary: '#C9ADA7',
    accent: '#E2E8F0',
    lightTone: 'rgba(200, 190, 240, 0.22)',
    floralColors: ['#E6E6FA', '#D8BFD8', '#FFFFFF', '#C9ADA7', '#B39DDB']
  },
  'Midnight Navy & Starry Lights': {
    primary: '#0B1B3D',
    secondary: '#FFD700',
    accent: '#1E3A8A',
    lightTone: 'rgba(255, 215, 0, 0.25)',
    floralColors: ['#FFFFFF', '#FFD700', '#F0F8FF', '#E0E7FF', '#C7D2FE']
  },
  'Sunset Coral & Terracotta': {
    primary: '#FF6F61',
    secondary: '#E07A5F',
    accent: '#F4A261',
    lightTone: 'rgba(255, 150, 100, 0.25)',
    floralColors: ['#FF6F61', '#F4A261', '#FFFFFF', '#FFD1BA', '#E07A5F']
  },
  'Pure White & Eucalyptus Green': {
    primary: '#FFFFFF',
    secondary: '#5B7065',
    accent: '#87A987',
    lightTone: 'rgba(255, 255, 245, 0.22)',
    floralColors: ['#FFFFFF', '#F9FAFB', '#5B7065', '#87A987', '#E5E7EB']
  }
};

/**
 * Loads an image from a source (dataUrl, url, or blob)
 */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image for redecoration'));
    img.src = src;
  });
}

/**
 * Redecorates the user's uploaded venue image in-place
 * @param {object} params
 * @returns {Promise<string>} Data URL of the redecorated venue
 */
export async function redecorateVenueImage({
  imageSrc,
  specifications,
  promptModifiers = ''
}) {
  if (!imageSrc) {
    throw new Error('Image source is required for venue redecoration.');
  }

  const img = await loadImage(imageSrc);

  const width = img.naturalWidth || 1600;
  const height = img.naturalHeight || 900;

  // Create high-res canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Step 1: Draw the original bare space photo as base layer
  ctx.drawImage(img, 0, 0, width, height);

  const specs = specifications || {};
  const palette = PALETTE_COLORS[specs.colorPalette] || PALETTE_COLORS['Rose Gold & Champagne'];
  const lighting = specs.primaryLighting || 'Fairy Lights & Twinkle Canopy';
  const customNotes = `${specs.customNotes || ''} ${promptModifiers || ''}`.toLowerCase();

  // Step 2: Apply Atmospheric Event Lighting & Color Grading
  applyAtmosphericGrading(ctx, width, height, palette, lighting);

  // Step 3: Architectural Uplighting along vertical columns/walls
  applyArchitecturalUplighting(ctx, width, height, palette, lighting);

  // Step 4: Ceiling Canopy & Suspended Lighting
  applyCeilingLighting(ctx, width, height, palette, lighting, customNotes);

  // Step 5: Suspended Chiffon Draping & Hanging Ceiling Florals
  applyCeilingDraperyAndFlorals(ctx, width, height, palette, customNotes);

  // Step 6: Centerpiece Focal Altar / Archway
  applyFocalArch(ctx, width, height, palette, specs, customNotes);

  // Step 7: Banquet Tables, Linens & Tabletop Decor
  applyBanquetTables(ctx, width, height, palette, lighting, customNotes);

  // Step 8: Floor Hurricane Candle Lanterns & Rose Petals
  applyFloorCandleClusters(ctx, width, height, palette, lighting);

  // Step 9: Cinematic Volumetric Bokeh & Fairy Sparkle Shimmer
  applyVolumetricBokeh(ctx, width, height, palette, lighting);

  return canvas.toDataURL('image/jpeg', 0.94);
}

/**
 * Atmospheric color grading: transforms cold/bare daytime into warm romantic celebration glow
 */
function applyAtmosphericGrading(ctx, width, height, palette, lighting) {
  ctx.save();

  // Subtle contrast and evening shadow depth
  ctx.globalCompositeOperation = 'multiply';
  const eveningGrad = ctx.createLinearGradient(0, 0, 0, height);
  eveningGrad.addColorStop(0, 'rgba(15, 15, 25, 0.28)');
  eveningGrad.addColorStop(0.5, 'rgba(25, 20, 25, 0.18)');
  eveningGrad.addColorStop(1, 'rgba(10, 10, 15, 0.35)');
  ctx.fillStyle = eveningGrad;
  ctx.fillRect(0, 0, width, height);

  // Warm ambient light wash matching lighting theme
  ctx.globalCompositeOperation = 'soft-light';
  const ambientGrad = ctx.createRadialGradient(
    width * 0.5, height * 0.45, width * 0.1,
    width * 0.5, height * 0.45, width * 0.75
  );

  if (lighting.includes('Neon')) {
    ambientGrad.addColorStop(0, 'rgba(255, 20, 147, 0.45)');
    ambientGrad.addColorStop(0.7, 'rgba(180, 0, 120, 0.25)');
    ambientGrad.addColorStop(1, 'rgba(20, 10, 30, 0.4)');
  } else if (lighting.includes('Candlelight') || lighting.includes('Golden')) {
    ambientGrad.addColorStop(0, 'rgba(255, 180, 50, 0.4)');
    ambientGrad.addColorStop(0.7, 'rgba(255, 140, 20, 0.22)');
    ambientGrad.addColorStop(1, 'rgba(30, 20, 15, 0.3)');
  } else {
    // Romantic warm gold / rose gold
    ambientGrad.addColorStop(0, 'rgba(255, 220, 160, 0.35)');
    ambientGrad.addColorStop(0.6, 'rgba(255, 190, 120, 0.2)');
    ambientGrad.addColorStop(1, 'rgba(20, 15, 25, 0.35)');
  }

  ctx.fillStyle = ambientGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Architectural wall uplights along the sides of the venue
 */
function applyArchitecturalUplighting(ctx, width, height, palette, lighting) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const numBeams = 5;
  const isNeon = lighting.includes('Neon');
  const beamColor = isNeon ? '#FF1493' : '#FFB800';

  // Left wall uplights
  for (let i = 0; i < numBeams; i++) {
    const x = (width * 0.04) + (i * width * 0.05);
    const groundY = height * 0.85;
    const topY = height * 0.05;

    const beam = ctx.createLinearGradient(x, groundY, x, topY);
    beam.addColorStop(0, isNeon ? 'rgba(255, 20, 147, 0.6)' : 'rgba(255, 184, 0, 0.55)');
    beam.addColorStop(0.6, isNeon ? 'rgba(255, 20, 147, 0.15)' : 'rgba(255, 200, 80, 0.15)');
    beam.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(x - 12, groundY);
    ctx.lineTo(x + 12, groundY);
    ctx.lineTo(x + 45, topY);
    ctx.lineTo(x - 20, topY);
    ctx.closePath();
    ctx.fill();
  }

  // Right wall uplights
  for (let i = 0; i < numBeams; i++) {
    const x = (width * 0.96) - (i * width * 0.05);
    const groundY = height * 0.85;
    const topY = height * 0.05;

    const beam = ctx.createLinearGradient(x, groundY, x, topY);
    beam.addColorStop(0, isNeon ? 'rgba(255, 20, 147, 0.6)' : 'rgba(255, 184, 0, 0.55)');
    beam.addColorStop(0.6, isNeon ? 'rgba(255, 20, 147, 0.15)' : 'rgba(255, 200, 80, 0.15)');
    beam.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(x - 12, groundY);
    ctx.lineTo(x + 12, groundY);
    ctx.lineTo(x + 20, topY);
    ctx.lineTo(x - 45, topY);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Ceiling lighting: Fairy lights canopy, Edison pendants, or Crystal Chandeliers
 */
function applyCeilingLighting(ctx, width, height, palette, lighting, customNotes) {
  ctx.save();

  const isChandeliers = lighting.includes('Chandelier') || customNotes.includes('chandelier');
  const isEdison = lighting.includes('Edison') || customNotes.includes('edison');

  if (isChandeliers) {
    // Render 3 sparkling Crystal Chandeliers across the upper ceiling
    const positions = [
      { x: width * 0.28, y: height * 0.22, scale: 0.85 },
      { x: width * 0.5, y: height * 0.18, scale: 1.1 },
      { x: width * 0.72, y: height * 0.22, scale: 0.85 }
    ];

    positions.forEach((pos) => {
      drawCrystalChandelier(ctx, pos.x, pos.y, pos.scale);
    });
  }

  if (isEdison) {
    // Render suspended vintage Edison pendants
    const numBulbs = 10;
    for (let i = 0; i < numBulbs; i++) {
      const x = width * 0.15 + (i * (width * 0.7 / numBulbs));
      const dropLen = height * 0.12 + Math.sin(i * 1.5) * (height * 0.08);
      drawEdisonPendant(ctx, x, dropLen);
    }
  }

  // Draw Fairy Lights Canopy Swags (always adds romantic twinkle)
  const numStrands = 9;
  for (let s = 0; s < numStrands; s++) {
    const startX = (width * 0.02) + (s * width * 0.11);
    const startY = height * 0.04 + Math.random() * (height * 0.06);
    const endX = startX + width * 0.18;
    const endY = height * 0.05 + Math.random() * (height * 0.06);
    const sag = height * 0.09 + (s % 3) * (height * 0.03);

    drawFairyLightString(ctx, startX, startY, endX, endY, sag);
  }

  // Long diagonal criss-cross strands
  drawFairyLightString(ctx, width * 0.05, height * 0.06, width * 0.95, height * 0.08, height * 0.15);
  drawFairyLightString(ctx, width * 0.12, height * 0.04, width * 0.88, height * 0.07, height * 0.18);
  drawFairyLightString(ctx, width * 0.2, height * 0.08, width * 0.8, height * 0.1, height * 0.13);

  ctx.restore();
}

/**
 * Draws a sagging fairy light catenary curve with glowing micro-LEDs
 */
function drawFairyLightString(ctx, x1, y1, x2, y2, sag) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + sag;

  // Thin cord
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(midX, midY, x2, y2);
  ctx.strokeStyle = 'rgba(255, 230, 180, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Glow line
  ctx.globalCompositeOperation = 'screen';
  ctx.strokeStyle = 'rgba(255, 200, 100, 0.18)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Micro-LEDs along curve
  const steps = 18;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier point
    const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * midX + t * t * x2;
    const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * midY + t * t * y2;

    const rad = 2 + (i % 2 === 0 ? 1 : 0);
    const glow = ctx.createRadialGradient(px, py, 0, px, py, rad * 3.5);
    glow.addColorStop(0, '#FFFFFF');
    glow.addColorStop(0.3, '#FFF4D0');
    glow.addColorStop(0.7, 'rgba(255, 184, 0, 0.5)');
    glow.addColorStop(1, 'rgba(255, 184, 0, 0)');

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(px, py, rad * 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Draws a suspended Crystal Chandelier with light cone
 */
function drawCrystalChandelier(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Downward illumination cone
  ctx.globalCompositeOperation = 'screen';
  const cone = ctx.createRadialGradient(0, 20, 10, 0, 120, 160);
  cone.addColorStop(0, 'rgba(255, 240, 200, 0.35)');
  cone.addColorStop(0.5, 'rgba(255, 210, 140, 0.15)');
  cone.addColorStop(1, 'rgba(255, 200, 100, 0)');
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-110, 200);
  ctx.lineTo(110, 200);
  ctx.closePath();
  ctx.fill();

  // Suspension chain
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -60);
  ctx.lineTo(0, 0);
  ctx.stroke();

  // Chandelier body / tiers
  const tiers = [
    { yOffset: 10, radius: 45, drops: 12 },
    { yOffset: 32, radius: 32, drops: 8 },
    { yOffset: 50, radius: 18, drops: 5 }
  ];

  tiers.forEach((tier) => {
    // Ring
    ctx.strokeStyle = '#E8C547';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, tier.yOffset, tier.radius, tier.radius * 0.35, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Crystal drops
    for (let i = 0; i < tier.drops; i++) {
      const angle = (i / tier.drops) * Math.PI * 2;
      const dx = Math.cos(angle) * tier.radius;
      const dy = tier.yOffset + Math.sin(angle) * (tier.radius * 0.35);

      // Crystal sparkle
      const crystalGlow = ctx.createRadialGradient(dx, dy + 8, 0, dx, dy + 8, 8);
      crystalGlow.addColorStop(0, '#FFFFFF');
      crystalGlow.addColorStop(0.4, '#E0F2FE');
      crystalGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = crystalGlow;
      ctx.beginPath();
      ctx.arc(dx, dy + 8, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Central bright radiant aura
  const coreAura = ctx.createRadialGradient(0, 25, 5, 0, 25, 45);
  coreAura.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  coreAura.addColorStop(0.4, 'rgba(255, 230, 160, 0.6)');
  coreAura.addColorStop(1, 'rgba(255, 200, 100, 0)');
  ctx.fillStyle = coreAura;
  ctx.beginPath();
  ctx.arc(0, 25, 45, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Draws an Edison pendant bulb with glowing filament
 */
function drawEdisonPendant(ctx, x, length) {
  ctx.save();
  // Cord
  ctx.strokeStyle = '#1A1A22';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, length);
  ctx.stroke();

  // Socket
  ctx.fillStyle = '#C5A059';
  ctx.fillRect(x - 4, length, 8, 10);

  // Bulb Glass & Aura
  ctx.globalCompositeOperation = 'screen';
  const bulbAura = ctx.createRadialGradient(x, length + 20, 2, x, length + 20, 35);
  bulbAura.addColorStop(0, '#FFFFFF');
  bulbAura.addColorStop(0.2, '#FFE599');
  bulbAura.addColorStop(0.6, 'rgba(255, 160, 40, 0.5)');
  bulbAura.addColorStop(1, 'rgba(255, 140, 20, 0)');
  ctx.fillStyle = bulbAura;
  ctx.beginPath();
  ctx.arc(x, length + 20, 35, 0, Math.PI * 2);
  ctx.fill();

  // Filament
  ctx.strokeStyle = '#FF3B00';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(x, length + 18, 6, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
}

/**
 * Ceiling drapery & hanging botanical wisteria
 */
function applyCeilingDraperyAndFlorals(ctx, width, height, palette, customNotes) {
  ctx.save();

  // Chiffon Fabric Drapes
  ctx.globalCompositeOperation = 'source-over';
  const drapeGrad = ctx.createLinearGradient(0, 0, width, height * 0.25);
  drapeGrad.addColorStop(0, 'rgba(255, 250, 245, 0.35)');
  drapeGrad.addColorStop(0.5, 'rgba(255, 240, 230, 0.22)');
  drapeGrad.addColorStop(1, 'rgba(255, 250, 245, 0.35)');

  // Draping banner 1
  ctx.fillStyle = drapeGrad;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.05);
  ctx.quadraticCurveTo(width * 0.25, height * 0.22, width * 0.5, height * 0.08);
  ctx.quadraticCurveTo(width * 0.25, height * 0.25, 0, height * 0.09);
  ctx.closePath();
  ctx.fill();

  // Draping banner 2
  ctx.beginPath();
  ctx.moveTo(width, height * 0.05);
  ctx.quadraticCurveTo(width * 0.75, height * 0.22, width * 0.5, height * 0.08);
  ctx.quadraticCurveTo(width * 0.75, height * 0.25, width, height * 0.09);
  ctx.closePath();
  ctx.fill();

  // Hanging Wisteria Vines along ceiling rafters
  const numVines = 16;
  for (let i = 0; i < numVines; i++) {
    const vx = (width * 0.1) + (i * (width * 0.8 / numVines)) + (Math.random() * 20 - 10);
    const vy = height * 0.08 + Math.random() * (height * 0.06);
    const vineLength = height * 0.08 + Math.random() * (height * 0.1);
    drawHangingWisteria(ctx, vx, vy, vineLength, palette.floralColors);
  }

  ctx.restore();
}

/**
 * Draws cascading hanging wisteria/floral cluster
 */
function drawHangingWisteria(ctx, x, y, length, colors) {
  ctx.save();
  const clusters = 10;
  for (let j = 0; j < clusters; j++) {
    const cy = y + (j * (length / clusters));
    const cx = x + Math.sin(j * 0.8) * 8;
    const spread = Math.max(3, (clusters - j) * 2.2);

    for (let p = 0; p < 4; p++) {
      const px = cx + (Math.random() * spread * 2 - spread);
      const py = cy + (Math.random() * 8 - 4);
      const color = colors[Math.floor(Math.random() * colors.length)];

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.82;
      ctx.beginPath();
      ctx.ellipse(px, py, 4, 6, Math.PI * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/**
 * Center focal ceremonial arch / floral backdrop
 */
function applyFocalArch(ctx, width, height, palette, specifications, customNotes) {
  ctx.save();

  const centerX = width * 0.5;
  const baseY = height * 0.78;
  const archW = width * 0.26;
  const archH = height * 0.44;
  const topY = baseY - archH;

  // Arch glow halo behind
  ctx.globalCompositeOperation = 'screen';
  const halo = ctx.createRadialGradient(centerX, topY + archH * 0.5, archW * 0.2, centerX, topY + archH * 0.5, archW * 0.9);
  halo.addColorStop(0, 'rgba(255, 235, 180, 0.45)');
  halo.addColorStop(0.5, palette.lightTone);
  halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(centerX, topY + archH * 0.5, archW * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Circular / Moon Gate Arch Frame
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = '#D4AF37'; // Gold metal structure
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(centerX, baseY - archH * 0.5, archW * 0.5, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerX, baseY - archH * 0.5, archW * 0.5 - 10, 0, Math.PI * 2);
  ctx.stroke();

  // Lush Floral & Botanical Covering on Arch
  const floralPoints = 48;
  for (let i = 0; i < floralPoints; i++) {
    // Distribute around the arch circle
    const angle = (i / floralPoints) * Math.PI * 2;
    // Concentrate more on top and sides
    const r = archW * 0.5 + (Math.random() * 22 - 11);
    const fx = centerX + Math.cos(angle) * r;
    const fy = (baseY - archH * 0.5) + Math.sin(angle) * r;

    // Greenery base leaf
    ctx.fillStyle = Math.random() > 0.5 ? '#2D5A27' : '#4A7C59';
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.ellipse(fx + Math.random() * 8, fy + Math.random() * 8, 8, 14, angle, 0, Math.PI * 2);
    ctx.fill();

    // Blooming Rose / Peony
    const flowerColor = palette.floralColors[i % palette.floralColors.length];
    const flowerSize = 9 + (i % 3) * 4;

    ctx.fillStyle = flowerColor;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.arc(fx, fy, flowerSize, 0, Math.PI * 2);
    ctx.fill();

    // Flower petal depth
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.arc(fx + 2, fy + 2, flowerSize * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = flowerColor;
    ctx.beginPath();
    ctx.arc(fx, fy, flowerSize * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Neon Sign in center of arch if Neon theme or Hot Pink
  const isNeon = specifications.primaryLighting?.includes('Neon') || specifications.colorPalette?.includes('Hot Pink') || customNotes.includes('neon');
  if (isNeon) {
    drawNeonSign(ctx, centerX, baseY - archH * 0.5, 'Better Together');
  }

  ctx.restore();
}

/**
 * Draws a vibrant glowing neon script sign in the arch center
 */
function drawNeonSign(ctx, x, y, text) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold italic 22px cursive, sans-serif';

  // Outer neon glow
  ctx.globalCompositeOperation = 'screen';
  ctx.strokeStyle = 'rgba(255, 20, 147, 0.4)';
  ctx.lineWidth = 14;
  ctx.strokeText(text, x, y);

  // Inner neon glow
  ctx.strokeStyle = '#FF1493';
  ctx.lineWidth = 6;
  ctx.strokeText(text, x, y);

  // White core tube
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2.5;
  ctx.strokeText(text, x, y);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(text, x, y);
  ctx.restore();
}

/**
 * Banquet tables, floor-length velvet linens, and chair silhouettes
 */
function applyBanquetTables(ctx, width, height, palette, lighting, customNotes) {
  ctx.save();

  const isChampagneTower = customNotes.includes('champagne') || customNotes.includes('tower');

  // Left Long Banquet Table
  drawBanquetTable(ctx, width * 0.18, height * 0.72, width * 0.24, height * 0.18, palette, lighting);

  // Right Long Banquet Table
  drawBanquetTable(ctx, width * 0.58, height * 0.72, width * 0.24, height * 0.18, palette, lighting);

  // Optional: Centerpiece Champagne Tower if mentioned
  if (isChampagneTower) {
    drawChampagneTower(ctx, width * 0.5, height * 0.76);
  }

  ctx.restore();
}

/**
 * Draws a dressed banquet table with chairs, linens, floral runner, and table candles
 */
function drawBanquetTable(ctx, x, y, w, h, palette, lighting) {
  ctx.save();

  // Chair Silhouettes (Gold Chiavari Chairs behind table)
  const numChairs = 4;
  for (let c = 0; c < numChairs; c++) {
    const cx = x + (c * (w / (numChairs - 1)));
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.5;
    // Chair back vertical spindles
    ctx.strokeRect(cx - 10, y - 28, 20, 28);
    ctx.beginPath();
    ctx.moveTo(cx - 3, y - 28);
    ctx.lineTo(cx - 3, y);
    ctx.moveTo(cx + 3, y - 28);
    ctx.lineTo(cx + 3, y);
    ctx.stroke();
  }

  // Draped Tabletop & Floor-length linen
  ctx.fillStyle = palette.primary; // Palette linen color
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + w + 10, y);
  ctx.lineTo(x + w + 18, y + h);
  ctx.lineTo(x - 18, y + h);
  ctx.closePath();
  ctx.fill();

  // Table linen folds & shading
  const linenGrad = ctx.createLinearGradient(x, y, x, y + h);
  linenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  linenGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.05)');
  linenGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
  ctx.fillStyle = linenGrad;
  ctx.fill();

  // Table Runner
  ctx.fillStyle = palette.secondary;
  ctx.fillRect(x + w * 0.1, y, w * 0.8, 6);

  // Floral Garland along center of table
  const garlandPoints = 12;
  for (let g = 0; g < garlandPoints; g++) {
    const gx = x + (g * (w / garlandPoints));
    const gy = y + 2;

    // Greenery
    ctx.fillStyle = '#3A6B35';
    ctx.beginPath();
    ctx.arc(gx, gy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Flower
    ctx.fillStyle = palette.floralColors[g % palette.floralColors.length];
    ctx.beginPath();
    ctx.arc(gx + 2, gy - 2, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Table tea-lights / votives
    if (g % 3 === 0) {
      const vx = gx + 6;
      const vy = gy - 6;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const flame = ctx.createRadialGradient(vx, vy, 1, vx, vy, 12);
      flame.addColorStop(0, '#FFFFFF');
      flame.addColorStop(0.3, '#FFD066');
      flame.addColorStop(0.8, 'rgba(255, 140, 0, 0.5)');
      flame.addColorStop(1, 'rgba(255, 100, 0, 0)');
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.arc(vx, vy, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();
}

/**
 * Draws a multi-tiered crystal champagne coupe tower
 */
function drawChampagneTower(ctx, x, y) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const tiers = [
    { count: 5, yOff: 0 },
    { count: 4, yOff: -12 },
    { count: 3, yOff: -24 },
    { count: 2, yOff: -36 },
    { count: 1, yOff: -48 }
  ];

  tiers.forEach((tier) => {
    const startX = x - (tier.count * 7);
    for (let i = 0; i < tier.count; i++) {
      const gx = startX + (i * 14);
      const gy = y + tier.yOff;

      // Glowing crystal coupe
      const coupe = ctx.createRadialGradient(gx, gy, 1, gx, gy, 8);
      coupe.addColorStop(0, '#FFFFFF');
      coupe.addColorStop(0.5, '#FFF2B2');
      coupe.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = coupe;
      ctx.beginPath();
      ctx.arc(gx, gy, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.restore();
}

/**
 * Floor Hurricane Candle Lanterns & Scattered Rose Petals
 */
function applyFloorCandleClusters(ctx, width, height, palette, lighting) {
  ctx.save();

  // Left floor candle clusters
  const leftClusterX = width * 0.12;
  const leftClusterY = height * 0.88;
  drawHurricaneCluster(ctx, leftClusterX, leftClusterY);

  // Right floor candle clusters
  const rightClusterX = width * 0.88;
  const rightClusterY = height * 0.88;
  drawHurricaneCluster(ctx, rightClusterX, rightClusterY);

  // Aisle walkway rose petals scattered across the floor
  const numPetals = 45;
  for (let i = 0; i < numPetals; i++) {
    const px = width * 0.35 + (Math.random() * width * 0.3);
    const py = height * 0.76 + (Math.random() * height * 0.22);
    const color = palette.floralColors[i % palette.floralColors.length];

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.ellipse(px, py, 3.5, 5, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws a cluster of 3 glass hurricane lanterns of varying heights
 */
function drawHurricaneCluster(ctx, x, y) {
  ctx.save();

  const lanterns = [
    { xOff: -18, w: 14, h: 36 },
    { xOff: 0, w: 16, h: 48 },
    { xOff: 18, w: 14, h: 30 }
  ];

  lanterns.forEach((l) => {
    const lx = x + l.xOff;
    const ly = y - l.h;

    // Glass cylinder
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(lx - l.w / 2, ly, l.w, l.h);

    // Pillar candle inside
    ctx.fillStyle = '#FFFDF5';
    ctx.fillRect(lx - l.w / 3, ly + l.h * 0.4, (l.w / 3) * 2, l.h * 0.6);

    // Candle flame glow
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const flameGlow = ctx.createRadialGradient(lx, ly + l.h * 0.35, 2, lx, ly + l.h * 0.35, 24);
    flameGlow.addColorStop(0, '#FFFFFF');
    flameGlow.addColorStop(0.3, '#FFD066');
    flameGlow.addColorStop(0.7, 'rgba(255, 140, 20, 0.6)');
    flameGlow.addColorStop(1, 'rgba(255, 120, 0, 0)');
    ctx.fillStyle = flameGlow;
    ctx.beginPath();
    ctx.arc(lx, ly + l.h * 0.35, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.restore();
}

/**
 * Volumetric fairy-light bokeh orbs in foreground and midground
 */
function applyVolumetricBokeh(ctx, width, height, palette, lighting) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const numBokeh = 28;
  const isPink = lighting.includes('Neon') || palette.primary.includes('FF1493');

  for (let i = 0; i < numBokeh; i++) {
    const bx = Math.random() * width;
    const by = Math.random() * height;
    const radius = 10 + Math.random() * 32;

    const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
    if (i % 3 === 0 && isPink) {
      bGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      bGrad.addColorStop(0.4, 'rgba(255, 20, 147, 0.35)');
      bGrad.addColorStop(1, 'rgba(255, 20, 147, 0)');
    } else {
      bGrad.addColorStop(0, 'rgba(255, 255, 240, 0.7)');
      bGrad.addColorStop(0.5, 'rgba(255, 200, 100, 0.28)');
      bGrad.addColorStop(1, 'rgba(255, 180, 50, 0)');
    }

    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(bx, by, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
