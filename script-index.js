
// ALBUMS
let lastClickedAlbum = document.querySelectorAll('.album:nth-child(7)');

document.addEventListener('DOMContentLoaded', function () {


    const albumIdsList0 = [
        '2ODvWsOgouMbaA5xf0RkJe,4yP0hdKOZPNshxUOjY0cZj,0P3oVJBFOv3TDXlYRhGL7s,1wFOXqEczod4HmSIHLQvKR,5YxR0EDEfl0o1gyhCrvY3R,2ODvWsOgouMbaA5xf0RkJe',
    ];

    const albumIdsList1 = [
        '2ODvWsOgouMbaA5xf0RkJe,4yP0hdKOZPNshxUOjY0cZj,0P3oVJBFOv3TDXlYRhGL7s,1wFOXqEczod4HmSIHLQvKR,5YxR0EDEfl0o1gyhCrvY3R',
    ];

    const albumIdsList2 = [
        '5m850t3rvdS8tiRKjRFRN3,3qVlp6pklSSwJrs1puX9Tm,0dwlqqTeFovdI0oMN4dfYQ,5FSCwTf6hQX6oKFwgsqaDv, 0lrsVMYOG5jaQdvM4jmHvY'
    ];

    const albumIdsList3 = [
        '2ODvWsOgouMbaA5xf0RkJe,4yP0hdKOZPNshxUOjY0cZj,0P3oVJBFOv3TDXlYRhGL7s,1wFOXqEczod4HmSIHLQvKR,5YxR0EDEfl0o1gyhCrvY3R,0lrsVMYOG5jaQdvM4jmHvY',
    ];

    const albumIdsList4 = [
        '2ODvWsOgouMbaA5xf0RkJe,4yP0hdKOZPNshxUOjY0cZj,0P3oVJBFOv3TDXlYRhGL7s,1wFOXqEczod4HmSIHLQvKR,5YxR0EDEfl0o1gyhCrvY3R,0lrsVMYOG5jaQdvM4jmHvY',
    ];

    fetchSpotifyData(albumIdsList0, 'albumList0');

    fetchSpotifyData(albumIdsList1, 'albumList1');

    fetchSpotifyData(albumIdsList2, 'albumList2');

    fetchSpotifyData(albumIdsList3, 'albumList3');

    fetchSpotifyData(albumIdsList4, 'albumList4');
});


