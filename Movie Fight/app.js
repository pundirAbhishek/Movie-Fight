const autoCompleteConfig = {
  renderOption: movie => {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})      
    `;
  },
  inputValue: movie => {
    return movie.Title;
  },
  fetchData: async searchTerm => {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "26910f5c",
        s: searchTerm
      }
    });

    if (response.data.Error) {
      return [];
    }
    return response.data.Search;
  }
};

createAutoComplete({
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect: movie => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
  ...autoCompleteConfig
});

createAutoComplete({
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect: movie => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
  ...autoCompleteConfig
});

let rightMovie;
let leftMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "26910f5c",
      i: movie.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplate(response.data);

  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    compare();
  }
};

const compare = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
      rightStat.classList.add('is-primary');
      rightStat.classList.remove('is-warning');
    }
    else{
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
      leftStat.classList.add('is-primary');
      leftStat.classList.remove('is-warning');
      
    }
  });
};

const movieTemplate = movieDetail => {
  const moneyMade = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, " ").replace(/,/g, "")
  );
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

  let count = 0;
  const awards = movieDetail.Awards.split(" ").reduce((preValue, word) => {
    const value = parseInt(word);
    if (isNaN(value)) {
      return preValue;
    }
    return preValue + value;
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${moneyMade} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Meta Scrore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
