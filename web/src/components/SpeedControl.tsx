const SPEEDS = [0.5, 0.75, 1, 1.5, 2];

interface SpeedControlProps {
  speed: number;
  onChange: (speed: number) => void;
}

export function SpeedControl({ speed, onChange }: SpeedControlProps) {
  return (
    <label className="speed-control" title="animation speed">
      <span className="speed-value">{speed}×</span>
      <input
        type="range"
        min={0}
        max={SPEEDS.length - 1}
        step={1}
        value={SPEEDS.indexOf(speed)}
        onChange={(e) => onChange(SPEEDS[Number(e.target.value)])}
        aria-label="animation speed"
      />
    </label>
  );
}
