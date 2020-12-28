window.addEventListener('DOMContentLoaded', (event) => {
  let pageNum = 1;
  let isLoading = false;
  const releases = document.querySelector('.main-content');
  const serachBar = document.querySelector('.header__search');
  const hederInput = document.querySelector('.header__search-input');
  const burgerMenu = document.querySelector('.burger');
  const headerMenu = document.querySelector('.header__nav');
  let startFetchPoint = releases.offsetTop + releases.offsetHeight;
  const queryString = getParameterByName('id');
  showMovies(queryString);

  /**
 * Get movie ID from the url
 * @param {string} parameter_name (id)
 * @param {string} url query
 * @returns {number} movie id
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
  *   requests the movie data from the Api using fetch.
  * Then it puts those data in the main HTML.
  * @param {*} url
 */
  function showMovies(queryString) {
    isLoading = true;
    fetch(`https://api.themoviedb.org/3/search/movie?&api_key=d21fd133a42d23df0df00bcf8f251627&query=${queryString}&page=${pageNum}`)
      .then((response) => response.json())
      .then((data) => {
        if (parseInt(data.total_pages) < 20) {
          if (data.results.length === 0) { document.querySelector('.not-found').style = 'display:block'; } else {
            data.results.forEach((element) => {
              const main = document.querySelector('.main-content');
              let markup = '';
              const imgMovie = `https://image.tmdb.org/t/p/original${element.poster_path}`;
              const latestMovieRate = element.vote_average;
              const latestMovieTitle = element.title;
              const relaseDate = element.release_date;
              markup = `<div class="movie-card">
                <div class=movie-wrapper>
                <a  href="Moviepage.html?id=${element.id}">
                <img src="${imgMovie}" class="movie__poster"  onerror="this.src='alternative.jpg';">
                <div class="overlay">
                <i class="fa fa-play-circle icon"></i>  </div> </a></div> 
                <span class="rate ${RateClass(latestMovieRate)}">${(latestMovieRate)}</span>
                <span class="movie__title">${latestMovieTitle}</span>
                <br>
                <span class="relase_date">${relaseDate}</span>
              </div>`;
              main.innerHTML += markup;
            });
            startFetchPoint = releases.offsetTop + releases.offsetHeight;
            isLoading = false;
            document.querySelector('.not-found').style = 'display:none';
          }
        }
      });
  }
  /** Check the vote value
 * @param {number}average_vote
 * @returns {string} class name
 */
  function RateClass(averageVote) {
    return (averageVote >= 7) ? 'rate-green' : 'rate-red';
  }
  /**
   *  search function to retrive the search query to the same page
   * @param {*} event
   */

  function submitted(event) {
    event.preventDefault();
    const { value } = hederInput;
    window.open(`search.html?id=${value}`, '_self');
  }
  serachBar.addEventListener('submit', submitted);
  /**
   * scroll event listner when the page is close to the end of the total height
   *
   */
  document.addEventListener('scroll', () => {
    if ((window.scrollY >= startFetchPoint - window.innerHeight) && !isLoading) {
      const currentScroll = window.scrollY;
      showMovies(++pageNum);
      window.scrollTo(0, currentScroll);
    }
  });

  /** Hamburger Menu Listner */

  burgerMenu.addEventListener('click', () => {
    headerMenu.classList.toggle('nav-active');
    burgerMenu.classList.toggle('x-style');
  });
});
