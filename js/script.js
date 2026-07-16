// Minimal search/filter implementation for the tool grid
function filterTools() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const query = input.value.trim().toLowerCase();
  const cards = document.querySelectorAll('.card.tool');

  cards.forEach(card => {
    const text = (card.textContent || '').toLowerCase();
    const matches = query === '' || text.includes(query);
    card.style.display = matches ? '' : 'none';
  });
}

// Optional: allow pressing Escape to clear the search box
document.addEventListener('keydown', (e) => {
  const input = document.getElementById('searchInput');
  if (!input) return;
  if (e.key === 'Escape') {
    input.value = '';
    filterTools();
    input.blur();
  }
});
