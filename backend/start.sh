#!/bin/bash
set -e

OLLAMA_URL="${OLLAMA_BASE_URL:-http://ollama:11434}"
MODEL="${DEFAULT_MODEL:-gemma3:1b}"

echo "⏳ Venter på at Ollama skal bli klar..."
until curl -sf "$OLLAMA_URL/api/tags" > /dev/null 2>&1; do
    sleep 2
done
echo "✅ Ollama er klar!"

echo "📦 Sjekker om modell '$MODEL' finnes..."
if ! curl -s "$OLLAMA_URL/api/tags" | python -c "
import sys, json
models = [m['name'] for m in json.load(sys.stdin).get('models', [])]
sys.exit(0 if any('$MODEL' in m for m in models) else 1)
" 2>/dev/null; then
    echo "⬇️  Laster ned modell '$MODEL'... (dette kan ta litt tid)"
    curl -s "$OLLAMA_URL/api/pull" -d "{\"name\": \"$MODEL\", \"stream\": false}"
    echo ""
    echo "✅ Modell '$MODEL' er klar!"
else
    echo "✅ Modell '$MODEL' finnes allerede."
fi

echo "🚀 Starter backend..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
