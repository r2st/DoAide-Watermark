import { useState, useRef, useCallback } from 'react';
import ImageUpload from './ImageUpload';
import { Slider, Select, ColorPicker, Button, PositionGrid } from './Controls';
import { loadImage, applyTextWatermark, applyTiledWatermark } from '../utils/canvas';
import { FONTS } from '../utils/constants';

export default function BatchProcessor() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState('text');
  const [options, setOptions] = useState({
    text: 'DoAide',
    fontFamily: 'Arial',
    fontSize: 48,
    color: '#ffffff',
    opacity: 0.5,
    rotation: -30,
    position: 'center',
    spacingX: 200,
    spacingY: 150,
  });

  const update = (key, value) => setOptions((prev) => ({ ...prev, [key]: value }));

  const handleFiles = (fileList) => {
    const imageFiles = fileList.filter((f) => f.type.startsWith('image/'));
    setFiles(imageFiles);
  };

  const processAll = async () => {
    setProcessing(true);
    setProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (mode === 'text') {
        applyTextWatermark(canvas, ctx, options);
      } else {
        applyTiledWatermark(canvas, ctx, options);
      }

      const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `watermarked-${file.name}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      setProgress(((i + 1) / files.length) * 100);
    }

    setProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <div className="space-y-4">
        <ImageUpload
          onImageLoad={handleFiles}
          label="Drop multiple images here"
          multiple
        />

        {files.length > 0 && (
          <div className="bg-dark-lighter rounded-xl p-4 border border-white/5">
            <p className="text-sm text-white/60 mb-3">{files.length} image{files.length !== 1 ? 's' : ''} selected</p>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {files.map((file, i) => (
                <div key={i} className="aspect-square rounded-lg bg-black/30 overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {processing && (
          <div className="bg-dark-lighter rounded-xl p-4 border border-white/5">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Button onClick={processAll} disabled={files.length === 0 || processing} className="w-full">
          {processing ? 'Processing...' : `Process ${files.length} Image${files.length !== 1 ? 's' : ''}`}
        </Button>
      </div>

      <div className="bg-dark-lighter rounded-xl p-4 space-y-4 h-fit border border-white/5">
        <h3 className="text-sm font-medium text-white/80">Batch Settings</h3>

        <Select
          label="Watermark Mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'text', label: 'Text Watermark' },
            { value: 'tiled', label: 'Tiled Watermark' },
          ]}
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/60">Watermark Text</label>
          <input
            type="text"
            value={options.text}
            onChange={(e) => update('text', e.target.value)}
            className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white
              focus:outline-none focus:border-gold/50"
          />
        </div>

        <Select label="Font" value={options.fontFamily} onChange={(v) => update('fontFamily', v)} options={FONTS} />
        <Slider label="Font Size" value={options.fontSize} onChange={(v) => update('fontSize', v)} min={12} max={200} unit="px" />
        <ColorPicker label="Color" value={options.color} onChange={(v) => update('color', v)} />
        <Slider label="Opacity" value={options.opacity} onChange={(v) => update('opacity', v)} min={0} max={1} step={0.05} />
        <Slider label="Rotation" value={options.rotation} onChange={(v) => update('rotation', v)} min={-180} max={180} unit="°" />

        {mode === 'text' && (
          <PositionGrid value={options.position} onChange={(v) => update('position', v)} />
        )}

        {mode === 'tiled' && (
          <>
            <Slider label="H Spacing" value={options.spacingX} onChange={(v) => update('spacingX', v)} min={50} max={500} unit="px" />
            <Slider label="V Spacing" value={options.spacingY} onChange={(v) => update('spacingY', v)} min={50} max={500} unit="px" />
          </>
        )}
      </div>
    </div>
  );
}
