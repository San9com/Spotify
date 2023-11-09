const clientId = '8a51e3a9ce0a480d883b10ad594397b7'; // Replace with your actual client ID
const clientSecret = '068c9639ad1344f39cccd3964a5a34f4'; // Replace with your actual client secret
const playlistId = '37i9dQZF1EQoqCH7BwIYb7'; // Your playlist ID

// Function to retrieve access token from Spotify
async function getAccessToken() {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });

    const data = await result.json();
    return data.access_token;
}

// Function to fetch playlist details
async function fetchPlaylistDetails(accessToken, playlistId) {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    return await result.json();
}

// Function to fetch tracks from the playlist
async function fetchTracks(accessToken, tracksEndpoint) {
    const result = await fetch(tracksEndpoint, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    return await result.json();
}

// Function to update the playlist details in the HTML
function updatePlaylistDetails(details) {
    // Set playlist name
    document.querySelector('.playlist-name').textContent = details.name;
    
    // Set playlist total songs and owner
    document.querySelector('.playlist-total-songs').textContent = `${details.tracks.total} songs`;
    
    // Set playlist owner (assuming the owner object has a display_name property)
    document.querySelector('.playlist-owner').textContent = details.owner.display_name;
    
    // Set playlist cover image (assuming there is at least one image in the images array)
    if (details.images && details.images.length > 0) {
        document.querySelector('.playlist-cover-img').src = details.images[0].url;
    }
}

// Function to create a song list item
function createSongListItem(track) {
    return `
        <div class="song" data-src="songs/song1.mp3">
            <div class="song-number">${track.track_number}</div>
            <div class="song-title">${track.name}</div>
            <div class="song-artist">${track.artists.map(artist => artist.name).join(', ')}</div>
            <div class="song-album">${track.album.name}</div>
            <div class="song-duration">${(track.duration_ms / 60000).toFixed(2)}</div>
        </div>
    `;
}

// Function to update the songs list in the HTML
function updateSongsList(tracks) {
    const songsContainer = document.querySelector('.songs-list');
    songsContainer.innerHTML = tracks.items.map(item => createSongListItem(item.track)).join('');
}

// Main function to initialize the playlist
async function initializePlaylist() {
    try {
        const accessToken = await getAccessToken();
        const playlistDetails = await fetchPlaylistDetails(accessToken, playlistId);
        const tracks = await fetchTracks(accessToken, playlistDetails.tracks.href);
        
        updatePlaylistDetails(playlistDetails);
        updateSongsList(tracks);
    } catch (error) {
        console.error('Error initializing the playlist:', error);
    }
}

function playSong(src) {
  var player = document.getElementById('audio-player');
  if (!player) {
    // Create audio element if it doesn't exist
    player = document.createElement('audio');
    player.id = 'audio-player';
    player.controls = 'controls';
    document.body.appendChild(player);
  }
  player.src = src;
  player.play();
}
// Start the initialization process
initializePlaylist();