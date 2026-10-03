import { useState, useRef, useEffect, useCallback } from 'react';
import ImageUpload from './ImageUpload';
import { Slider, Select, ColorPicker, Toggle, Button, PositionGrid } from './Controls';
import { loadImage, applyTextWatermark, downloadCanvas } from '../utils/canvas';
import { FONTS } from '../utils/constants';

const DEFAULT_OPTIONS = {
  text: 'DoAide',
  fontFamily: 'Arial',
  fontSize: 48,
  color: '#ffffff',
  opacity: 0.5,
  rotation: -30,
  position: 'center',
  bold: false,
  italic: false,
};

export default function TextWatermark() {
  const [imageSrc, setImageSrc] = useState(null);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const canvasRef = useRef(null);
  const sourceImgRef = useRef(null);

  const update = (key, value) => setOptions((prev) => ({ ...prev, [key]: value }));

  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = sourceImgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    applyTextWatermark(canvas, ctx, options);
  }, [options]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  const handleImage = async (src) => {
    setImageSrc(src);
    const img = await loadImage(src);
    sourceImgRef.current = img;
    renderPreview();
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvas(canvasRef.current, 'watermarked.png');
  };

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
          </div>
        )}
        {imageSrc && (
          <Button onClick={handleDownload} className="w-full">
            Download Watermarked Image
          </Button>
        )}
      </div>

      <div className="bg-dark-lighter rounded-xl p-4 space-y-4 h-fit border border-white/5">
        <h3 className="text-sm font-medium text-white/80">Text Watermark Settings</h3>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Watermark Text</label>
          <input
            type="text"
            value={options.text}
            onChange={(e) => update('text', e.target.value)}
            className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white
              focus:outline-none focus:border-gold/50"
            placeholder="Enter watermark text"
          />
        </div>

        <Select
          label="Font"
          value={options.fontFamily}
          onChange={(v) => update('fontFamily', v)}
          options={FONTS}
        />

        <Slider label="Font Size" value={options.fontSize} onChange={(v) => update('fontSize', v)} min={12} max={200} unit="px" />
        <ColorPicker label="Color" value={options.color} onChange={(v) => update('color', v)} />
        <Slider label="Opacity" value={options.opacity} onChange={(v) => update('opacity', v)} min={0} max={1} step={0.05} />
        <Slider label="Rotation" value={options.rotation} onChange={(v) => update('rotation', v)} min={-180} max={180} unit="°" />

        <div className="flex gap-4">
          <Toggle label="Bold" checked={options.bold} onChange={(v) => update('bold', !options.bold)} />
          <Toggle label="Italic" checked={options.italic} onChange={(v) => update('italic', !options.italic)} />
        </div>

        <PositionGrid value={options.position} onChange={(v) => update('position', v)} />
      </div>
    </div>
  );
}
