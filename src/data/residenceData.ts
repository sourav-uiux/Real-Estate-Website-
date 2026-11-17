export interface JourneyChapter {
  id: string;
  index: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  elevation: string;
  focusMaterial: string;
}

export interface InteriorSpace {
  id: string;
  name: string;
  level: string;
  area: string;
  orientation: string;
  concept: string;
  materials: string[];
  architecturalNote: string;
  image: string;
  imageAlt: string;
}

export interface MaterialStudy {
  id: string;
  name: string;
  origin: string;
  finish: string;
  note: string;
  swatchHex: string;
}

export interface PropertySpec {
  id: string;
  value: string;
  unit?: string;
  label: string;
  detail: string;
}

export interface LifestyleItem {
  id: string;
  title: string;
  caption: string;
  description: string;
  metrics: string;
  image: string;
  imageAlt: string;
}

export interface LocationPin {
  id: string;
  name: string;
  category: string;
  travelTime: string;
  distance: string;
  description: string;
  x: number;
  y: number;
  isEstate?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Architecture' | 'Interiors' | 'Details';
  caption: string;
  aspect: 'wide' | 'portrait' | 'square';
  image: string;
  imageAlt: string;
}

export const IMAGES = {
  heroAerial: '/src/assets/images/villa_hero_aerial_1794894770347.jpg',
  exteriorArrival: '/src/assets/images/villa_exterior_arrival_1794894770675.jpg',
  interiorLiving: '/src/assets/images/villa_interior_living_1794894772275.jpg',
  interiorSuite: '/src/assets/images/villa_interior_suite_1794894771650.jpg',
  detailStonePool: '/src/assets/images/villa_detail_stone_pool_1794894772624.jpg',
} as const;

export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    id: 'setting',
    index: '01',
    label: 'The Setting',
    title: 'Carved into the Cap Ferrat promontory',
    subtitle: '4,800 m² terraced coastal headland above the Mediterranean',
    description:
      'Anchored onto ancient limestone ledges forty-two meters above sea level, the estate follows the natural contour of the peninsula through terraced olive groves and columnar cypress.',
    elevation: '+42m Above Sea Level',
    focusMaterial: 'Coastal Limestone Bluff',
  },
  {
    id: 'arrival',
    index: '02',
    label: 'Architectural Arrival',
    title: 'Cantilevered stone planes and reflecting water',
    subtitle: 'Quiet horizontal geometry framed by cedar soffits',
    description:
      'Approaching along the limestone motor court, twin travertine shear walls guide the eye across a still basalt water basin toward the six-meter patinated bronze pivot threshold.',
    elevation: 'North Courtyard · Level 0',
    focusMaterial: 'Honed Roman Travertine',
  },
  {
    id: 'threshold',
    index: '03',
    label: 'Entering the Residence',
    title: 'Dissolving the boundary between stone and horizon',
    subtitle: 'Floor-to-ceiling structural glazing with zero-threshold tracks',
    description:
      'Beyond the bronze portal, the spatial compression opens immediately into a double-height gallery where recessed sliding glass disappears into travertine pockets.',
    elevation: 'Main Gallery · +3.8m Clear',
    focusMaterial: 'Patinated Bronze & Glass',
  },
  {
    id: 'interior',
    index: '04',
    label: 'Interior Discovery',
    title: 'Light orchestrated across timber, linen, and stone',
    subtitle: 'Seven interconnected living pavilions oriented south-west',
    description:
      'Acoustic smoked-cedar ceiling slats warm the expanse of honed limestone floors while framing uninterrupted views from Beaulieu Bay to the Esterel massif.',
    elevation: 'Living & Dining Pavilion',
    focusMaterial: 'Smoked European Cedar',
  },
  {
    id: 'details',
    index: '05',
    label: 'Signature Details',
    title: 'Tactile permanence at every architectural joint',
    subtitle: 'Fluted masonry, recessed step luminance, and cantilevered water',
    description:
      'Every shadow gap, mitered travertine corner, and hand-waxed bronze balustrade is detailed to weather gracefully with the coastal salt air.',
    elevation: 'Infinity Edge & Terrace',
    focusMaterial: 'Fluted Travertine & Bronze',
  },
];

