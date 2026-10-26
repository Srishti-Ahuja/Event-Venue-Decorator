/**
 * Curated Pre-populated Venue Templates
 * Includes high-resolution photographic pairs for Bare Venue (Original) vs AI Decorated Render (After),
 * default specification states, sample spatial layout notes, and initial vendor decor checklists.
 */

export const VENUE_TEMPLATES = [
  {
    id: 'rustic-barn',
    name: 'Rustic Barn',
    tagline: 'Vaulted timber rafters & warm wooden textures',
    category: 'Indoor Rustic',
    dimensions: '45ft x 80ft (3,600 sq ft) • Capacity: 220 guests',
    // Clean Unsplash photo of empty rustic wooden barn interior
    bareImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600&auto=format&fit=crop',
    // High-end decorated rustic barn wedding with fairy lights canopy & floral tables
    decoratedImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
    defaultSpecs: {
      celebrationType: 'Wedding Ceremony & Reception',
      aestheticStyle: 'Bohemian Romantic',
      colorPalette: 'Rose Gold & Warm Champagne',
      primaryLighting: 'Fairy Lights & Twinkle Canopy',
      customNotes: 'Cascading floral arch at the central timber beam, banquet tables with sheer cheesecloth runners, and glowing Edison bulb festoons suspended across the vaulted ceiling.',
    },
    spatialAnalysis: {
      roomType: 'Vaulted Timber Barn',
      ceilingHeight: '26 feet, exposed pine truss architecture',
      architecturalAnchors: ['Central timber posts', 'A-frame rafters', 'Double sliding barn doors'],
      lightingAnalysis: 'Subdued natural daylight from high clerestory windows; ideal for warm low-kelvin ambient illumination.',
      surfaceMaterials: 'Reclaimed weathered pine flooring, rough-hewn cedar walls, matte black iron hardware'
    },
    checklist: [
      { id: 'rb-1', category: 'Lighting & Ambiance', name: 'Canopy Fairy Light Webbing (300m warm white)', quantity: 1, unitCost: 850, completed: true, notes: 'Draped diagonally between main rafters' },
      { id: 'rb-2', category: 'Lighting & Ambiance', name: 'Vintage Edison Filament Pendants (Cluster of 12)', quantity: 4, unitCost: 180, completed: false, notes: 'Over head table and dessert bar' },
      { id: 'rb-3', category: 'Florals & Greenery', name: 'Boho Floral Birch Altar Arch (Eucalyptus & Blush Roses)', quantity: 1, unitCost: 1200, completed: true, notes: 'Focal point at back timber wall' },
      { id: 'rb-4', category: 'Florals & Greenery', name: 'Cascading Table Garland Runners (Ruscus & Peonies)', quantity: 14, unitCost: 95, completed: false, notes: '7ft per farmhouse table' },
      { id: 'rb-5', category: 'Furniture & Seating', name: 'Reclaimed Solid Elm Farmhouse Tables', quantity: 14, unitCost: 120, completed: true, notes: 'Seats 8-10 guests each' },
      { id: 'rb-6', category: 'Furniture & Seating', name: 'Oak Cross-Back Chairs with Ivory Linen Cushions', quantity: 140, unitCost: 9, completed: false, notes: 'Natural walnut finish' },
      { id: 'rb-7', category: 'Tableware & Linens', name: 'Dusty Rose Gauze Table Runners (12ft)', quantity: 14, unitCost: 28, completed: true, notes: 'Puddled ends on timber floor' },
      { id: 'rb-8', category: 'Structural & Backdrops', name: 'Welcome Entry Whiskey Barrel & Neon Sign Display', quantity: 1, unitCost: 350, completed: false, notes: 'Custom script neon on rustic hedge wall' }
    ]
  },
  {
    id: 'grand-ballroom',
    name: 'Grand Ballroom',
    tagline: 'Palatial elegance with marble floors & high arches',
    category: 'Indoor Luxury',
    dimensions: '70ft x 110ft (7,700 sq ft) • Capacity: 450 guests',
    // Clean high-ceiling ballroom interior
    bareImage: 'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?q=80&w=1600&auto=format&fit=crop',
    // Opulent decorated ballroom with crystal chandeliers, emerald & gold tables
    decoratedImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1600&auto=format&fit=crop',
    defaultSpecs: {
      celebrationType: 'Luxury Gala & Charity Ball',
      aestheticStyle: 'Luxury Glamour',
      colorPalette: 'Emerald & Warm Gold',
      primaryLighting: 'Crystal Chandeliers & Perimeter Uplighting',
      customNotes: 'Towering crystal floral candelabras, heavy emerald velvet perimeter drapery with warm gold tassels, and seamless gloss white monogram dance floor.',
    },
    spatialAnalysis: {
      roomType: 'Classical Neoclassical Ballroom',
      ceilingHeight: '32 feet with ornate gold-leaf coffered insets',
      architecturalAnchors: ['Fluted Corinthian columns', 'Symmetrical wall sconces', 'Parquet marble inlays'],
      lightingAnalysis: 'High reflective ceiling indices with existing chandelier mounting winches; excellent acoustic & lighting rigging points.',
      surfaceMaterials: 'Carrara white marble flooring, cream plaster molding with gilt leaf accents'
    },
    checklist: [
      { id: 'gb-1', category: 'Lighting & Ambiance', name: 'Motorized Crystal Chandelier Drop Rigs', quantity: 6, unitCost: 650, completed: true, notes: 'Tiered 8-arm crystal fixtures' },
      { id: 'gb-2', category: 'Lighting & Ambiance', name: 'DMX Wireless LED Uplights (Emerald Amber Wash)', quantity: 32, unitCost: 45, completed: true, notes: 'Cast against columns and wall drapery' },
      { id: 'gb-3', category: 'Florals & Greenery', name: 'Elevated High-Trumpet Candelabra Centerpieces', quantity: 24, unitCost: 260, completed: false, notes: 'White hydrangeas, gold-sprayed monstera, white orchids' },
      { id: 'gb-4', category: 'Florals & Greenery', name: 'Grand Entrance Dual Floral Urn Pedestals', quantity: 2, unitCost: 750, completed: true, notes: 'Flanking the primary double archway' },
      { id: 'gb-5', category: 'Furniture & Seating', name: 'Polished Gold Stainless Chiavari Chairs', quantity: 280, unitCost: 14, completed: false, notes: 'Emerald velvet seat pads' },
      { id: 'gb-6', category: 'Tableware & Linens', name: 'Heavy Emerald Green Velvet Round Tablecloths (132")', quantity: 28, unitCost: 65, completed: false, notes: 'Floor-length draping' },
      { id: 'gb-7', category: 'Tableware & Linens', name: '24k Gold Beaded Glass Charger Plates', quantity: 280, unitCost: 6, completed: true, notes: 'Fine bone china setting' },
      { id: 'gb-8', category: 'Structural & Backdrops', name: 'Gloss White Seamless Monogram Dance Floor (24ft x 24ft)', quantity: 1, unitCost: 1800, completed: false, notes: 'Metallic gold foil central crest' }
    ]
  },
  {
    id: 'open-lawn',
    name: 'Open Lawn',
    tagline: 'Manicured estate grounds under open twilight skies',
    category: 'Outdoor Garden',
    dimensions: '120ft x 150ft (18,000 sq ft) • Capacity: 350 guests',
    // Clean expansive lawn estate with trees
    bareImage: 'https://images.unsplash.com/photo-1587582423116-ec07293f0395?q=80&w=1600&auto=format&fit=crop',
    // Garden wedding reception illuminated with festoon canopy & floral tables
    decoratedImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600&auto=format&fit=crop',
    defaultSpecs: {
      celebrationType: 'Sunset Garden Wedding & Cocktail Soirée',
      aestheticStyle: 'Enchanted Forest & Whimsical',
      colorPalette: 'Pure White & Eucalyptus Green',
      primaryLighting: 'Warm Candlelight & Suspended Festoons',
      customNotes: 'Clear-top canopy with suspended botanical hoops, perimeter tree uplighting in champagne gold, and a curved lounge vignette with rattan furniture.',
    },
    spatialAnalysis: {
      roomType: 'Open Garden Estate Lawn',
      ceilingHeight: 'Infinite outdoor canopy framed by 40ft perimeter cypress trees',
      architecturalAnchors: ['Stone fountain perimeter', 'Mature olive trees', 'Central level grass lawn'],
      lightingAnalysis: 'Transition from bright outdoor golden hour to deep indigo twilight; requires layered vertical and ground lighting.',
      surfaceMaterials: 'Bermuda turf lawn, flagstone garden pathways, raw stone terrace borders'
    },
    checklist: [
      { id: 'ol-1', category: 'Structural & Backdrops', name: 'Clear-Top Architectural Marquee (40ft x 80ft)', quantity: 1, unitCost: 4200, completed: true, notes: 'Transparent ceiling to view twilight sky and stars' },
      { id: 'ol-2', category: 'Lighting & Ambiance', name: 'Suspended Festoon Bistro Light Grid', quantity: 1, unitCost: 1100, completed: false, notes: 'Warm filament bulbs on black guide wires' },
      { id: 'ol-3', category: 'Lighting & Ambiance', name: 'Tree Trunk Micro-Fairy Light Spiral Wraps', quantity: 12, unitCost: 95, completed: true, notes: 'Surrounding the perimeter garden lawn' },
      { id: 'ol-4', category: 'Lighting & Ambiance', name: 'Glass Hurricane Pillar Candle Lanterns', quantity: 60, unitCost: 18, completed: false, notes: 'Lining the stone path and perimeter' },
      { id: 'ol-5', category: 'Florals & Greenery', name: 'Suspended 5ft Foliage & Delphinium Hoops', quantity: 6, unitCost: 480, completed: false, notes: 'Floating from marquee ceiling trusses' },
      { id: 'ol-6', category: 'Florals & Greenery', name: 'Organic Asymmetrical Floral Ground Meadow', quantity: 1, unitCost: 1350, completed: true, notes: 'Low sprawling floral curve for ceremony staging' },
      { id: 'ol-7', category: 'Furniture & Seating', name: 'Natural Cane Rattan Cocktail Lounge Sets', quantity: 4, unitCost: 380, completed: false, notes: 'Including low coffee tables and linen accent pillows' },
      { id: 'ol-8', category: 'Tableware & Linens', name: 'Raw Natural Flax Linen Runners & Stoneware', quantity: 18, unitCost: 42, completed: true, notes: 'Earthy organic texture' }
    ]
  }
];

