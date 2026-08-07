/* ==============================================================================
 * FILE: ui-itinerary-view.js
 * CATEGORY: MarlonWalksLA Website - Trip Itinerary & Visited Checklist
 * ============================================================================== */

window.MarlonItineraryView = {
  activeDay: 'All', // 'All', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Visited'

  getSpotsCountForDay: function(dayName, allMarkers, itinMap, savedRoutesMap, allPresets, visitedIds) {
    if (dayName === 'Visited') {
      return visitedIds.length;
    }
    if (dayName === 'All') {
      return Object.keys(itinMap).filter(id => !itinMap[id] || itinMap[id] === 'All').length;
    }
    let count = Object.keys(itinMap).filter(sId => itinMap[sId] === dayName).length;
    const dayRouteIds = Object.keys(savedRoutesMap).filter(rId => savedRoutesMap[rId] === dayName);
    dayRouteIds.forEach(rId => {
      const p = allPresets.find(item => item.id === rId);
      if (p) {
        p.spotTitles.forEach(t => {
          const match = allMarkers.find(m => m.title.toLowerCase().includes(t.toLowerCase().trim()));
          if (match && !window.MarlonStorage.isSpotExcludedFromRoute(rId, match.id)) count++;
        });
      }
    });
    return count;
  },

  showConfirmModal: function(title, message, skipKey, onConfirm) {
    if (localStorage.getItem(skipKey) === 'true') {
      onConfirm();
      return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'marlon-modal-overlay';
    overlay.innerHTML = `
      <div class="marlon-modal-box">
        <div class="marlon-modal-title">${title}</div>
        <div class="marlon-modal-text">${message}</div>
        <label class="marlon-modal-checkbox">
          <input type="checkbox" id="marlon-skip-cb"> Don't ask me again
        </label>
        <div class="marlon-modal-actions">
          <button class="marlon-btn-cancel">Cancel</button>
          <button class="marlon-btn-confirm">Yes, Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    overlay.querySelector('.marlon-btn-cancel').onclick = () => overlay.remove();
    overlay.querySelector('.marlon-btn-confirm').onclick = () => {
      if (overlay.querySelector('#marlon-skip-cb').checked) {
        localStorage.setItem(skipKey, 'true');
      }
      overlay.remove();
      onConfirm();
    };
  },

  copyDayToClipboard: function(dayName, spotIds, routeIds, allMarkers, extSpotsMap, allPresets) {
    let text = `🗺️ My LA Trip: ${dayName === 'Visited' ? 'Visited Spots' : dayName === 'All' ? 'Unassigned Spots' : dayName}\n\n`;
    
    routeIds.forEach(rId => {
      const p = allPresets.find(item => item.id === rId);
      if (p) {
        text += `✨ Route: ${p.title}\n`;
        p.spotTitles.forEach(t => {
          const match = allMarkers.find(m => m.title.toLowerCase().includes(t.toLowerCase().trim()));
          if (match && !window.MarlonStorage.isSpotExcludedFromRoute(rId, match.id)) {
            text += `📍 ${match.title}\n`;
          }
        });
        text += `\n`;
      }
    });

    if (spotIds.length > 0) {
      text += `📌 Spots:\n`;
      spotIds.forEach(id => {
        let m = allMarkers.find(item => item.id === id) || extSpotsMap[id];
        if (m) {
          text += `📍 ${m.title} ${m.neighborhood ? `(${m.neighborhood})` : ''}\n`;
          if (m.isExternal) text += `🔗 ${m.gmapsUrl}\n`;
        }
      });
    }
    
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied ${dayName} itinerary to clipboard!`);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  },

  renderItinerary: function(container, allMarkers, callbacks) {
    if (!container) return;
    const itinMap = window.MarlonStorage.getItineraryMap();
    const savedRoutesMap = window.MarlonStorage.getSavedRoutesMap();
    const visitedIds = window.MarlonStorage.getVisitedSpots();
    const allPresets = window.MARLON_ROUTES_PRESETS || [];
    const extSpotsMap = window.MarlonStorage.getExternalSpots ? window.MarlonStorage.getExternalSpots() : {};
    const activeDay = this.activeDay;

    const daysList = ['All', 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Visited'];
    const dayCounts = {};
    daysList.forEach(d => dayCounts[d] = this.getSpotsCountForDay(d, allMarkers, itinMap, savedRoutesMap, allPresets, visitedIds));

    let activeRouteIds = [];
    let activeCustomSpotIds = [];
    let activeDaySpotIds = [];

    if (activeDay === 'Visited') {
      activeCustomSpotIds = [...visitedIds];
      activeDaySpotIds = [...visitedIds];
    } else if (activeDay === 'All') {
      activeCustomSpotIds = Object.keys(itinMap).filter(id => !itinMap[id] || itinMap[id] === 'All');
      activeDaySpotIds = [...activeCustomSpotIds];
    } else {
      activeRouteIds = Object.keys(savedRoutesMap).filter(rId => savedRoutesMap[rId] === activeDay);
      activeCustomSpotIds = Object.keys(itinMap).filter(sId => itinMap[sId] === activeDay);
      
      activeCustomSpotIds.forEach(id => activeDaySpotIds.push(id));
      activeRouteIds.forEach(rId => {
        const p = allPresets.find(item => item.id === rId);
        if (p) {
          p.spotTitles.forEach(t => {
            const cleanT = t.toLowerCase().trim();
            const match = allMarkers.find(m => m.title.toLowerCase().includes(cleanT) || cleanT.includes(m.title.toLowerCase()));
            if (match && !window.MarlonStorage.isSpotExcludedFromRoute(rId, match.id) && !activeDaySpotIds.includes(match.id)) {
              activeDaySpotIds.push(match.id);
            }
          });
        }
      });
    }

    let html = `
      <div class="itinerary-view-wrapper">
        <div class="day-filter-bar" style="margin-top: 4px;">
          ${daysList.map(d => `<button type="button" class="day-pill ${activeDay === d ? 'is-active' : ''} ${dayCounts[d] > 0 ? 'has-items' : ''}" data-day="${d}">${d === 'Visited' ? '✅ Visited' : d} ${dayCounts[d] > 0 ? `(${dayCounts[d]})` : ''}</button>`).join('')}
        </div>
        <div class="itinerary-section">
          <div class="itinerary-blocks-container">
    `;

    // ------------------- VISITED TAB CONTENT -------------------
    if (activeDay === 'Visited') {
      html += `
        <div class="route-block-card">
          <div class="route-block-header" style="background-color: #f0f7ff; justify-content: space-between; cursor: default;">
            <span class="route-block-title" style="font-size: 13px;">✅ Visited Passport (${visitedIds.length})</span>
            ${visitedIds.length > 0 ? `
              <div style="display:flex; gap: 6px;">
                <button type="button" class="icon-btn share-day-btn" data-day="Visited" title="Share visited places">📤</button>
              </div>
            ` : ''}
          </div>
          <div class="route-block-body">
      `;

      if (visitedIds.length === 0) {
        html += `
          <div style="text-align: center; padding: 16px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
            <div style="font-size: 24px; margin-bottom: 6px;">📍</div>
            <strong>No visited spots yet!</strong><br>
            Check off places as you explore LA or search in <strong>🔍 Search</strong> or <strong>🛣️ Routes</strong> to add spots to your map.
          </div>
        `;
      } else {
        html += visitedIds.map(sId => {
          let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
          if (!m) return '';

          const isSaved = window.MarlonStorage.getSavedSpotIds().includes(sId);
          const gmapsLink = m.isExternal ? m.gmapsUrl : `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;

          return `
            <div class="itinerary-item nested-spot-item is-visited-item" data-id="${sId}">
              <div class="itinerary-item-info" style="flex: 1; padding-right: 4px;">
                <div class="itinerary-item-name" style="margin-bottom: 2px;">📍 ${m.title}</div>
                ${m.neighborhood ? `<div class="spot-feed-meta">${m.neighborhood}</div>` : ''}
              </div>
              <div class="itinerary-item-actions" style="gap: 4px; display: flex; align-items: center;">
                <a href="${gmapsLink}" target="_blank" class="icon-btn" title="Open Map" style="text-decoration:none;">🚗</a>
                <button type="button" class="icon-btn pin-toggle ${isSaved ? 'is-active' : ''}" data-id="${sId}" title="Pin">📌</button>
                <button type="button" class="icon-btn visited-toggle is-active" data-id="${sId}" title="Visited">✓</button>
              </div>
            </div>
          `;
        }).join('');
      }

      html += `</div></div>`;

    // ------------------- DAY 1..4 OR ALL (UNASSIGNED) CONTENT -------------------
    } else if (activeDay !== 'All' && activeRouteIds.length === 0 && activeCustomSpotIds.length === 0) {
      // Empty State for Day 1..4
      const customTitle = localStorage.getItem(`marlon_day_title_${activeDay}`) || activeDay;
      html += `
        <div class="route-block-card">
          <div class="route-block-header">
            <input type="text" class="day-title-input" data-day="${activeDay}" value="${customTitle}" placeholder="Name your day (e.g. Museum Day)">
          </div>
          <div class="route-block-body">
            <div style="text-align: center; padding: 12px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
              <div style="font-size: 20px; margin-bottom: 4px;">🗺️</div>
              <strong>No plans for ${activeDay} yet!</strong><br>
              Search in <strong>🔍 Search</strong> or <strong>🛣️ Routes</strong> to add spots to your map.
            </div>
            <div class="manual-search-wrap" style="position: relative; margin-top: 4px;">
              <input type="text" class="empty-slot-input manual-spot-search" data-day="${activeDay}" placeholder="Search 102 spots or Google Maps...">
              <div class="search-results-dropdown"></div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Render Route Blocks for Day 1..4
      html += activeRouteIds.map(routeId => {
        const preset = allPresets.find(p => p.id === routeId);
        if (!preset) return '';
        return `
          <details class="route-block-card" open style="margin-bottom: 8px;">
            <summary class="route-block-header">
              <div class="route-block-title-wrap">
                <span class="route-block-title">${preset.title}</span>
                <span class="route-block-meta">${preset.duration.split('•')[1] || ''}</span>
              </div>
              <div class="route-block-controls">
                <select class="route-day-select" data-route="${preset.id}">
                  <option value="Day 1" ${savedRoutesMap[routeId] === 'Day 1' ? 'selected' : ''}>Day 1</option>
                  <option value="Day 2" ${savedRoutesMap[routeId] === 'Day 2' ? 'selected' : ''}>Day 2</option>
                  <option value="Day 3" ${savedRoutesMap[routeId] === 'Day 3' ? 'selected' : ''}>Day 3</option>
                  <option value="Day 4" ${savedRoutesMap[routeId] === 'Day 4' ? 'selected' : ''}>Day 4</option>
                </select>
                <button type="button" class="icon-btn remove-route-block-btn" data-route="${preset.id}" title="Remove Route Block">✕</button>
              </div>
            </summary>
            <div class="route-block-body">
              ${preset.spotTitles.map(t => {
                const match = allMarkers.find(m => m.title.toLowerCase().includes(t.toLowerCase().trim()));
                if (!match || window.MarlonStorage.isSpotExcludedFromRoute(preset.id, match.id)) return '';
                const isVisited = visitedIds.includes(match.id);
                const isSaved = true; 
                const gmapsLink = `https://www.google.com/maps/dir/?api=1&destination=${match.lat},${match.lng}`;
                return `
                  <div class="itinerary-item nested-spot-item ${isVisited ? 'is-visited-item' : ''}" data-id="${match.id}">
                    <div class="itinerary-item-info">
                      <div class="itinerary-item-name">📍 ${match.title}</div>
                      <div class="spot-feed-meta">${match.neighborhood}</div>
                    </div>
                    <div class="itinerary-item-actions">
                      <a href="${gmapsLink}" target="_blank" class="icon-btn nested-icon-btn" title="Open Map" style="text-decoration:none;">🚗</a>
                      <button type="button" class="icon-btn nested-icon-btn pin-toggle ${isSaved ? 'is-active' : ''}" data-id="${match.id}" title="Pin">📌</button>
                      <button type="button" class="icon-btn nested-icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${match.id}" title="Visited">✓</button>
                      <button type="button" class="icon-btn nested-icon-btn remove-nested-spot-btn" data-route="${preset.id}" data-id="${match.id}" title="Remove">✕</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </details>
        `;
      }).join('');

      if (activeDay !== 'All') {
        const customTitle = localStorage.getItem(`marlon_day_title_${activeDay}`) || activeDay;
        html += `
          <div class="route-block-card">
            <div class="route-block-header" style="justify-content: space-between;">
              <div style="flex:1;">
                <input type="text" class="day-title-input" data-day="${activeDay}" value="${customTitle}" placeholder="Name your day (e.g. Museum Day)">
              </div>
              <div style="display:flex; gap: 6px; padding-left: 6px;">
                <button type="button" class="icon-btn share-day-btn" data-day="${activeDay}" title="Share this day">📤</button>
                <button type="button" class="icon-btn clear-day-btn" data-day="${activeDay}" title="Clear plans">🗑️</button>
              </div>
            </div>
            <div class="route-block-body">
        `;
        if (activeCustomSpotIds.length > 0) {
          html += activeCustomSpotIds.map(sId => {
            let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
            if (!m) return '';

            const isVisited = visitedIds.includes(m.id);
            const isSaved = true;
            const gmapsLink = m.isExternal ? m.gmapsUrl : `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;

            return `
              <div class="itinerary-item nested-spot-item ${isVisited ? 'is-visited-item' : ''}" data-id="${sId}">
                <div class="itinerary-item-info" style="flex: 1; padding-right: 4px;">
                  <div class="itinerary-item-name" style="margin-bottom: 2px;">📍 ${m.title}</div>
                </div>
                <div class="itinerary-item-actions" style="gap: 4px; display: flex; align-items: center;">
                  <select class="day-assign-select" data-id="${sId}" style="margin-right: 2px; padding: 2px 4px !important;">
                    <option value="All" ${!itinMap[sId] || itinMap[sId] === 'All' ? 'selected' : ''}>Unassigned</option>
                    <option value="Day 1" ${itinMap[sId] === 'Day 1' ? 'selected' : ''}>Day 1</option>
                    <option value="Day 2" ${itinMap[sId] === 'Day 2' ? 'selected' : ''}>Day 2</option>
                    <option value="Day 3" ${itinMap[sId] === 'Day 3' ? 'selected' : ''}>Day 3</option>
                    <option value="Day 4" ${itinMap[sId] === 'Day 4' ? 'selected' : ''}>Day 4</option>
                  </select>
                  <a href="${gmapsLink}" target="_blank" class="icon-btn" title="Open Map" style="text-decoration:none;">🚗</a>
                  <button type="button" class="icon-btn pin-toggle ${isSaved ? 'is-active' : ''}" data-id="${sId}" title="Pin">📌</button>
                  <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${sId}" title="Visited">✓</button>
                  <button type="button" class="icon-btn remove-toggle" data-id="${sId}">✕</button>
                </div>
              </div>
            `;
          }).join('');
        }
        html += `
              <div class="manual-search-wrap" style="position: relative; margin-top: 4px;">
                <input type="text" class="empty-slot-input manual-spot-search" data-day="${activeDay}" placeholder="Search 102 spots or Google Maps...">
                <div class="search-results-dropdown"></div>
              </div>
            </div>
          </div>
        `;
      } else {
        // UNASSIGNED (ALL) TAB CONTENT
        html += `
          <div class="route-block-card">
            <div class="route-block-header" style="background-color: #f0f7ff; justify-content: space-between; cursor: default;">
              <span class="route-block-title" style="font-size: 13px;">📌 Unassigned Spots (${activeCustomSpotIds.length})</span>
              ${activeCustomSpotIds.length > 0 ? `
                <div style="display:flex; gap: 6px;">
                  <button type="button" class="icon-btn share-day-btn" data-day="All" title="Share unassigned spots">📤</button>
                  <button type="button" class="icon-btn clear-day-btn" data-day="All" title="Clear unassigned spots">🗑️</button>
                </div>
              ` : ''}
            </div>
            <div class="route-block-body">
        `;
        if (activeCustomSpotIds.length === 0) {
          html += `
            <div style="text-align: center; padding: 12px 8px; color: #64748b; font-size: 12px; line-height: 1.5;">
              <div style="font-size: 20px; margin-bottom: 4px;">📌</div>
              <strong>No unassigned spots yet!</strong><br>
              Search in <strong>🔍 Search</strong> or <strong>🛣️ Routes</strong> to add spots to your map.
            </div>
          `;
        } else {
          html += activeCustomSpotIds.map(sId => {
            let m = allMarkers.find(item => item.id === sId) || extSpotsMap[sId];
            if (!m) return '';

            const isVisited = visitedIds.includes(m.id);
            const isSaved = true;
            const gmapsLink = m.isExternal ? m.gmapsUrl : `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`;

            return `
              <div class="itinerary-item nested-spot-item ${isVisited ? 'is-visited-item' : ''}" data-id="${sId}">
                <div class="itinerary-item-info" style="flex: 1; padding-right: 4px;">
                  <div class="itinerary-item-name" style="margin-bottom: 2px;">📍 ${m.title}</div>
                </div>
                <div class="itinerary-item-actions" style="gap: 4px; display: flex; align-items: center;">
                  <select class="day-assign-select" data-id="${sId}" style="margin-right: 2px; padding: 2px 4px !important;">
                    <option value="All" ${!itinMap[sId] || itinMap[sId] === 'All' ? 'selected' : ''}>Unassigned</option>
                    <option value="Day 1" ${itinMap[sId] === 'Day 1' ? 'selected' : ''}>Day 1</option>
                    <option value="Day 2" ${itinMap[sId] === 'Day 2' ? 'selected' : ''}>Day 2</option>
                    <option value="Day 3" ${itinMap[sId] === 'Day 3' ? 'selected' : ''}>Day 3</option>
                    <option value="Day 4" ${itinMap[sId] === 'Day 4' ? 'selected' : ''}>Day 4</option>
                  </select>
                  <a href="${gmapsLink}" target="_blank" class="icon-btn" title="Open Map" style="text-decoration:none;">🚗</a>
                  <button type="button" class="icon-btn pin-toggle ${isSaved ? 'is-active' : ''}" data-id="${sId}" title="Pin">📌</button>
                  <button type="button" class="icon-btn visited-toggle ${isVisited ? 'is-active' : ''}" data-id="${sId}" title="Visited">✓</button>
                  <button type="button" class="icon-btn remove-toggle" data-id="${sId}">✕</button>
                </div>
              </div>
            `;
          }).join('');
        }
        html += `
              <div class="manual-search-wrap" style="position: relative; margin-top: 4px;">
                <input type="text" class="empty-slot-input manual-spot-search" data-day="All" placeholder="Search 102 spots or Google Maps...">
                <div class="search-results-dropdown"></div>
              </div>
            </div>
          </div>
        `;
      }
    }
    
    html += `</div></div></div>`;
    container.innerHTML = html;

    // ------------------- UPDATE MAP PINS FOR SELECTED PILL -------------------
    const map = window.marlonMapInstance;
    if (map && allMarkers && allMarkers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      let visibleCount = 0;

      allMarkers.forEach(m => {
        if (activeDaySpotIds.includes(m.id)) {
          m.marker.addTo(map);
          bounds.extend([m.lng, m.lat]);
          visibleCount++;
        } else {
          m.marker.remove();
        }
      });

      if (visibleCount >= 1) {
        map.fitBounds(bounds, { padding: 60, maxZoom: 13.5 });
      } else {
        const dtlaCenter = [-118.2437, 34.0522];
        map.flyTo({ center: dtlaCenter, zoom: 10.2 });
      }
    }

    // ------------------- ATTACH EVENT LISTENERS -------------------
    container.querySelectorAll('.manual-spot-search').forEach(input => {
      const dropdown = input.nextElementSibling;
      const dayTarget = input.dataset.day;

      input.addEventListener('input', (e) => {
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) {
          dropdown.style.display = 'none';
          return;
        }

        const curatedMatches = allMarkers.filter(m => 
          m.title.toLowerCase().includes(query) || 
          (m.neighborhood && m.neighborhood.toLowerCase().includes(query))
        ).slice(0, 4);

        let dropdownHtml = curatedMatches.map(m => `
          <div class="search-result-item" data-type="curated" data-id="${m.id}">
            <div>
              <div class="search-result-title">📍 ${m.title}</div>
              <div class="search-result-meta">${m.neighborhood || ''}</div>
            </div>
            <span class="search-badge curated">+ Add</span>
          </div>
        `).join('');

        dropdownHtml += `
          <div class="search-result-item" data-type="google" data-query="${input.value.trim()}">
            <div>
              <div class="search-result-title">🗺️ Search "${input.value.trim()}"</div>
              <div class="search-result-meta">Save custom Google Map link</div>
            </div>
            <span class="search-badge address">External</span>
          </div>
        `;

        dropdown.innerHTML = dropdownHtml;
        dropdown.style.display = 'block';

        dropdown.querySelectorAll('.search-result-item').forEach(item => {
          item.addEventListener('click', (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            
            if (item.dataset.type === 'curated') {
              window.MarlonStorage.toggleSavedSpot(item.dataset.id, dayTarget);
              window.MarlonItineraryView.renderItinerary(container, allMarkers, callbacks);
            } else {
              const extId = 'ext-' + Date.now();
              const gmapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(item.dataset.query);
              const spotData = { id: extId, title: item.dataset.query, neighborhood: 'External Location', gmapsUrl: gmapsUrl, isExternal: true };
              if (window.MarlonStorage.addExternalSpot) window.MarlonStorage.addExternalSpot(spotData, dayTarget);
              window.MarlonItineraryView.renderItinerary(container, allMarkers, callbacks);
              dropdown.style.display = 'none';
              input.value = '';
            }
          });
        });
      });

      document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.style.display = 'none';
      });
    });

    container.querySelectorAll('.day-pill').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); this.activeDay = btn.dataset.day; this.renderItinerary(container, allMarkers, callbacks); }));
    
    container.querySelectorAll('.remove-toggle, .remove-nested-spot-btn').forEach(btn => btn.addEventListener('click', (e) => { 
      e.preventDefault(); e.stopPropagation(); 
      this.showConfirmModal("Remove Spot?", "Are you sure you want to remove this location from your trip?", "marlon_skip_remove", () => {
        if (btn.classList.contains('remove-nested-spot-btn')) {
          window.MarlonStorage.excludeSpotFromRoute(btn.dataset.route, btn.dataset.id);
        } else {
          if (callbacks.onRemoveSpot) callbacks.onRemoveSpot(btn.dataset.id);
        }
        this.renderItinerary(container, allMarkers, callbacks);
      });
    }));

    container.querySelectorAll('.clear-day-btn').forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      const d = btn.dataset.day;
      this.showConfirmModal(`Clear ${d}?`, `This will remove all spots and routes currently assigned to ${d}.`, "marlon_skip_clear", () => {
         if (callbacks.onClearDay) callbacks.onClearDay(d);
      });
    }));

    container.querySelectorAll('.share-day-btn').forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      const d = btn.dataset.day;
      this.copyDayToClipboard(d, activeCustomSpotIds, activeRouteIds, allMarkers, extSpotsMap, allPresets);
    }));

    container.querySelectorAll('.pin-toggle').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); window.MarlonStorage.toggleSavedSpot(btn.dataset.id, activeDay !== 'All' && activeDay !== 'Visited' ? activeDay : 'All'); this.renderItinerary(container, allMarkers, callbacks); }));
    container.querySelectorAll('.visited-toggle').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (callbacks.onToggleVisited) callbacks.onToggleVisited(btn.dataset.id); this.renderItinerary(container, allMarkers, callbacks); }));
    container.querySelectorAll('.day-title-input').forEach(input => input.addEventListener('change', (e) => { localStorage.setItem(`marlon_day_title_${input.dataset.day}`, e.target.value); }));
    container.querySelectorAll('.day-assign-select').forEach(sel => sel.addEventListener('change', (e) => { e.stopPropagation(); window.MarlonStorage.setSpotDay(sel.dataset.id, sel.value); this.renderItinerary(container, allMarkers, callbacks); }));
  }
};
