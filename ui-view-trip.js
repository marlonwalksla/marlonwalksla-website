/* ==============================================================================
 * FILE: ui-view-trip.js
 * CATEGORY: MarlonWalksLA Website - Trip / Itinerary Tab View
 * ============================================================================== */

window.MarlonTripView = {
  activeDay: 'All',

  renderTrip: function(container, allMarkers, callbacks) {
    if (!container) return;
    container.innerHTML = '';

    const savedMap = window.MarlonStorage ? window.MarlonStorage.getSavedRoutesMap() : {};
    const days = ['All', 'Day 1', 'Day 2', 'Day 3', 'Day 4'];

    const masterWrap = document.createElement('div');
    masterWrap.className = 'trip-view-wrapper';
    masterWrap.style.display = 'flex';
    masterWrap.style.flexDirection = 'column';
    masterWrap.style.gap = '8px';
    masterWrap.style.width = '100%';

    /* DAY PILL SELECTOR BAR */
    const dayFilterBar = document.createElement('div');
    dayFilterBar.className = 'day-filter-bar';
    dayFilterBar.style.marginTop = '2px';

    dayFilterBar.innerHTML = days.map(d => {
      const count = (savedMap[d] || []).length;
      const label = d === 'All' ? `📌 Unassigned (${count})` : `${d} (${count})`;
      return `<button type="button" class="day-pill ${this.activeDay === d ? 'is-active' : ''}" data-day="${d}">${label}</button>`;
    }).join('');

    masterWrap.appendChild(dayFilterBar);

    /* ACTIVE DAY SPOTS LIST */
    const activeSpotIds = savedMap[this.activeDay] || [];
    const spotsToDisplay = activeSpotIds.map(id => allMarkers.find(m => m.id === id)).filter(Boolean);

    let itemsHTML = spotsToDisplay.length === 0
      ? `<div style="text-align:center; padding:16px; color:#94a3b8; font-size:12px; font-style:italic;">No spots saved for ${this.activeDay === 'All' ? 'Unassigned' : this.activeDay} yet.<br>Explore the Search tab to pin spots!</div>`
      : spotsToDisplay.map(m => window.MarlonComponents.renderSpotItemHTML(m, { showDaySelect: true, currentDay: this.activeDay })).join('');

    const titleText = this.activeDay === 'All' ? `📌 Unassigned Spots (${spotsToDisplay.length})` : `📌 ${this.activeDay} Spots (${spotsToDisplay.length})`;

    const shellCard = window.MarlonComponents.createShellCard({
      title: titleText,
      headerActionsHTML: `
        <button type="button" class="top-trash-btn clear-day-btn" data-day="${this.activeDay}" title="Clear all spots in ${this.activeDay}">
          🗑️
        </button>
      `,
      itemsHTML: itemsHTML
    });

    masterWrap.appendChild(shellCard);
    container.appendChild(masterWrap);

    /* EVENT LISTENERS */
    masterWrap.addEventListener('click', (e) => {
      /* 1. Day Selector Pills */
      const pill = e.target.closest('.day-pill');
      if (pill) {
        e.preventDefault();
        this.activeDay = pill.dataset.day;
        this.renderTrip(container, allMarkers, callbacks);
        return;
      }

      /* 2. Top Red Trash Button (Clear Day) */
      const clearBtn = e.target.closest('.clear-day-btn');
      if (clearBtn) {
        e.stopPropagation();
        const dayToClear = clearBtn.dataset.day;
        if (confirm(`Clear all spots in ${dayToClear === 'All' ? 'Unassigned' : dayToClear}?`)) {
          if (callbacks && callbacks.onClearDay) {
            callbacks.onClearDay(dayToClear);
          }
        }
        return;
      }

      /* 3. Spot Row Info Click (Fly to Pin) */
      const infoBtn = e.target.closest('.spot-info-click');
      if (infoBtn && callbacks && callbacks.onSelectSpot) {
        callbacks.onSelectSpot(infoBtn.dataset.id);
        return;
      }

      /* 4. Pin Toggle (Unpin Spot) */
      const pinToggle = e.target.closest('.pin-toggle');
      if (pinToggle && callbacks && callbacks.onRemoveSpot) {
        e.stopPropagation();
        callbacks.onRemoveSpot(pinToggle.dataset.id);
        return;
      }

      /* 5. Visited Toggle */
      const visitedToggle = e.target.closest('.visited-toggle');
      if (visitedToggle && callbacks && callbacks.onToggleVisited) {
        e.stopPropagation();
        callbacks.onToggleVisited(visitedToggle.dataset.id);
        return;
      }
    });

    /* 6. Day Assignment Dropdown Select */
    masterWrap.addEventListener('change', (e) => {
      const select = e.target.closest('.day-assign-select');
      if (select && window.MarlonStorage) {
        const spotId = select.dataset.id;
        const newDay = select.value;
        window.MarlonStorage.saveRouteBlock(spotId, newDay);
        if (window.updateMarlonMarkerStates) window.updateMarlonMarkerStates();
        this.renderTrip(container, allMarkers, callbacks);
      }
    });
  }
};
