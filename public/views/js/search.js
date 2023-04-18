function RedirectionVersIndex(searchQuery) {
  window.location.href = `/?search=${encodeURIComponent(searchQuery)}`;
}

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');

searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value.trim();
  RedirectionVersIndex(searchQuery);
});

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const searchQuery = searchInput.value.trim();
    RedirectionVersIndex(searchQuery);
  }
});
