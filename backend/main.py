from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
    task: str = Field(min_length=3, max_length=300)
    model: str = "llama3.2"

    @field_validator("task")
    @classmethod
    def normalize_task(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("task must not be empty")
        return normalized


FORBIDDEN_TERMS = [
    "hate",
    "racist",
    "sexist",
    "kill",
]


def _apply_safety_filter(text: str) -> tuple[str, bool]:
    lowered = text.lower()
    if any(term in lowered for term in FORBIDDEN_TERMS):
        return (
            "Fortsett steg for steg. Du har kontroll, og neste lille deloppgave gir fart.",
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
async def models():
    """List available LLM models in Ollama."""
    try:
        return {"models": await llm_service.list_models()}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Ollama unavailable: {e}")


@app.post("/motivate")
async def motivate(req: MotivateRequest):
    """Send a task description and get motivational content back."""
    prompt = (
        "Du er HuMotivatoren – et profesjonelt verktøy med intelligent humor. "
        "Brukeren trenger inspirasjon og motivasjon. Svar med en blanding av "
        "humoristiske fakta, motiverende tips og gjerne litt absurd statistikk. "
        "Hold deg til Iteras verdier – vær inkluderende og positiv.\n\n"
        f"Brukerens oppgave: {req.task}\n\n"
        "Gi et motiverende, morsomt og kort svar på norsk."
    )
    try:
        response = await llm_service.generate(prompt, model=req.model)
        filtered, filtered_flag = _apply_safety_filter(response)
        return {
            "motivation": filtered,
            "model_used": req.model,
            "safety_note": "Filtered for respectful tone" if filtered_flag else "Tone OK",
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")
