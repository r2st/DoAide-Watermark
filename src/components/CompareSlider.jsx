import { useState, useRef, useCallback, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { Button } from './Controls';

export default function CompareSlider() {
  const [beforeSrc, setBeforeSrc] = useState(null);
  const [afterSrc, setAfterSrc] = useState(null);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handlePointerDown = useCallback((e) => {
    dragging.current = true;
    handleMove(e.clientX);
  }, [handleMove]);

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (dragging.current) handleMove(e.clientX);
    };
    const handlePointerUp = () => {
      dragging.current = false;
    };
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handleMove]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!beforeSrc ? (
          <ImageUpload onImageLoad={(src) => setBeforeSrc(src)} label="Upload BEFORE image" />
        ) : (
          <div className="relative">
            <img src={beforeSrc} alt="Before" className="rounded-xl max-h-32 mx-auto" />
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">Before</span>
            <button
              onClick={() => setBeforeSrc(null)}
              className="absolute top-2 right-2 bg-black/60 text-white/80 rounded-full w-6 h-6 flex items-center justify-center
                hover:bg-red-500/60 transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        )}
        {!afterSrc ? (
          <ImageUpload onImageLoad={(src) => setAfterSrc(src)} label="Upload AFTER image" />
        ) : (
          <div className="relative">
            <img src={afterSrc} alt="After" className="rounded-xl max-h-32 mx-auto" />
            <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">After</span>
            <button
              onClick={() => setAfterSrc(null)}
              className="absolute top-2 right-2 bg-black/60 text-white/80 rounded-full w-6 h-6 flex items-center justify-center
                hover:bg-red-500/60 transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {beforeSrc && afterSrc && (
        <div
          ref={containerRef}
          className="relative rounded-xl overflow-hidden cursor-col-resize select-none bg-black/20"
          onPointerDown={handlePointerDown}
          style={{ touchAction: 'none' }}
        >
          <img src={afterSrc} alt="After" className="w-full block" draggable={false} />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={beforeSrc}
              alt="Before"
              className="block"
              style={{ width: containerRef.current?.offsetWidth || '100%' }}
              draggable={false}
            />
          </div>

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white
              shadow-lg flex items-center justify-center text-dark font-bold text-sm select-none">
              ⇔
            </div>
          </div>

          <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded pointer-events-none">
            Before
          </span>
          <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded pointer-events-none">
            After
          </span>
        </div>
      )}
    </div>
  );
}
