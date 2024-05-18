const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const musicsEl = document.getElementById('musics');
const resultHeading = document.getElementById('result-heading');
const single_musicEl = document.getElementById('single-music');

// Search music and fetch from API
function searchMusic(e) {
  e.preventDefault();

  // Clear single music
  single_musicEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.theaudiodb.com/api/v1/json/2/searchalbum.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;

        if (data.album === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!<p>`;
        } else {
          musicsEl.innerHTML = data.album
            .map(
              album => `
            <div class="album">
              <img src="${album.strAlbumThumb}" alt="${album.strAlbum}" />
              <div class="album-info" data-albumID="${album.idAlbum}">
                <h3>${album.strAlbum}</h3>
              </div>
            </div>
          `
            )
            .join('');
        }
      });
    // Clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// Fetch album by ID
function getAlbumById(albumID) {
  fetch(`https://www.theaudiodb.com/api/v1/json/2/album.php?i=${albumID}`)
    .then(res => res.json())
    .then(data => {
      const album = data.album[0];
      addAlbumToDOM(album);
    });
}

// Fetch random album by fetching a list and selecting one at random
function getRandomMusic() {
  // Clear musics and heading
  musicsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  // Fetch a random artist (you can use an artist with a large discography for better randomness)
  const randomArtists = ["The Beatles", "Led Zeppelin", "Pink Floyd", "Queen", "Michael Jackson"];
  const randomArtist = randomArtists[Math.floor(Math.random() * randomArtists.length)];

  fetch(`https://www.theaudiodb.com/api/v1/json/2/searchalbum.php?s=${randomArtist}`)
    .then(res => res.json())
    .then(data => {
      if (data.album && data.album.length > 0) {
        const randomAlbum = data.album[Math.floor(Math.random() * data.album.length)];
        getAlbumById(randomAlbum.idAlbum);
      } else {
        resultHeading.innerHTML = `<p>Could not find a random album. Try again!<p>`;
      }
    });
}

// Add album to DOM
function addAlbumToDOM(album) {
  single_musicEl.innerHTML = ` 
    <div class="single-album">
        <h1>${album.strAlbum}</h1>
        <img src="${album.strAlbumThumb}" alt="${album.strAlbum}" />
        <div class="single-album-info">
        ${album.strArtist ? `<p>Artist: ${album.strArtist}</p>` : ''}
        ${album.intYearReleased ? `<p>Year: ${album.intYearReleased}</p>` : ''}
        </div>
        <div class="main">
            <p>${album.strDescriptionEN}</p>
        </div>
    </div>
    `;
}

// Event listeners
submit.addEventListener('submit', searchMusic);
random.addEventListener('click', getRandomMusic);

musicsEl.addEventListener('click', e => {
  const album = e.target.closest('.album');
  if (album) {
    const albumID = album.querySelector('.album-info').getAttribute('data-albumid');
    musicsEl.innerHTML = '';
    resultHeading.innerHTML = '';
    getAlbumById(albumID);
  }
});
