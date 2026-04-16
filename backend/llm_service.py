import httpx
from os import getenv

OLLAMA_BASE_URL = getenv("OLLAMA_BASE_URL", "http://ollama:11434")


async def generate(prompt: str, model: str = "llama3.2") -> str:
    """Send a prompt to Ollama and return the response text."""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={"model": model, "prompt": prompt, "stream": False},
        )
        response.raise_for_status()
        return response.json()["response"]


async def chat(messages: list[dict], model: str = "llama3.2") -> str:
    """Send a chat conversation to Ollama and return the assistant reply."""
    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={"model": model, "messages": messages, "stream": False},
        )
        response.raise_for_status()
        return response.json()["message"]["content"]


async def list_models() -> list[str]:
    """List all models available in the Ollama instance."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
        response.raise_for_status()
        return [m["name"] for m in response.json().get("models", [])]
