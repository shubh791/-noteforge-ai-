'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Topbar from '@/components/Topbar'
import InputPanel from '@/components/InputPanel'
import PreviewPanel from '@/components/PreviewPanel'
import Footer from '@/components/Footer'

const loadHtml2Canvas = () => new Promise((resolve, reject) => {
  if (typeof window !== 'undefined' && window.html2canvas) {
    resolve(window.html2canvas); return
  }
  const script = document.createElement('script')
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
  script.onload = () => resolve(window.html2canvas)
  script.onerror = () => reject(new Error('Failed to load html2canvas from CDN'))
  document.head.appendChild(script)
})

export default function Home() {
  const [inputText, setInputText]   = useState('')
  const [apiKey, setApiKey]         = useState('')
  const [outputHtml, setOutputHtml] = useState('')
  const [status, setStatus]         = useState('idle')
  const [errorMsg, setErrorMsg]     = useState('')
  const [exporting, setExporting]   = useState(false)
  const [mobileTab, setMobileTab]   = useState('input')
  const notesRef = useRef(null)

  /* Auto-switch to preview when generation starts */
  useEffect(() => {
    if (status === 'streaming' || status === 'done' || status === 'error') {
      setMobileTab('preview')
    }
  }, [status])

  const handleGenerate = useCallback(async () => {
    const text = inputText.trim()
    const key  = apiKey.trim()

    if (!text) { alert('Please paste your raw text first.'); return }
    if (key && !key.startsWith('nvapi-')) {
      alert('Your NVIDIA NIM key must start with "nvapi-".')
      return
    }

    setStatus('loading')
    setOutputHtml('')
    setErrorMsg('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, apiKey: key }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || `Server error: ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      setStatus('streaming')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setOutputHtml(
          accumulated
            .replace(/^```html?\s*/i, '')
            .replace(/```\s*$/, '')
            .trim()
        )
      }

      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }, [inputText, apiKey])

  const handleClear = useCallback(() => {
    setInputText('')
    setOutputHtml('')
    setStatus('idle')
    setErrorMsg('')
    setMobileTab('input')
  }, [])

  const handleExportImage = useCallback(async (full = false) => {
    const source = notesRef.current
    if (!source) return
    setExporting(true)

    try {
      const html2canvas = await loadHtml2Canvas()
      await document.fonts.ready

      const clone = document.createElement('div')
      clone.innerHTML = source.innerHTML
      const w = full ? 900 : Math.min(source.offsetWidth, 900)
      Object.assign(clone.style, {
        position: 'fixed', top: '0', left: '-9999px',
        width: w + 'px', background: '#ffffff',
        padding: '36px 44px', fontFamily: "'Outfit', sans-serif",
        color: '#1a1a2e', columnCount: '1',
        boxSizing: 'border-box', lineHeight: '1.6',
      })
      document.body.appendChild(clone)

      const canvas = await html2canvas(clone, {
        scale: full ? 3 : 2, useCORS: true, allowTaint: true,
        logging: false, backgroundColor: '#ffffff',
        width: w, height: clone.scrollHeight,
        windowWidth: w + 88, windowHeight: clone.scrollHeight,
      })
      document.body.removeChild(clone)

      const url = canvas.toDataURL('image/png')
      const a   = document.createElement('a')
      a.href = url
      a.download = full ? 'notes-full.png' : 'notes.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      alert('Export failed.\n\n' + err.message)
    } finally {
      setExporting(false)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Topbar
        status={status}
        exporting={exporting}
        onClear={handleClear}
        onGenerate={handleGenerate}
        onExportImage={handleExportImage}
      />

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Mobile-only tab bar */}
        <div className="flex md:hidden flex-shrink-0 bg-white border-b border-slate-200">
          <button
            onClick={() => setMobileTab('input')}
            className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              mobileTab === 'input'
                ? 'text-violet-600 border-violet-600 bg-violet-50'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            ✏ Input
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              mobileTab === 'preview'
                ? 'text-violet-600 border-violet-600 bg-violet-50'
                : 'text-slate-500 border-transparent hover:text-slate-700'
            }`}
          >
            ◎ Preview
          </button>
        </div>

        <InputPanel
          inputText={inputText}
          apiKey={apiKey}
          status={status}
          onTextChange={setInputText}
          onKeyChange={setApiKey}
          onGenerate={handleGenerate}
          className={mobileTab !== 'input' ? 'hidden md:flex' : ''}
        />
        <PreviewPanel
          status={status}
          outputHtml={outputHtml}
          errorMsg={errorMsg}
          notesRef={notesRef}
          onGenerate={handleGenerate}
          hidden={mobileTab !== 'preview'}
        />
      </div>
      <Footer />
    </div>
  )
}
