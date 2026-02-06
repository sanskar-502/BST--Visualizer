function CodePanel({ statusTitle, statusMessage, codeLines, activeCodeLine }) {
  return (
    <aside className="code-panel">
      <div className="status-bar">
        <div className="status-title">{statusTitle}</div>
        <p className="status-text">{statusMessage}</p>
      </div>
      <div className="code-view">
        <div className="code-title">Pseudocode</div>
        <div className="code-lines">
          {codeLines.map((line, index) => (
            <div
              key={`${line}-${index}`}
              className={`code-line${index === activeCodeLine ? ' active' : ''}`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default CodePanel
