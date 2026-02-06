# VisualAlgo BST/AVL Visualizer (Replica)

A pixel-styled React app that replicates the VisualAlgo Binary Search Tree / AVL Tree visualizer UI and interaction model. The project focuses on step-by-step animations for BST operations, AVL rebalancing, and a UI layout that mirrors the original experience.

## Features

- Full-screen VisualAlgo-style layout with top header, left accordion menu, right status/code panel, and bottom control bar.
- Step-by-step animations for `search`, `insert`, and `remove` (BST + AVL).
- AVL mode with rotations (LL, RR, LR, RL) and animated node repositioning.
- Random tree creation, empty tree reset, and balanced tree creation.
- Pause/Play and Step Back/Step Forward controls.
- Speed slider controlling animation delay (500ms / speed multiplier).
- Accordion sidebar with slide-out panels for Create/Search/Insert/Remove.
- Interruptible operations: triggering a new operation cancels any in-progress animation.

## How It Works

### Tree Model
Each node uses the shape:

```text
{
  id,
  value,
  left,
  right,
  x,
  y,
  isHiglighed,
  isFound
}
```

- `x` and `y` are percentage-based coordinates for layout.
- `isHiglighed` and `isFound` drive the animation color state.

### Animation Engine
All operations are implemented in `useBST.js` as async flows that emit discrete steps:

- Each step highlights a node, updates the status message, and updates the active pseudocode line.
- A step waits `500ms / speedMultiplier` with support for pause.
- The animation loop is cancelable. Any new operation immediately cancels the previous one.

### Step Back / Forward
Every step records a snapshot of:

- tree state
- status message/title
- active pseudocode line
- highlight mode

When paused, you can move backward or forward through these snapshots.

### AVL Mode
When AVL mode is active:

- After every insert/remove, the tree is scanned for imbalance.
- Rotations are performed (LL/RR/LR/RL) with step highlights.
- Node positions smoothly transition using CSS.

## UI Layout

- **Top Bar**: Mode toggle (BST / AVL)
- **Left Sidebar**: Accordion with Create/Search/Insert/Remove panels
- **Right Panel**: Status bar and pseudocode view
- **Bottom Bar**: Speed slider, play/pause, step controls

## Project Structure

```text
src/
  App.jsx             # Top-level layout and wiring
  Sidebar.jsx         # Accordion menu with controls
  ControlBar.jsx      # Playback and speed controls
  TreeCanvas.jsx      # SVG edges + node rendering
  CodePanel.jsx       # Status + pseudocode display
  useBST.js           # BST/AVL logic + animation engine
  App.css             # VisualAlgo-like styles
  index.css           # Global layout reset
```

## Getting Started

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Controls

- **Create ? Empty**: Clears the tree.
- **Create ? Random**: Inserts 5–10 random values.
- **Create ? Balanced**: Inserts a preset balanced tree.
- **Create ? Nodes**: Custom N random insertions.
- **Search/Insert/Remove**: Input `v` and run an animated operation.

## Notes / Current Limitations

- Step Back/Forward only works while paused.
- Play/Step is based on snapshots; resuming after stepping continues the live operation (not replayed from the stepped snapshot).
- Visual accuracy is close to VisualAlgo, but not pixel-perfect for every font/spacing detail.

## Roadmap (Optional)

- Add configurable tree presets and larger datasets.
- Add export/import of tree states.
- Improve step replay so play continues from current snapshot.
- Add animation trails and per-edge highlighting.

---

If you want additional documentation (developer notes, algorithm details, or styling references), let me know.
