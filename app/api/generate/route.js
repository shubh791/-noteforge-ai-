import { NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/prompt'

export const runtime = 'edge'
export const maxDuration = 60

const NIM_MODEL = 'meta/llama-3.1-8b-instruct'
const NIM_BASE_URL = 'https://integrate.api.nvidia.com/v1'

export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { text } = body
  const apiKey = (body.apiKey || process.env.NVIDIA_API_KEY || '').trim()

  // Debug: log whether env key was found (visible in terminal, not browser)
  if (!body.apiKey && process.env.NVIDIA_API_KEY) {
    console.log('[generate] Using NVIDIA_API_KEY from .env.local')
  }

  if (!text || text.trim().length < 10) {
    return NextResponse.json({ error: 'Text is too short — paste more content.' }, { status: 400 })
  }
  if (!apiKey) {
    return NextResponse.json(
      { error: 'No API key found. Either type it in the input box, or add NVIDIA_API_KEY=nvapi-... to .env.local and restart the dev server.' },
      { status: 400 }
    )
  }
  if (!apiKey.startsWith('nvapi-')) {
    return NextResponse.json(
      { error: `API key looks wrong — it must start with "nvapi-" but got: "${apiKey.slice(0, 10)}..."` },
      { status: 400 }
    )
  }

  // Manual AbortController — more compatible than AbortSignal.timeout()
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 90000)

  let nimResponse
  try {
    nimResponse = await fetch(`${NIM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'User-Agent': 'rl-notes-studio/1.0',
      },
      body: JSON.stringify({
        model: NIM_MODEL,
        max_tokens: 16384,
        temperature: 0.2,
        stream: true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Convert ALL of the following raw text into beautiful structured HTML study notes. Include every section, every formula, every variant, every table, every list. Output raw HTML only — no JSON, no markdown fences, nothing else.\n\nRAW TEXT:\n${text}`,
          },
        ],
      }),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    const isAbort = err?.name === 'AbortError'
    const msg = isAbort
      ? 'Request timed out after 90 s. Check your connection and try again.'
      : `Could not reach NVIDIA — ${err?.name}: ${err?.message}. Check your internet connection and that build.nvidia.com is accessible.`
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  clearTimeout(timeoutId)

  if (!nimResponse.ok) {
    const errText = await nimResponse.text().catch(() => '')
    let errMsg = `NVIDIA API error (HTTP ${nimResponse.status})`
    try {
      const j = JSON.parse(errText)
      errMsg = j?.message || j?.error?.message || errMsg
    } catch {}
    if (nimResponse.status === 401) errMsg = 'Invalid API key — check it is correct and starts with "nvapi-".'
    if (nimResponse.status === 402) errMsg = 'Free credits exhausted. Visit build.nvidia.com to check usage.'
    if (nimResponse.status === 429) errMsg = 'Rate limit hit (40 req/min). Wait 60 seconds and try again.'
    if (nimResponse.status === 504) errMsg = 'NVIDIA gateway timed out (504). Try again in a moment.'
    return NextResponse.json({ error: errMsg }, { status: 502 })
  }

  // Forward NVIDIA SSE stream → raw HTML chunks → client
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const reader = nimResponse.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() // hold incomplete last line

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') {
              controller.close()
              return
            }
            try {
              const json = JSON.parse(data)
              const chunk = json.choices?.[0]?.delta?.content || ''
              if (chunk) controller.enqueue(encoder.encode(chunk))
            } catch {}
          }
        }
      } catch (err) {
        controller.error(err)
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
