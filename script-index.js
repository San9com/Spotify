//service worker

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
  
// ALBUMS
let lastClickedAlbum = document.querySelectorAll('.album:nth-child(7)');



document.addEventListener('DOMContentLoaded', function () {


    const albumIdsList0 = [
        '2ODvWsOgouMbaA5xf0RkJe,4yP0hdKOZPNshxUOjY0cZj,0P3oVJBFOv3TDXlYRhGL7s,1wFOXqEczod4HmSIHLQvKR,5YxR0EDEfl0o1gyhCrvY3R,7lvWOiTh8oMtOldgbB4EWi',
    ];

    const albumIdsList1 = [
        '2ODvWsOgouMbaA5xf0RkJe,4yP0hdKOZPNshxUOjY0cZj,0P3oVJBFOv3TDXlYRhGL7s,1wFOXqEczod4HmSIHLQvKR,5YxR0EDEfl0o1gyhCrvY3R',
    ];

    const albumIdsList2 = [
        '5m850t3rvdS8tiRKjRFRN3,3qVlp6pklSSwJrs1puX9Tm,0dwlqqTeFovdI0oMN4dfYQ,5RQj4uYV6vyrDu23Sj8PrK, 0lrsVMYOG5jaQdvM4jmHvY'
    ];

    const albumIdsList3 = [
        '6PLCFJZUcU4yrUztsa3mzm,5YzzV7NMiiVGKMve73OBYc,6T80Oi2lqkE0cJb6QKHFvg,7lvWOiTh8oMtOldgbB4EWi,5YxR0EDEfl0o1gyhCrvY3R,0lrsVMYOG5jaQdvM4jmHvY',
    ];

    const albumIdsList4 = [
        '0w3f9KcyAau2CzhOmMCTfV,3RSgamvBlEgLEaMafK9xp7,0P3oVJBFOv3TDXlYRhGL7s,1wFOXqEczod4HmSIHLQvKR,5YxR0EDEfl0o1gyhCrvY3R,0lrsVMYOG5jaQdvM4jmHvY',
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

    // API token stuff
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
                    // Spotify API response data
                    displayAlbumList(albumsData.albums, containerId);
                })
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
}

function displayAlbumList(albums, containerId) {
    const albumListContainer = document.getElementById(containerId);
    const mainContainer = document.getElementById('main');
    const availableWidth = mainContainer.offsetWidth; 

    let totalWidth = 0;

    albums.forEach((album, index) => {
        const albumElement = document.createElement('div');
        albumElement.classList.add('album');

        // album Information
        const albumInfo = document.createElement('div');
        albumInfo.classList.add('album-info');

        if (album) {
            // album Cover
            const albumCover = document.createElement('img');
            const playButton = document.createElement('img');

            playButton.src = 'assets/spotify-playbutton.png';
            playButton.id = 'playButton';

            if (album.images && album.images.length > 0) {
                albumCover.src = album.images[0].url;
                albumCover.alt = album.name;
            } else {
                // fallback image 
                albumCover.src = 'assets/icons/apple-touch-icon.png';
                albumCover.alt = 'Album Cover';
            }

            // album names
            const albumName = document.createElement('p');
            albumName.style.whiteSpace = 'nowrap';
            albumName.style.overflow = 'hidden';
            albumName.style.textOverflow = 'ellipsis';
            albumName.textContent = `${album.name || 'N/A'}`;

            // artists
            const artists = document.createElement('p');
            artists.textContent = `${album.artists ? album.artists.map(artist => artist.name).join(', ') : 'N/A'}`;

            //  width of the current album (later should be automatic)
            const albumWidth = 180;

            // check width
            if (containerId === 'albumList0'|| totalWidth + albumWidth <= availableWidth) {
                totalWidth += albumWidth;

                
                albumInfo.appendChild(albumCover);
                albumInfo.appendChild(playButton);
                albumInfo.appendChild(albumName);
                albumInfo.appendChild(artists);

                albumElement.appendChild(albumInfo);

                albumElement.addEventListener('click', () => {
                    
                    lastClickedAlbum = album;
                    console.log(lastClickedAlbum)
                    
                    displayLastClickedAlbum();
                });

                // append the album container to the list
                albumListContainer.appendChild(albumElement);
            } else {
                // stop adding albums 
                return;
            }
        }
    });


    
}





// last clicked album 

