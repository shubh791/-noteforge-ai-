import Link from 'next/link'

export const metadata = {
  title: '404 — Page Not Found · NoteForge AI',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#eef2f7] flex flex-col items-center justify-center px-4">

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200/60 px-8 py-10 max-w-md w-full text-center">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-400 blur-md opacity-40 rounded-xl" />
            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-mono text-2xl font-black shadow-lg shadow-indigo-200">
              N
            </div>
          </div>
        </div>

        {/* 404 */}
        <p className="text-[11px] font-bold uppercase tracking-widest text-violet-500 mb-2">Error 404</p>
        <h1 className="text-3xl font-black text-slate-800 leading-tight mb-3">
          Page not found
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          The page you're looking for doesn't exist or has been moved.
          Head back and turn your notes into something great.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-md"
        >
          <span className="text-indigo-400">✦</span>
          Back to NoteForge AI
        </Link>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-[11px] text-slate-400">
        NoteForge AI — Powered by NVIDIA NIM
      </p>

    </div>
  )
}
