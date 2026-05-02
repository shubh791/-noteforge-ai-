const isKeyError = (msg) =>
  msg && (
    msg.toLowerCase().includes('api key') ||
    msg.toLowerCase().includes('nvapi') ||
    msg.toLowerCase().includes('401') ||
    msg.toLowerCase().includes('invalid key')
  )

export default function PreviewPanel({ status, outputHtml, errorMsg, notesRef, onGenerate, hidden }) {
  const showNotes = (status === 'streaming' || status === 'done') && outputHtml
  const wordCount = outputHtml
    ? outputHtml.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
    : 0

  return (
    <div className={`flex-1 overflow-y-auto p-4 md:p-5 bg-[#eef2f7] scroll-preview ${hidden ? 'hidden md:block' : 'block'}`}>

      {/* Empty state */}
      {status === 'idle' && (
        <div className="flex flex-col items-center justify-center h-[460px] gap-3 text-slate-500 text-center">
          <div className="text-5xl opacity-20">📄</div>
          <div className="text-[17px] font-semibold text-slate-500 mt-1">Notes appear here</div>
          <div className="text-[12.5px] max-w-[300px] leading-relaxed text-slate-400">
            Paste raw text on the left and click Generate. Works with any topic — RL, ML, maths, history.
          </div>
        </div>
      )}

      {/* Loading state */}
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center h-[460px] gap-4">
          <div className="loading-ring" />
          <div className="text-sm font-semibold text-slate-600 tracking-tight">Connecting to NVIDIA NIM</div>
          <div className="text-[11.5px] text-slate-400 text-center leading-relaxed">
            Llama 3.1 · First tokens arrive in seconds
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="bg-white border border-red-100 rounded-xl p-5 max-w-[540px] mx-auto mt-10 shadow-sm">
          <div className="flex items-center gap-1.5 text-[13.5px] font-bold text-rose-700 mb-2">
            <span className="w-5 h-5 rounded-full bg-red-100 text-rose-700 text-[10px] flex items-center justify-center flex-shrink-0">
              ✕
            </span>
            Generation Failed
          </div>
          <div className="text-[12.5px] leading-7 text-gray-500">{errorMsg}</div>

          {isKeyError(errorMsg) && (
            <div className="mt-3 text-xs leading-relaxed px-3 py-2 rounded-lg bg-violet-50 border border-violet-200 text-violet-700">
              Key must start with{' '}
              <code className="bg-violet-100 px-1 py-0.5 rounded font-mono text-[11px]">nvapi-</code>.
              {' '}Get one free at{' '}
              <a href="https://build.nvidia.com/settings/api-keys" target="_blank" rel="noreferrer" className="font-semibold underline">
                build.nvidia.com ↗
              </a>
            </div>
          )}
          {errorMsg?.includes('.env.local') && (
            <div className="mt-3 text-xs leading-relaxed px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              After editing{' '}
              <code className="font-mono text-[11px]">.env.local</code>, restart the dev server for the key to take effect.
            </div>
          )}
          {(errorMsg?.includes('fetch') || errorMsg?.includes('network') || errorMsg?.includes('reach')) && (
            <div className="mt-3 text-xs leading-relaxed px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
              Check internet access and that <strong>build.nvidia.com</strong> is reachable.
            </div>
          )}

          <button
            onClick={onGenerate}
            className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-violet-100 bg-gradient-to-br from-violet-600 to-violet-800 border border-violet-700 hover:from-violet-700 hover:to-violet-900 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(124,58,237,0.38)] active:scale-95 transition-all duration-150 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Generated notes */}
      {showNotes && (
        <div>
          {/* Notes header bar */}
          <div className="flex items-center justify-between max-w-[1200px] mx-auto mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
              <span className="text-[12px] font-bold text-slate-700 tracking-tight">Your Study Notes</span>
            </div>
            <div className="flex items-center gap-2">
              {status === 'streaming' ? (
                <div className="flex items-center gap-1.5 text-[10.5px] text-violet-600 font-semibold px-2.5 py-1 bg-violet-50 border border-violet-200/70 rounded-full">
                  <span className="stream-dot" />
                  Writing…
                  {wordCount > 10 && (
                    <span className="font-mono text-violet-500">{wordCount.toLocaleString()} words</span>
                  )}
                </div>
              ) : (
                <span className="text-[10.5px] font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                  {wordCount.toLocaleString()} words
                </span>
              )}
            </div>
          </div>

          <div
            className="notes-page"
            ref={notesRef}
            dangerouslySetInnerHTML={{ __html: outputHtml }}
          />
        </div>
      )}
    </div>
  )
}
