# HuMotivatoren – Oppgaveoversikt

## Prosjektbeskrivelse
HuMotivatoren er et verktøy som gir brukeren inspirasjon og motivasjon med intelligent humor. Brukeren beskriver hva de skal gjøre, og appen svarer med (ir)relevante fakta, statistikk, visuelle/audio-innhold og (u)seriøse tips. Fremstår som et profft verktøy med glimt i øyet.

**Tech-stack:** React (frontend) · Python (backend) · LLM-integrasjon · Åpne API-er

---

## 1. Prosjektoppsett

### 1.1 Backend-oppsett (Python)
- Initialiser Python-prosjekt med virtuelt miljø (`venv`)
- Sett opp rammeverk (FastAPI eller Flask)
- Konfigurer `requirements.txt` / `pyproject.toml`
- Legg til CORS-støtte for frontend-kommunikasjon
- Sett opp miljøvariabler (`.env`) for API-nøkler

### 1.2 Frontend-oppsett (React)
- Opprett React-app (Vite + React anbefalt)
- Sett opp mappestruktur (`components/`, `pages/`, `services/`, `assets/`)
- Installer nødvendige pakker (axios/fetch, routing, styling)
- Konfigurer proxy/miljøvariabler for backend-URL

### 1.3 Prosjektinfrastruktur
- Sett opp `.gitignore` for Python og React
- Lag en felles `README.md` med kjøreinstruksjoner
- Eventuelt Docker Compose for enkel oppstart

---

## 2. Backend-utvikling

### 2.1 API-design
- Definer REST-endepunkter:
  - `POST /api/motivate` – Mottar brukerens oppgave/beskrivelse, returnerer motivasjonsinnhold
  - `GET /api/settings` – Hent tilgjengelige innstillinger/personlighetstyper
  - `POST /api/settings` – Oppdater brukerens preferanser

### 2.2 LLM-integrasjon
- Koble til LLM (f.eks. OpenAI API eller annen LLM oppgitt på Slack)
- Lag prompt-engineering som genererer humoristisk, motiverende innhold
- Sørg for at innholdet følger Iteras verdier (innholdsfiltrering)
- Håndter ulike "personlighetstyper" i prompts (seriøs, humoristisk, absurd osv.)

### 2.3 Åpne API-integrasjoner
- Integrer minst ett åpent API, f.eks.:
  - **Fakta-API** (f.eks. uselessfacts, numbersapi) – for (ir)relevante fakta
  - **Bilde/GIF-API** (f.eks. Giphy, Unsplash) – for visuelt innhold
  - **Sitat-API** (f.eks. quotable) – for inspirerende/morsomme sitater
  - **Nyhets-API** (f.eks. NewsAPI) – for use case "lese nyhetene"
  - **Sport-API** (f.eks. football-data.org) – for use case "spille fotball"
- Lag servicemodul(er) som henter og formaterer data fra disse API-ene

### 2.4 Innholdsaggregering
- Kombiner LLM-respons med data fra åpne API-er til én samlet respons
- Lag logikk som velger relevant innhold basert på brukerens input og innstillinger
- Sørg for variasjon (ikke samme respons hver gang)

---

## 3. Frontend-utvikling

### 3.1 Hovedside / Input-visning
- Lag inputfelt der brukeren beskriver oppgaven sin
- "Motiver meg"-knapp som sender forespørsel til backend
- Lasteindikator mens backend jobber

### 3.2 Resultatvisning
- Vis motivasjonsinnhold på en visuelt tiltalende måte:
  - Humoristisk/motiverende tekst fra LLM
  - Fakta/statistikk-kort
  - Bilder/GIF-er
  - Sitater
- Animasjoner eller overganger for å gjøre det engasjerende
- Mulighet for å "få ny inspirasjon" (ny forespørsel)

### 3.3 Innstillinger / Personlighetstyper
- Side eller panel for innstillinger:
  - Velg personlighetstype (f.eks. "Seriøs coach", "Kontorklovn", "Zen-mester", "Absurd humor")
  - Velg innholdstype (fakta, bilder, sitater, statistikk)
  - Humornivå (skala)
- Lagre innstillinger i state/localStorage

### 3.4 Ulike views / temaer
- Minst 2-3 ulike visuelle temaer tilpasset personlighetstyper
- Responsivt design (fungerer på storskjerm for demo)
- Profesjonelt utseende med humoristiske detaljer

### 3.5 UI/UX og styling
- Velg styling-løsning (CSS Modules, Tailwind, Styled Components)
- Design et "profft" men lekent uttrykk
- Sørg for god lesbarhet på storskjerm (demo-krav)

---

## 4. Testing

### 4.1 Backend-tester
- Enhetstester for API-endepunkter (pytest)
- Tester for LLM-prompt-generering (mock LLM-kall)
- Tester for API-integrasjoner (mock eksterne API-er)
- Test at innholdsfiltrering fungerer (Itera-verdier)

### 4.2 Frontend-tester
- Komponenttester (React Testing Library / Vitest)
- Test at brukerinput sendes korrekt til backend
- Test at resultatvisning rendrer ulike innholdstyper
- Test innstillinger-funksjonalitet

---

## 5. Use Case-spesifikke oppgaver

### 5.1 "Lese nyhetene og trenge inspirasjon"
- Hent nyheter via API og la LLM lage motiverende kommentar

### 5.2 "Spille fotball – trenger inspirasjon"
- Hent fotballfakta/-statistikk og la LLM lage motiverende innhold

### 5.3 "Hackathon med avdelingen"
- Generer teambuilding-tips, hackathon-motivasjon og morsomme fakta

---

## 6. Demo og ferdigstilling

### 6.1 Demo-forberedelse
- Sørg for at appen kan kjøres og demonstreres på 2 minutter
- Lag en demo-flyt som viser hovedfunksjonalitet
- Test på storskjerm/projektor

### 6.2 Dokumentasjon
- Oppdater README med:
  - Installasjonsinstruksjoner
  - Hvordan kjøre frontend og backend
  - Miljøvariabler som trengs
  - Kort beskrivelse av arkitektur

---

## Oppsummering – Prioritert rekkefølge

| # | Oppgave | Prioritet |
|---|---------|-----------|
| 1 | Prosjektoppsett (backend + frontend) | 🔴 Høy |
| 2 | Backend: API-endepunkt + LLM-integrasjon | 🔴 Høy |
| 3 | Frontend: Inputside + resultatvisning | 🔴 Høy |
| 4 | Åpne API-integrasjoner (minst 1) | 🔴 Høy |
| 5 | Innstillinger og personlighetstyper | 🟡 Medium |
| 6 | Ulike views/temaer | 🟡 Medium |
| 7 | Testing (backend + frontend) | 🟡 Medium |
| 8 | Use case-tilpasninger | 🟢 Lav |
| 9 | Demo-forberedelse og dokumentasjon | 🔴 Høy |
