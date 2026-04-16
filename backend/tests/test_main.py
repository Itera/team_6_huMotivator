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


def test_models_ok(monkeypatch):
    async def fake_list_models():
        return ["llama3.2", "gemma3:1b"]

    monkeypatch.setattr(main.llm_service, "list_models", fake_list_models)

    response = client.get("/models")
    assert response.status_code == 200
    assert response.json()["models"] == ["llama3.2", "gemma3:1b"]


def test_motivate_ok(monkeypatch):
    async def fake_generate(prompt: str, model: str):
        return "Du klarer dette. Start med ett konkret steg."

    monkeypatch.setattr(main.llm_service, "generate", fake_generate)

    response = client.post(
        "/motivate",
        json={"task": "Forberede presentasjon", "model": "llama3.2"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert "motivation" in payload
    assert payload["model_used"] == "llama3.2"
    assert payload["safety_note"] == "Tone OK"


def test_motivate_safety_filter(monkeypatch):
    async def fake_generate(prompt: str, model: str):
        return "You should kill this task quickly"

    monkeypatch.setattr(main.llm_service, "generate", fake_generate)

    response = client.post(
        "/motivate",
        json={"task": "Skrive rapport", "model": "llama3.2"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["safety_note"] == "Filtered for respectful tone"
    assert "Fortsett steg for steg" in payload["motivation"]


def test_motivate_validation_error():
    response = client.post("/motivate", json={"task": " ", "model": "llama3.2"})
    assert response.status_code == 422


def test_motivate_llm_error(monkeypatch):
    async def fake_generate(prompt: str, model: str):
        raise RuntimeError("ollama unavailable")

    monkeypatch.setattr(main.llm_service, "generate", fake_generate)

    response = client.post(
        "/motivate",
        json={"task": "Spille fotball", "model": "llama3.2"},
    )

    assert response.status_code == 502
    assert "LLM error" in response.json()["detail"]
