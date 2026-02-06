import { useCallback, useEffect, useRef, useState } from 'react'

const STEP_MS = 500

const SEARCH_CODE = [
  'if this is null return',
  'if value == this.key return this',
  'if value < this.key search left',
  'else search right',
]

const INSERT_CODE = [
  'if this is null return new node',
  'if value == this.key return this',
  'if value < this.key insert left',
  'else insert right',
]

const REMOVE_CODE = [
  'search for node',
  'case: leaf -> delete',
  'case: one child -> replace',
  'case: two children -> successor swap',
]

const AVL_CODE = [
  'balance = height(left) - height(right)',
  'LL: rotate right',
  'RR: rotate left',
  'LR: rotate left, then right',
  'RL: rotate right, then left',
]

const DEFAULT_VALUES = [
  23, 12, 64, 5, 18, 1, 9, 15, 20, 29, 72, 26, 43, 50, 70, 83,
]

const createNode = (value, id) => ({
  id,
  value,
  left: null,
  right: null,
  x: 0,
  y: 0,
  isHiglighed: false,
  isFound: false,
})

const cloneTree = (node) => {
  if (!node) return null
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  }
}

const clearFlags = (node) => {
  if (!node) return
  node.isHiglighed = false
  node.isFound = false
  clearFlags(node.left)
  clearFlags(node.right)
}

const getHeight = (node) => {
  if (!node) return 0
  return 1 + Math.max(getHeight(node.left), getHeight(node.right))
}

const getBalance = (node) => {
  if (!node) return 0
  return getHeight(node.left) - getHeight(node.right)
}

const hasImbalance = (node) => {
  if (!node) return false
  const balance = getBalance(node)
  if (Math.abs(balance) > 1) return true
  return hasImbalance(node.left) || hasImbalance(node.right)
}

const layoutTree = (root) => {
  if (!root) return null

  const height = getHeight(root)
  const top = 12
  const bottom = 78
  const levels = Math.max(1, height - 1)
  const levelGap = levels === 0 ? 0 : (bottom - top) / levels

  const assign = (node, depth, minX, maxX) => {
    if (!node) return
    const mid = (minX + maxX) / 2
    const gap = 3
    node.x = mid
    node.y = top + depth * levelGap
    if (node.left) {
      assign(node.left, depth + 1, minX, Math.max(minX, mid - gap))
    }
    if (node.right) {
      assign(node.right, depth + 1, Math.min(maxX, mid + gap), maxX)
    }
  }

  assign(root, 0, 8, 92)

  return root
}

const insertImmediate = (root, value, nextId) => {
  if (!root) return createNode(value, nextId())

  let current = root
  while (current) {
    if (value < current.value) {
      if (!current.left) {
        current.left = createNode(value, nextId())
        break
      }
      current = current.left
    } else if (value > current.value) {
      if (!current.right) {
        current.right = createNode(value, nextId())
        break
      }
      current = current.right
    } else {
      break
    }
  }

  return root
}

