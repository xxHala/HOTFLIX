window.addEventListener('load', (event) => {
  const movieID = getParameterByName('id');
  GetDetails(movieID);
  getSimiler(movieID);
  const SmilierMovies = [];
  const serchInput = document.querySelector('.header__search-input');
  const buttonMoblie = document.querySelector('.search-icon-mobile ');
  const serchElment = document.querySelector('.header__search');
  const burgerMenu = document.querySelector('.burger');

  const headerMenu = document.querySelector('.header__nav');
  const Stars = [];
  const Crew = [];

  /**
 *  getting parameter names
 * @param {string} parameter_name (id)
 * @param {string} url query
 * @returns {number} movie_ID
 */
  function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  /**
 * Fetch movie details from the Movie-deatlis Api
 * @param {number} movie_ID
 * @returns {void}
 */
  function GetDetails(movieID) {
    fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=d21fd133a42d23df0df00bcf8f251627&language=en-US`)
      .then((response) => response.json())
      .then((data) => DrawMovieData(data));
  }

  /**
 * DrawMovie data and movie background image
 * the movie details
 * @param {object} data
 * @returns {void}
 */
  function DrawMovieData(data) {
    drawMovieCover(data.backdrop_path);
    drawMovieDetails(data);
  }

  /**
 * Retrive Founded-movie details on the page
 * @param {object} data
 * @returns {void}
 */
  function drawMovieDetails(data) {
    const movieTitle = data.original_title;
    const releaseYear = data.release_date.split('-')[0];
    const overView = data.overview;
    const generes = data.genres;
    const { status } = data;
    const popular = data.popularity;
    const movieElementDetails = document.querySelector('.movie-elements-details');
    let movieDetails = `
      <div class="play-component">

<button class="circle plus">
</button>
 <span> play</span>
</div>
    <div class="title-info">
    <span class="movie-title">${movieTitle}</span> </div>
    <div class = 'movie-information'>
    <span class="movie-release-year">${releaseYear}</span>
    <span class="movie-status">${status}</span>
    <span class="popularity">${popular}</span> </div>
    <div class = 'trailer'>
    <img class= 'trailer-pic' src="video-play-xxl.png" alt="playButton">
    <span class ='trailer-text'>trailer</span>
    <div class="trailer-display"></div>
    <div class="trailer-error">Oops!, There is No Tralier Found For this movie</div>
    </div>
    <span class="movie-overview">${overView}</span>
    <div class="movie-genres-holder"></div>
    `;
    movieElementDetails.innerHTML += movieDetails;
    const movieGenres = document.querySelector('.movie-genres-holder');
    generes.forEach((element) => {
      movieGenres.innerHTML += `<span class="movie-genres">${element.name}</span>`;
    });
    movieDetails = `
    <span class="title-main-actors">Directors </span>
    <div class="movie-director "></div>
    <span class = "title-main-actors"> Stars </span>
    <div class="movie-stars"></div>
    </div>`;
    movieElementDetails.innerHTML += movieDetails;
    MovieStar(data.id);
    const trailerPicture = document.querySelector('.trailer-pic');
    trailerPicture.addEventListener('click', () => getTralier(movieID));
  }

  /**
   *  getting movie-Tralier if found otherwise return nothing
   * @param {*} id  Movie-id
   * @returns {*} void
   */
  function getTralier(id) {
    let videokey = 0;
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=d21fd133a42d23df0df00bcf8f251627&language=en-US`)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length == 0) {
          const tralierERROR = document.querySelector('.trailer-error');
          tralierERROR.style = 'display:block';
        } else {
          videokey = data.results[0].key;
          const keyElment = document.querySelector('.trailer-pic');
          $(keyElment).click(() => {
            swal.fire({
              title: 'Tralier Video!',
              width: '850px',
              html: `<div class="resp-container">
              <iframe width="750px" height="450px"
               src="https://www.youtube.com/embed/${videokey}" 
               frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div>`,
              showCancelButton: false,
              showConfirmButton: false,
            });
          });
        }
      });
  }

  /**
 *  Draw backgdound cover of the movie-poster and getting Movie-Poster itself.
 * @param {string} imgCover
 * @returns {void}
 */
  function drawMovieCover(imgCover) {
    const imgContainer = document.querySelector('.movie-img-elements');
    const htmlhead = document.getElementsByTagName('head')[0];
    const styleElement = document.createElement('style');
    const imgMovie = `https://image.tmdb.org/t/p/original${imgCover}`;
    imgContainer.innerHTML = `<img src='${imgMovie}'>`;
    const posterElement = htmlhead.appendChild(styleElement);
    const moviePoster = `
    .movie-img-warpper::before {
            background-image: url(${imgMovie});
            background-size: cover;
            content: "";
            ackgroundPosition: 'center';
            height: 100%;
            left: 0;
            opacity: 39%;
            position: absolute;
            top: 0;
            width: 100%;
            z-index: -3; }`;
    posterElement.innerHTML = moviePoster;
  }

  /**
 * fetch only first 5 stars and first 5crew
 * of the movie if they are more than 5 else retrive them all
 *  from credits API
 * @param {number} moive_id
 * @returns {void}
 */
  function MovieStar(id) {
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=d21fd133a42d23df0df00bcf8f251627&language=en-US`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cast.length >= 5) for (let i = 0; i < 5; i++) Stars.push(data.cast[i]);
        else data.cast.map((actor) => Stars.push(actor));
        if (data.crew.length >= 5) for (let i = 0; i < 5; i++) Crew.push(data.crew[i]);
        else data.crew.map((creww) => Crew.push(creww));

        const actors = document.querySelector('.movie-stars');
        Stars.forEach((actor) => {
          actors.innerHTML += `<span class='actor-name'>${actor.name}</span>`;
        });
        const director = document.querySelector('.movie-director');
        Crew.forEach((crew) => {
          director.innerHTML += `<span class='actor-name'>${crew.name}</span>`;
        });
      });
  }

  /**
 * Fetch similer movies from the similar API
 * @param {number} movie_ID
 * @returns {void}
 */
  function getSimiler(movieID) {
    fetch(`https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=d21fd133a42d23df0df00bcf8f251627&language=en-US&page=1`)
      .then((response) => (response.json())
        .then((data) => SimilersData(data)));
  }
  /**
 * fetch similar Movies and add slider iff there is smilar ones
 * @param {object} data
 * @returns {void}
 */
  function SimilersData(data) {
    if (data.results.length > 0) {
      Slider();
      data.results.map((movie) => SmilierMovies.push(movie));
      const container = document.querySelector('.swiper-wrapper-secound');
      let markup = '';
      const imgurl = 'https://image.tmdb.org/t/p/original/';
      SmilierMovies.forEach((movie) => {
        markup = `
        <div class="movie-card">
        <div class=movie-wrapper>
        <a  href="Moviepage.html?id=${movie.id}">
        <img src="${imgurl + movie.poster_path}" onerror="this.src='alternative.jpg';" class="movie__poster">
        <div class="overlay">
                <i class="fa fa-play-circle icon"></i>  </div>
       </a>
        <span class="rate ${RateClass(movie.vote_average)}">${(movie.vote_average)}</span>
        <a class="movie__title" href="/pages/movie.html?id=${movie.id}">${movie.title}</a><br/>
        <span class="relase_date">${movie.release_date}</span>
       </div></div>`;
        container.innerHTML += markup;
      });
      $(container).slick({
        arrows: false,
        slidesToScroll: 10,
        slidesToShow: 6,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 3,

            },
          },
        ],
      });
    } else {
      document.querySelector('.swiper-container').style.display = 'none';
    }
  }

  /**
 * adding slider for smiliar Movies
 * @param {void}
 * @returns {void}
 */
  function Slider() {
    document.querySelector('.swiper-container').innerHTML = `
    <div class="section-two">
		<div class="content__main">
				<div class="shared-continer">
        <div class="tilte_nav">
    <span class="content__title">More to watch</span>
    <div class="buttons">
    <button class="left-button-slider" title="Previous">
    &leftarrow;
    </button>
    <button class="right-button-slider" title="Next">
    &rightarrow;
    </button>
    </div>
    </div>
   <div class="swiper-wrapper-secound"></div>
     </div>`;
    Buttons();
  }
  /** Check the vote value
 * @param {number}average_vote
 * @returns {string} class name
 */
  function RateClass(averageVote) {
    return (averageVote > 7) ? 'rate-high' : 'rate-low';
  }

  /** Hamburger menu listner */
  burgerMenu.addEventListener('click', () => {
    headerMenu.classList.toggle('nav-active');
    burgerMenu.classList.toggle('x-style');
  });
  /**
  * event listner to toggle search bar on moblie-view
  */
  buttonMoblie.addEventListener('click', () => {
    serchElment.classList.toggle('serch-g');
    serchElment.style = 'display :block';
		     });
  /**
 *  search function to retrive the search qurey to the search.html page
 * @param {*} event
 */
  function submitted(event) {
    event.preventDefault();
    const { value } = serchInput;
    window.open(`search.html?id=${value}`, '_self');
  }
  serchElment.addEventListener('submit', submitted);

  /**
 * Trun on listeners of slider buttons
 * @param {void}
 * @returns {void}
 */
  function Buttons() {
  // get slider class
    const movieSlider = document.querySelector('.swiper-wrapper-secound');
    // left button for slider listener
    const leftButtonSlider = document.querySelector('.left-button-slider');
    leftButtonSlider.addEventListener('click', (event) => {
      $(movieSlider).slick('slickPrev');
    });
    // right button for slider listener
    const rightButtonSlider = document.querySelector('.right-button-slider');
    rightButtonSlider.addEventListener('click', (event) => {
      $(movieSlider).slick('slickNext');
    });
  }
});
