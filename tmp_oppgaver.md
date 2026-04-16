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


### 1.2 Frontend-oppsett (React/TypeScript)

- Kjør `npm install` i `frontend`-mappen for å installere alle nødvendige pakker (React, ReactDOM, React Router, Styled Components, axios, mm.).
- Kjør `npm run dev` i `frontend` for å starte utviklingsserveren (Vite).
- All kode skal skrives i TypeScript (`.tsx`/`.ts`).
- Mappestruktur:
  - `components/` – Gjenbrukbare UI-komponenter, hver i egen mappe med tilhørende `.styled.tsx` for styling.
  - `pages/` – Sider (Home, Result, Settings), hver i egen mappe med tilhørende `.styled.tsx`.
  - `services/` – API-kall og annen forretningslogikk.
  - `assets/` – Bilder, ikoner, etc.
- Bruk Styled Components for all styling. Del opp komponenter slik:
  - Eksempel: `components/Button/Button.tsx` og `components/Button/Button.styled.tsx`.
- Miljøvariabler for backend-URL settes i `.env`-fil i `frontend` (se `.env.example`).
- Ingen .js/.jsx-filer skal brukes – kun `.ts`/`.tsx`.
- Ingen Tailwind eller CSS-moduler – kun Styled Components.
- Se README for oppdaterte kjøreinstruksjoner og onboarding.

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


### 3. Frontend-utvikling

#### 3.1 Hovedside / Input-visning (`pages/Home`)
- Inputfelt for oppgavebeskrivelse (`useState`)
- "Motiver meg"-knapp som kaller backend via `services/api.ts` og sender bruker til Resultat-siden
- Lasteindikator vises mens backend jobber

#### 3.2 Resultatvisning (`pages/Result`)
- Viser motivasjonsinnhold fra backend (tekst, fakta, bilder/GIF, sitat)
- Alt innhold vises med Styled Components og animasjoner/overganger kan legges til
- "Få ny inspirasjon"-knapp sender bruker tilbake til Home

#### 3.3 Innstillinger / Personlighetstyper (`pages/Settings`)
- Side/panel for valg av personlighetstype, innholdstype og humornivå
- Bruk `useTheme` fra `components/ThemeProvider` for å endre tema
- Lagre innstillinger i React state og localStorage

#### 3.4 Ulike views / temaer
- Minst 2-3 ulike visuelle temaer, styres via ThemeProvider og Styled Components
- Responsivt design (fungerer på storskjerm for demo)
- Profesjonelt, men lekent uttrykk

#### 3.5 UI/UX og styling
- Kun Styled Components – ingen global CSS eller Tailwind
- Følg komponentstruktur: én fil for logikk (`.tsx`), én for styling (`.styled.tsx`)
- God lesbarhet og demo-vennlig layout

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

| #   | Oppgave                                  | Prioritet |
| --- | ---------------------------------------- | --------- |
| 1   | Prosjektoppsett (backend + frontend)     | 🔴 Høy    |
| 2   | Backend: API-endepunkt + LLM-integrasjon | 🔴 Høy    |
| 3   | Frontend: Inputside + resultatvisning    | 🔴 Høy    |
| 4   | Åpne API-integrasjoner (minst 1)         | 🔴 Høy    |
| 5   | Innstillinger og personlighetstyper      | 🟡 Medium |
| 6   | Ulike views/temaer                       | 🟡 Medium |
| 7   | Testing (backend + frontend)             | 🟡 Medium |
| 8   | Use case-tilpasninger                    | 🟢 Lav    |
| 9   | Demo-forberedelse og dokumentasjon       | 🔴 Høy    |