export const INTERIOR_SPACES: InteriorSpace[] = [
  {
    id: 'living',
    name: 'Grand Living Pavilion',
    level: 'Main Garden Level',
    area: '185 m²',
    orientation: 'South-West Sea Panorama',
    concept:
      'A double-height sanctuary anchored by a monolithic carved travertine hearth and acoustic cedar-slat ceiling.',
    materials: ['Honed Roman Travertine', 'Smoked Oak', 'Belgian Bouclé Linen'],
    architecturalNote:
      '14-meter motorized Vitrocsa glass elevation pockets completely into the limestone core.',
    image: IMAGES.interiorLiving,
    imageAlt: 'Grand minimalist luxury living room opening onto a Mediterranean sea terrace',
  },
  {
    id: 'dining',
    name: 'Sea-View Dining Gallery',
    level: 'Main Garden Level',
    area: '74 m²',
    orientation: 'West Sunset Axis',
    concept:
      'Positioned along the west glass loggia for evening light, centered around a twelve-seat sculpted limestone table.',
    materials: ['Sandblasted Limestone', 'Brushed Bronze Chandelier', 'Saddle Leather'],
    architecturalNote:
      'Concealed pocket screens separate the formal dining gallery from the catering back-of-house.',
    image: IMAGES.interiorLiving,
    imageAlt: 'Minimalist architectural dining and living gallery with coastal horizon views',
  },
  {
    id: 'kitchen',
    name: 'Sculptural Atelier Kitchen',
    level: 'Main Garden Level',
    area: '62 m²',
    orientation: 'Courtyard & Sea Cross-Breeze',
    concept:
      'A monolithic Pietra Grey marble island paired with fluted walnut cabinetry and integrated Gaggenau 400 series instruments.',
    materials: ['Pietra Grey Stone', 'Fluted American Walnut', 'Burnished Brass'],
    architecturalNote:
      'Adjoining scullery and climate-controlled 900-bottle wine vault hidden behind flush timber panels.',
    image: IMAGES.exteriorArrival,
    imageAlt: 'Architectural stone and warm timber craftsmanship in the main residence pavilion',
  },
  {
    id: 'master',
    name: 'Principal Owner Suite',
    level: 'Upper Sky Wing',
    area: '138 m²',
    orientation: '270° Peninsula Exposure',
    concept:
      'Occupying the entire cantilevered upper wing with private terrace, dual dressing rooms, and unobstructed horizon sightlines.',
    materials: ['Wide-Plank French Oak', 'Hand-Troweled Lime Plaster', 'Raw Silk Drapery'],
    architecturalNote:
      'Deep 2.4-meter cedar overhang shades summer noon glare while welcoming low winter sun.',
    image: IMAGES.interiorSuite,
    imageAlt: 'Serene minimalist master suite with smoked oak joinery and Mediterranean sea view',
  },
  {
    id: 'bath',
    name: 'Limestone Spa Bath',
    level: 'Upper Sky Wing',
    area: '48 m²',
    orientation: 'East Morning Light',
    concept:
      'Carved from a single block of warm travertine, the soaking vessel sits beside frameless glazing hovering above the pine canopy.',
    materials: ['Monolithic Travertine', 'Unlacquered Brass', 'Teak Duckboard'],
    architecturalNote:
      'Includes private cedar sauna, rain steam chamber, and concealed skylight wash.',
    image: IMAGES.interiorSuite,
    imageAlt: 'Carved limestone soaking tub in a minimalist luxury spa bathroom overlooking the sea',
  },
  {
    id: 'terrace',
    name: 'Private Sky Terrace',
    level: 'Upper Sky Wing',
    area: '110 m²',
    orientation: 'South Horizon',
    concept:
      'Flush structural glass balustrades preserve an uninterrupted visual plane between the interior oak floor and the sea.',
    materials: ['Bush-Hammered Limestone', 'Low-Iron Laminated Glass', 'Teak Loungers'],
    architecturalNote:
      'Integrated wind-baffle glazing allows year-round evening contemplation above the bay.',
    image: IMAGES.heroAerial,
    imageAlt: 'Cantilevered travertine upper sky terrace overlooking the Côte d Azur coastline',
  },
  {
    id: 'outdoor',
    name: 'Cliffside Outdoor Pavilion',
    level: 'Pool & Garden Level',
    area: '240 m²',
    orientation: 'Full Mediterranean Exposure',
    concept:
      'An open-air living room shaded by cantilevered stone eaves beside the 28-meter saltwater infinity pool.',
    materials: ['Fluted Travertine', 'Weathered Cedar', 'Architectural Bronze'],
    architecturalNote:
      'Equipped with sunken fire lounge, outdoor stone kitchen, and recessed step lighting.',
    image: IMAGES.detailStonePool,
    imageAlt: 'Cantilevered travertine infinity pool and outdoor architectural terrace at sunset',
  },
];

