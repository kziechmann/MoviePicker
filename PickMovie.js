document.addEventListener('DOMContentLoaded', (event) => {
  let selectedGenre = "Action"
  let trailerId = 'urRVZ4SW7WU'
  let moviePoster = document.querySelector("#BRposter")
  let movieTitle = document.querySelector("#title")
  let movieYear = document.querySelector("#year")

  let buttons = document.querySelectorAll("#buttonContainer button")
  for(let button of buttons){
    button.addEventListener('click', ()=>{
      buttons.forEach((btn)=>{btn.classList = "genre"})
      selectedGenre = button.innerText
      button.classList = "selected"
    })
  }

  function suggestMovie(genre) {
    axios.get('http://www.omdbapi.com?apikey=8cc4a7e0&s='+genre)
      .then((response) => {
        let movies = response.data.Search
        moviePoster.src = movies[0].Poster
        movieTitle.innerText = movies[0].Title
        movieYear.innerText = movies[0].Year
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  let goButton = document.querySelector("#GO")
  goButton.addEventListener('click', ()=>{
    suggestMovie(selectedGenre)
    document.querySelector("#player").src = `https://www.youtube.com/embed/${trailerId}?enablejsapi=1`
  })

});

      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '240',
          width: '360',
          videoId: 'gCcx85zbxz4',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
      }
      // 4. The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
      var done = false;
      function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
        }
      }
      function stopVideo() {
        player.stopVideo();
      }