function displayLastClickedAlbum() {
    const artistDiv = document.getElementById('artistDiv');
    artistDiv.innerHTML = ''; 
    const artistSection = document.querySelector('main #artist')
    const currentTrackDiv = document.querySelector('#track-info')
    const currentTrackTitles = document.createElement('div');
    currentTrackDiv.innerHTML = '';

    if (lastClickedAlbum) {
        // create elements to display album info
        const albumCover1 = document.createElement('img');
        const albumName1 = document.createElement('p');
        const artists1 = document.createElement('p');

        albumCover1.src = lastClickedAlbum.images && lastClickedAlbum.images.length > 0
            ? lastClickedAlbum.images[0].url
            : 'assets/icons/apple-touch-icon.png';
        albumCover1.alt = lastClickedAlbum.name;

        albumName1.textContent = `${lastClickedAlbum.name || 'N/A'}`;
        artists1.textContent = `${lastClickedAlbum.artists
            ? lastClickedAlbum.artists.map(artist => artist.name).join(', ')
            : 'N/A'}`;

        const albumCover2 = document.createElement('img');
        const albumName2 = document.createElement('p');
        const artists2 = document.createElement('p');


        albumCover2.src = lastClickedAlbum.images && lastClickedAlbum.images.length > 0
            ? lastClickedAlbum.images[0].url
            : 'assets/icons/apple-touch-icon.png';
        albumCover2.alt = lastClickedAlbum.name;

        albumName2.textContent = `${lastClickedAlbum.name || 'N/A'}`;
        artists2.textContent = `${lastClickedAlbum.artists
            ? lastClickedAlbum.artists.map(artist => artist.name).join(', ')
            : 'N/A'}`;

        // append elements to the artistDiv
        artistSection.style.display='flex'
        artistDiv.appendChild(albumCover1);
        artistDiv.appendChild(albumName1);
        artistDiv.appendChild(artists1);
        currentTrackDiv.appendChild(albumCover2);
        currentTrackDiv.appendChild(currentTrackTitles);
        currentTrackTitles.appendChild(albumName2)
        currentTrackTitles.appendChild(artists2);

    }
}

// PLAYLISTS

document.addEventListener('DOMContentLoaded', function () {
    const playlistIds = [
        '37i9dQZEVXbmdnMZWUtKbM', 
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

    // API token stuff
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

            // fetch each playlist
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

        // Playlist info
        const playlistInfo = document.createElement('div');
        playlistInfo.classList.add('playlist-info');

        // Playlist cover
        const playlistCover = document.createElement('img');

        if (playlist.images && playlist.images.length > 0) {
            playlistCover.src = playlist.images[0].url;
            playlistCover.alt = playlist.name;
        } else {
        
            playlistCover.src = 'assets/icons/apple-touch-icon.png';
            playlistCover.alt = 'Playlist Cover';
        }

        // Playlist naming
        const playlistName = document.createElement('p');

        const SecondaryInfoDiv = document.createElement('div');
        playlistName.style.whiteSpace = 'nowrap';
        playlistName.style.overflow = 'hidden';
        playlistName.style.textOverflow = 'ellipsis';
        playlistName.textContent = `${playlist.name || 'N/A'}`;



        // album owner
        const owner = document.createElement('p');
        owner.textContent = `playlist • ${playlist.owner ? playlist.owner.display_name || playlist.owner.id : 'N/A'}`;

        // append elements to the playlist container
        playlistInfo.appendChild(playlistCover);
        playlistInfo.appendChild(SecondaryInfoDiv)
        SecondaryInfoDiv.appendChild(playlistName);
        SecondaryInfoDiv.appendChild(owner);

        playlistElement.appendChild(playlistInfo);

        // append the playlist container to the list
        playlistContainer.appendChild(playlistElement);
    }
}




// MAIN PAGE UPDATE GREETING

function updateGreeting() {
    const greetingElement = document.querySelector('main #main h3'); 

    if (greetingElement) {
        const currentTime = new Date().getHours();

        let greeting;

        if (currentTime >= 5 && currentTime < 12) {
            greeting = 'Good Morning';
        } else if (currentTime >= 12 && currentTime < 18) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }

        greetingElement.textContent = greeting;
    }
}

updateGreeting();

setInterval(updateGreeting, 600000);



function redirectToUrl() {

    var redirectUrl = '/Search.html';

    window.location.href = redirectUrl;
}

document.getElementById('Search').addEventListener('click', redirectToUrl);