export const MATERIAL_STUDIES: MaterialStudy[] = [
  {
    id: 'travertine',
    name: 'Honed Roman Travertine',
    origin: 'Tivoli Quarries · Vein-Cut',
    finish: 'Matte Open-Pore & Fluted',
    note: 'Dry-stacked exterior monoliths transition seamlessly into radiant-heated interior slabs.',
    swatchHex: '#D8CEBE',
  },
  {
    id: 'bronze',
    name: 'Patinated Architectural Bronze',
    origin: 'Custom Swiss Extrusions',
    finish: 'Hand-Waxed Dark Umber',
    note: 'Used across window mullions, pivot portals, and recessed terrace luminaire housings.',
    swatchHex: '#5C4D3C',
  },
  {
    id: 'cedar',
    name: 'Smoked European Cedar',
    origin: 'Kiln-Treated Acoustic Slats',
    finish: 'Natural Matte Oil',
    note: 'Warm soffits extend continuously from exterior overhangs across interior ceilings.',
    swatchHex: '#8C6A4A',
  },
  {
    id: 'glazing',
    name: 'Low-Iron Structural Glazing',
    origin: 'Triple-Laminated Solar Glass',
    finish: 'Frameless Recessed Tracks',
    note: 'Zero color cast ensures the true cerulean palette of the Mediterranean remains unaltered.',
    swatchHex: '#B7C4C7',
  },
];

export const PROPERTY_SPECS: PropertySpec[] = [
  {
    id: 'living-area',
    value: '1,420',
    unit: 'm²',
    label: 'Total Living Area',
    detail: 'Across three stepped limestone levels connected by stone stair & glass lift',
  },
  {
    id: 'estate-parcel',
    value: '4,800',
    unit: 'm²',
    label: 'Coastal Estate Grounds',
    detail: 'Gated peninsula parcel with 68m of coastal frontage and private path',
  },
  {
    id: 'suites',
    value: '06',
    label: 'En-Suite Bedrooms',
    detail: 'Principal upper sky wing, four garden guest suites, and staff quarters',
  },
  {
    id: 'baths',
    value: '08',
    label: 'Stone Bathrooms',
    detail: 'Monolithic carved travertine basins, steam hammam, and outdoor rain showers',
  },
  {
    id: 'pavilions',
    value: '03',
    label: 'Living Pavilions',
    detail: 'Grand double-height salon, sunset dining gallery, and private study',
  },
  {
    id: 'status',
    value: '2026',
    label: 'Private Release',
    detail: 'Saint-Jean-Cap-Ferrat · Côte d’Azur · Offered by Private Dossier',
  },
];

export const LIFESTYLE_ITEMS: LifestyleItem[] = [
  {
    id: 'infinity-pool',
    title: '28-Meter Infinity Horizon Pool',
    caption: 'Saltwater Architecture · Heated Year-Round',
    description:
      'Cantilevered four meters beyond the lower cliff terrace, the travertine-lined pool creates an unbroken water mirror merging directly into the Mediterranean.',
    metrics: '28m × 5.5m · Zero-Edge Overflow · Integrated Hydro-Spa',
    image: IMAGES.detailStonePool,
    imageAlt: 'Cantilevered travertine infinity pool overlooking the Mediterranean horizon',
  },
  {
    id: 'gardens',
    title: 'Terraced Olive & Cypress Grounds',
    caption: 'Botanical Privacy · Dry-Stone Landscaping',
    description:
      'Centuries-old silver olive trees, maritime pines, wild rosemary, and columnar cypresses insulate the residence in fragrance and complete acoustic seclusion.',
    metrics: '4,800 m² Landscaped Grounds · Automated Subsurface Irrigation',
    image: IMAGES.exteriorArrival,
    imageAlt: 'Manicured Mediterranean olive and cypress courtyard gardens with limestone walls',
  },
  {
    id: 'wellness',
    title: 'Subterranean Wellness & Spa Sanctuary',
    caption: 'Carved Stone Vitality · Natural Skylight',
    description:
      'Descending beneath the pool court lies an acoustic wellness level featuring a 12-meter indoor vitality pool, Finnish cedar sauna, marble hammam, and Technogym studio.',
    metrics: '210 m² Wellness Wing · Private Massage & Cryo Suite',
    image: IMAGES.interiorSuite,
    imageAlt: 'Minimalist limestone wellness bath and calm morning coastal light',
  },
  {
    id: 'entertaining',
    title: 'Alfresco Loggia & 900-Bottle Cellar',
    caption: 'Mediterranean Entertaining · Sunset Orientation',
    description:
      'Host intimate evenings around the sunken limestone fire court or dine beneath recessed cedar eaves while yacht lights shimmer across Villefranche Bay.',
    metrics: '16-Seat Covered Terrace · Sommelier Tasting Vault',
    image: IMAGES.heroAerial,
    imageAlt: 'Cliffside luxury villa outdoor entertaining terrace and sunset horizon',
  },
];