export const CELEBRATION_TYPES = [
  'Wedding Ceremony & Reception',
  'Luxury Gala & Charity Ball',
  'Milestone Birthday Celebration',
  'Romantic Anniversary Soirée',
  'Corporate Summit & Product Launch',
  'Cocktail & Networking Reception',
  'Whimsical Baby Shower'
];

export const AESTHETIC_STYLES = [
  { id: 'boho', label: 'Bohemian Romantic', desc: 'Organic florals, pampas, warm timber, earthy softness' },
  { id: 'minimalist', label: 'Modern Minimalist', desc: 'Clean architectural lines, monochromatic, sculptural stems' },
  { id: 'luxury', label: 'Luxury Glamour', desc: 'Crystal chandeliers, metallic golds, rich velvets & mirror finishes' },
  { id: 'enchanted', label: 'Enchanted Forest', desc: 'Lush wild moss, cascading greenery, twinkling fairy light canopies' },
  { id: 'cyberpunk', label: 'Neon Glam / Cyberpunk', desc: 'Vibrant hot pink neon tubes, dark contrast, futuristic acrylics' },
  { id: 'vintage', label: 'Vintage French Chateau', desc: 'Ornate antique candelabras, antique blush tones, ornate gilt' },
  { id: 'tropical', label: 'Tropical Elegance', desc: 'Monstera, king proteas, woven rattan, golden sunset warmth' }
];

