export default function ApiKeyInput({ value, onChange }) {
  return (
    <div className="api-row">
      <span className="api-label">NIM KEY</span>
      <input
        type="password"
        className="api-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="nvapi-xxxx  (or set in .env.local)"
        autoComplete="off"
      />
      <a
        href="https://build.nvidia.com/settings/api-keys"
        target="_blank"
        rel="noreferrer"
        className="api-link"
      >
        Get free ↗
      </a>
    </div>
  )
}
