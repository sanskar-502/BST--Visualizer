import { useState } from 'react'

const sections = [
  { key: 'create', label: 'Create' },
  { key: 'search', label: 'Search' },
  { key: 'insert', label: 'Insert' },
  { key: 'remove', label: 'Remove' },
]

function Sidebar({
  insertValue,
  searchValue,
  removeValue,
  createCount,
  onInsertChange,
  onSearchChange,
  onRemoveChange,
  onCreateCountChange,
  onInsert,
  onSearch,
  onRemove,
  onCreateEmpty,
  onCreateRandom,
  onCreateRandomCount,
  onCreateBalanced,
  isAnimating,
}) {
  const [activeSection, setActiveSection] = useState('create')

  const toggleSection = (key) => {
    setActiveSection((current) => (current === key ? null : key))
  }

  const renderPanel = (key) => {
    if (key === 'create') {
      return (
        <div className="accordion-panel">
          <div className="panel-row">
            <button
              className="panel-btn"
              onClick={() => onCreateEmpty()}
            >
              Empty
            </button>
            <button
              className="panel-btn"
              onClick={() => onCreateRandom()}
            >
              Random
            </button>
            <button
              className="panel-btn"
              onClick={() => onCreateBalanced()}
            >
              Balanced
            </button>
          </div>
          <div className="panel-label">Nodes</div>
          <div className="panel-control">
            <span>N =</span>
            <input
              className="panel-input"
              value={createCount}
              maxLength={3}
              inputMode="numeric"
              onChange={(event) => onCreateCountChange(event.target.value)}
            />
            <button
              className="panel-go"
              onClick={onCreateRandomCount}
            >
              Random N
            </button>
          </div>
        </div>
      )
    }

    if (key === 'search') {
      return (
        <div className="accordion-panel">
          <div className="panel-label">Search</div>
          <div className="panel-control">
            <span>v =</span>
            <input
              className="panel-input"
              value={searchValue}
              maxLength={6}
              inputMode="numeric"
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <button
              className="panel-go"
              onClick={onSearch}
            >
              Go
            </button>
          </div>
        </div>
      )
    }

    if (key === 'insert') {
      return (
        <div className="accordion-panel">
          <div className="panel-label">Insert</div>
          <div className="panel-control">
            <span>v =</span>
            <input
              className="panel-input"
              value={insertValue}
              maxLength={6}
              inputMode="numeric"
              onChange={(event) => onInsertChange(event.target.value)}
            />
            <button
              className="panel-go"
              onClick={onInsert}
            >
              Go
            </button>
          </div>
        </div>
      )
    }

    if (key === 'remove') {
      return (
        <div className="accordion-panel">
          <div className="panel-label">Remove</div>
          <div className="panel-control">
            <span>v =</span>
            <input
              className="panel-input"
              value={removeValue}
              maxLength={6}
              inputMode="numeric"
              onChange={(event) => onRemoveChange(event.target.value)}
            />
            <button
              className="panel-go"
              onClick={onRemove}
            >
              Go
            </button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Menu</div>
      <div className="sidebar-accordion">
        {sections.map((section) => (
          <div key={section.key} className="accordion-item">
            <button
              className={`sidebar-item${
                activeSection === section.key ? ' active' : ''
              }`}
              onClick={() => toggleSection(section.key)}
            >
              <span>{section.label}</span>
              <span className="chevron">{'>'}</span>
            </button>
            {activeSection === section.key && renderPanel(section.key)}
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar


