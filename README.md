# team_6_huMotivator

🇳🇴 Norsk (original tekst)

HuMotivatoren

Når du trenger inspirasjon og arbeidslyst skal humotivatoren hjelpe deg. Du forteller kort hva du skal gjøre og den vil feks hente (i)relevant fakta, visuelle/audio innhold som bidrar til å skape et smil. Gjerne statistikk som er veldig treffende. Den skal anbefale (u)seriøse ting for å få inspirasjon.
Den skal fremstå som et profft verktøy. Med intelligent humor og tips.

Løsningen bør ha noen innstillinger og parametre. Kanskje noen ulike view som er tilpasset ulike personlighetstyper og innholdsvalg. Her har dere mange muligheter til å finne på (u)relevante ting.

Vi skal holde oss til Iteras verdier. (Dvs at vi passer litt på hva AI finner på)

Løsning må

benytte en LLM (info kommer på slack)
benytte en eller flere åpne APIer
ha frontend, backend og tester
kunne demonstreres visuelt på storskjerm (på 2 min)

Use cases:

Jeg bør lese nyhetene og trenger inspirasjon
Ragulan vil jeg skal spille fotball, jeg trenger inspirasjon
Jeg er på hackathon med avdelingen og trenger inspirasjon

En på laget setter opp en repo på github. Hjelp hverandre med å få det opp på alle PC’er.
Alle på laget skal lage en PR, dvs prøve seg på minimum en prompt og få noe utviklet som deretter blir en del av løsningen.

Målet er ikke perfeksjon, men å leke med AI, teste og få et presentabelt (u)profesjonelt resultat.

🇬🇧 English (translation)

HuMotivator

When you need inspiration and motivation to work, the HuMotivator should help you. You briefly describe what you’re going to do, and it will, for example, fetch (ir)relevant facts, visual/audio content that helps create a smile. Preferably statistics that are very spot-on. It should recommend (un)serious things to inspire you.
It should appear as a professional tool, with intelligent humor and tips.

The solution should have some settings and parameters. Perhaps different views tailored to different personality types and content preferences. There are many opportunities here to come up with (ir)relevant ideas.

We should adhere to Itera’s values (i.e., be mindful of what the AI generates).

The solution must:

use an LLM (info will come on Slack)
use one or more open APIs
have frontend, backend, and tests
be demonstrable visually on a big screen (within 2 minutes)

Use cases:

I should read the news and need inspiration
Ragulan wants me to play football, I need inspiration
I am at a hackathon with my department and need inspiration

One team member sets up a repo on GitHub. Help each other get it running on all PCs.
Everyone on the team should create a PR, i.e., try at least one prompt and build something that becomes part of the solution.

The goal is not perfection, but to play with AI, test, and produce a presentable (un)professional result.

## Demo-Ready Scaffold (Synced With Main)

The repository now includes:

- Frontend (React + Vite): `frontend/`
- Backend (FastAPI + Ollama): `backend/`
- Backend API tests (pytest): `backend/tests/test_main.py`

### Run backend

```bash
cd backend
cp .env.example .env
docker compose up --build
```

Backend is available at `http://localhost:8000`.

The backend uses:
- Ollama (LLM) for motivational responses.
- YouTube search API for video suggestions.
- Spotify API for music suggestions (optional credentials; coach-specific fallback tracks are returned if credentials are missing).

### Run frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open the local Vite URL and test the full flow from Home to Result.
Result view now shows motivation text plus video and music enrichment from backend open-API integrations.

### Run tests

```bash
cd backend
docker build -t humotivator-backend-test .
docker run --rm humotivator-backend-test pytest -q
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) automatically:
- Runs backend tests (pytest) on every push and PR to `main`
- Builds the frontend and runs type checks
- Runs ESLint for code quality

Check workflow status on the [Actions](../../actions) tab.