export const LOCATION_PINS: LocationPin[] = [
  {
    id: 'villa-verone',
    name: 'Villa Vérone',
    category: 'Private Coastal Estate',
    travelTime: 'Origin',
    distance: 'Chemin de la Pointe',
    description: 'Secluded south-west promontory overlooking Villefranche Bay and the open sea.',
    x: 47,
    y: 56,
    isEstate: true,
  },
  {
    id: 'paloma-cove',
    name: 'Paloma Beach & Cove',
    category: 'Coastal Sanctuary',
    travelTime: '4 min',
    distance: '1.4 km',
    description: 'Sheltered turquoise cove and pine-shaded coastal footpath along Pointe Saint-Hospice.',
    x: 68,
    y: 62,
  },
  {
    id: 'beaulieu-marina',
    name: 'Beaulieu-sur-Mer Marina',
    category: 'Superyacht Berth',
    travelTime: '6 min',
    distance: '2.8 km',
    description: 'Deep-water harbor with private yacht mooring and waterfront dining.',
    x: 64,
    y: 30,
  },
  {
    id: 'villefranche-bay',
    name: 'Villefranche-sur-Mer',
    category: 'Historic Harbour',
    travelTime: '8 min',
    distance: '3.6 km',
    description: 'Amphitheater bay famed for calm anchorage and 16th-century citadel architecture.',
    x: 24,
    y: 38,
  },
  {
    id: 'monaco',
    name: 'Principality of Monaco',
    category: 'Heliport & Port Hercule',
    travelTime: '22 min',
    distance: '12.5 km',
    description: 'Direct coastal corniche access or 7-minute private helicopter transfer.',
    x: 84,
    y: 16,
  },
  {
    id: 'nice-airport',
    name: 'Nice Côte d’Azur Private Terminal',
    category: 'International Aviation',
    travelTime: '25 min',
    distance: '14.2 km',
    description: 'Dedicated private aviation terminal with coastal promenade arrival.',
    x: 12,
    y: 70,
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'South-West Cliffside Elevation',
    category: 'Architecture',
    caption: 'Cantilevered travertine volumes suspended above the Cap Ferrat coastline.',
    aspect: 'wide',
    image: IMAGES.heroAerial,
    imageAlt: 'Wide golden-hour photograph of Villa Vérone cantilevered over the Mediterranean cliffside',
  },
  {
    id: 'gal-2',
    title: 'Grand Living Pavilion & Hearth',
    category: 'Interiors',
    caption: 'Fourteen meters of pocketed glazing dissolve the boundary to the sea terrace.',
    aspect: 'wide',
    image: IMAGES.interiorLiving,
    imageAlt: 'Expansive living room with travertine fireplace and Mediterranean sea panorama',
  },
  {
    id: 'gal-3',
    title: 'Water Court & Bronze Portal',
    category: 'Architecture',
    caption: 'Stepping limestone slabs cross the basalt reflecting basin at arrival.',
    aspect: 'square',
    image: IMAGES.exteriorArrival,
    imageAlt: 'Minimalist travertine and dark bronze entrance courtyard with reflecting pool',
  },
  {
    id: 'gal-4',
    title: 'Owner Suite & Carved Bath',
    category: 'Interiors',
    caption: 'Monolithic travertine soaking vessel aligned with the eastern horizon.',
    aspect: 'portrait',
    image: IMAGES.interiorSuite,
    imageAlt: 'Master suite and monolithic limestone soaking bath facing the sea',
  },
  {
    id: 'gal-5',
    title: 'Fluted Masonry & Infinity Edge',
    category: 'Details',
    caption: 'Recessed bronze step illumination against hand-fluted Roman travertine.',
    aspect: 'portrait',
    image: IMAGES.detailStonePool,
    imageAlt: 'Close-up architectural study of cantilevered pool edge, fluted stone, and bronze rail',
  },
];
