import { useState, useEffect, useRef } from 'react';
import { Card } from './Card';
import { MAX_POINTS } from '../utils/commission';

interface PointTrackerProps {
  points: number;
  quota: number;
  onPointsChange: (points: number) => void;
}

export function PointTracker({ points, quota, onPointsChange }: PointTrackerProps) {
  const [showReset, setShowReset] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const prevPointsRef = useRef(points);

  useEffect(() => {
    if (points >= quota && prevPointsRef.current < quota) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 600);
    }
    prevPointsRef.current = points;
  }, [points, quota]);

  const adjust = (delta: number) => {
    const newVal = Math.min(MAX_POINTS, Math.max(0, Math.round((points + delta) * 10) / 10));
    onPointsChange(newVal);
  };

  const handleReset = () => {
    onPointsChange(0);
    setShowReset(false);
  };

  const handleInputSubmit = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val >= 0) {
      onPointsChange(Math.min(MAX_POINTS, Math.round(val * 10) / 10));
    }
    setShowInput(false);
    setInputValue('');
  };

  return (
    <Card className={celebrating ? 'celebrate ring-2 ring-emerald-400' : ''}>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Monthly Points</p>

        {/* Main +/- controls */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <button
            onClick={() => adjust(-1)}
            className="w-16 h-16 rounded-2xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-2xl font-bold text-gray-700 transition-all flex items-center justify-center cursor-pointer select-none"
            aria-label="Decrease 1 point"
          >
            −
          </button>

          <button
            onClick={() => setShowInput(true)}
            className="min-w-[120px] cursor-pointer bg-transparent border-none"
          >
            <span className={`text-5xl font-extrabold text-gray-900 number-transition tabular-nums ${celebrating ? 'text-emerald-600' : ''}`}>
              {points % 1 === 0 ? points.toFixed(0) : points.toFixed(1)}
            </span>
            <span className="block text-xs text-gray-400 mt-1">pts</span>
          </button>

          <button
            onClick={() => adjust(1)}
            className="w-16 h-16 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-2xl font-bold text-white transition-all flex items-center justify-center cursor-pointer select-none shadow-md"
            aria-label="Increase 1 point"
          >
            +
          </button>
        </div>

        {/* Slider */}
        <div className="mb-5 px-1">
          <input
            type="range"
            min={0}
            max={MAX_POINTS}
            step={1}
            value={points}
            onChange={(e) => onPointsChange(Number(e.target.value))}
            className="w-full h-2 cursor-pointer accent-brand-500 touch-pan-y"
            aria-label="Monthly points"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-medium tabular-nums">
            <span>0</span>
            <span>{MAX_POINTS}</span>
          </div>
        </div>

        {/* Reset */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowReset(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100 active:bg-rose-200 transition-colors cursor-pointer select-none"
          >
            Reset
          </button>
        </div>

        {/* Direct numeric input modal */}
        {showInput && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowInput(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-semibold text-gray-700 mb-3">Set Points Manually</p>
              <input
                type="number"
                step="0.5"
                min="0"
                max={MAX_POINTS}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={points.toString()}
                className="w-full text-center text-3xl font-bold border border-gray-200 rounded-xl p-3 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowInput(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInputSubmit}
                  className="flex-1 py-3 rounded-xl bg-brand-500 text-white font-semibold text-sm cursor-pointer"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset confirmation modal */}
        {showReset && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowReset(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-xl" onClick={(e) => e.stopPropagation()}>
              <p className="text-lg font-bold text-gray-900 mb-2">Reset Points?</p>
              <p className="text-sm text-gray-500 mb-4">This will set your points to 0 for the month.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReset(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-semibold text-sm cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
