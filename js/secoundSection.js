window.addEventListener('DOMContentLoaded', (event) => {
  let pageNum = 1;
  let isLoading = false;
  document.querySelector('.loader').style.display = 'none';
  const latets = [];
  const releases = document.querySelector('.section-two');
  let startFetchPoint = releases.offsetTop + releases.offsetHeight;

  /**
   * fetch data from popular Movie pages
   * @param {*} void
   * @returns {*} data from api
   */
  function getMovies() {
    isLoading = true;
    document.querySelector('.loader').style.display = 'block';
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=d21fd133a42d23df0df00bcf8f251627&language=en-US&page=${pageNum}`;
    fetch(url)
      .then((results) => results.json())
      .then((data) => movieData(data));
  }
  /**
     * push data from pages to array and call draw function
     * @param {*} data
     * @returns {*} data from api
     */
  function movieData(data) {
    data.results.forEach((movie) => {
      latets.push(movie);
    });
    Drawer();
  }
  /**
     * function to draw html into secound section
     * @param {*} void
     * @returns {*} html markup-
     */
  function Drawer() {
    let htmlStr = '';
    let htmlCards = '';
    latets.forEach((Movie) => {
      const imgMovie = `https://image.tmdb.org/t/p/original${Movie.poster_path}`;
      const latestMovieRate = Movie.vote_average;
      const latestMovieTitle = Movie.title;
      const relaseDate = Movie.release_date;
      htmlStr = `<div class=movie-card>
                <div class=movie-wrapper>
                <a  href="Moviepage.html?id=${Movie.id}">
                <img src="${imgMovie}" class="movie__poster" onerror="this.src='alternative.jpg';">
                <div class="overlay">
                <i class="fa fa-play-circle icon"></i>  </div></div> </a>
        <span class="rate ${RateClass(latestMovieRate)}">${(latestMovieRate)}</span>
                <span class="movie__title">${latestMovieTitle}</span>
                <span class="relase_date">${relaseDate}</span>
              </div>`;
      htmlCards += htmlStr;
    });
    document.querySelector('.swiper-wrapper-secound').innerHTML += htmlCards;
    startFetchPoint = releases.offsetTop + releases.offsetHeight;
    isLoading = false;
    document.querySelector('.loader').style.display = 'none';
  }

  getMovies(pageNum);

  /** Check the vote value
 * @param {number}average_vote
 * @returns {string} class name
 */
  function RateClass(averageVote) {
    return (averageVote > 7) ? 'rate-green' : 'rate-red';
  }
  /**
   * event listner to load more content form api page on load " on the end of the section "
  */

  document.addEventListener('scroll', () => {
    if ((window.scrollY >= startFetchPoint - window.innerHeight) && !isLoading) {
      const currentScroll = window.scrollY;
      getMovies(++pageNum);
      window.scrollTo(0, currentScroll);
    }
  });
});
