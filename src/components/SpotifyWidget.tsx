import React from 'react';

const SpotifyWidget = () => {
    return (
        <article
            className="card orbit-widget top-right spotify-container"
            style={{ padding: 0, overflow: 'hidden', border: 'none', position: 'relative' }}
        >
            <div id="playlist-controls">
                <input type="text" id="plInput" placeholder="Playlist Link/ID..." title="Enter Spotify ID" />
                <button id="plSaveBtn">Load</button>
            </div>
            <iframe
                id="spotifyFrame"
                style={{ borderRadius: '12px' }}
                src="https://open.spotify.com/embed/playlist/0ADGCEur3ZJ9deZlFuOWIA?utm_source=generator&theme=0"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Player"
            />
        </article>
    );
};

export default SpotifyWidget;
