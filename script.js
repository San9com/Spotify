//Library 
// Define your data (dummy data in this example)
const playlistsData = [
    { name: "My Favorite Tracks", songs: ["Song 1", "Song 2", "Song 3"] },
    // Add more playlists here
];

const albumsData = [
    { title: "Album 1", artist: "Artist 1", cover: "album1.jpg" },
    // Add more albums here
];

// Function to populate the playlists and albums dynamically
function populateLibrary() {
    const playlistsContainer = document.getElementById("playlists");
    const albumsContainer = document.getElementById("albums");

    // Populate playlists
    playlistsData.forEach(playlist => {
        const li = document.createElement("li");
        li.textContent = playlist.name;
        playlistsContainer.appendChild(li);
    });

    // Populate albums
    albumsData.forEach(album => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${album.cover}" alt="${album.title} cover">
            <div>${album.title} - ${album.artist}</div>
        `;
        albumsContainer.appendChild(li);
    });
}

// Run the function to populate the library on page load
populateLibrary();
/*------------------------------------------------------------------------------*/