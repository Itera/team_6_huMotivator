import os
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class MotivationRequest(BaseModel):
    task: str = Field(min_length=3, max_length=240)
    vibe: str = Field(default="balanced", pattern="^(balanced|serious|playful)$")


class MotivationResponse(BaseModel):
    intro: str
    pep_talk: str
    quote: str
    joke: str
    action_tip: str
    safety_note: str


FORBIDDEN_PHRASES = {
    "hate",
    "kill",
    "idiot",
    "racist",
    "sexist",
}


def _safe_text(text: str) -> str:
    lowered = text.lower()
    if any(term in lowered for term in FORBIDDEN_PHRASES):
        return "Keep going. You have momentum, and the next small step matters."
    return text


async def _fetch_quote() -> str:
    url = "https://zenquotes.io/api/random"
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            if isinstance(data, list) and data:
                quote = data[0].get("q", "Stay curious.")
                author = data[0].get("a", "Unknown")
                return f'"{quote}" - {author}'
    except Exception:
        pass
    return '"Progress is built in small, repeatable steps." - HuMotivator'


async def _fetch_joke() -> str:
    url = "https://v2.jokeapi.dev/joke/Programming,Miscellaneous?type=single&safe-mode"
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            joke = data.get("joke")
            if isinstance(joke, str) and joke.strip():
                return joke.strip()
    except Exception:
        pass
    return "Debugging is like being the detective in a crime movie where you are also the suspect."


def _extract_openai_text(payload: dict[str, Any]) -> str:
    output_text = payload.get("output_text")
    if isinstance(output_text, str) and output_text.strip():
        return output_text.strip()

    output = payload.get("output")
    if not isinstance(output, list):
        return ""

    chunks: list[str] = []
    for item in output:
        if not isinstance(item, dict):
            continue
        content = item.get("content")
        if not isinstance(content, list):
            continue
        for part in content:
            if isinstance(part, dict):
                text = part.get("text")
                if isinstance(text, str) and text.strip():
                    chunks.append(text.strip())

    return "\n".join(chunks).strip()


async def _generate_pep_talk(task: str, vibe: str) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    if not api_key:
        if vibe == "playful":
            return f"Turn '{task}' into a mini quest: one focused sprint, one victory dance, then repeat."
        if vibe == "serious":
            return f"Treat '{task}' as a priority objective. Pick the highest-impact subtask and finish it first."
        return f"Start '{task}' with 15 focused minutes. Motion creates motivation."

    prompt = (
        "You are HuMotivator, a respectful workplace motivation assistant. "
        "Write 2 concise sentences in English, supportive and practical, with light humor only. "
        "No harmful language. "
        f"Task: {task}. Vibe: {vibe}."
    )

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/responses",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "input": prompt,
                    "max_output_tokens": 120,
                },
            )
            response.raise_for_status()
            text = _extract_openai_text(response.json())
            if text:
                return text
    except Exception:
        pass

    return f"You've got this: start '{task}' with the simplest next step and stack quick wins from there."


def _action_tip(task: str) -> str:
    return f"Action tip: set a 20-minute timer and complete the smallest visible part of '{task}'."

app = FastAPI(title="HuMotivatoren API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Welcome to HuMotivator API"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/motivate", response_model=MotivationResponse)
async def motivate(payload: MotivationRequest):
    task = payload.task.strip()
    if not task:
        raise HTTPException(status_code=400, detail="Task must not be empty")

    quote, joke, pep_talk = await _gather_content(task=task, vibe=payload.vibe)

    return MotivationResponse(
        intro=f"Motivation mode activated for: {task}",
        pep_talk=_safe_text(pep_talk),
        quote=_safe_text(quote),
        joke=_safe_text(joke),
        action_tip=_action_tip(task),
        safety_note="Generated content is filtered for respectful workplace tone.",
    )


async def _gather_content(task: str, vibe: str) -> tuple[str, str, str]:
    quote = await _fetch_quote()
    joke = await _fetch_joke()
    pep_talk = await _generate_pep_talk(task=task, vibe=vibe)
    return quote, joke, pep_talk
