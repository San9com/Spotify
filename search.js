document.addEventListener("DOMContentLoaded", function () {
  const playlistId = "37i9dQZF1E39rswpexcqQo"; // Replace with your playlist ID
  fetchPlaylistTracks(playlistId, "song-list");
  const albulmDetails = document.getElementById("albulm-body");
  const songListContainer = document.getElementById("songs");
  songListContainer.style.display = "none";
  const searchInput = document.getElementById("search-bar");

  // Add event listener to the search bar
  searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();

    // Check if the search input is not empty
    if (searchTerm !== "") {
      albulmDetails.style.display = "none";
      songListContainer.style.display = "flex";
      filterAndDisplayTracks(searchTerm);
    } else {
      albulmDetails.style.display = "flex";
      songListContainer.style.display = "none";
    }
  });
});

// Rest of the code remains unchanged

function filterAndDisplayTracks(searchTerm) {
  const filteredTracks = tracksData.items.filter((track) => {
    const trackName = track.track.name.toLowerCase();
    return trackName.startsWith(searchTerm);
  });

  // Clear the current list of songs
  songListContainer.innerHTML = "";

  // Display the filtered tracks
  displayPlaylistTracks(filteredTracks, "song-list");
}

// Rest of the code remains unchanged

function fetchPlaylistTracks(playlistId, containerId) {
  const clientId = "8a51e3a9ce0a480d883b10ad594397b7";
  const clientSecret = "068c9639ad1344f39cccd3964a5a34f4";

  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  // Request access token using Client Credentials Flow
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
    .then((response) => response.json())
    .then((data) => {
      const accessToken = data.access_token;

      // Use the obtained access token to fetch playlist tracks
      fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((tracksData) => {
          // Handle Spotify API response data (playlist tracks data)
          displayPlaylistTracks(tracksData.items, containerId);
        })
        .catch((error) => console.error("Error:", error));
    })
    .catch((error) => console.error("Error:", error));
}

function displayPlaylistTracks(tracks, containerId) {
  const songContainer = document.getElementById("songs");

  tracks.forEach((track) => {
    const trackElement = document.createElement("div");
    trackElement.classList.add("track");

    // Track Information
    const trackInfo = document.createElement("div");
    trackInfo.classList.add("track-info");

    if (track.track) {
      // Track Name
      const trackName = document.createElement("p");
      trackName.textContent = `${track.track.name || "N/A"}`;

      // Artists
      const artists = document.createElement("p");
      artists.textContent = `${
        track.track.artists
          ? track.track.artists.map((artist) => artist.name).join(", ")
          : "N/A"
      }`;

      // Duration
      const duration = document.createElement("p");
      duration.textContent = `${formatDuration(track.track.duration_ms)}`;

      // Append elements to the track container
      trackInfo.appendChild(trackName);
      trackInfo.appendChild(artists);
      trackInfo.appendChild(duration);

      trackElement.appendChild(trackInfo);

      // Append the track container to the list
      songContainer.appendChild(trackElement);
    }
  });
}

// Helper function to format track duration from milliseconds to minutes:seconds
function formatDuration(durationMs) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = ((durationMs % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}
