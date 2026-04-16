from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from enum import Enum
from pydantic import BaseModel, Field, field_validator

import llm_service

app = FastAPI(title="HuMotivatoren API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MotivateRequest(BaseModel):
    task: str = Field(min_length=3, max_length=280)
    model: str = "gemma3:1b"

    @field_validator("task")
    @classmethod
    def normalize_task(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("task must not be empty")
        return normalized


class CoachType(str, Enum):
    coach1 = "coach1"
    coach2 = "coach2"
    coach3 = "coach3"


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


@app.get("/motivate")
def motivate(coach: CoachType = Query(..., description="Coach style: coach1, coach2, or coach3")):
    """Get motivational content from a specific coach personality."""
    system_prompt = COACH_SYSTEM_PROMPTS[coach]
    user_prompt = "Gi meg motivasjon nå. Svar kort og på norsk."

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]
    try:
        response = llm_service.chat(messages)
        safe_text, filtered = _apply_safety_filter(response)
        return {
            "motivation": safe_text,
            "coach": coach.value,
            "safety_note": "Filtered for respectful tone" if filtered else "Tone OK",
        }
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
