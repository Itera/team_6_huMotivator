import requests
from os import getenv

OLLAMA_BASE_URL = getenv("OLLAMA_BASE_URL", "http://ollama:11434")


def generate(prompt: str, model: str = "gemma3:1b") -> str:
    """Send a prompt to Ollama and return the response text."""
    messages = [{"role": "user", "content": prompt}]
    return chat(messages, model)


def chat(messages: list[dict], model: str = "gemma3:1b") -> str:
    """Send a chat conversation to Ollama and return the assistant reply."""
    response = requests.post(
        f"{OLLAMA_BASE_URL}/api/chat",
        json={"model": model, "messages": messages, "stream": False},
        timeout=300.0,
    )
    response.raise_for_status()
    return response.json()["message"]["content"]


def list_models() -> list[str]:
    """List all models available in the Ollama instance."""
    response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=10.0)
    response.raise_for_status()
    return [m["name"] for m in response.json().get("models", [])]
