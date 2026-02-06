import { useState } from 'react'
import './App.css'
import Sidebar from './Sidebar.jsx'
import CodePanel from './CodePanel.jsx'
import TreeCanvas from './TreeCanvas.jsx'
import ControlBar from './ControlBar.jsx'
import useBST from './useBST.js'

function App() {
  const [insertValue, setInsertValue] = useState('9')
  const [searchValue, setSearchValue] = useState('29')
  const [removeValue, setRemoveValue] = useState('23')
  const [createCount, setCreateCount] = useState('8')
  const [speedMultiplier, setSpeedMultiplier] = useState(1)
  const [treeMode, setTreeMode] = useState('BST')

  const {
    tree,
    statusTitle,
    statusMessage,
    codeLines,
    activeCodeLine,
    highlightMode,
    canStepBack,
    canStepForward,
    insert,
    search,
    remove,
    createEmpty,
    createRandom,
    createBalanced,
    isAnimating,
    isPaused,
    pause,
    play,
    stepBack,
    stepForward,
  } = useBST({ mode: treeMode, speedMultiplier })

  const parseInput = (value) => {
    const trimmed = value.trim()
    if (!trimmed) return NaN
    return Number(trimmed)
  }

  const handleInsert = () => insert(parseInput(insertValue))
  const handleSearch = () => search(parseInput(searchValue))
  const handleRemove = () => remove(parseInput(removeValue))
  const handleCreateRandomCount = () =>
    createRandom(parseInput(createCount))

  return (
    <div className="app">
      <header className="top-bar">
        <div className="top-title">Binary Search Tree / AVL Tree</div>
        <div className="top-toggle">
          <button
            className={`mode-btn${treeMode === 'BST' ? ' active' : ''}`}
            onClick={() => setTreeMode('BST')}
          >
            Binary Search Tree
          </button>
          <button
            className={`mode-btn${treeMode === 'AVL' ? ' active' : ''}`}
            onClick={() => setTreeMode('AVL')}
          >
            AVL Tree
          </button>
        </div>
      </header>
      <main className="main">
        <Sidebar
          insertValue={insertValue}
          searchValue={searchValue}
          removeValue={removeValue}
          createCount={createCount}
          onInsertChange={setInsertValue}
          onSearchChange={setSearchValue}
          onRemoveChange={setRemoveValue}
          onCreateCountChange={setCreateCount}
          onInsert={handleInsert}
          onSearch={handleSearch}
          onRemove={handleRemove}
          onCreateEmpty={createEmpty}
          onCreateRandom={createRandom}
          onCreateRandomCount={handleCreateRandomCount}
          onCreateBalanced={createBalanced}
          isAnimating={isAnimating}
        />
        <TreeCanvas tree={tree} highlightMode={highlightMode} />
        <CodePanel
          statusTitle={statusTitle}
          statusMessage={statusMessage}
          codeLines={codeLines}
          activeCodeLine={activeCodeLine}
        />
      </main>
      <ControlBar
        speedMultiplier={speedMultiplier}
        onSpeedChange={setSpeedMultiplier}
        onPause={pause}
        onPlay={play}
        onStepBack={stepBack}
        onStepForward={stepForward}
        canStepBack={canStepBack}
        canStepForward={canStepForward}
        isPaused={isPaused}
        isAnimating={isAnimating}
      />
    </div>
  )
}

export default App
