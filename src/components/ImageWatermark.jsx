import { useState, useRef, useEffect, useCallback } from 'react';
import ImageUpload from './ImageUpload';
import { Slider, Button, PositionGrid } from './Controls';
import { loadImage, applyImageWatermark, downloadCanvas } from '../utils/canvas';

export default function ImageWatermark() {
  const [imageSrc, setImageSrc] = useState(null);
  const [logoSrc, setLogoSrc] = useState(null);
  const [options, setOptions] = useState({ opacity: 0.6, scale: 0.2, position: 'bottom-right' });
  const canvasRef = useRef(null);
  const sourceImgRef = useRef(null);
  const logoImgRef = useRef(null);

  const update = (key, value) => setOptions((prev) => ({ ...prev, [key]: value }));

  const renderPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = sourceImgRef.current;
    const logo = logoImgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    if (logo) {
      applyImageWatermark(canvas, ctx, logo, options);
    }
  }, [options]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  const handleImage = async (src) => {
    setImageSrc(src);
    sourceImgRef.current = await loadImage(src);
    renderPreview();
  };

  const handleLogo = async (src) => {
    setLogoSrc(src);
    logoImgRef.current = await loadImage(src);
    renderPreview();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <div className="space-y-4">
        {!imageSrc ? (
          <ImageUpload onImageLoad={handleImage} label="Upload your main image" />
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
          <Button onClick={() => downloadCanvas(canvasRef.current, 'logo-watermarked.png')} className="w-full" disabled={!logoSrc}>
            Download Watermarked Image
          </Button>
        )}
      </div>

      <div className="bg-dark-lighter rounded-xl p-4 space-y-4 h-fit border border-white/5">
        <h3 className="text-sm font-medium text-white/80">Logo Watermark Settings</h3>

        {!logoSrc ? (
          <ImageUpload onImageLoad={handleLogo} label="Upload logo / watermark image" />
        ) : (
          <div className="relative rounded-lg overflow-hidden bg-black/30 p-2">
            <img src={logoSrc} alt="Logo preview" className="max-h-20 mx-auto" />
            <button
              onClick={() => { setLogoSrc(null); logoImgRef.current = null; }}
              className="absolute top-1 right-1 bg-black/60 text-white/80 rounded-full w-6 h-6 flex items-center justify-center
                hover:bg-red-500/60 transition-colors text-xs"
            >
              ✕
            </button>
          </div>
        )}

        <Slider label="Opacity" value={options.opacity} onChange={(v) => update('opacity', v)} min={0} max={1} step={0.05} />
        <Slider label="Scale" value={options.scale} onChange={(v) => update('scale', v)} min={0.05} max={1} step={0.05} />
        <PositionGrid value={options.position} onChange={(v) => update('position', v)} />
      </div>
    </div>
  );
}
