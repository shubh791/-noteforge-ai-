/* ─── colour palette ─── */
const CARD_COLORS = [
  { solid:'#2196F3', light:'#e3f2fd' },
  { solid:'#9C27B0', light:'#f3e5f5' },
  { solid:'#00897B', light:'#e0f2f1' },
  { solid:'#FF7043', light:'#fbe9e7' },
  { solid:'#F59E0B', light:'#fffbeb' },
  { solid:'#00ACC1', light:'#e0f7fa' },
  { solid:'#1565C0', light:'#e8eaf6' },
  { solid:'#7B1FA2', light:'#ede7f6' },
]
const TAG_COLORS = ['#1565C0','#00897B','#9C27B0','#FF7043','#F59E0B','#00ACC1']

/* ── Question ── */
function QuestionBlock({ block }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12,
      background:'#f8fafc', border:'2px solid #e2e8f0', borderRadius:12,
      padding:'16px 20px', marginBottom:16 }}>
      <span style={{ fontSize:16, fontWeight:800, color:'#0f172a', lineHeight:1.45 }}>
        {block.title}
      </span>
      {block.marks && (
        <span style={{ flexShrink:0, background:'#fbbf24', color:'#1c1917', fontWeight:800,
          fontSize:12, padding:'5px 14px', borderRadius:20, whiteSpace:'nowrap', marginTop:2 }}>
          [{block.marks} Marks]
        </span>
      )}
    </div>
  )
}

/* ── Introduction ── */
function IntroBlock({ block }) {
  return (
    <div style={{ borderRadius:12, overflow:'hidden', marginBottom:14,
      boxShadow:'0 2px 10px rgba(0,0,0,.08)' }}>
      <div style={{ background:'#1565C0', color:'#fff', fontWeight:700, fontSize:12.5,
        padding:'8px 16px', letterSpacing:'.06em', textTransform:'uppercase' }}>
        1. Introduction
      </div>
      <div style={{ background:'#fff', padding:'14px 16px' }}>
        <p style={{ margin:0, fontSize:13, color:'#334155', lineHeight:1.75 }}>{block.content}</p>
      </div>
    </div>
  )
}

