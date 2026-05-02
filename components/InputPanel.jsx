export default function InputPanel({ inputText, apiKey, status, onTextChange, onKeyChange, onGenerate, className }) {
  const isWorking = status === 'loading' || status === 'streaming'
  const charCount = inputText.length

  return (
    <div className={`flex flex-col gap-4 p-4 flex-1 md:flex-none md:w-80 md:flex-shrink-0 bg-white/50 backdrop-blur-md border-r border-slate-200 ${className || ''}`}>
      
      {/* Section Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isWorking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Raw Content</span>
        </div>
        {charCount > 0 && (
          <span className="text-[10px] font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
            {charCount.toLocaleString()} chars
          </span>
        )}
      </div>

      {/* API Key Card */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold text-slate-400 tracking-tight">NVIDIA API KEY</label>
          <a
            className="text-[10px] font-bold text-violet-500 hover:underline"
            href="https://build.nvidia.com/settings/api-keys"
            target="_blank"
            rel="noreferrer"
          >
            GET KEY ↗
          </a>
        </div>
        <input
          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
          type="password"
          value={apiKey}
          onChange={(e) => onKeyChange(e.target.value)}
          placeholder="nvapi-..."
          spellCheck={false}
        />
      </div>

      {/* Text input area - This now takes up the remaining space properly */}
      <div className="relative flex-1 min-h-0">
        <textarea
          className="w-full h-full p-4 text-sm leading-relaxed text-slate-700 bg-white border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
          value={inputText}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={isWorking}
          placeholder="Paste raw text here..."
        />
      </div>

      {/* Action Area - Locked to the bottom */}
      <div className="pt-2 shrink-0">
        {isWorking && (
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: status === 'streaming' ? '85%' : '35%' }}
            />
          </div>
        )}

        <button
          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md
            ${isWorking 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-200 hover:brightness-105'
            }`}
          onClick={onGenerate}
          disabled={isWorking}
        >
          {isWorking ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-xs uppercase tracking-wider">Processing...</span>
            </>
          ) : (
            <>
              <span className="text-base">✦</span>
              <span className="text-xs uppercase tracking-wider">Generate Notes</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}