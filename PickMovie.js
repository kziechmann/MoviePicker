document.addEventListener('DOMContentLoaded', (event) => {
  let suggestedMovie = "FreeSolo"
  let selectedGenre = "99"
  let moviePoster = document.querySelector("#poster")
  let movieTitle = document.querySelector("#title")
  let movieYear = document.querySelector("#year")
  let movieRating = document.querySelector("#stars")
  let movieMaturity = document.querySelector("#maturity")
  let movieRuntime = document.querySelector("#runtime")
  let movieGenre = document.querySelector("#genre")
  let moviePlot = document.querySelector("#plot")
  let movieWebsite = document.querySelector("#website")
  let favoriteButton = document.querySelector("#Favorite")
  let favoriteNum = 1


  // Create Genre Buttons
  let buttons = document.querySelectorAll("#buttonContainer button")
  for(let button of buttons){
    button.addEventListener('click', ()=>{
      buttons.forEach((btn)=>{btn.classList = "genre"})
      selectedGenre = selectGenre(button.innerText)
      button.classList = "selected"
    })
  }

  // Assign TMDB genre code to selectedGenre
  let selectGenre = buttonText =>{
    switch(buttonText) {
    case "ACTION":
        return "28"
        break;
    case "ADVENTURE":
        return "12"
        break;
    case "ANIMATION":
        return "16"
        break;
    case "COMEDY":
        return "35"
        break;
    case "CRIME":
        return "80"
        break;
    case "DOCUMENTARY":
        return "99"
        break;
    case "DRAMA":
        return "18"
        break;
    case "FAMILY":
        return "10751"
        break;
    case "FANTASY":
        return "14"
        break;
    case "HORROR":
        return "27"
        break;
    case "ROMANCE":
        return "10749"
        break;
    case "SCI-FI":
        return "878"
        break;
    case "THRILLER":
        return "53"
        break;
    case "WAR":
        return "10752"
        break;
    default:
}
  }

  // Adding favorites in local storage
  favoriteButton.addEventListener('click', ()=>{
    if (favoriteNum === 1) {
      favoriteNum = 2
      document.querySelector("#fbutton1").style = ""
      let favoriteMovie1 = {}
      storeFavoriteInfo(favoriteMovie1)
      localStorage.setItem('favoriteMovie1', JSON.stringify(favoriteMovie1))
    } else if (favoriteNum === 2) {
      let favoriteMovie2 = {}
      favoriteNum = 1
      document.querySelector("#fbutton2").style = ""
      storeFavoriteInfo(favoriteMovie2)
      localStorage.setItem('favoriteMovie2', JSON.stringify(favoriteMovie2))
    }
  })

  let storeFavoriteInfo = function(favMovieObj){
    favMovieObj["movieTitle"] = movieTitle.innerText
    favMovieObj["moviePoster"] = moviePoster.src
    favMovieObj["movieYear"] = movieYear.innerText
    favMovieObj["movieRating"] = movieRating.innerText
    favMovieObj["movieMaturity"] = movieMaturity.innerText
    favMovieObj["movieGenre"] = movieGenre.innerText
    favMovieObj["movieRuntime"] = movieRuntime.innerText
    favMovieObj["moviePlot"] = moviePlot.innerText
    favMovieObj["movieWebsite"] = movieWebsite.href
    favMovieObj["suggestedMovie"] = suggestedMovie
    favMovieObj["trailerURL"] = document.querySelector("#player").src
  }

  // Retrieving favorites from local storage
  let favorite1 = document.querySelector("#fbutton1")
  favorite1.addEventListener('click', ()=>{
    let favMovie = JSON.parse(localStorage.getItem('favoriteMovie1'))
    updateFromFavoriteInfo(favMovie)
  })

  let favorite2 = document.querySelector("#fbutton2")
  favorite2.addEventListener('click', ()=>{
    let favMovie = JSON.parse(localStorage.getItem('favoriteMovie2'))
    updateFromFavoriteInfo(favMovie)
  })

  let updateFromFavoriteInfo = function(favoriteMovie){
    movieTitle.innerText = favoriteMovie["movieTitle"]
    moviePoster.src = favoriteMovie["moviePoster"]
    movieYear.innerText = favoriteMovie["movieYear"]
    movieRating.innerText = favoriteMovie["movieRating"]
    movieMaturity.innerText = favoriteMovie["movieMaturity"]
    movieGenre.innerText = favoriteMovie["movieGenre"]
    movieRuntime.innerText = favoriteMovie["movieRuntime"]
    moviePlot.innerText = favoriteMovie["moviePlot"]
    movieWebsite.innerText = `${favoriteMovie["movieTitle"]} Official Website`
    movieWebsite.href = favoriteMovie["movieWebsite"]
    suggestedMovie = favoriteMovie["suggestedMovie"]
    document.querySelector("#player").src = favoriteMovie["trailerURL"]
  }

  let cleanTitle = function(title){
    let result = ""
    let invalidChars = ["&",":",".",",","-","!","$","'",'"']
    for(let i=0;i<title.length;i++){
      if (title[i] === " ") {
        result += "+"
      } else if (!invalidChars.includes(title[i])){
        result += title[i]
      }
    }
    return result
  }

  // Retrieving movie data from TMDB API
  let suggestMovie = genre =>{
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=8bc80cb92717ca1f3194282f05980aa7&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&vote_count.gte=30&vote_average.gte=7&with_genres=${selectedGenre}`)
      .then((response) => {
        console.log("suggestMovie from tmdb >>>>",response)
        let movies = response.data.results
        let randomIndex = Math.floor(Math.random() * 19)
        suggestedMovie = movies[`${randomIndex}`].title
        movieTitle.innerText = suggestedMovie
        getMovieInfo()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  let getMovieInfo = () =>{
  axios.get('http://www.omdbapi.com?apikey=8cc4a7e0&t='+suggestedMovie)
    .then((response) => {
      console.log("getMovieInfo from OMDB >>>>",response)
      let movieInfo = response.data
      moviePoster.src = movieInfo.Poster
      movieYear.innerText = movieInfo.Year
      movieRating.innerText = movieInfo.imdbRating
      movieMaturity.innerText = movieInfo.Rated
      movieRuntime.innerText = movieInfo.Runtime
      movieGenre.innerText = movieInfo.Genre
      moviePlot.innerText = movieInfo.Plot
      movieWebsite.innerText = `${movieInfo.Title} Official Website`
      movieWebsite.href = movieInfo.Website
      getTrailer()
    })
    .catch((error) => {
      console.log(error)
    })
  }

  // Retrieving trailer from Youtube
  let getTrailer = () =>{
    let cleanedUpTitle = cleanTitle(suggestedMovie)
    axios.get(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBBUEVDoq-VdrHTRZXf8fMIXzDnS3dXIbY&q=${cleanedUpTitle}OfficialTrailer&part=snippet,id&order=relevance&maxResults=1`)
      .then((response) => {
        console.log("getTrailer from Youtube >>>>",response)
        let trailerId = response.data.items[0].id.videoId
        document.querySelector("#player").src = `https://www.youtube.com/embed/${trailerId}?enablejsapi=1`
      })
      .catch((error) => {
        console.log(error)
      })
  }

  let goButton = document.querySelector("#GO")
  goButton.addEventListener('click', ()=>{
    suggestMovie(selectedGenre)
  })

});
