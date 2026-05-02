export default function Topbar({ status, exporting, onClear, onGenerate, onExportImage }) {
  const isWorking = status === 'loading' || status === 'streaming'
  const done = status === 'done'

  return (
    <header className="h-14 bg-white/70 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 flex-shrink-0 z-50 sticky top-0 print:hidden">
      {/* Brand - Modern Gradient Logo */}
      <div className="flex items-center gap-3 group cursor-default">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-400 blur-sm opacity-40 group-hover:opacity-70 transition-opacity" />
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-mono text-base font-black shadow-lg shadow-indigo-200">
            N
          </div>
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-black text-slate-800 leading-tight tracking-tight">NoteForge <span className="text-violet-600">AI</span></span>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by NVIDIA NIM</span>
          </div>
        </div>
      </div>

      {/* Actions - Glassmorphism Style Buttons */}
      <div className="flex items-center gap-2">
        {status !== 'idle' && (
          <button
            onClick={onClear}
            className="hidden xs:inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-100/50 hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-95 border border-transparent hover:border-slate-200"
          >
            Clear
          </button>
        )}

        <button
          onClick={onGenerate}
          disabled={isWorking}
          className={`relative overflow-hidden inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all active:scale-95 shadow-md hover:shadow-indigo-200
            ${isWorking 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
        >
          {isWorking ? (
            <>
              <div className="w-3 h-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              <span>{status === 'streaming' ? 'Writing...' : 'Connecting...'}</span>
            </>
          ) : (
            <>
              <span className="text-indigo-400">✦</span>
              <span>Generate Notes</span>
            </>
          )}
        </button>

        {done && (
          <>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            
            {/* Export Buttons - Colorful Accents */}
            <button
              onClick={() => onExportImage(false)}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:shadow-sm hover:shadow-blue-100 transition-all active:scale-95 disabled:opacity-50"
            >
              {exporting ? '...' : '↓ Export'}
            </button>
            
            <button
              onClick={() => onExportImage(true)}
              disabled={exporting}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 hover:shadow-sm hover:shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
            >
              {exporting ? '...' : '↓ High-Res PNG'}
            </button>
          </>
        )}
      </div>
    </header>
  )
}