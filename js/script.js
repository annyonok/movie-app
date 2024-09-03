// api
// https://kinopoiskapiunofficial.tech/
// api key: 9034e172-4ab9-4ebc-a7da-52cf87b70781

const API_KEY = '9034e172-4ab9-4ebc-a7da-52cf87b70781';
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';
const API_URL_MOVIE_DETAILS = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

getMovies(API_URL_POPULAR);

async function getMovies(url) {
    const resp = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
    });
    const respData = await resp.json();
    showMovies(respData);
}

// Для поиска
async function getSearchMovies(url) {
    const resp = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
    });
    const respData = await resp.json();
    showSearchMovies(respData);
}

function getClassByRate(vote) {
    if (vote >= 7) {
        return 'green';
    } else if (vote > 5) {
        return 'orange';
    } else {
        return 'red';
    }
}

function showMovies(data) {
    const moviesEl = document.querySelector('.movies');

    //Очищаем предыдущие фильмы
    document.querySelector('.movies').innerHTML = '';

    data.items.forEach((movie) => {
        const movieEl = document.createElement('div')
        movieEl.classList.add('movies__card')
        movieEl.innerHTML = `
        <div class="movie__cover_inner">
                        <img class="movie__cover"
                            src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
                        <div class="movie__cover_darkened"></div>
                    </div>

                    <div class="movie__info">
                        <div class="movie__title">${movie.nameOriginal}</div>
                        <div class="movie__category">${movie.genres.map(
            (genre) => ` ${genre.genre}`
        )}</div>
                        <div class="movie__average movie_average-${getClassByRate(movie.ratingKinopoisk)}">${movie.ratingKinopoisk}</div>
                    </div>
        `;
        // Обработчик для модалки
        movieEl.addEventListener('click', () => openModal(movie.kinopoiskId));
        moviesEl.appendChild(movieEl)
    });
}

// Для поиска
function showSearchMovies(data) {
    const moviesEl = document.querySelector('.movies');

    //Очищаем предыдущие фильмы
    document.querySelector('.movies').innerHTML = '';

    data.films.forEach((movie) => {
        const movieEl = document.createElement('div')
        movieEl.classList.add('movies__card')
        movieEl.innerHTML = `
        <div class="movie__cover_inner">
            <img class="movie__cover"
            src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
            <div class="movie__cover_darkened"></div>
        </div>

        <div class="movie__info">
            <div class="movie__title">${movie.nameEn}</div>
            <div class="movie__category">${movie.genres.map(
            (genre) => ` ${genre.genre}`
    )}</div>

    ${movie.rating ? `<div class="movie__average movie_average-${getClassByRate(movie.rating)}">${movie.rating}</div>` : ''}
            </div>
        `;
        // Обработчик для модалки
        movieEl.addEventListener('click', () => openModal(movie.filmId));
        moviesEl.appendChild(movieEl);
    });
}

const form = document.querySelector('form');
const search = document.querySelector('.header__search');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
    if (search.value) {
        getSearchMovies(apiSearchUrl);

        search.value = '';
    }
})

//Modal
const modalEl = document.querySelector('.modal');

async function openModal(id) {
    const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
    });
    const respData = await resp.json();

    modalEl.classList.add('modal__show');
    //При открытии модалки запрещаем скролл для body
    document.body.classList.add('stop__scrolling');

modalEl.innerHTML = `
<div class="modal__card">
    <img class="modal__movie_backdrop" src="${respData.posterUrlPreview}" alt="">
    <h2>
        <div class="modal__movie_title">${respData.nameOriginal}</div>
        <div class="modal__movie_release-year"> ${respData.year}</div>
    </h2>
    <ul class="modal__movie_info">
        <div class="loader"></div>
        <li class="modal__movie_genre">Жанр: ${respData.genres.map(
            (el) => ` <span>${el.genre}</span>`
    )}</li>
        ${respData.filmLength ? `<li class="modal__movie_runtime">Продолжительность: ${respData.filmLength} мин.</li>` : ''}
        <li>Сайт: <a class="modal__movie_site" href="${respData.webUrl}" target="_blank">${respData.webUrl}</a></li>
        <li class="modal__movie_overview">Описание: ${respData.description}</li>
    </ul>
    <button class="modal__button_close">Закрыть</button>
</div>
`;

// Закрываем при клике на кнопку
const btnClose = document.querySelector('.modal__button_close');
btnClose.addEventListener('click', () => {
    closeModal()
})
}

function closeModal() {
    modalEl.classList.remove('modal__show');
    document.body.classList.remove('stop__scrolling');
}

// Закрываем при клике по пустому месту
window.addEventListener('click', (e) => {
    if(e.target === modalEl) {
        closeModal();
    }
})

// Обработчик при нажатии кнопки esc
window.addEventListener('keydown', (e) => {
    if(e.keyCode === 27) {
        closeModal();
    }
})

