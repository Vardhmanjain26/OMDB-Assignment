//Initial References
let movieNameRef = document.getElementById("movie-name");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
let searchList = document.getElementById("search-list"); // Add a reference to the search list element

const key = "30fa867d";
const apiUrl = "http://www.omdbapi.com/";

//Function to fetch data from API
let getMovie = (movieName) => {
  let url = `${apiUrl}?t=${movieName}&apikey=${key}`;

  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      //If movie exists in database
      if (data.Response == "True") {
        result.innerHTML = `
            <div class="info">
                <img src=${data.Poster} class="poster">
                <div>
                    <h2>${data.Title}</h2>
                    <div class="rating">
                        <img src="star-icon.svg">
                        <h4>${data.imdbRating}</h4>
                    </div>
                    <div class="details">
                        <span>${data.Rated}</span>
                        <span>${data.Year}</span>
                        <span>${data.Runtime}</span>
                    </div>
                    <div class="genre">
                        <div>${data.Genre.split(",").join("</div><div>")}</div>
                    </div>
                </div>
            </div>
            <h3>Plot:</h3>
            <p>${data.Plot}</p>
            <h3>Cast:</h3>
            <p>${data.Actors}</p>  
        `;
      } else {
        result.innerHTML = `<h3 class='msg'>${data.Error}</h3>`;
      }
    })
    .catch(() => {
      result.innerHTML = `<h3 class="msg">Error Occured</h3>`;
    });
};

// Function to update the search list
let updateSearchList = () => {
    let movieName = movieNameRef.value;
    if (movieName.length <= 0) {
      searchList.innerHTML = "";
    } else {
      let url = `${apiUrl}?s=${movieName}&apikey=${key}`;
  
      fetch(url)
        .then((resp) => resp.json())
        .then((data) => {
          if (data.Response == "True") {
            let suggestions = data.Search.map((movie) => movie.Title);
            let listItems = suggestions.map(
              (title) => `<li onclick="selectMovie('${title}')">${title}</li>`
            );
            searchList.innerHTML = `<ul>${listItems.join("")}</ul>`;
  
            // Calculate the height of the search list and adjust the position of the movie details section
            let searchListHeight = searchList.getBoundingClientRect().height;
            result.style.marginTop = `${searchListHeight}px`;
          } else {
            searchList.innerHTML = "";
          }
        })
        .catch(() => {
          searchList.innerHTML = "";
        });
    }
  };
  
  // Function to select a movie from the search list
  let selectMovie = (movieName) => {
    movieNameRef.value = movieName;
    searchList.innerHTML = "";
    result.style.marginTop = "0"; // Reset the position of the movie details section
    getMovie(movieName);
  };
  
  searchBtn.addEventListener("click", () => getMovie(movieNameRef.value));
  movieNameRef.addEventListener("input", updateSearchList);
  window.addEventListener("load", () => getMovie(movieNameRef.value));


  