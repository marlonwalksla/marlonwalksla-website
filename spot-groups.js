/* ==============================================================================
 * FILE: spot-groups.js
 * CATEGORY: MarlonWalksLA Website - Parts of Town & Moods (map filter groups)
 *
 * Groups the 40 neighborhoods in spots.geojson into a few "parts of town",
 * and the 70+ tags into a few "moods". Edit the lists below to regroup;
 * the map filters, quiz and area links all read from here.
 * ============================================================================== */

window.MARLON_GROUPS = {
  areas: [
    { id: 'downtown', en: 'Downtown', es: 'Centro',
      cities: ['DTLA', 'Arts District', 'Chinatown', 'Little Tokyo', 'Lincoln Heights'] },
    { id: 'hollywood', en: 'Hollywood', es: 'Hollywood',
      cities: ['Hollywood', 'East Hollywood', 'North Hollywood', 'Burbank'] },
    { id: 'weho', en: 'West Hollywood', es: 'West Hollywood',
      cities: ['West Hollywood'] },
    { id: 'beverlyhills', en: 'Beverly Hills', es: 'Beverly Hills',
      cities: ['Beverly Hills', 'Century City'] },
    { id: 'eastside', en: 'Echo Park & Silver Lake', es: 'Echo Park y Silver Lake',
      cities: ['Echo Park', 'Silver Lake', 'Los Feliz'] },
    { id: 'midcity', en: 'Koreatown & Mid-City', es: 'Koreatown y Mid-City',
      cities: ['Koreatown', 'Mid-City', 'Miracle Mile', 'Fairfax'] },
    { id: 'santamonica', en: 'Santa Monica', es: 'Santa Monica',
      cities: ['Santa Monica'] },
    { id: 'venice', en: 'Venice', es: 'Venice',
      cities: ['Venice'] },
    { id: 'malibu', en: 'Malibu', es: 'Malibu',
      cities: ['Malibu'] },
    { id: 'westside', en: 'Westwood & Culver City', es: 'Westwood y Culver City',
      cities: ['Westwood', 'Brentwood', 'Sawtelle', 'Culver City'] },
    { id: 'inglewood', en: 'Inglewood', es: 'Inglewood',
      cities: ['Inglewood'] },
    { id: 'southbay', en: 'South Bay beaches', es: 'Playas del South Bay',
      cities: ['Playa del Rey', 'Manhattan Beach', 'Hermosa Beach', 'Redondo Beach', 'Rancho Palos Verdes'] },
    { id: 'longbeach', en: 'Long Beach', es: 'Long Beach',
      cities: ['Long Beach'] },
    { id: 'pasadena', en: 'Pasadena & Northeast LA', es: 'Pasadena y el noreste',
      cities: ['Pasadena', 'Highland Park', 'Glendale', 'San Marino', 'La Cañada Flintridge', 'Arcadia', 'San Gabriel', 'Alhambra'] }
  ],

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

  /* Returns the area id for a spot's City, or null */
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
