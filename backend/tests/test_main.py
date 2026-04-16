import sys
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parents[1]))
import main

client = TestClient(main.app)


def test_health_ok():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_models_ok(monkeypatch):
    def fake_list_models():
        return ["llama3.2", "gemma3:1b"]

    monkeypatch.setattr(main.llm_service, "list_models", fake_list_models)

    response = client.get("/models")
    assert response.status_code == 200
    assert response.json()["models"] == ["llama3.2", "gemma3:1b"]


def test_motivate_ok_plain_text(monkeypatch):
    """LLM returns plain text (not JSON) – should still work gracefully."""
    def fake_chat(messages: list, model: str = "gemma3:1b"):
        return "Du klarer dette. Start med ett konkret steg."

    def fake_search(query, limit=1):
        return {
            "type": "youtube",
            "title": "Fallback video",
            "url": "https://www.youtube.com/watch?v=fb1",
            "thumbnail": "",
        }

    monkeypatch.setattr(main.llm_service, "chat", fake_chat)
    monkeypatch.setattr(main.youtube_service, "search_video", fake_search)

    response = client.get("/motivate?coach=coach1&task=Forberede+presentasjon")

    assert response.status_code == 200
    payload = response.json()
    assert "motivation" in payload
    assert payload["coach"] == "coach1"
    assert payload["safety_note"] == "Tone OK"
    assert payload["media"]["type"] == "youtube"


def test_motivate_ok_with_media(monkeypatch):
    """LLM returns structured JSON with youtube suggestion."""
    import json as _json

    def fake_chat(messages: list, model: str = "gemma3:1b"):
        return _json.dumps({
            "text": "Kom igjen! Du har dette!",
            "media": {"type": "youtube", "query": "motivasjon trening"}
        })

    def fake_search(query, limit=1):
        return {
            "type": "youtube",
            "title": "Motivasjonsvideo",
            "url": "https://www.youtube.com/watch?v=abc123",
            "thumbnail": "https://i.ytimg.com/vi/abc123/default.jpg",
        }

    monkeypatch.setattr(main.llm_service, "chat", fake_chat)
    monkeypatch.setattr(main.youtube_service, "search_video", fake_search)

    response = client.get("/motivate?coach=coach1&task=Trene+hardt")

    assert response.status_code == 200
    payload = response.json()
    assert payload["motivation"] == "Kom igjen! Du har dette!"
    assert payload["media"]["type"] == "youtube"
    assert "youtube.com" in payload["media"]["url"]


def test_motivate_ok_media_none(monkeypatch):
    """LLM returns JSON with media type 'none' – fallback search still provides media."""
    import json as _json

    def fake_chat(messages: list, model: str = "gemma3:1b"):
        return _json.dumps({
            "text": "Bare gjør det.",
            "media": {"type": "none", "query": ""}
        })

    def fake_search(query, limit=1):
        return {
            "type": "youtube",
            "title": "Les bok motivasjon",
            "url": "https://www.youtube.com/watch?v=fallback",
            "thumbnail": "https://i.ytimg.com/vi/fallback/default.jpg",
        }

    monkeypatch.setattr(main.llm_service, "chat", fake_chat)
    monkeypatch.setattr(main.youtube_service, "search_video", fake_search)

    response = client.get("/motivate?coach=coach1&task=Les+bok")

    assert response.status_code == 200
    payload = response.json()
    assert payload["motivation"] == "Bare gjør det."
    assert payload["media"]["type"] == "youtube"


def test_motivate_without_task(monkeypatch):
    def fake_chat(messages: list, model: str = "gemma3:1b"):
        return "Du er sterkere enn du tror!"

    def fake_search(query, limit=1):
        return {
            "type": "youtube",
            "title": "Motivasjon",
            "url": "https://www.youtube.com/watch?v=notask",
            "thumbnail": "",
        }

    monkeypatch.setattr(main.llm_service, "chat", fake_chat)
    monkeypatch.setattr(main.youtube_service, "search_video", fake_search)

    response = client.get("/motivate?coach=coach2")

    assert response.status_code == 200
    assert "motivation" in response.json()


def test_motivate_safety_filter(monkeypatch):
    import json as _json

    def fake_chat(messages: list, model: str = "gemma3:1b"):
        return _json.dumps({
            "text": "You should kill this task quickly",
            "media": {"type": "none", "query": ""}
        })

    def fake_search(query, limit=1):
        return None

    monkeypatch.setattr(main.llm_service, "chat", fake_chat)
    monkeypatch.setattr(main.youtube_service, "search_video", fake_search)

    response = client.get("/motivate?coach=coach1&task=Skrive+rapport")

    assert response.status_code == 200
    payload = response.json()
    assert payload["safety_note"] == "Filtered for respectful tone"
    assert "Du har dette" in payload["motivation"]


def test_motivate_invalid_coach():
    response = client.get("/motivate?coach=invalid_coach")
    assert response.status_code == 422


def test_motivate_missing_coach():
    response = client.get("/motivate")
    assert response.status_code == 422


def test_motivate_llm_error(monkeypatch):
    def fake_chat(messages: list, model: str = "gemma3:1b"):
        raise RuntimeError("ollama unavailable")

    monkeypatch.setattr(main.llm_service, "chat", fake_chat)

    response = client.get("/motivate?coach=coach1&task=Spille+fotball")

    assert response.status_code == 502
    assert "LLM error" in response.json()["detail"]


def test_poem_ok(monkeypatch):
    def fake_generate(prompt: str, model: str = "gemma3:1b"):
        return "Et kort dikt om fremgang"

    monkeypatch.setattr(main.llm_service, "generate", fake_generate)

    response = client.post(
        "/poem",
        json={"topic": "hackathon", "model": "llama3.2"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["poem"] == "Et kort dikt om fremgang"
    assert payload["model_used"] == "llama3.2"


def test_poem_validation_error():
    response = client.post("/poem", json={"topic": " ", "model": "llama3.2"})
    assert response.status_code == 422
