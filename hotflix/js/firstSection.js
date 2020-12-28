'search.js';

window.addEventListener('load', (event) => {
  /**
   * definition to local varibales
   * */
  const serachBar = document.querySelector('.header__search');
  const searchInput = document.querySelector('.header__search-input');
  const burgerMenu = document.querySelector('.burger');
  const container = document.querySelector('.swiper-wrapper');
  const buttonMoblie = document.querySelector('.search-icon-mobile ');
  const headerMenu = document.querySelector('.header__nav');
  const latets = [];
  let markup = '';

  /**
     * fetch data from  Movie Datapase
     * @param {*} void
     * @returns {*} data from api
     */

  function Moviefetch() {
    fetch(
      'https://api.themoviedb.org/3/movie/top_rated?api_key=d21fd133a42d23df0df00bcf8f251627&language=en-US&page=1',
    )
      .then((resp) => resp.json())
      .then((data) => latestmovieData(data));
  }

  /**
     * to call the api from the main js page
     */
  function firstsection() {
    Moviefetch();
  }
  firstsection();
  /**
     *  push data to latests array and start drawing the card
     * @param {*} data
     */
  function latestmovieData(data) {
    data.results.forEach((movie) => {
      latets.push(movie);
    });
    swiperDrawer();
  }
  /**
    *
    *draw img card and append them to html with slickslider
    @param {*} void
    * @returns {*} html element
    */

  function swiperDrawer() {
    latets.forEach((Movie) => {
      const imgMovie = `https://image.tmdb.org/t/p/original${Movie.poster_path}`;
      const latestMovieRate = Movie.vote_average;
      const latestMovieTitle = Movie.title;
      const relaseDate = Movie.release_date;
      markup = `  <div class=movie-card data-id=${Movie.id}>
                <div class=movie-wrapper>
                <a  href="Moviepage.html?id=${Movie.id}">
                <img src="${imgMovie}" class="movie__poster" onerror="this.src='alternative.jpg';" >
                <div class="overlay">
                <i class="fa fa-play-circle icon"></i>  </div></div> </a>
        <span class="rate ${RateClass(latestMovieRate)}">${(latestMovieRate)}</span>
                <span class="movie__title">${latestMovieTitle}</span>
                <br>
                <span class="relase_date">${relaseDate}</span>
              </div>`;
      container.innerHTML += markup;
    });

    $(container).slick({
      slidesToShow: 5,
      slidesToScroll: 5,
      arrows: false,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
      ],
    });
  }
  /**
 *  search function to retrive the search qurey to the search.html page
 * @param {*} event
 */
  function submitted(event) {
    event.preventDefault();
    const { value } = searchInput;
    window.open(`search.html?id=${value}`, '_self');
  }
  serachBar.addEventListener('submit', submitted);

  /** Hamburger menu listner */
  burgerMenu.addEventListener('click', () => {
    headerMenu.classList.toggle('nav-active');
    burgerMenu.classList.toggle('x-style');
  });
  /** Event Listner to toggle search bar on moblie view */
  buttonMoblie.addEventListener('click', () => {
    serachBar.classList.toggle('serch-g');
    serachBar.style = 'display :block';
  });

  /** Check the vote value
 * @param {number}average_vote
 * @returns {string} class
 */
  function RateClass(averageVote) {
    return (averageVote > 7) ? 'rate-green' : 'rate-red';
  }
  const leftButtonSlider = document.querySelector('.left-button-slider');
  leftButtonSlider.addEventListener('click', (event) => {
    $(container).slick('slickPrev');
  });
  const rightButtonSlider = document.querySelector('.right-button-slider');
  rightButtonSlider.addEventListener('click', (event) => {
    $(container).slick('slickNext');
  });
});
