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


def test_motivate_ok(monkeypatch):
    def fake_chat(messages: list, model: str = "gemma3:1b"):
        return "Du klarer dette. Start med ett konkret steg."

    monkeypatch.setattr(main.llm_service, "chat", fake_chat)

    response = client.get("/motivate?coach=coach1&task=Forberede+presentasjon")

    assert response.status_code == 200
    payload = response.json()
    assert "motivation" in payload
    assert payload["coach"] == "coach1"
    assert payload["safety_note"] == "Tone OK"


def test_motivate_without_task(monkeypatch):
    def fake_chat(messages: list, model: str = "gemma3:1b"):
        return "Du er sterkere enn du tror!"

    monkeypatch.setattr(main.llm_service, "chat", fake_chat)

    response = client.get("/motivate?coach=coach2")

    assert response.status_code == 200
    assert "motivation" in response.json()


def test_motivate_safety_filter(monkeypatch):
    def fake_chat(messages: list, model: str = "gemma3:1b"):
        return "You should kill this task quickly"

    monkeypatch.setattr(main.llm_service, "chat", fake_chat)

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
