// Minimal search/filter implementation for the tool grid (improved)
// - Debounced input handling for performance
// - Scoped Escape handling on the input
// - aria-hidden toggling for accessibility
// - Optional liveCallback to announce results (hook into a role="status" element)

(function () {
  const input = document.getElementById('searchInput');
  let searchTimeout = null;

  // Optional callback: set this to a function(count) to announce results via a live region.
  // Example in HTML:
  // <div id="searchStatus" role="status" aria-live="polite" class="sr-only" aria-atomic="true"></div>
  // window.searchLiveCallback = (count) => { document.getElementById('searchStatus').textContent = `${count} results`; }
  const liveCallback = window.searchLiveCallback || null;

  function filterTools() {
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.card.tool');
    let visibleCount = 0;

    cards.forEach(card => {
      const text = (card.textContent || '').toLowerCase();
      const matches = query === '' || text.includes(query);
      card.style.display = matches ? '' : 'none';
      // For assistive tech, mark hidden items
      if (matches) {
        card.setAttribute('aria-hidden', 'false');
        visibleCount++;
      } else {
        card.setAttribute('aria-hidden', 'true');
      }
    });

    if (typeof liveCallback === 'function') {
      try { liveCallback(visibleCount); } catch (e) { /* fail safe */ }
    }
  }

  function filterDebounced() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterTools, 150);
  }

  if (input) {
    // Initial filter in case the input is prefilled
    filterTools();

    // Filter as the user types (debounced)
    input.addEventListener('input', filterDebounced);

    // Scoped Escape handling: clear and blur only when the input is focused
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        filterTools();
        input.blur();
      }
    });
  }
})();
