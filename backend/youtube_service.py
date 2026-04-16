from youtubesearchpython import VideosSearch


def search_video(query: str, limit: int = 1) -> dict | None:
    """Search YouTube and return the top result."""
    try:
        search = VideosSearch(query, limit=limit)
        results = search.result().get("result", [])
        if not results:
            return None
        video = results[0]
        return {
            "type": "youtube",
            "title": video.get("title", ""),
            "url": video.get("link", ""),
            "thumbnail": (video.get("thumbnails") or [{}])[0].get("url", ""),
        }
    except Exception:
        return None
