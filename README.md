# RL Notes Studio — NVIDIA NIM Edition

Convert raw RL exam text into beautiful study notes using the **free NVIDIA NIM API**.

## Get Your Free Key (2 mins)

1. Go to **https://build.nvidia.com** → Sign up free (no credit card)
2. Go to **https://build.nvidia.com/settings/api-keys**
3. Click **Generate Personal Key** → Services: Public API Endpoints → Generate
4. Copy your key — it starts with **`nvapi-`**

Free tier: **1,000 inference credits**, 40 req/min, 100+ models.

## Run

```bash
npm install
npm run dev
# Open http://localhost:3000
# Paste nvapi-... key → select topic → Generate
```

## Structure (App Router, no src/)

```
app/
  api/generate/route.ts   ← NVIDIA NIM API (Llama 3.3 70B)
  globals.css             ← All styles
  layout.tsx
  page.tsx                ← Main UI
lib/
  samples.ts              ← 4 RL topics
  prompt.ts               ← AI prompt
```

## Change Model

In `app/api/generate/route.ts`:
```ts
const NIM_MODEL = 'meta/llama-3.3-70b-instruct'   // default (best)
const NIM_MODEL = 'mistralai/mistral-large-2'       // fast
const NIM_MODEL = 'deepseek-ai/deepseek-r1'         // reasoning
```

Browse all free models: https://build.nvidia.com/models
