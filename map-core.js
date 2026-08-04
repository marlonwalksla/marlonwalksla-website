/* ==============================================================================
 * FILE: map-core.js - Updated with onRemoveNestedSpot handler
 * ============================================================================== */

// (Inside renderItinerary callback block:)
    window.MarlonItineraryView.renderItinerary(listCardView, allMarkers, {
      onBack: showFilterControlsView,
      onClear: () => {
        if (confirm("Clear your whole planned itinerary?")) {
          window.MarlonStorage.clearItinerary();
          updateHeaderBadges();
          updateMarkerStates();
          renderItinerary();
        }
      },
      onImportPreset: (pId, day) => {
        window.MarlonStorage.toggleRouteBlock(pId, day);
        updateHeaderBadges();
        updateMarkerStates();
        renderItinerary();
      },
      onRemoveRoute: (rId) => {
        window.MarlonStorage.toggleRouteBlock(rId);
        updateHeaderBadges();
        updateMarkerStates();
        renderItinerary();
      },
      onRemoveNestedSpot: (rId, sId) => {
        window.MarlonStorage.excludeSpotFromRoute(rId, sId);
        updateHeaderBadges();
        updateMarkerStates();
        renderItinerary();
      },
      onChangeRouteDay: (rId, day) => {
        window.MarlonStorage.setRouteDay(rId, day);
        renderItinerary();
      },
      onChangeSpotDay: (sId, day) => {
        window.MarlonStorage.setSpotDay(sId, day);
        renderItinerary();
      },
      onRemoveSpot: (sId) => {
        window.MarlonStorage.toggleSavedSpot(sId);
        updateHeaderBadges();
        updateMarkerStates();
        renderItinerary();
      },
      onToggleVisited: (sId) => {
        window.MarlonStorage.toggleVisitedSpot(sId);
        updateHeaderBadges();
        updateMarkerStates();
        renderItinerary();
      },
      onSpotClick: (sId) => {
        const match = allMarkers.find(m => m.id === sId);
        if (match) match.wrapper.click();
      }
    });