/* ── Numbered card grid ── */
function CardsBlock({ block }) {
  return (
    <div>
      {/* section badge */}
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}>
        <span style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'#fff',
          fontWeight:700, fontSize:12, padding:'6px 20px', borderRadius:20 }}>
          {block.label || 'Key Points'}
        </span>
      </div>

      {/* 2-col grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        {(block.cards || []).map((card, i) => {
          const c = CARD_COLORS[i % CARD_COLORS.length]
          return (
            <div key={i} style={{ borderRadius:12, border:`2px dashed ${c.solid}`,
              background:'#fff', padding:'14px 14px 12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:9 }}>
                <span style={{ width:30, height:30, borderRadius:'50%', background:c.solid,
                  color:'#fff', fontWeight:800, fontSize:14, display:'flex',
                  alignItems:'center', justifyContent:'center', flexShrink:0,
                  boxShadow:'0 2px 6px rgba(0,0,0,.2)' }}>
                  {i + 1}
                </span>
                <span style={{ fontWeight:700, fontSize:13, color:'#1e293b', lineHeight:1.3 }}>
                  {card.title}
                </span>
              </div>
              <p style={{ margin:'0 0 9px', fontSize:12.5, color:'#475569', lineHeight:1.65 }}>
                {card.description}
              </p>
              {card.explanation && (
                <div style={{ background:c.light, borderLeft:`3px solid ${c.solid}`,
                  borderRadius:'0 8px 8px 0', padding:'7px 11px' }}>
                  <span style={{ fontWeight:700, color:c.solid, fontSize:12 }}>Explanation: </span>
                  <span style={{ fontSize:12, color:'#334155', lineHeight:1.6 }}>
                    {card.explanation}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Vertical flow diagram ── */
function VFlowBlock({ block }) {
  const steps = block.steps || []
  return (
    <div className="nd-vflow-wrap" style={{ marginBottom:14, padding:'20px 16px',
      background:'#f8fafc', borderRadius:12, border:'1.5px solid #e0e7ff' }}>
      {block.title && (
        <div style={{ textAlign:'center', fontWeight:700, fontSize:12.5, color:'#4338ca',
          marginBottom:16, textTransform:'uppercase', letterSpacing:'.06em' }}>
          ⟳ {block.title}
        </div>
      )}
      <div className="nd-vflow">
        {steps.map((step, i) => (
          <div key={i}>
            <div className="nd-vnode" style={{
              background: i % 2 === 0
                ? 'linear-gradient(135deg,#4338ca,#6366f1)'
                : 'linear-gradient(135deg,#3730a3,#4338ca)'
            }}>
              {step}
            </div>
            {i < steps.length - 1 && <div className="nd-varrow">↓</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Horizontal flow diagram ── */
function HFlowBlock({ block }) {
  const nodes = block.nodes || []
  return (
    <div className="nd-hflow-wrap" style={{ marginBottom:14, padding:'18px 16px',
      background:'#f8fafc', borderRadius:12, border:'1.5px solid #e0e7ff' }}>
      {block.title && (
        <div style={{ textAlign:'center', fontWeight:700, fontSize:12, color:'#475569',
          marginBottom:14, textTransform:'uppercase', letterSpacing:'.06em' }}>
          {block.title}
        </div>
      )}
      <div className="nd-hflow">
        {nodes.map((node, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div className="nd-hnode" style={{ background:'#1565C0' }}>{node}</div>
            {i < nodes.length - 1 && <div className="nd-harrow">→</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Tree diagram ── */
function TreeBlock({ block }) {
  const children = block.children || []
  return (
    <div className="nd-tree-wrap" style={{ marginBottom:14, padding:'20px 16px',
      background:'#f8fafc', borderRadius:12, border:'1.5px solid #ede9fe' }}>
      <div className="nd-tree">
        <div className="nd-tree-root"
          style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
          {block.root}
        </div>
        <div className="nd-tree-line" />
        <div className="nd-tree-children">
          {children.map((child, i) => (
            <div key={i} className="nd-tree-child"
              style={{ borderColor:'#7c3aed', background:'#f5f3ff', color:'#5b21b6' }}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Formula box ── */
function FormulaBlock({ block }) {
  return (
    <div className="nd-formula" style={{ marginBottom:14 }}>
      <div style={{ fontSize:10.5, fontWeight:700, color:'#92400e',
        textTransform:'uppercase', letterSpacing:'.1em', marginBottom:10 }}>
        📐 Formula
      </div>
      <div className="nd-formula-eq">{block.formula}</div>
      {block.legend && (
        <div style={{ marginTop:10, fontSize:12, color:'#92400e', lineHeight:1.7 }}>
          {block.legend}
        </div>
      )}
    </div>
  )
}

/* ── Application tags ── */
function TagsBlock({ block }) {
  const tags = block.tags || []
  return (
    <div className="nd-tags-wrap" style={{ marginBottom:14, padding:'18px 16px',
      background:'#f8fafc', borderRadius:12, border:'1.5px solid #e0e7ff' }}>
      {block.title && (
        <div style={{ textAlign:'center', fontWeight:700, fontSize:12, color:'#475569',
          marginBottom:14, textTransform:'uppercase', letterSpacing:'.06em' }}>
          {block.title}
        </div>
      )}
      <div className="nd-tags">
        {tags.map((tag, i) => (
          <div key={i} className="nd-tag"
            style={{ background: TAG_COLORS[i % TAG_COLORS.length] }}>
            {tag}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Summary ── */
function SummaryBlock({ block }) {
  return (
    <div style={{ background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 55%,#4338ca 100%)',
      borderRadius:12, padding:'16px 20px' }}>
      <div style={{ color:'#fff', fontWeight:800, fontSize:13, textAlign:'center',
        letterSpacing:'.07em', marginBottom:12, textTransform:'uppercase' }}>
        ✦ Summary
      </div>
      <ul style={{ margin:0, padding:0, listStyle:'none', display:'flex',
        flexDirection:'column', gap:7 }}>
        {(block.points || []).map((pt, i) => (
          <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:9,
            fontSize:12.5, color:'#e2e8f0', lineHeight:1.6 }}>
            <span style={{ color:'#4ade80', fontWeight:800, flexShrink:0, marginTop:1 }}>✓</span>
            {pt}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Router ── */
const RENDERERS = {
  question:  QuestionBlock,
  intro:     IntroBlock,
  cards:     CardsBlock,
  vflow:     VFlowBlock,
  hflow:     HFlowBlock,
  tree:      TreeBlock,
  formula:   FormulaBlock,
  tags:      TagsBlock,
  summary:   SummaryBlock,
}

export default function BlockRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return null
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      {blocks.map((block, i) => {
        const Component = RENDERERS[block.type]
        return Component ? <Component key={i} block={block} /> : null
      })}
    </div>
  )
}
