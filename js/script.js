// Enhanced search/filter implementation for the tool grid
// - Debounced input handling for performance
// - Scoped Escape handling on the input
// - aria-hidden toggling for accessibility
// - Optional liveCallback to announce results (hook into a role="status" element)
// - Performance optimizations: caching, early returns, error handling
// - Keyboard navigation support

(function () {
  const input = document.getElementById('searchInput');
  let searchTimeout = null;
  const cardCache = new Map(); // Cache searchable text for performance

  // Optional callback: set this to a function(count, total) to announce results via a live region.
  // Example in HTML:
  // <div id="searchStatus" role="status" aria-live="polite" class="sr-only" aria-atomic="true"></div>
  // window.searchLiveCallback = (count, total) => { document.getElementById('searchStatus').textContent = `Found ${count} of ${total} tools`; }
  const liveCallback = window.searchLiveCallback || null;

  /**
   * Get searchable text for a card, with caching
   */
  function getCardSearchText(card) {
    if (cardCache.has(card)) {
      return cardCache.get(card);
    }
    const text = (card.textContent || '').toLowerCase().trim();
    cardCache.set(card, text);
    return text;
  }

  /**
   * Filter and display tools based on search query
   */
  function filterTools() {
    if (!input) return;
    
    try {
      const query = input.value.trim().toLowerCase();
      const cards = document.querySelectorAll('.card.tool');
      
      if (!cards || cards.length === 0) {
        console.warn('No tool cards found with selector .card.tool');
        return;
      }

      let visibleCount = 0;

      cards.forEach((card) => {
        if (!card) return;
        
        const searchText = getCardSearchText(card);
        const isMatch = query === '' || searchText.includes(query);

        if (isMatch) {
          card.style.display = '';
          card.setAttribute('aria-hidden', 'false');
          visibleCount++;
        } else {
          card.style.display = 'none';
          card.setAttribute('aria-hidden', 'true');
        }
      });

      // Announce results to live region
      if (typeof liveCallback === 'function') {
        try {
          liveCallback(visibleCount, cards.length);
        } catch (e) {
          console.warn('Live callback error:', e);
        }
      }
    } catch (e) {
      console.error('Filter error:', e);
    }
  }

  /**
   * Debounced filter handler
   */
  function filterDebounced() {
    if (searchTimeout !== null) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(filterTools, 150);
  }

  /**
   * Initialize search functionality
   */
  function init() {
    if (!input) {
      console.warn('Search input element not found (#searchInput)');
      return;
    }

    // Initial filter in case the input is prefilled
    filterTools();

    // Filter as the user types (debounced)
    input.addEventListener('input', filterDebounced);

    // Scoped Escape handling: clear and blur only when the input is focused
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        input.value = '';
        filterTools();
        input.blur();
      }
    });

    // Optional: Focus on search input with Cmd/Ctrl + K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        input.focus();
        input.select();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
