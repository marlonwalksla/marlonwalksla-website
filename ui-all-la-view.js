/* ==============================================================================
 * FILE: ui-all-la-view.js
 * CATEGORY: MarlonWalksLA Website - All LA Directory & Filter Controls
 * ============================================================================== */

window.MarlonAllLaView = {
  activeArea: 'All',
  activeCategories: new Set(),
  activeTag: 'All',

  render: function(container, categories, tagsSet, neighborhoods, categoryMap, defaultPinSvg, applyFiltersCallback) {
    if (!container) return;
    container.innerHTML = '';

    const headerIntro = document.createElement('div');
    headerIntro.className = 'featured-feed-header';
    headerIntro.innerHTML = `
      <span class="featured-feed-title">🌐 EXPLORE ALL LOCATIONS</span>
      <span class="featured-feed-subtitle">Filter by category, vibe, or neighborhood to curate your route:</span>
    `;
    container.appendChild(headerIntro);

    // CATEGORIES PILLS BAR
    const catGroup = document.createElement('div');
    catGroup.className = 'dashboard-group';

    const catLabel = document.createElement('div');
    catLabel.className = 'dashboard-label';
    catLabel.innerText = '🏷️ CATEGORIES';
    catGroup.appendChild(catLabel);

    const catPillsBar = document.createElement('div');
    catPillsBar.className = 'category-pills-bar stacked';

    Array.from(categories).sort().forEach(cat => {
      const pill = document.createElement('div');
      pill.className = 'cat-pill';
      pill.dataset.category = cat;
      const catDetails = window.MarlonSpotCard ? window.MarlonSpotCard.getCategoryDetails(cat, '', categoryMap, defaultPinSvg) : { color: '#3898ec', name: cat };
      pill.innerHTML = `<span class="cat-dot" style="background-color:${catDetails.color}"></span>${catDetails.name}`; 
      catPillsBar.appendChild(pill);
    });

    catGroup.appendChild(catPillsBar);
    container.appendChild(catGroup); 

    catPillsBar.addEventListener('click', (e) => {
      e.preventDefault();
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;
      const cat = pill.dataset.category;

      if (this.activeCategories.has(cat)) {
        this.activeCategories.delete(cat);
        pill.classList.remove('is-active');
      } else {
        this.activeCategories.add(cat);
        pill.classList.add('is-active');
      }
      if (applyFiltersCallback) applyFiltersCallback();
    });

    // VIBE DROPDOWN
    let tagSelect = null;
    if (tagsSet.size > 0) {
      const tagGroup = document.createElement('div');
      tagGroup.className = 'dashboard-group';

      const tagLabel = document.createElement('div');
      tagLabel.className = 'dashboard-label';
      tagLabel.innerText = '✨ VIBE';
      tagGroup.appendChild(tagLabel);

      tagSelect = document.createElement('select');
      tagSelect.innerHTML = `<option value="All">All Vibes</option>`;
      Array.from(tagsSet).sort().forEach(tagVal => {
        const cleanTag = tagVal.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        tagSelect.innerHTML += `<option value="${tagVal}">${cleanTag}</option>`;
      });

      tagGroup.appendChild(tagSelect);
      container.appendChild(tagGroup);

      tagSelect.addEventListener('change', (e) => {
        this.activeTag = e.target.value;
        if (applyFiltersCallback) applyFiltersCallback();
      });
    }

    // NEIGHBORHOOD DROPDOWN
    const areaGroup = document.createElement('div');
    areaGroup.className = 'dashboard-group';

    const areaLabel = document.createElement('div');
    areaLabel.className = 'dashboard-label';
    areaLabel.innerText = '📍 NEIGHBORHOODS';
    areaGroup.appendChild(areaLabel);

    const areaSelect = document.createElement('select');
    areaSelect.innerHTML = `<option value="All">All LA Neighborhoods</option>`;
    Array.from(neighborhoods).sort().forEach(area => {
      areaSelect.innerHTML += `<option value="${area}">${area}</option>`;
    });

    areaGroup.appendChild(areaSelect);
    container.appendChild(areaGroup); 

    areaSelect.addEventListener('change', (e) => {
      this.activeArea = e.target.value;
      if (applyFiltersCallback) applyFiltersCallback();
    });

    // RESET BUTTON
    const resetContainer = document.createElement('div');
    resetContainer.style.display = 'flex';
    resetContainer.style.justifyContent = 'center';
    resetContainer.style.width = '100%';

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-filters-btn';
    resetBtn.innerHTML = '↺ Reset Filters';

    resetContainer.appendChild(resetBtn);
    container.appendChild(resetContainer);

    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.activeArea = 'All';
      this.activeTag = 'All';
      this.activeCategories.clear();

      if (areaSelect) areaSelect.value = 'All';
      if (tagSelect) tagSelect.value = 'All';

      catPillsBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
      if (applyFiltersCallback) applyFiltersCallback();
    });
  }
};
