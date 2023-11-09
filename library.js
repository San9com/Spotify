// Function to get the Spotify access token
async function getSpotifyAccessToken() {
  const clientId = '8a51e3a9ce0a480d883b10ad594397b7';  // Replace with your Spotify client ID
  const clientSecret = '068c9639ad1344f39cccd3964a5a34f4';  // Replace with your Spotify client secret

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

// Function to fetch songs from Spotify API
async function fetchSongsFromSpotify(accessToken) {
  const playlistId = '37i9dQZF1EQoqCH7BwIYb7'; // Your actual playlist ID
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  return data.items; // The structure depends on Spotify's response
}

// Function to add songs to the playlist in the DOM
function addSongsToPlaylist(songs) {
  const playlistElement = document.getElementById('playlist');

  songs.forEach(item => {
    const song = item.track;
    const songElement = document.createElement('li');
    songElement.textContent = `${song.name} by ${song.artists.map(artist => artist.name).join(', ')}`;
    playlistElement.appendChild(songElement);
  });
}

// Function to initialize the playlist
async function initializePlaylist() {
  try {
    const accessToken = await getSpotifyAccessToken();
    const songs = await fetchSongsFromSpotify(accessToken);
    addSongsToPlaylist(songs);
  } catch (error) {
    console.error('Error initializing the playlist:', error);
  }
}

// Call this function when you want to start the process
initializePlaylist();
