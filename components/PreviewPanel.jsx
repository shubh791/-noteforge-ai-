const isKeyError = (msg) =>
  msg && (
    msg.toLowerCase().includes('api key') ||
    msg.toLowerCase().includes('nvapi') ||
    msg.toLowerCase().includes('401') ||
    msg.toLowerCase().includes('invalid key')
  )

export default function PreviewPanel({ status, outputHtml, errorMsg, notesRef, onGenerate, hidden }) {
  const isStreaming = status === 'streaming'
  const isDone      = status === 'done'
  const showNotes   = (isStreaming || isDone) && outputHtml
  const wordCount   = outputHtml
    ? outputHtml.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
    : 0

  return (
    <div className={`flex-1 flex flex-col overflow-hidden bg-slate-100/60 ${hidden ? 'hidden md:flex' : 'flex'}`}>

      {/* ── Status strip (only when notes are present) ── */}
      {showNotes && (
        <div className="flex-shrink-0 flex items-center justify-between px-5 h-9 bg-white border-b border-slate-200/80">
          <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest">
            Preview
          </span>
          <div className="flex items-center gap-2">
            {isStreaming ? (
              <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-violet-600 bg-violet-50 border border-violet-200/70 px-2.5 py-0.5 rounded-full">
                <span className="stream-dot" />
                Writing…
                {wordCount > 30 && (
                  <span className="font-mono text-[10px] text-violet-500 ml-0.5">
                    {wordCount.toLocaleString()} w
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                ✓ {wordCount.toLocaleString()} words
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Scrollable content area ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-preview px-4 py-6 md:px-10 md:py-8">

        {/* ── Idle ── */}
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center h-full min-h-[460px] gap-6 select-none">
            <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-4xl">
              📄
            </div>
            <div className="text-center">
              <p className="text-[15px] font-bold text-slate-700 mb-1.5 tracking-tight">
                Notes appear here
              </p>
              <p className="text-[12.5px] text-slate-400 leading-relaxed max-w-[260px]">
                Paste raw lecture or exam text on the left, then click Generate.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-[300px]">
              {[
                ['📐', 'Sections & diagrams'],
                ['✦',  'Bullet breakdowns'],
                ['∑',  'Formula boxes'],
                ['↓',  'PNG export'],
              ].map(([icon, label]) => (
                <div key={label} className="flex items-center gap-2 text-[11.5px] text-slate-500 bg-white border border-slate-100 rounded-lg px-3 py-2 shadow-sm">
                  <span className="text-slate-400 text-xs w-4 text-center">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center h-full min-h-[460px] gap-5">
            <div className="loading-ring" />
            <div className="text-center">
              <p className="text-[13.5px] font-bold text-slate-700 mb-1 tracking-tight">
                Connecting to NVIDIA NIM
              </p>
              <p className="text-[11.5px] text-slate-400">
                Llama 3.1 · First tokens arrive in seconds
              </p>
            </div>
            <div className="flex flex-col gap-2.5 w-full max-w-[500px] mt-1">
              {[88, 72, 94, 60, 80, 68].map((w, i) => (
                <div
                  key={i}
                  className="h-7 bg-white rounded-lg border border-slate-100 animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 110}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className="flex items-start justify-center pt-12 min-h-[460px]">
            <div className="bg-white border border-red-100 rounded-2xl p-5 w-full max-w-[540px] shadow-sm">
              <div className="flex items-center gap-2 text-[13px] font-bold text-rose-700 mb-2">
                <span className="w-5 h-5 rounded-full bg-red-100 text-rose-600 text-[10px] flex items-center justify-center flex-shrink-0 font-black">
                  ✕
                </span>
                Generation Failed
              </div>

              <p className="text-[12.5px] leading-7 text-slate-500 mb-3">{errorMsg}</p>

              {isKeyError(errorMsg) && (
                <div className="text-xs leading-relaxed px-3 py-2.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 mb-2">
                  Key must start with{' '}
                  <code className="bg-violet-100 px-1 py-0.5 rounded font-mono text-[11px]">nvapi-</code>.
                  {' '}Get one free at{' '}
                  <a href="https://build.nvidia.com/settings/api-keys" target="_blank" rel="noreferrer"
                    className="font-semibold underline underline-offset-2">
                    build.nvidia.com ↗
                  </a>
                </div>
              )}
              {errorMsg?.includes('.env.local') && (
                <div className="text-xs leading-relaxed px-3 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 mb-2">
                  After editing{' '}
                  <code className="font-mono text-[11px]">.env.local</code>, restart the dev server for the key to take effect.
                </div>
              )}
              {(errorMsg?.includes('fetch') || errorMsg?.includes('network') || errorMsg?.includes('reach')) && (
                <div className="text-xs leading-relaxed px-3 py-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 mb-2">
                  Check internet access and that <strong>build.nvidia.com</strong> is reachable.
                </div>
              )}

              <button
                onClick={onGenerate}
                className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-br from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 hover:-translate-y-px hover:shadow-lg hover:shadow-violet-200/60 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                ↺ Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── Notes ── */}
        {showNotes && (
          <div
            className="notes-page"
            ref={notesRef}
            dangerouslySetInnerHTML={{ __html: outputHtml }}
          />
        )}

      </div>
    </div>
  )
}
