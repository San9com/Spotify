const clientId = '8a51e3a9ce0a480d883b10ad594397b7';
const clientSecret = '068c9639ad1344f39cccd3964a5a34f4';
const playlistId1 = '37i9dQZF1EQoqCH7BwIYb7';
const playlistId2 = '33m1hy2WH7oTsO3Hx033B6';

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
async function fetchPlaylistDetails(accessToken, playlistId1) {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId1}`, {
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
        const playlistDetails = await fetchPlaylistDetails(accessToken, playlistId1);
        const tracks = await fetchTracks(accessToken, playlistDetails.tracks.href);
        
        updatePlaylistDetails(playlistDetails);
        updateSongsList(tracks);
    } catch (error) {
        console.error('Error initializing the playlist:', error);
    }
}

function playSong() {
    let songList = document.getElementById('songs-list');
    let pl = document.getElementById('audio-player');
    let player = document.getElementById('actual-audio'); // This is the audio element
    const playBtn = document.getElementById('play-btn');
    const progressContainer = document.querySelector('#progress-container');
    const progress = document.querySelector('#progress');
    let pauseplayimg = document.getElementById('stopplay');

    let isPlaying = false;

    playBtn.addEventListener('click', togglePlay);
    progressContainer.addEventListener('click', setProgress);

    function togglePlay() {
        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }

    player.onplay = function() {
        isPlaying = true;
        playBtn.style.backgroundColor = '#1ed760'; // Change button to show playing status
        pauseplayimg.src = 'imgs/pause.png';
    };

    player.onpause = function() {
        isPlaying = false;
        playBtn.style.backgroundColor = '#fff'; // Change button to show paused status
        pauseplayimg.src = 'imgs/play.png';
    };

    player.ontimeupdate = function() {
        let progressPercent = (player.currentTime / player.duration) * 100;
        progress.style.width = progressPercent + '%';
    };

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        player.currentTime = (clickX / width) * player.duration;
    }

    // Assuming each song item has data-src attribute with the correct song path
    songList.addEventListener('click', function(e) {
        // Find the clicked song element and get the song path
        let clickedSong = e.target.closest('.song');
        if (clickedSong) {
            let songPath = clickedSong.getAttribute('data-src');
            player.src = songPath;
            player.play();
            pl.style.display = "grid";
            pl.style.gridTemplateColumns = "120px 200px 30px auto 30px 30px 30px 30px 160px 30px";
            pl.style.gridColumnGap = "20px";
        }
    });
}

document.addEventListener('DOMContentLoaded', playSong);

// Start the initialization process
initializePlaylist();