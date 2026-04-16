from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
from pydantic import BaseModel, Field, field_validator
from dotenv import load_dotenv
import json
import re

load_dotenv()

import llm_service
import youtube_service
import spotify_service

app = FastAPI(title="HuMotivatoren API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CoachType(str, Enum):
    coach1 = "coach1"
    coach2 = "coach2"
    coach3 = "coach3"


class MotivateRequest(BaseModel):
    coach: CoachType
    task: str = Field(default="", max_length=280)


COACH_SYSTEM_PROMPTS = {
    CoachType.coach1: (
        "Du skal gi motivasjon på en direkte og militær måte. "
        "Det finnes ikke noen snarveier, kun hardt arbeid og disiplin."
        "Gi korte, kraftfulle og direkte motivasjonsmeldinger som inspirerer til handling."
        "Vær brutal"
    ),
    CoachType.coach2: (
        "Du er en empatisk psykolog og terapeut. Gi motivasjon gjennom "
        "forståelse, refleksjon og terapeutiske teknikker. Hjelp leseren "
        "med å forstå følelsene sine og finne indre motivasjon."
        "Jeg lytter, jeg forstår, jeg støtter overdrivende mye."
    ),
    CoachType.coach3: (
        "Du er en spirituell og mystisk guru. Gi motivasjon gjennom kosmiske "
        "metaforer, abstrakte visdomsord og litt merkelige, men inspirerende "
        "perspektiver. Vær rar, poetisk og uforutsigbar."
        "Ser svar i stjerner, krystaller og steiner"
    ),
}

COACH_MEDIA_BIAS: dict[CoachType, str] = {
    CoachType.coach1: "motivation speech discipline workout",
    CoachType.coach2: "guided meditation calm mindfulness",
    CoachType.coach3: "ambient meditation spiritual nature sounds",
}

COACH_MUSIC_BIAS: dict[CoachType, str] = {
    CoachType.coach1: "workout motivation power",
    CoachType.coach2: "calm relaxing piano",
    CoachType.coach3: "ambient spiritual meditation",
}

COACH_FALLBACK_YOUTUBE: dict[CoachType, dict] = {
    CoachType.coach1: {
        "type": "youtube",
        "title": "Best Motivational Speech – David Goggins",
        "url": "https://www.youtube.com/watch?v=78I9dTB9vqM",
        "thumbnail": "https://i.ytimg.com/vi/78I9dTB9vqM/hqdefault.jpg",
    },
    CoachType.coach2: {
        "type": "youtube",
        "title": "10-Minute Guided Meditation for Self-Compassion",
        "url": "https://www.youtube.com/watch?v=izV_st2ISMU",
        "thumbnail": "https://i.ytimg.com/vi/izV_st2ISMU/hqdefault.jpg",
    },
    CoachType.coach3: {
        "type": "youtube",
        "title": "Alan Watts – The Real You",
        "url": "https://www.youtube.com/watch?v=mMRrCYPxD0I",
        "thumbnail": "https://i.ytimg.com/vi/mMRrCYPxD0I/hqdefault.jpg",
    },
}

COACH_FALLBACK_SPOTIFY: dict[CoachType, dict] = {
    CoachType.coach1: {
        "type": "spotify",
        "title": "Eye of the Tiger",
        "artist": "Survivor",
        "url": "https://open.spotify.com/track/2KH16WveTQWT6KOG9Rg6e2",
        "image": "https://i.scdn.co/image/ab67616d0000b2734a052b99c042dc15f933145b",
    },
    CoachType.coach2: {
        "type": "spotify",
        "title": "Weightless",
        "artist": "Marconi Union",
        "url": "https://open.spotify.com/track/6kkwzB6hXLIONkEk9JciA6",
        "image": "https://i.scdn.co/image/ab67616d0000b273b26f5bdec49fade2a6c1e46a",
    },
    CoachType.coach3: {
        "type": "spotify",
        "title": "Experience",
        "artist": "Ludovico Einaudi",
        "url": "https://open.spotify.com/track/1BncfTJAMEHRSE0lqb0GbY",
        "image": "https://i.scdn.co/image/ab67616d0000b27345c0ef8c8f4a0fbd412fa3a0",
    },
}

STRUCTURED_SUFFIX = (
    "\n\nSvar ALLTID med gyldig JSON og ingenting annet. Formatet skal være:\n"
    '{"text": "din motivasjonstekst her", '
    '"media": {"type": "youtube", "query": "søkeord for relevant video"}}\n'
    'Sett media.type til "none" og media.query til "" hvis video ikke passer.'
)


def _parse_llm_json(raw: str) -> dict:
    """Try to extract JSON from the LLM response, falling back to plain text."""
    cleaned = raw.strip()
    # Strip markdown code fences if the model wraps them
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    try:
        return json.loads(cleaned)
    except (json.JSONDecodeError, ValueError):
        return {"text": raw, "media": {"type": "none", "query": ""}}


class PoemRequest(BaseModel):
    topic: str = Field(min_length=2, max_length=180)
    model: str = "gemma3:1b"

    @field_validator("topic")
    @classmethod
    def normalize_topic(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("topic must not be empty")
        return normalized


FORBIDDEN_TERMS = ["hate", "kill", "racist", "sexist"]


def _apply_safety_filter(text: str) -> tuple[str, bool]:
    lowered = text.lower()
    if any(term in lowered for term in FORBIDDEN_TERMS):
        return (
            "Du har dette. Ta ett tydelig neste steg, og bygg momentum derfra.",
            True,
        )
    return text, False


@app.get("/")
def root():
    return {"message": "Velkommen til HuMotivatoren! 🎉"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/models")
def models():
    """List available LLM models in Ollama."""
    try:
        return {"models": llm_service.list_models()}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Ollama unavailable: {e}")


@app.post("/motivate")
def motivate(req: MotivateRequest):
    """Get motivational content from a specific coach personality, optionally enriched with media."""
    coach = req.coach
    task = req.task
    system_prompt = COACH_SYSTEM_PROMPTS[coach] + STRUCTURED_SUFFIX
    user_prompt = (
        f"Gi meg motivasjon for denne oppgaven: {task.strip()}. Svar kort og på norsk."
        if task.strip()
        else "Gi meg motivasjon nå. Svar kort og på norsk."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    try:
        raw_response = llm_service.chat(messages)
        parsed = _parse_llm_json(raw_response)

        motivation_text = parsed.get("text", raw_response)
        media_block = parsed.get("media", {"type": "none", "query": ""})
        media_type = media_block.get("type", "none")
        media_query = media_block.get("query", "")

        safe_text, filtered = _apply_safety_filter(motivation_text)

        # Always enrich with a YouTube video.
        # Use the LLM-suggested query when available, otherwise fall back
        # to the user task combined with coach-specific keywords.
        bias = COACH_MEDIA_BIAS.get(coach, "")
        if media_type == "youtube" and media_query:
            search_query = f"{media_query} {bias}".strip()
        else:
            fallback = task.strip() if task.strip() else "motivasjon"
            search_query = f"{fallback} {bias}".strip()
        media_result = youtube_service.search_video(search_query)

        # Also enrich with a Spotify track using coach-specific music bias
        music_bias = COACH_MUSIC_BIAS.get(coach, "")
        music_query = f"{media_query} {music_bias}".strip() if media_query else f"{task.strip() or 'motivasjon'} {music_bias}".strip()
        spotify_result = spotify_service.search_track(music_query)

        result: dict = {
            "motivation": safe_text,
            "coach": coach.value,
            "safety_note": "Filtered for respectful tone" if filtered else "Tone OK",
            "media": media_result or COACH_FALLBACK_YOUTUBE[coach],
            "spotify": spotify_result or COACH_FALLBACK_SPOTIFY[coach],
        }

        return result
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")


@app.post("/poem")
def poem(req: PoemRequest):
    """Generate a short poem about a given topic."""
    prompt = (
        "Skriv et kort og morsomt dikt på norsk (maks 8 linjer) "
        f"om følgende tema: {req.topic}\n\n"
        "Diktet skal være lett, humoristisk og motiverende."
    )
    try:
        response = llm_service.generate(prompt, model=req.model)
        safe_text, filtered = _apply_safety_filter(response)
        return {
            "poem": safe_text,
            "model_used": req.model,
            "safety_note": "Filtered for respectful tone" if filtered else "Tone OK",
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")
