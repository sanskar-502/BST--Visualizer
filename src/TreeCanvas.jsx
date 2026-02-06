function getHeight(node) {
  if (!node) return 0
  return 1 + Math.max(getHeight(node.left), getHeight(node.right))
}

function TreeCanvas({ tree, highlightMode }) {
  const nodes = []
  const edges = []

  const traverse = (node) => {
    if (!node) return
    nodes.push(node)
    if (node.left) edges.push({ from: node, to: node.left })
    if (node.right) edges.push({ from: node, to: node.right })
    traverse(node.left)
    traverse(node.right)
  }

  traverse(tree)

  const height = getHeight(tree)

  return (
    <section className="tree-canvas" data-mode={highlightMode || 'search'}>
      <div className="tree-meta">
        N={nodes.length}, h={height}
      </div>
      <svg className="tree-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((edge) => (
          <line
            key={`${edge.from.id}-${edge.to.id}`}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
          />
        ))}
      </svg>
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`tree-node${
            node.isHiglighed ? ' is-highlighted' : ''
          }${node.isFound ? ' is-found' : ''}`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {node.value}
        </div>
      ))}
    </section>
  )
}

export default TreeCanvas
