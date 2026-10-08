/* ==============================================================================
 * FILE: spot-groups.js
 * CATEGORY: MarlonWalksLA Website - Parts of Town & Moods (map filter groups)
 *
 * Locations are the real place names in spots.geojson (the "City" field).
 * Regions only help people find a location faster: tap a region, then its
 * locations appear. Add a new location by adding it to a region's list.
 * Moods group the 70+ tags. The map filters, quiz and links all read from here.
 * ============================================================================== */

window.MARLON_GROUPS = {
  /* Regions (navigation only). Order = order shown. */
  areas: [
    { id: 'downtown', en: 'Downtown', es: 'Centro',
      cities: ['DTLA', 'Arts District', 'Chinatown', 'Little Tokyo', 'Lincoln Heights'] },
    { id: 'hollywood', en: 'Hollywood', es: 'Hollywood',
      cities: ['Hollywood', 'West Hollywood', 'East Hollywood'] },
    { id: 'eastside', en: 'Eastside', es: 'Eastside',
      cities: ['Echo Park', 'Silver Lake', 'Los Feliz', 'Highland Park'] },
    { id: 'midcity', en: 'Mid-City & Beverly Hills', es: 'Mid-City y Beverly Hills',
      cities: ['Koreatown', 'Mid-City', 'Miracle Mile', 'Fairfax', 'Beverly Hills', 'Century City'] },
    { id: 'westside', en: 'Westside & Malibu', es: 'Westside y Malibu',
      cities: ['Santa Monica', 'Venice', 'Malibu', 'Culver City', 'Westwood', 'Brentwood', 'Sawtelle'] },
    { id: 'valley', en: 'The Valley & Glendale', es: 'El Valle y Glendale',
      cities: ['North Hollywood', 'Burbank', 'Glendale'] },
    { id: 'southbay', en: 'South Bay & Inglewood', es: 'South Bay e Inglewood',
      cities: ['Inglewood', 'Playa del Rey', 'Manhattan Beach', 'Hermosa Beach', 'Redondo Beach', 'Rancho Palos Verdes'] },
    { id: 'longbeach', en: 'Long Beach', es: 'Long Beach',
      cities: ['Long Beach'] },
    { id: 'pasadena', en: 'Pasadena & SGV', es: 'Pasadena y SGV',
      cities: ['Pasadena', 'San Marino', 'La Cañada Flintridge', 'Arcadia', 'San Gabriel', 'Alhambra'] }
  ],

  /* Shorter or friendlier display names for some locations */
  placeLabels: { 'North Hollywood': 'NoHo', 'La Cañada Flintridge': 'La Cañada', 'Rancho Palos Verdes': 'Palos Verdes' },

  placeId: function(city) {
    return String(city || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  },
  placeLabel: function(city) { return this.placeLabels[city] || city; },

  moods: [
    { id: 'views', en: 'Views & sunsets', es: 'Vistas y atardeceres', emoji: '🌅',
      tags: ['skyline-views', 'rooftop-patio', 'sunset'], categories: [] },
    { id: 'food', en: 'Food & drinks', es: 'Comida y bebidas', emoji: '🌮',
      tags: ['iconic-eats', 'dining', 'street-food', 'tacos', 'coffee'], categories: ['Dining'] },
    { id: 'history', en: 'History & architecture', es: 'Historia y arquitectura', emoji: '🏛️',
      tags: ['historic', 'architecture'], categories: ['Landmarks'] },
    { id: 'arts', en: 'Art & museums', es: 'Arte y museos', emoji: '🎨',
      tags: ['street-art', 'arts'], categories: ['Arts'] },
    { id: 'nightlife', en: 'Nightlife', es: 'Vida nocturna', emoji: '🍸',
      tags: ['late-night', 'nightlife', 'craft-cocktails', 'speakeasy', 'live-music', 'dance-floor', 'dj-sets'], categories: ['Nightlife'] },
    { id: 'outdoors', en: 'Parks & beaches', es: 'Parques y playas', emoji: '🌴',
      tags: ['beach-vibes', 'hiking', 'outdoor'], categories: ['Parks'] },
    { id: 'shows', en: 'Shows & shopping', es: 'Shows y compras', emoji: '🎟️',
      tags: ['entertainment', 'shopping', 'vintage-thrifting'], categories: ['Entertainment', 'Shopping'] }
  ],

  /* Returns the region id for a spot's City, or null */
  areaOf: function(city) {
    const c = (city || '').trim();
    const a = this.areas.find(area => area.cities.includes(c));
    return a ? a.id : null;
  },

  /* Returns the list of mood ids a spot belongs to */
  moodsOf: function(props) {
    const tags = String(props.Tags || '').split(/[,;]/).map(t => t.trim().toLowerCase()).filter(Boolean);
    const cat = String(props.Category || '').trim();
    return this.moods
      .filter(m => m.categories.includes(cat) || m.tags.some(t => tags.includes(t)))
      .map(m => m.id);
  },

  isFree: function(props) {
    return /(^|[;,\s])free-budget([;,\s]|$)/i.test(String(props.Tags || ''));
  }
};
