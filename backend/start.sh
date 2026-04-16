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
if ! curl -sf "$OLLAMA_URL/api/tags" | python -c "
import sys, json
models = [m['name'] for m in json.load(sys.stdin).get('models', [])]
sys.exit(0 if any('$MODEL' in m for m in models) else 1)
" 2>/dev/null; then
    echo "⬇️  Laster ned modell '$MODEL'... (dette kan ta litt tid)"
    curl -sf "$OLLAMA_URL/api/pull" -d "{\"name\": \"$MODEL\"}" | while read -r line; do
        status=$(echo "$line" | python -c "import sys,json; print(json.load(sys.stdin).get('status',''))" 2>/dev/null)
        [ -n "$status" ] && echo "   $status"
    done
    echo "✅ Modell '$MODEL' er klar!"
else
    echo "✅ Modell '$MODEL' finnes allerede."
fi

echo "🚀 Starter backend..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload
