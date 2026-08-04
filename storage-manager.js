/* ==============================================================================
 * FILE: storage-manager.js
 * CATEGORY: MarlonWalksLA Website - Local Storage & Route Block Manager
 * ============================================================================== */

window.MarlonStorage = {
  getItineraryMap: function() {
    return JSON.parse(localStorage.getItem('marlon_saved_itinerary_map') || '{}');
  },

  getSavedRoutesMap: function() {
    return JSON.parse(localStorage.getItem('marlon_saved_routes_map') || '{}');
  },

  getVisitedSpots: function() {
    return JSON.parse(localStorage.getItem('marlon_visited_spots') || '[]');
  },

  getSavedSpotIds: function() {
    const spotMap = this.getItineraryMap();
    const routeMap = this.getSavedRoutesMap();
    const presets = window.MARLON_ROUTES_PRESETS || [];

    let spotIds = Object.keys(spotMap);

    // Include all spots belonging to imported route blocks
    Object.keys(routeMap).forEach(routeId => {
      const preset = presets.find(p => p.id === routeId);
      if (preset && window.MARLON_ALL_MARKERS) {
        preset.spotTitles.forEach(targetTitle => {
          const cleanTarget = targetTitle.toLowerCase().trim();
          const match = window.MARLON_ALL_MARKERS.find(m => {
            const cleanTitle = m.title.toLowerCase().trim();
            return cleanTitle.includes(cleanTarget) || cleanTarget.includes(cleanTitle);
          });
          if (match && !spotIds.includes(match.id)) {
            spotIds.push(match.id);
          }
        });
      }
    });

    return spotIds;
  },

  toggleSavedSpot: function(id, defaultDay = 'Day 1') {
    let map = this.getItineraryMap();
    if (map[id]) {
      delete map[id];
    } else {
      map[id] = defaultDay;
    }
    localStorage.setItem('marlon_saved_itinerary_map', JSON.stringify(map));
  },

  setSpotDay: function(id, day) {
    let map = this.getItineraryMap();
    if (map[id]) {
      map[id] = day;
      localStorage.setItem('marlon_saved_itinerary_map', JSON.stringify(map));
    }
  },

  toggleRouteBlock: function(routeId, day = 'Day 1') {
    let routes = this.getSavedRoutesMap();
    if (routes[routeId]) {
      delete routes[routeId];
    } else {
      routes[routeId] = day;
    }
    localStorage.setItem('marlon_saved_routes_map', JSON.stringify(routes));
  },

  setRouteDay: function(routeId, day) {
    let routes = this.getSavedRoutesMap();
    if (routes[routeId]) {
      routes[routeId] = day;
      localStorage.setItem('marlon_saved_routes_map', JSON.stringify(routes));
    }
  },

  toggleVisitedSpot: function(id) {
    let visited = this.getVisitedSpots();
    if (visited.includes(id)) {
      visited = visited.filter(item => item !== id);
    } else {
      visited.push(id);
    }
    localStorage.setItem('marlon_visited_spots', JSON.stringify(visited));
  },

  clearItinerary: function() {
    localStorage.setItem('marlon_saved_itinerary_map', '{}');
    localStorage.setItem('marlon_saved_routes_map', '{}');
  }
};
