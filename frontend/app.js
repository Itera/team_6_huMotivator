const API_BASE = "http://localhost:8000";

const taskInput = document.getElementById("taskInput");
const modelSelect = document.getElementById("modelSelect");
const generateBtn = document.getElementById("generateBtn");
const sampleBtn = document.getElementById("sampleBtn");
const statusEl = document.getElementById("status");
const responseGrid = document.getElementById("responseGrid");

document.getElementById("apiBase").textContent = API_BASE;

function setStatus(message, kind = "") {
  statusEl.className = `status ${kind}`.trim();
  statusEl.textContent = message;
}

function renderMotivation(payload) {
  responseGrid.innerHTML = "";

  const tiles = [
    ["Motivation", payload.motivation || "No response from model."],
    ["Model", payload.model_used || "unknown"],
    ["Safety", payload.safety_note || "No additional safety notes."],
  ];

  tiles.forEach(([title, text], index) => {
    const article = document.createElement("article");
    article.className = "tile" + (title === "Motivation" ? " full" : "");
    article.style.animationDelay = `${index * 55}ms`;

    const h3 = document.createElement("h3");
    h3.textContent = title;

    const p = document.createElement("p");
    p.textContent = text;

    article.appendChild(h3);
    article.appendChild(p);
    responseGrid.appendChild(article);
  });
}

async function loadModels() {
  setStatus("Loading models...", "ok");
  try {
    const response = await fetch(`${API_BASE}/models`);
    if (!response.ok) {
      throw new Error(`Model fetch failed (${response.status})`);
    }

    const data = await response.json();
    const models = Array.isArray(data.models) ? data.models : [];
    modelSelect.innerHTML = "";

    if (!models.length) {
      const option = document.createElement("option");
      option.value = "llama3.2";
      option.textContent = "llama3.2 (fallback)";
      modelSelect.appendChild(option);
      setStatus("No models reported by backend; using fallback.", "error");
      return;
    }

    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });

    setStatus("Models loaded.", "ok");
  } catch (error) {
    modelSelect.innerHTML = "";
    const option = document.createElement("option");
    option.value = "llama3.2";
    option.textContent = "llama3.2 (fallback)";
    modelSelect.appendChild(option);
    setStatus(String(error.message || error), "error");
  }
}

async function generateMotivation() {
  const task = taskInput.value.trim();
  const model = modelSelect.value || "llama3.2";

  if (!task) {
    setStatus("Please add a task first.", "error");
    return;
  }

  generateBtn.disabled = true;
  setStatus("Generating motivation...", "ok");

  try {
    const response = await fetch(`${API_BASE}/motivate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task, model }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Backend error (${response.status}): ${body}`);
    }

    const payload = await response.json();
    renderMotivation(payload);
    setStatus("Motivation generated.", "ok");
  } catch (error) {
    setStatus(String(error.message || error), "error");
  } finally {
    generateBtn.disabled = false;
  }
}

generateBtn.addEventListener("click", generateMotivation);
sampleBtn.addEventListener("click", () => {
  taskInput.value = "I need inspiration to practice football after work";
  generateMotivation();
});

loadModels();
