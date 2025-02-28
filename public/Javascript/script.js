document.addEventListener('DOMContentLoaded', () => {
    const WATCHLIST_KEY = 'watchlist';
    const mainContainer = document.querySelector('.watchlist-container');
    const getWatchlist = () => JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || [];
    const saveWatchlist = (watchlist) => {
        try {
            localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    };

    const showAlert = (icon, title, htmlContent) => {
        Swal.fire({
            icon,
            title,
            html: htmlContent,
        });
    };
    
    const showEmptyMessage = (container) => {
        container.innerHTML = '';
        const emptyMessage = document.createElement('p');
        emptyMessage.innerHTML = 'Your Watchlist is <span style="color:red;">EMPTY</span>';
        container.appendChild(emptyMessage);
    };

    const appendToWatchlist = (movie, container) => {
        const newItem = document.createElement('div');
        newItem.id = `movie-${movie.id}`;
        newItem.classList.add('watchlist-item');
        newItem.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="watchlist-poster">
            <a href="/movie/${movie.id}" class="watchlist-title">${movie.title}</a>
            <button class="remove-from-watchlist-btn" data-id="${movie.id}">Remove</button>
        `;
        container.appendChild(newItem);
    };

    const removeFromWatchlist = (movieId, container) => {
        const watchlist = getWatchlist();
        const movieIndex = watchlist.findIndex(item => item.id === movieId);

        if (movieIndex > -1) {
            const [removedMovie] = watchlist.splice(movieIndex, 1);
            saveWatchlist(watchlist);

            const movieElement = document.getElementById(`movie-${movieId}`);
            if (movieElement) {
                movieElement.remove();
            }

            if (container.children.length === 0) {
                showEmptyMessage(container);
            }

            showAlert('error', 'Removed from Watchlist', `<span style="color:red;">${removedMovie.title}</span> has been removed from your watchlist!`);
        }
    };

    // Initialize watchlist container
    if (mainContainer) {
        let watchlistContainer = mainContainer.querySelector('.subwatchlist_container');

        if (!watchlistContainer) {
            watchlistContainer = document.createElement('div');
            watchlistContainer.classList.add('subwatchlist_container');
            mainContainer.appendChild(watchlistContainer);
        } else {
            watchlistContainer.innerHTML = '';
        }

        const watchlist = getWatchlist();
        if (watchlist.length > 0) {
            watchlist.forEach(movie => appendToWatchlist(movie, watchlistContainer));
        } else {
            showEmptyMessage(watchlistContainer);
        }

        watchlistContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-from-watchlist-btn')) {
                const movieId = event.target.getAttribute('data-id');
                removeFromWatchlist(movieId, watchlistContainer);
            }
        });
    }

    // Add to Watchlist event listener
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-watchlist-btn')) {
            const button = event.target;
            const movieCard = button.closest('.movie-card');
            const movie = {
                id: button.getAttribute('data-id'),
                title: movieCard.querySelector('.movie-title').innerText,
                poster: movieCard.querySelector('img').src,
            };

            const watchlist = getWatchlist();
            if (watchlist.some(item => item.id === movie.id)) {
                showAlert('info', 'Already in Watchlist', `<span style="color:red;">${movie.title}</span> is already in your watchlist!`);
                return;
            }

            watchlist.push(movie);
            saveWatchlist(watchlist);
            showAlert('success', 'Added to Watchlist', `<span style="color:red;">${movie.title}</span> has been added to your watchlist!`);
            appendToWatchlist(movie, document.querySelector('.subwatchlist_container'));
        }
    });

    // Search Bar for Watchlist
    const watchlistSearchBar = document.getElementById('search-bar');
    if (watchlistSearchBar) {
        watchlistSearchBar.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase().trim();
            const watchlistItems = document.querySelectorAll('.watchlist-item');

            watchlistItems.forEach(item => {
                const title = item.querySelector('.watchlist-title').innerText.toLowerCase().trim();
                item.style.display = title.includes(query) ? 'block' : 'none';
            });
        });
    }

    // Home Page Search Bar
    const homeSearchBar = document.getElementById('search-bar');
    if (homeSearchBar) {
        homeSearchBar.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase().trim();
            const movieCards = document.querySelectorAll('.movie-card');

            movieCards.forEach(card => {
                const title = card.querySelector('.movie-title').innerText.toLowerCase().trim();
                card.style.display = title.includes(query) ? 'block' : 'none';
            });
        });
    }

    // Video playback Play/Pause
    const videoElement = document.getElementById('video');
    
    if (videoElement) {
        const videoKey = "videoCurrentTime";
        const lastPlayedTime = localStorage.getItem(videoKey);
         
        if (lastPlayedTime) {
            videoElement.currentTime = (lastPlayedTime);
            
            console.log(`Resuming from ${lastPlayedTime} seconds.`);
        }
        videoElement.addEventListener('pause', () => {
            localStorage.setItem(videoKey, videoElement.currentTime);
             
            console.log(`Video paused at ${videoElement.currentTime} seconds.`);          
        }); 
    }
});


//Footer
document.getElementById('current-year').textContent = new Date().getFullYear();
















