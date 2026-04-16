import requests
from os import getenv

SPOTIFY_CLIENT_ID = getenv("SPOTIFY_CLIENT_ID", "")
SPOTIFY_CLIENT_SECRET = getenv("SPOTIFY_CLIENT_SECRET", "")

_cached_token: str | None = None


def _get_token() -> str:
    """Get a Spotify access token using the Client Credentials flow."""
    global _cached_token
    if _cached_token:
        return _cached_token

    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
        raise RuntimeError("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set")

    resp = requests.post(
        "https://accounts.spotify.com/api/token",
        data={"grant_type": "client_credentials"},
        auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET),
        timeout=10,
    )
    resp.raise_for_status()
    _cached_token = resp.json()["access_token"]
    return _cached_token


def search_track(query: str, limit: int = 1) -> dict | None:
    """Search Spotify for a track and return metadata for the top result."""
    try:
        token = _get_token()
        resp = requests.get(
            "https://api.spotify.com/v1/search",
            params={"q": query, "type": "track", "limit": limit},
            headers={"Authorization": f"Bearer {token}"},
            timeout=10,
        )
        resp.raise_for_status()

        items = resp.json().get("tracks", {}).get("items", [])
        if not items:
            return None

        track = items[0]
        images = track.get("album", {}).get("images", [])
        return {
            "type": "spotify",
            "title": track.get("name", ""),
            "artist": ", ".join(a["name"] for a in track.get("artists", [])),
            "url": track.get("external_urls", {}).get("spotify", ""),
            "image": images[0]["url"] if images else "",
        }
    except Exception:
        return None
