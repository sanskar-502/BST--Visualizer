function ControlBar({
  speedMultiplier,
  onSpeedChange,
  onPause,
  onPlay,
  onStepBack,
  onStepForward,
  canStepBack,
  canStepForward,
  isPaused,
  isAnimating,
}) {
  const handleSpeed = (event) => {
    onSpeedChange(Number(event.target.value))
  }

  return (
    <footer className="bottom-bar">
      <div className="speed-control">
        <span className="speed-label">{speedMultiplier.toFixed(1)}x</span>
      </div>
      <div className="transport">
        <button
          className="control-btn"
          onClick={onStepBack}
          disabled={!isAnimating || !isPaused || !canStepBack}
        >
          Step Back
        </button>
        <button
          className="control-btn"
          onClick={onPlay}
          disabled={!isAnimating || !isPaused}
        >
          Play
        </button>
        <button
          className="control-btn"
          onClick={onPause}
          disabled={!isAnimating || isPaused}
        >
          Pause
        </button>
        <button
          className="control-btn"
          onClick={onStepForward}
          disabled={!isAnimating || !isPaused || !canStepForward}
        >
          Step Forward
        </button>
      </div>
      <div className="speed-slider">
        <label htmlFor="speed">Speed</label>
        <input
          id="speed"
          type="range"
          min="0.5"
          max="4"
          step="0.25"
          value={speedMultiplier}
          onChange={handleSpeed}
        />
      </div>
    </footer>
  )
}

export default ControlBar
