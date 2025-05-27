document.addEventListener('DOMContentLoaded', () => {
  const movieGrid = document.getElementById('movieGrid');
  const searchInput = document.getElementById('searchInput');

  const savedTheme = localStorage.getItem('theme');
  document.body.classList.add(savedTheme === 'dark' ? 'dark-theme' : 'light-theme');

  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  function renderWatchlist(movies) {
    movieGrid.innerHTML = '';

    if (movies.length === 0) {
      movieGrid.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 80vh;
          text-align: center;
          font-family: 'Inter', sans-serif;
          color: #555;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" fill="none" viewBox="0 0 24 24" stroke="#ccc" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17v1a2 2 0 002 2h2a2 2 0 002-2v-1m-6 0H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4m-6 0h6"/>
          </svg>
          <h2 style="margin-top: 20px;">No movies added</h2>
          <a href="/home" style="
            margin-top: 25px;
            padding: 12px 28px;
            background-color: #e50914;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.3s ease;
          ">Back to Home</a>
        </div>
      `;
      return;
    }

    movies.forEach((movie, index) => {
      const card = document.createElement('div');
      card.className = 'movie-card';
      card.setAttribute('data-title', movie.title);

      card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="watch-actions">
            <button class="watch-toggle">Mark as Watched</button>
            <button class="remove-btn" data-index="${index}">Remove</button>
          </div>
        </div>
      `;

      movieGrid.appendChild(card);
    });
  }

  // Initial render
  renderWatchlist(watchlist);

  // Remove from watchlist
  movieGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const index = e.target.dataset.index;
      watchlist.splice(index, 1);
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
      renderWatchlist(watchlist);
    }
  });

  // Search filter
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = watchlist.filter(movie => movie.title.toLowerCase().includes(query));
    renderWatchlist(filtered);
  });
});