function fetchSpotifyData(albumIds, containerId) {
    const clientId = '8a51e3a9ce0a480d883b10ad594397b7';
    const clientSecret = '068c9639ad1344f39cccd3964a5a34f4';

    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    // Request access token 
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })
        .then(response => response.json())
        .then(data => {
            const accessToken = data.access_token;

            // Use the obtained access token to make a request to the Spotify API for multiple albums
            fetch(`https://api.spotify.com/v1/albums?ids=${albumIds}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(albumsData => {
                    // Handle Spotify API response data
                    displayAlbumList(albumsData.albums, containerId);
                })
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
}

function displayAlbumList(albums, containerId) {
    const albumListContainer = document.getElementById(containerId);
    const mainContainer = document.getElementById('main');
    const availableWidth = mainContainer.offsetWidth; // Get the available width of the parent container

    let totalWidth = 0;

    albums.forEach((album, index) => {
        const albumElement = document.createElement('div');
        albumElement.classList.add('album');

        // Album Information
        const albumInfo = document.createElement('div');
        albumInfo.classList.add('album-info');

        if (album) {
            // Album Cover
            const albumCover = document.createElement('img');
            const playButton = document.createElement('img');

            playButton.src = '/spotify-playbutton.png';
            playButton.id = 'playButton';

            if (album.images && album.images.length > 0) {
                albumCover.src = album.images[0].url;
                albumCover.alt = album.name;
            } else {
                // Provide a fallback image or handle the case when images are not available
                albumCover.src = 'path/to/fallback-image.jpg';
                albumCover.alt = 'Album Cover';
            }

            // Album Name
            const albumName = document.createElement('p');
            albumName.style.whiteSpace = 'nowrap';
            albumName.style.overflow = 'hidden';
            albumName.style.textOverflow = 'ellipsis';
            albumName.textContent = `${album.name || 'N/A'}`;

            // Artists
            const artists = document.createElement('p');
            artists.textContent = `${album.artists ? album.artists.map(artist => artist.name).join(', ') : 'N/A'}`;

            // Calculate the total width of the current album
            const albumWidth = 180;

            // Check if adding the current album exceeds the available width
            if (containerId === 'albumList0'|| totalWidth + albumWidth <= availableWidth) {
                totalWidth += albumWidth;

                // Append elements to the album container
                albumInfo.appendChild(albumCover);
                albumInfo.appendChild(playButton);
                albumInfo.appendChild(albumName);
                albumInfo.appendChild(artists);

                albumElement.appendChild(albumInfo);

                albumElement.addEventListener('click', () => {
                    // Store the information of the last clicked album
                    lastClickedAlbum = album;
                    console.log(lastClickedAlbum)
                    // Display the last clicked album in the artistDiv
                    displayLastClickedAlbum();
                });

                // Append the album container to the list
                albumListContainer.appendChild(albumElement);
            } else {
                // Stop adding albums if the available width is exceeded
                return;
            }
        }
    });
}

// last clicked album 

function displayLastClickedAlbum() {
    const artistDiv = document.getElementById('artistDiv');
    artistDiv.innerHTML = ''; // Clear previous content
    const artistSection = document.querySelector('main #artist')
    const currentTrackDiv = document.querySelector('#track-info')
    currentTrackDiv.innerHTML = '';

    if (lastClickedAlbum) {
        // Create elements to display album information
        const albumCover1 = document.createElement('img');
        const albumName1 = document.createElement('p');
        const artists1 = document.createElement('p');

        // Set attributes and text content
        albumCover1.src = lastClickedAlbum.images && lastClickedAlbum.images.length > 0
            ? lastClickedAlbum.images[0].url
            : 'path/to/fallback-image.jpg';
        albumCover1.alt = lastClickedAlbum.name;

        albumName1.textContent = `${lastClickedAlbum.name || 'N/A'}`;
        artists1.textContent = `${lastClickedAlbum.artists
            ? lastClickedAlbum.artists.map(artist => artist.name).join(', ')
            : 'N/A'}`;

        const albumCover2 = document.createElement('img');
        const albumName2 = document.createElement('p');
        const artists2 = document.createElement('p');

        // Set attributes and text content
        albumCover2.src = lastClickedAlbum.images && lastClickedAlbum.images.length > 0
            ? lastClickedAlbum.images[0].url
            : 'path/to/fallback-image.jpg';
        albumCover2.alt = lastClickedAlbum.name;

        albumName2.textContent = `${lastClickedAlbum.name || 'N/A'}`;
        artists2.textContent = `${lastClickedAlbum.artists
            ? lastClickedAlbum.artists.map(artist => artist.name).join(', ')
            : 'N/A'}`;

        // Append elements to the artistDiv
        artistSection.style.display='flex'
        artistDiv.appendChild(albumCover1);
        artistDiv.appendChild(albumName1);
        artistDiv.appendChild(artists1);
        currentTrackDiv.appendChild(albumCover2);
        currentTrackDiv.appendChild(albumName2);
        currentTrackDiv.appendChild(artists2);
        
    }
}

// PLAYLISTS

document.addEventListener('DOMContentLoaded', function () {
    const playlistIds = [
        '37i9dQZEVXbmdnMZWUtKbM', // Replace with your playlist IDs
        '37i9dQZF1EQoqCH7BwIYb7',
        '37i9dQZEVXcFmf9jn3TICW',
        '37i9dQZF1E35zsu8P2X5re',
        '37i9dQZF1E39rswpexcqQo',
        '37i9dQZF1E39PgSCtQ9usZ',
        '37i9dQZF1E38bkQhy4LKAK',
        '60Mub90fQes2jiSP4jlXs2'
    ];

    fetchPlaylistsData(playlistIds, 'YourLibrary');
});

function fetchPlaylistsData(playlistIds, containerId) {
    const clientId = '8a51e3a9ce0a480d883b10ad594397b7';
    const clientSecret = '068c9639ad1344f39cccd3964a5a34f4';

    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    // Request access token using Client Credentials Flow
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    })
        .then(response => response.json())
        .then(data => {
            const accessToken = data.access_token;

            // Fetch details for each playlist
            playlistIds.forEach(playlistId => {
                fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(playlistData => {
                        // Handle Spotify API response data (playlist data in this example)
                        displayPlaylist(playlistData, containerId);
                    })
                    .catch(error => console.error('Error:', error));
            });
        })
        .catch(error => console.error('Error:', error));
}

function displayPlaylist(playlist, containerId) {
    const playlistContainer = document.getElementById(containerId);

    if (playlist) {
        const playlistElement = document.createElement('div');
        playlistElement.classList.add('playlist');

        // Playlist Information
        const playlistInfo = document.createElement('div');
        playlistInfo.classList.add('playlist-info');

        // Playlist Cover
        const playlistCover = document.createElement('img');

        if (playlist.images && playlist.images.length > 0) {
            playlistCover.src = playlist.images[0].url;
            playlistCover.alt = playlist.name;
        } else {
            // Provide a fallback image or handle the case when images are not available
            playlistCover.src = 'path/to/fallback-image.jpg';
            playlistCover.alt = 'Playlist Cover';
        }

        // Playlist Name
        const playlistName = document.createElement('p');

        const SecondaryInfoDiv = document.createElement('div');
        playlistName.style.whiteSpace = 'nowrap';
        playlistName.style.overflow = 'hidden';
        playlistName.style.textOverflow = 'ellipsis';
        playlistName.textContent = `${playlist.name || 'N/A'}`;



        // Owner
        const owner = document.createElement('p');
        owner.textContent = `playlist • ${playlist.owner ? playlist.owner.display_name || playlist.owner.id : 'N/A'}`;

        // Append elements to the playlist container
        playlistInfo.appendChild(playlistCover);
        playlistInfo.appendChild(SecondaryInfoDiv)
        SecondaryInfoDiv.appendChild(playlistName);
        SecondaryInfoDiv.appendChild(owner);

        playlistElement.appendChild(playlistInfo);

        // Append the playlist container to the list
        playlistContainer.appendChild(playlistElement);
    }
}

