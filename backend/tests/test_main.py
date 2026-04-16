import sys
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parents[1]))
import main


client = TestClient(main.app)


def test_health_ok():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_motivate_success(monkeypatch):
    async def fake_quote() -> str:
        return '"Test quote" - Tester'

    async def fake_joke() -> str:
        return "A clean joke"

    async def fake_pep_talk(task: str, vibe: str) -> str:
        return f"You can do {task} ({vibe})."

    monkeypatch.setattr(main, "_fetch_quote", fake_quote)
    monkeypatch.setattr(main, "_fetch_joke", fake_joke)
    monkeypatch.setattr(main, "_generate_pep_talk", fake_pep_talk)

    response = client.post("/api/motivate", json={"task": "read the news", "vibe": "playful"})
    assert response.status_code == 200

    payload = response.json()
    assert payload["intro"].startswith("Motivation mode activated")
    assert payload["pep_talk"] == "You can do read the news (playful)."
    assert payload["quote"] == '"Test quote" - Tester'
    assert payload["joke"] == "A clean joke"


def test_motivate_filters_unsafe_content(monkeypatch):
    async def fake_quote() -> str:
        return '"safe" - source'

    async def fake_joke() -> str:
        return "safe joke"

    async def fake_pep_talk(task: str, vibe: str) -> str:
        return "We should kill this task"

    monkeypatch.setattr(main, "_fetch_quote", fake_quote)
    monkeypatch.setattr(main, "_fetch_joke", fake_joke)
    monkeypatch.setattr(main, "_generate_pep_talk", fake_pep_talk)

    response = client.post("/api/motivate", json={"task": "finish slides", "vibe": "balanced"})
    assert response.status_code == 200

    payload = response.json()
    assert payload["pep_talk"] == "Keep going. You have momentum, and the next small step matters."


def test_motivate_validation_error():
    response = client.post("/api/motivate", json={"task": "", "vibe": "balanced"})
    assert response.status_code == 422
