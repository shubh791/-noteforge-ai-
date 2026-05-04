function QuestionBlock({ block }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-extrabold text-slate-800">{block.title}</h1>
      {block.marks && (
        <span className="bg-yellow-400 px-3 py-1 rounded-full text-xs font-bold shrink-0 ml-3">
          {block.marks}
        </span>
      )}
    </div>
  )
}

function TextBlock({ block }) {
  const colors = {
    introduction: 'bg-blue-50 border-blue-500',
    intro:        'bg-blue-50 border-blue-500',
    definition:   'bg-emerald-50 border-emerald-500',
    importance:   'bg-purple-50 border-purple-500',
    working:      'bg-indigo-50 border-indigo-500',
    conclusion:   'bg-slate-50 border-slate-400',
  }
  const key = block.title?.toLowerCase() || ''
  const colorClass = Object.entries(colors).find(([k]) => key.includes(k))?.[1]
    ?? 'bg-slate-50 border-slate-400'

  return (
    <div className={`border-l-4 p-4 rounded-xl mb-3 ${colorClass}`}>
      <h3 className="font-bold mb-2 text-slate-700">{block.title}</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
        {(block.content || []).map((c, i) => <li key={i}>{c}</li>)}
      </ul>
    </div>
  )
}

function TermsBlock({ block }) {
  return (
    <div className="mb-3">
      <h3 className="font-bold mb-3 text-slate-700">{block.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(block.items || []).map((item, i) => (
          <div key={i} className="contents">
            <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
              <p className="font-bold text-indigo-800 mb-1">{i + 1}. {item.name}</p>
              <ul className="list-disc pl-4 text-sm text-slate-600 space-y-0.5">
                {(item.definition || []).map((d, j) => <li key={j}>{d}</li>)}
              </ul>
            </div>
            {item.example && item.example.length > 0 && (
              <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                <p className="font-bold text-green-800 mb-1">Example</p>
                <ul className="list-disc pl-4 text-sm text-slate-600 space-y-0.5">
                  {item.example.map((e, j) => <li key={j}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FlowBlock({ block }) {
  const steps = block.steps || []
  return (
    <div className="mb-3">
      {block.title && <h3 className="font-bold mb-2 text-slate-700">{block.title}</h3>}
      <div className="flex flex-wrap items-center gap-2 justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="px-3 py-2 border-2 border-indigo-500 rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-800">
              {step}
            </div>
            {i < steps.length - 1 && (
              <span className="font-bold text-indigo-500 text-lg">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function TreeBlock({ block }) {
  return (
    <div className="text-center mb-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="font-bold mb-3 text-slate-700">{block.root}</div>
      <div className="flex gap-3 flex-wrap justify-center">
        {(block.children || []).map((child, i) => (
          <div
            key={i}
            className="px-3 py-2 border-2 border-purple-400 rounded-lg bg-purple-50 text-sm font-semibold text-purple-800"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

function GroupedTermsBlock({ block }) {
  return (
    <div className="mb-3">
      <h3 className="font-bold mb-3 text-slate-700">{block.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {(block.items || []).map((item, i) => (
          <div key={i} className="bg-amber-50 p-3 rounded-xl border border-amber-100">
            <p className="font-bold text-amber-800 mb-1">{item.name}</p>
            <ul className="list-disc pl-4 text-sm text-slate-600 space-y-0.5">
              {(item.description || []).map((d, j) => <li key={j}>{d}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const RENDERERS = {
  question:      QuestionBlock,
  text:          TextBlock,
  terms:         TermsBlock,
  diagram_flow:  FlowBlock,
  diagram_tree:  TreeBlock,
  grouped_terms: GroupedTermsBlock,
}

export default function BlockRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <div className="space-y-1">
      {blocks.map((block, i) => {
        const Component = RENDERERS[block.type]
        return Component ? <Component key={i} block={block} /> : null
      })}
    </div>
  )
}
