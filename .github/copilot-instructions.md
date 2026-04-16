# Project Guidelines

## Project Context
- Build HuMotivator: an AI-powered motivation tool that mixes useful and playful content.
- Keep outputs professional in presentation, with intelligent humor in tone.
- Follow Itera values: prefer safe, respectful, and brand-aligned AI behavior.
- Treat [README.md](README.md) as the current source of truth for product intent.

## Architecture
- The solution must include frontend, backend, and tests.
- The solution must integrate at least one LLM and one or more open APIs.
- Prefer clear component boundaries:
  - frontend for interaction and presentation
  - backend for orchestration, LLM calls, API integrations, and filtering
  - tests for core flows and integration points

## Build And Test
- No canonical build/test commands are defined yet in this repository.
- Before adding tooling, align with existing files in the repo (if present) instead of inventing parallel setups.
- When introducing commands, document them in [README.md](README.md) and keep them simple for cross-PC onboarding.

## Conventions
- Optimize for a demo-ready MVP that can be shown visually in 2 minutes.
- Favor pragmatic, incremental changes over perfection.
- Keep setup friction low so teammates can run the project on different PCs quickly.
- Do not hardcode secrets or API keys; use environment variables and provide an example env file when relevant.
- Add lightweight safeguards for generated content quality before presenting it to users.

## Collaboration
- Assume each teammate contributes via PR with at least one prompt-driven feature or improvement.
- Keep PRs focused and easy to review; update docs when behavior or setup changes.

## Documentation
- Link to existing docs instead of duplicating long explanations.
- Current primary doc: [README.md](README.md).