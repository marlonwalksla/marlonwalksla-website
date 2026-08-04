/* ==============================================================================
 * FILE: storage-manager.js
 * CATEGORY: MarlonWalksLA Website - Local Storage & Itinerary State Manager
 * ============================================================================== */

window.MarlonStorage = {
  getItineraryMap: function() {
    return JSON.parse(localStorage.getItem('marlon_saved_itinerary_map') || '{}');
  },

  setItineraryMap: function(dataMap) {
    localStorage.setItem('marlon_saved_itinerary_map', JSON.stringify(dataMap));
  },

  getSavedSpotIds: function() {
    return Object.keys(this.getItineraryMap());
  },

  getVisitedSpots: function() {
    return JSON.parse(localStorage.getItem('marlon_visited_spots') || '[]');
  },

  toggleSavedSpot: function(id, defaultDay = 'Day 1') {
    let map = this.getItineraryMap();
    if (map[id]) {
      delete map[id];
    } else {
      map[id] = defaultDay;
    }
    this.setItineraryMap(map);
  },

  setSpotDay: function(id, day) {
    let map = this.getItineraryMap();
    map[id] = day;
    this.setItineraryMap(map);
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
  },

  // PRESET ROUTE IMPORT (ROBUST FUZZY SPOT MATCHING)
  importPresetRoute: function(presetSpotTitles, allMarkers, defaultDay = 'Day 1') {
    let map = this.getItineraryMap();
    
    presetSpotTitles.forEach(targetTitle => {
      const cleanTarget = targetTitle.toLowerCase().trim();
      const match = allMarkers.find(m => {
        const cleanTitle = m.title.toLowerCase().trim();
        return cleanTitle.includes(cleanTarget) || cleanTarget.includes(cleanTitle) || m.id.includes(cleanTarget);
      });

      if (match) {
        map[match.id] = defaultDay;
      }
    });

    this.setItineraryMap(map);
  }
};
