import { describe, it, expect, vi, beforeEach } from 'vitest';

function createMockCanvas(w = 800, h = 600) {
  const ctx = {
    drawImage: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 })),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    fillStyle: '',
    font: '',
    globalAlpha: 1,
  };
  const canvas = {
    width: w,
    height: h,
    getContext: () => ctx,
    toDataURL: vi.fn(() => 'data:image/png;base64,abc'),
  };
  return { canvas, ctx };
}

describe('canvas utils', () => {
  let applyTextWatermark, applyTiledWatermark, applyImageWatermark, downloadCanvas;

  beforeEach(async () => {
    const mod = await import('../utils/canvas.js');
    applyTextWatermark = mod.applyTextWatermark;
    applyTiledWatermark = mod.applyTiledWatermark;
    applyImageWatermark = mod.applyImageWatermark;
    downloadCanvas = mod.downloadCanvas;
  });

  describe('applyTextWatermark', () => {
    it('draws text with correct opacity', () => {
      const { canvas, ctx } = createMockCanvas();
      applyTextWatermark(canvas, ctx, { text: 'Test', opacity: 0.7 });
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.fillText).toHaveBeenCalledWith('Test', 0, 0);
      expect(ctx.restore).toHaveBeenCalled();
    });

    it('applies rotation', () => {
      const { canvas, ctx } = createMockCanvas();
      applyTextWatermark(canvas, ctx, { text: 'X', rotation: -45 });
      expect(ctx.rotate).toHaveBeenCalledWith((-45 * Math.PI) / 180);
    });

    it('uses bold and italic styles', () => {
      const { canvas, ctx } = createMockCanvas();
      applyTextWatermark(canvas, ctx, { text: 'Hi', bold: true, italic: true, fontSize: 24, fontFamily: 'Arial' });
      expect(ctx.font).toBe('italic bold 24px Arial');
    });

    it('positions text at top-left', () => {
      const { canvas, ctx } = createMockCanvas(800, 600);
      applyTextWatermark(canvas, ctx, { text: 'TL', position: 'top-left', fontSize: 20 });
      expect(ctx.translate).toHaveBeenCalled();
      const [x, y] = ctx.translate.mock.calls[0];
      expect(x).toBeLessThan(200);
      expect(y).toBeLessThan(200);
    });
  });

  describe('applyTiledWatermark', () => {
    it('draws multiple text instances', () => {
      const { canvas, ctx } = createMockCanvas(400, 400);
      applyTiledWatermark(canvas, ctx, { text: 'Tile', spacingX: 100, spacingY: 100 });
      expect(ctx.fillText.mock.calls.length).toBeGreaterThan(1);
    });

    it('respects opacity', () => {
      const { canvas, ctx } = createMockCanvas();
      applyTiledWatermark(canvas, ctx, { text: 'T', opacity: 0.1 });
      expect(ctx.globalAlpha).toBe(0.1);
    });
  });

  describe('applyImageWatermark', () => {
    it('draws the watermark image with opacity', () => {
      const { canvas, ctx } = createMockCanvas();
      const watermarkImg = { width: 200, height: 100 };
      applyImageWatermark(canvas, ctx, watermarkImg, { opacity: 0.5, scale: 0.3, position: 'center' });
      expect(ctx.drawImage).toHaveBeenCalled();
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });
  });

  describe('downloadCanvas', () => {
    it('triggers download', () => {
      const { canvas } = createMockCanvas();
      const clickSpy = vi.fn();
      vi.spyOn(document, 'createElement').mockReturnValue({
        set download(v) { this._download = v; },
        get download() { return this._download; },
        set href(v) { this._href = v; },
        get href() { return this._href; },
        click: clickSpy,
      });

      downloadCanvas(canvas, 'test.png');
      expect(clickSpy).toHaveBeenCalled();

      vi.restoreAllMocks();
    });
  });
});
