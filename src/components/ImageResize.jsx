import { useState, useRef, useCallback } from 'react';
import ImageUpload from './ImageUpload';
import { Slider, Select, Button, Toggle } from './Controls';
import { loadImage, downloadCanvas } from '../utils/canvas';

export default function ImageResize() {
  const [imageSrc, setImageSrc] = useState(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality] = useState(90);
  const [fit, setFit] = useState('contain');
  const canvasRef = useRef(null);
  const sourceImgRef = useRef(null);
  const aspectRef = useRef(1);

  const handleImage = async (src) => {
    setImageSrc(src);
    const img = await loadImage(src);
    sourceImgRef.current = img;
    setOriginalSize({ width: img.width, height: img.height });
    setWidth(img.width);
    setHeight(img.height);
    aspectRef.current = img.width / img.height;
    renderPreview(img, img.width, img.height);
  };

  const renderPreview = (img, w, h) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');

    if (fit === 'cover') {
      const scale = Math.max(w / img.width, h / img.height);
      const sw = w / scale;
      const sh = h / scale;
      const sx = (img.width - sw) / 2;
      const sy = (img.height - sh) / 2;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    } else {
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
    }
  };

  const handleWidthChange = (v) => {
    const newWidth = Math.max(1, v);
    setWidth(newWidth);
    if (lockAspect) {
      const newHeight = Math.round(newWidth / aspectRef.current);
      setHeight(newHeight);
      renderPreview(sourceImgRef.current, newWidth, newHeight);
    } else {
      renderPreview(sourceImgRef.current, newWidth, height);
    }
  };

  const handleHeightChange = (v) => {
    const newHeight = Math.max(1, v);
    setHeight(newHeight);
    if (lockAspect) {
      const newWidth = Math.round(newHeight * aspectRef.current);
      setWidth(newWidth);
      renderPreview(sourceImgRef.current, newWidth, newHeight);
    } else {
      renderPreview(sourceImgRef.current, width, newHeight);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `resized-${width}x${height}.png`;
    link.href = canvas.toDataURL('image/png', quality / 100);
    link.click();
  };

  const presets = [
    { label: 'Instagram Post', w: 1080, h: 1080 },
    { label: 'Instagram Story', w: 1080, h: 1920 },
    { label: 'Facebook Cover', w: 820, h: 312 },
    { label: 'Twitter Header', w: 1500, h: 500 },
    { label: 'YouTube Thumb', w: 1280, h: 720 },
    { label: 'HD 1920x1080', w: 1920, h: 1080 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <div className="space-y-4">
        {!imageSrc ? (
          <ImageUpload onImageLoad={handleImage} />
        ) : (
          <div className="relative rounded-xl overflow-hidden bg-black/20">
            <canvas ref={canvasRef} className="max-w-full h-auto mx-auto block" />
            <button
              onClick={() => { setImageSrc(null); sourceImgRef.current = null; }}
              className="absolute top-3 right-3 bg-black/60 text-white/80 rounded-full w-8 h-8 flex items-center justify-center
                hover:bg-red-500/60 transition-colors text-sm"
            >
              ✕
            </button>
            <div className="absolute bottom-3 left-3 bg-black/60 text-white/70 text-xs px-2 py-1 rounded">
              {width} × {height}px
            </div>
          </div>
        )}
        {imageSrc && (
          <Button onClick={handleDownload} className="w-full">
            Download Resized Image
          </Button>
        )}
      </div>

      <div className="bg-dark-lighter rounded-xl p-4 space-y-4 h-fit border border-white/5">
        <h3 className="text-sm font-medium text-white/80">Resize Settings</h3>

        {originalSize.width > 0 && (
          <p className="text-xs text-white/40">
            Original: {originalSize.width} × {originalSize.height}px
          </p>
        )}

        <div className="flex gap-2 items-end">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs text-white/60">Width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-full
                focus:outline-none focus:border-gold/50"
            />
          </div>
          <button
            onClick={() => setLockAspect(!lockAspect)}
            className={`mb-1 text-lg ${lockAspect ? 'text-gold' : 'text-white/30'}`}
            title={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          >
            {lockAspect ? '🔗' : '🔓'}
          </button>
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-xs text-white/60">Height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white w-full
                focus:outline-none focus:border-gold/50"
            />
          </div>
        </div>

        <Select
          label="Fit Mode"
          value={fit}
          onChange={(v) => {
            setFit(v);
            renderPreview(sourceImgRef.current, width, height);
          }}
          options={[
            { value: 'contain', label: 'Stretch to fit' },
            { value: 'cover', label: 'Crop to fill' },
          ]}
        />

        <Slider label="Quality" value={quality} onChange={setQuality} min={10} max={100} unit="%" />

        <div className="space-y-2">
          <span className="text-xs text-white/60">Quick Presets</span>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setWidth(p.w);
                  setHeight(p.h);
                  aspectRef.current = p.w / p.h;
                  renderPreview(sourceImgRef.current, p.w, p.h);
                }}
                className="text-xs bg-white/5 hover:bg-white/10 text-white/60 rounded-lg px-2 py-1.5 transition-colors
                  text-left"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
