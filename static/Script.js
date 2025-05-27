// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.checked = true;
}


// Prevent form from submitting and reloading the page
document.querySelector('form')?.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Watchlist functionality
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function updateWatchlist(movie) {
    const index = watchlist.findIndex(item => item.title === movie.title);
    if (index === -1) {
        watchlist.push(movie);
    } else {
        watchlist.splice(index, 1);
    }
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

function isInWatchlist(movie) {
    return watchlist.some(item => item.title === movie.title);
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const isWatchlisted = isInWatchlist(movie);

    card.innerHTML = `
        <img class="movie-poster" src="${movie.poster}" alt="${movie.title}">
        <div class="movie-info">
            <div class="movie-title">${movie.title}</div>
            <div class="movie-actions">
                <button class="watch-trailer-btn" data-trailer="${movie.trailer}">
                    <span class="btn-icon">▶</span> Trailer
                </button>
                <button class="add-watchlist-btn ${isWatchlisted ? 'added' : ''}">
                    ${isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
            </div>
        </div>
    `;

    const trailerBtn = card.querySelector('.watch-trailer-btn');
    const watchlistBtn = card.querySelector('.add-watchlist-btn');

    trailerBtn.addEventListener('click', () => {
        if (movie.trailer === "No trailer available") {
            alert("Trailer not available for this movie.");
        } else {
            showTrailerModal(movie.title, movie.trailer);
        }
    });

    watchlistBtn.addEventListener('click', () => {
        updateWatchlist(movie);
        const isNowInWatchlist = isInWatchlist(movie);
        watchlistBtn.textContent = isNowInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
        watchlistBtn.classList.toggle('added', isNowInWatchlist);
    });

    return card;
}


// Trailer Modal
function convertToEmbedUrl(url) {
    let videoId;
    if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

function showTrailerModal(title, trailerUrl) {
    const modal = document.createElement('div');
    modal.className = 'trailer-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">×</button>
            <h2>${title} - Trailer</h2>
            <div class="video-container">
                <iframe width="560" height="315" 
                    src="${convertToEmbedUrl(trailerUrl)}"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}


// Movie search and recommendation
const movieInput = document.getElementById('movie-input');
const searchBtn = document.getElementById('search-btn');
const recommendationsGrid = document.getElementById('recommendations');

searchBtn.addEventListener('click', () => {
    const userInput = movieInput.value.trim();
    if (!userInput) return;

    searchBtn.disabled = true;
    searchBtn.textContent = 'Loading...';
    recommendationsGrid.innerHTML = '';

    fetch(`/api/recommend?movie=${encodeURIComponent(userInput)}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                recommendationsGrid.innerHTML = `<p class="error">${data.error}</p>`;
                return;
            }

            data.forEach(movie => {
                recommendationsGrid.appendChild(createMovieCard(movie));
            });
        })
        .catch(err => {
            recommendationsGrid.innerHTML = `<p class="error">Error fetching recommendations. Try again later.</p>`;
            console.error(err);
        })
        .finally(() => {
            searchBtn.disabled = false;
            searchBtn.textContent = 'Get Recommendations';
        });
});