export const COLOR_PALETTES = [
  {
    name: 'Rose Gold & Champagne',
    swatches: ['#B76E79', '#F7E7CE', '#FFE4E1', '#D4AF37'],
    tag: 'Romantic'
  },
  {
    name: 'Emerald & Warm Gold',
    swatches: ['#0A5C36', '#FFB800', '#1A3326', '#E8C547'],
    tag: 'Opulent'
  },
  {
    name: 'Hot Pink & Charcoal Noir',
    swatches: ['#FF1493', '#0F0F12', '#FF60B2', '#2A2A38'],
    tag: 'Vibrant Signature'
  },
  {
    name: 'Lavender Haze & Silver',
    swatches: ['#9A8C98', '#C9ADA7', '#E2E8F0', '#4A4E69'],
    tag: 'Ethereal'
  },
  {
    name: 'Midnight Navy & Starry Lights',
    swatches: ['#0B1B3D', '#FFD700', '#1E3A8A', '#FFF8DC'],
    tag: 'Celestial'
  },
  {
    name: 'Sunset Coral & Terracotta',
    swatches: ['#FF6F61', '#E07A5F', '#F4A261', '#FBF1E6'],
    tag: 'Warm Festive'
  },
  {
    name: 'Pure White & Eucalyptus Green',
    swatches: ['#FFFFFF', '#5B7065', '#E5E7EB', '#87A987'],
    tag: 'Timeless'
  }
];

export const LIGHTING_OPTIONS = [
  { id: 'fairy', label: 'Fairy Lights & Twinkle Canopy', icon: 'Sparkles', desc: 'Warm 2400K micro-LED strands suspended overhead' },
  { id: 'chandeliers', label: 'Crystal Chandeliers & Sconces', icon: 'Crown', desc: 'Multi-tiered sparkling crystal glass chandeliers' },
  { id: 'candlelight', label: 'Warm Candlelight & Lanterns', icon: 'Flame', desc: 'Clustered hurricane pillar candles & votives' },
  { id: 'neon', label: 'Hot Pink Neon & Dynamic Uplighting', icon: 'Zap', desc: 'Architectural wall washes and vibrant neon accents' },
  { id: 'edison', label: 'Edison Bulbs & Industrial Festoons', icon: 'Lightbulb', desc: 'Exposed filament amber vintage pendants' },
  { id: 'goldenhour', label: 'Ambient Golden Hour & Sunset Wash', icon: 'Sun', desc: 'Warm natural directional rays with soft diffusion' }
];

export const QUICK_MODIFIERS = [
  { text: 'Add cascading hanging wisteria florals from ceiling', tag: 'Florals' },
  { text: 'Switch to flickering candlelight & brass lanterns', tag: 'Lighting' },
  { text: 'Drape sheer ivory chiffon canopies across beams', tag: 'Drapery' },
  { text: 'Install dense fairy light curtain on the back wall', tag: 'Fairy Lights' },
  { text: 'Add a multi-tier crystal champagne tower', tag: 'Feature' },
  { text: 'Upgrade to polished gold chiavari chairs with cushions', tag: 'Furniture' },
  { text: 'Scatter fresh blush rose petals across the walkway', tag: 'Details' },
  { text: 'Add vibrant hot pink neon script sign on greenery backdrop', tag: 'Modern Accent' }
];