const buildTree = (values, nextId) => {
  let root = null
  values.forEach((value) => {
    root = insertImmediate(root, value, nextId)
  })
  return layoutTree(root)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function useBST({ mode = 'BST', speedMultiplier = 1 } = {}) {
  const idRef = useRef(1)
  const nextId = useCallback(() => `n${idRef.current++}`, [])

  const [tree, setTree] = useState(() => buildTree(DEFAULT_VALUES, nextId))
  const treeRef = useRef(tree)
  const modeRef = useRef(mode)

  const [statusTitle, setStatusTitle] = useState('Exploration Mode')
  const [statusMessage, setStatusMessage] = useState('Ready.')
  const [codeLines, setCodeLines] = useState(SEARCH_CODE)
  const [activeCodeLine, setActiveCodeLine] = useState(0)
  const [highlightMode, setHighlightMode] = useState('search')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [historyIndex, setHistoryIndex] = useState(-1)

  const stepMsRef = useRef(STEP_MS)
  const pauseRef = useRef(false)
  const resumePromiseRef = useRef(null)
  const resumeResolveRef = useRef(null)
  const historyRef = useRef([])
  const historyIndexRef = useRef(-1)
  const statusTitleRef = useRef(statusTitle)
  const statusMessageRef = useRef(statusMessage)
  const codeLinesRef = useRef(codeLines)
  const highlightModeRef = useRef(highlightMode)
  const activeCodeLineRef = useRef(activeCodeLine)

  useEffect(() => {
    treeRef.current = tree
  }, [tree])

  useEffect(() => {
    modeRef.current = mode
  }, [mode])

  useEffect(() => {
    const safe = Number.isFinite(speedMultiplier) ? speedMultiplier : 1
    stepMsRef.current = STEP_MS / Math.max(0.25, safe)
  }, [speedMultiplier])

  useEffect(() => {
    statusTitleRef.current = statusTitle
  }, [statusTitle])

  useEffect(() => {
    statusMessageRef.current = statusMessage
  }, [statusMessage])

  useEffect(() => {
    codeLinesRef.current = codeLines
  }, [codeLines])

  useEffect(() => {
    highlightModeRef.current = highlightMode
  }, [highlightMode])

  useEffect(() => {
    activeCodeLineRef.current = activeCodeLine
  }, [activeCodeLine])

  const commitTree = useCallback((draft) => {
    const nextTree = layoutTree(cloneTree(draft))
    setTree(nextTree)
    return nextTree
  }, [])

  const buildSnapshot = useCallback((treeSnapshot, statusMessage, activeLine) => {
    return {
      tree: treeSnapshot,
      statusTitle: statusTitleRef.current,
      statusMessage,
      codeLines: codeLinesRef.current,
      activeCodeLine: activeLine,
      highlightMode: highlightModeRef.current,
    }
  }, [])

  const recordSnapshot = useCallback(
    (snapshot) => {
      const trimmed = historyRef.current.slice(0, historyIndexRef.current + 1)
      trimmed.push(snapshot)
      const max = 240
      const clipped =
        trimmed.length > max ? trimmed.slice(trimmed.length - max) : trimmed
      historyRef.current = clipped
      historyIndexRef.current = clipped.length - 1
      setHistoryIndex(historyIndexRef.current)
    },
    [setHistoryIndex]
  )

  const applySnapshot = useCallback((snapshot) => {
    if (!snapshot) return
    setTree(snapshot.tree)
    setStatusTitle(snapshot.statusTitle)
    setStatusMessage(snapshot.statusMessage)
    setCodeLines(snapshot.codeLines)
    setActiveCodeLine(snapshot.activeCodeLine)
    setHighlightMode(snapshot.highlightMode)
  }, [])

  const beginOperation = useCallback(
    (title, lines, modeValue) => {
      pauseRef.current = false
      setIsPaused(false)
      setIsAnimating(true)
      setStatusTitle(title)
      setCodeLines(lines)
      setHighlightMode(modeValue)
      statusTitleRef.current = title
      codeLinesRef.current = lines
      highlightModeRef.current = modeValue

      const baseTree = layoutTree(cloneTree(treeRef.current))
      const snapshot = buildSnapshot(baseTree, 'Starting...', 0)
      historyRef.current = [snapshot]
      historyIndexRef.current = 0
      setHistoryIndex(0)
      applySnapshot(snapshot)
      return baseTree
    },
    [applySnapshot, buildSnapshot]
  )

  const waitIfPaused = useCallback(async () => {
    if (!pauseRef.current) return
    if (!resumePromiseRef.current) {
      resumePromiseRef.current = new Promise((resolve) => {
        resumeResolveRef.current = resolve
      })
    }
    await resumePromiseRef.current
  }, [])

  const delayWithPause = useCallback(
    async (ms) => {
      let remaining = ms
      const chunkSize = 50
      while (remaining > 0) {
        await waitIfPaused()
        const chunk = Math.min(chunkSize, remaining)
        await delay(chunk)
        remaining -= chunk
      }
    },
    [waitIfPaused]
  )

  const step = useCallback(
    async (draft, node, { status, codeLine, found = false }) => {
      clearFlags(draft)
      if (node) {
        node.isHiglighed = true
        node.isFound = found
      }
      const nextTree = commitTree(draft)
      setStatusMessage(status)
      setActiveCodeLine(codeLine)
      recordSnapshot(buildSnapshot(nextTree, status, codeLine))
      await delayWithPause(stepMsRef.current)
    },
    [buildSnapshot, commitTree, delayWithPause, recordSnapshot]
  )

  const pause = useCallback(() => {
    if (!isAnimating) return
    pauseRef.current = true
    setIsPaused(true)
  }, [isAnimating])

  const play = useCallback(() => {
    pauseRef.current = false
    setIsPaused(false)
    if (resumeResolveRef.current) {
      resumeResolveRef.current()
      resumeResolveRef.current = null
      resumePromiseRef.current = null
    }
  }, [])

  const finishAnimation = useCallback(() => {
    pauseRef.current = false
    setIsPaused(false)
    if (resumeResolveRef.current) {
      resumeResolveRef.current()
      resumeResolveRef.current = null
      resumePromiseRef.current = null
    }
    setIsAnimating(false)
  }, [])

  const stepBack = useCallback(() => {
    if (historyIndexRef.current <= 0) return
    const nextIndex = historyIndexRef.current - 1
    historyIndexRef.current = nextIndex
    setHistoryIndex(nextIndex)
    applySnapshot(historyRef.current[nextIndex])
  }, [applySnapshot])

  const stepForward = useCallback(() => {
    const maxIndex = historyRef.current.length - 1
    if (historyIndexRef.current >= maxIndex) return
    const nextIndex = historyIndexRef.current + 1
    historyIndexRef.current = nextIndex
    setHistoryIndex(nextIndex)
    applySnapshot(historyRef.current[nextIndex])
  }, [applySnapshot])

  const insertInternal = useCallback(
    async (draft, value) => {
      if (!draft) {
        const root = createNode(value, nextId())
        root.isHiglighed = true
        root.isFound = true
        const nextTree = commitTree(root)
        const message = `Tree empty. Insert ${value} as root.`
        setStatusMessage(message)
        setActiveCodeLine(0)
        recordSnapshot(buildSnapshot(nextTree, message, 0))
        await delayWithPause(stepMsRef.current)
        return root
      }

      let current = draft
      while (current) {
        await step(draft, current, {
          status: `Compare ${value} with ${current.value}.`,
          codeLine: 1,
        })

        if (value === current.value) {
          await step(draft, current, {
            status: `${value} already exists.`,
            codeLine: 1,
            found: true,
          })
          return draft
        }

        if (value < current.value) {
          await step(draft, current, {
            status: `${value} < ${current.value}, go left.`,
            codeLine: 2,
          })

          if (!current.left) {
            current.left = createNode(value, nextId())
            await step(draft, current.left, {
              status: `Insert ${value} as left child of ${current.value}.`,
              codeLine: 0,
              found: true,
            })
            return draft
          }

          current = current.left
        } else {
          await step(draft, current, {
            status: `${value} > ${current.value}, go right.`,
            codeLine: 3,
          })

          if (!current.right) {
            current.right = createNode(value, nextId())
            await step(draft, current.right, {
              status: `Insert ${value} as right child of ${current.value}.`,
              codeLine: 0,
              found: true,
            })
            return draft
          }

          current = current.right
        }
      }

      return draft
    },
    [buildSnapshot, commitTree, delayWithPause, nextId, recordSnapshot, step]
  )

  const rebalanceTree = useCallback(
    async (draft, originLabel) => {
      if (!draft || modeRef.current !== 'AVL') return draft
      if (!hasImbalance(draft)) return draft

      setStatusTitle('AVL Rebalance')
      setCodeLines(AVL_CODE)
      setHighlightMode('rotate')
      statusTitleRef.current = 'AVL Rebalance'
      codeLinesRef.current = AVL_CODE
      highlightModeRef.current = 'rotate'

      const rootRef = { current: draft }

      const rotateRight = (y) => {
        const x = y.left
        const t2 = x.right
        x.right = y
        y.left = t2
        return x
      }

      const rotateLeft = (x) => {
        const y = x.right
        const t2 = y.left
        y.left = x
        x.right = t2
        return y
      }

      const rebalanceNode = async (node, parent, direction) => {
        if (!node) return null

        node.left = await rebalanceNode(node.left, node, 'left')
        node.right = await rebalanceNode(node.right, node, 'right')

        const balance = getBalance(node)

        if (balance > 1) {
          if (getBalance(node.left) < 0) {
            node.left = rotateLeft(node.left)
            await step(rootRef.current, node.left, {
              status: `LR case at ${node.value}: rotate left on ${node.left.value}.`,
              codeLine: 3,
              found: true,
            })
          }
          const newRoot = rotateRight(node)
          if (parent) parent[direction] = newRoot
          else rootRef.current = newRoot
          await step(rootRef.current, newRoot, {
            status: `Rotate right at ${newRoot.value}.`,
            codeLine: 1,
            found: true,
          })
          return newRoot
        }

        if (balance < -1) {
          if (getBalance(node.right) > 0) {
            node.right = rotateRight(node.right)
            await step(rootRef.current, node.right, {
              status: `RL case at ${node.value}: rotate right on ${node.right.value}.`,
              codeLine: 4,
              found: true,
            })
          }
          const newRoot = rotateLeft(node)
          if (parent) parent[direction] = newRoot
          else rootRef.current = newRoot
          await step(rootRef.current, newRoot, {
            status: `Rotate left at ${newRoot.value}.`,
            codeLine: 2,
            found: true,
          })
          return newRoot
        }

        return node
      }

      await rebalanceNode(rootRef.current, null, null)

      if (originLabel) {
        setStatusTitle(originLabel)
        statusTitleRef.current = originLabel
      }

      return rootRef.current
    },
    [step]
  )

  const search = useCallback(
    async (value) => {
      if (!Number.isFinite(value) || isAnimating) return

      const baseTree = beginOperation(`Search(${value})`, SEARCH_CODE, 'search')
      const workingTree = cloneTree(baseTree)
      if (!workingTree) {
        const message = 'Tree is empty.'
        setStatusMessage(message)
        setActiveCodeLine(0)
        recordSnapshot(buildSnapshot(baseTree, message, 0))
        finishAnimation()
        return
      }

      let current = workingTree
      while (current) {
        await step(workingTree, current, {
          status: `Highlight ${current.value}.`,
          codeLine: 1,
        })

        if (value === current.value) {
          await step(workingTree, current, {
            status: `${value} == ${current.value}, found.`,
            codeLine: 1,
            found: true,
          })
          finishAnimation()
          return
        }

        if (value < current.value) {
          await step(workingTree, current, {
            status: `${value} < ${current.value}, go left.`,
            codeLine: 2,
          })
          current = current.left
        } else {
          await step(workingTree, current, {
            status: `${value} > ${current.value}, go right.`,
            codeLine: 3,
          })
          current = current.right
        }
      }

      clearFlags(workingTree)
      const finalTree = commitTree(workingTree)
      const message = `${value} not found.`
      setStatusMessage(message)
      setActiveCodeLine(0)
      recordSnapshot(buildSnapshot(finalTree, message, 0))
      finishAnimation()
    },
    [beginOperation, buildSnapshot, commitTree, finishAnimation, isAnimating, recordSnapshot, step]
  )

  const insert = useCallback(
    async (value) => {
      if (!Number.isFinite(value) || isAnimating) return

      const baseTree = beginOperation(`Insert(${value})`, INSERT_CODE, 'insert')
      let workingTree = cloneTree(baseTree)
      workingTree = await insertInternal(workingTree, value)

      workingTree = await rebalanceTree(workingTree, `Insert(${value})`)
      const finalTree = commitTree(workingTree)
      recordSnapshot(
        buildSnapshot(finalTree, statusMessageRef.current, activeCodeLineRef.current)
      )
      finishAnimation()
    },
    [
      beginOperation,
      buildSnapshot,
      commitTree,
      finishAnimation,
      insertInternal,
      isAnimating,
      rebalanceTree,
      recordSnapshot,
    ]
  )

  const remove = useCallback(
    async (value) => {
      if (!Number.isFinite(value) || isAnimating) return

      const baseTree = beginOperation(`Remove(${value})`, REMOVE_CODE, 'remove')
      let workingTree = cloneTree(baseTree)
      if (!workingTree) {
        const message = 'Tree is empty.'
        setStatusMessage(message)
        setActiveCodeLine(0)
        recordSnapshot(buildSnapshot(baseTree, message, 0))
        finishAnimation()
        return
      }

      let current = workingTree
      let parent = null
      let direction = null

      while (current) {
        await step(workingTree, current, {
          status: `Searching at ${current.value}.`,
          codeLine: 0,
        })

        if (value === current.value) {
          break
        }

        parent = current
        if (value < current.value) {
          direction = 'left'
          current = current.left
        } else {
          direction = 'right'
          current = current.right
        }
      }

      if (!current) {
        clearFlags(workingTree)
        const finalTree = commitTree(workingTree)
        const message = `${value} not found.`
        setStatusMessage(message)
        setActiveCodeLine(0)
        recordSnapshot(buildSnapshot(finalTree, message, 0))
        finishAnimation()
        return
      }

      if (!current.left && !current.right) {
        await step(workingTree, current, {
          status: `${current.value} is a leaf. Remove it.`,
          codeLine: 1,
          found: true,
        })
        if (!parent) {
          workingTree = null
        } else {
          parent[direction] = null
        }
        commitTree(workingTree)
        await delayWithPause(stepMsRef.current)
      } else if (!current.left || !current.right) {
        const child = current.left || current.right
        await step(workingTree, current, {
          status: `${current.value} has one child. Replace with child.`,
          codeLine: 2,
          found: true,
        })
        if (!parent) {
          workingTree = child
        } else {
          parent[direction] = child
        }
        commitTree(workingTree)
        await delayWithPause(stepMsRef.current)
      } else {
        await step(workingTree, current, {
          status: `${current.value} has two children. Find successor.`,
          codeLine: 3,
        })

        setHighlightMode('successor')
        highlightModeRef.current = 'successor'
        let succParent = current
        let successor = current.right
        while (successor.left) {
          await step(workingTree, successor, {
            status: `Move to ${successor.value} to find successor.`,
            codeLine: 3,
            found: true,
          })
          succParent = successor
          successor = successor.left
        }

        await step(workingTree, successor, {
          status: `Successor is ${successor.value}.`,
          codeLine: 3,
          found: true,
        })

        current.value = successor.value
        await step(workingTree, current, {
          status: `Swap with successor ${successor.value}.`,
          codeLine: 3,
          found: true,
        })

        setHighlightMode('remove')
        highlightModeRef.current = 'remove'
        const succChild = successor.right

        await step(workingTree, successor, {
          status: `Delete successor ${successor.value}.`,
          codeLine: 1,
          found: true,
        })

        if (succParent.left === successor) {
          succParent.left = succChild
        } else {
          succParent.right = succChild
        }

        commitTree(workingTree)
        await delayWithPause(stepMsRef.current)
      }

      workingTree = await rebalanceTree(workingTree, `Remove(${value})`)
      const finalTree = commitTree(workingTree)
      recordSnapshot(
        buildSnapshot(finalTree, statusMessageRef.current, activeCodeLineRef.current)
      )
      finishAnimation()
    },
    [
      beginOperation,
      buildSnapshot,
      commitTree,
      delayWithPause,
      finishAnimation,
      isAnimating,
      recordSnapshot,
      rebalanceTree,
      step,
    ]
  )

  const createEmpty = useCallback(async () => {
    if (isAnimating) return
    beginOperation('Create(Empty)', INSERT_CODE, 'create')
    setTree(null)
    const message = 'Tree cleared.'
    setStatusMessage(message)
    setActiveCodeLine(0)
    recordSnapshot(buildSnapshot(null, message, 0))
    await delayWithPause(stepMsRef.current)
    finishAnimation()
  }, [beginOperation, buildSnapshot, delayWithPause, finishAnimation, isAnimating, recordSnapshot])

  const createBalanced = useCallback(async () => {
    if (isAnimating) return
    beginOperation('Create(Balanced)', INSERT_CODE, 'create')

    const values = [5, 12, 18, 23, 29, 36, 41, 48, 52, 60, 67, 71]
    const buildBalanced = (list) => {
      if (!list.length) return null
      const mid = Math.floor(list.length / 2)
      const node = createNode(list[mid], nextId())
      node.left = buildBalanced(list.slice(0, mid))
      node.right = buildBalanced(list.slice(mid + 1))
      return node
    }

    const balancedRoot = layoutTree(buildBalanced(values))
    setTree(balancedRoot)
    const message = 'Balanced tree created.'
    setStatusMessage(message)
    setActiveCodeLine(0)
    recordSnapshot(buildSnapshot(balancedRoot, message, 0))
    await delayWithPause(stepMsRef.current)
    finishAnimation()
  }, [
    beginOperation,
    buildSnapshot,
    delayWithPause,
    finishAnimation,
    isAnimating,
    nextId,
    recordSnapshot,
  ])

  const createRandom = useCallback(async (countOverride) => {
    if (isAnimating) return
    beginOperation('Create(Random)', INSERT_CODE, 'insert')

    let workingTree = null
    setTree(null)
    const clearingMessage = 'Clearing tree...'
    setStatusMessage(clearingMessage)
    setActiveCodeLine(0)
    recordSnapshot(buildSnapshot(null, clearingMessage, 0))
    await delayWithPause(stepMsRef.current)

    const requested = Number.isFinite(countOverride)
      ? Math.max(1, Math.round(countOverride))
      : null
    const count = requested ?? 5 + Math.floor(Math.random() * 6)
    const values = new Set()
    while (values.size < count) {
      values.add(5 + Math.floor(Math.random() * 90))
    }

    for (const value of values) {
      setStatusMessage(`Insert ${value} (random).`)
      workingTree = await insertInternal(workingTree, value)
      workingTree = await rebalanceTree(workingTree, 'Create(Random)')
      commitTree(workingTree)
    }

    const message = 'Random tree created.'
    setStatusMessage(message)
    recordSnapshot(
      buildSnapshot(workingTree, message, activeCodeLineRef.current)
    )
    finishAnimation()
  }, [
    beginOperation,
    buildSnapshot,
    commitTree,
    delayWithPause,
    finishAnimation,
    insertInternal,
    isAnimating,
    recordSnapshot,
    rebalanceTree,
  ])

  const canStepBack = historyIndex > 0
  const canStepForward =
    historyIndex >= 0 && historyIndex < historyRef.current.length - 1

  return {
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
  }
}

export default useBST

