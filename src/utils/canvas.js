export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (typeof src === 'string') {
      img.src = src;
    } else {
      img.src = URL.createObjectURL(src);
    }
  });
}

export function applyTextWatermark(canvas, ctx, options) {
  const {
    text = 'Watermark',
    fontFamily = 'Arial',
    fontSize = 48,
    color = '#ffffff',
    opacity = 0.5,
    rotation = -30,
    position = 'center',
    bold = false,
    italic = false,
  } = options;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;

  const style = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}`;
  ctx.font = `${style}${fontSize}px ${fontFamily}`;

  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;

  const pos = getPosition(canvas.width, canvas.height, textWidth, textHeight, position);

  ctx.translate(pos.x, pos.y);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function applyImageWatermark(canvas, ctx, watermarkImg, options) {
  const {
    opacity = 0.5,
    scale = 0.2,
    position = 'bottom-right',
  } = options;

  const w = watermarkImg.width * scale;
  const h = watermarkImg.height * scale;
  const pos = getPosition(canvas.width, canvas.height, w, h, position);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.drawImage(watermarkImg, pos.x - w / 2, pos.y - h / 2, w, h);
  ctx.restore();
}

export function applyTiledWatermark(canvas, ctx, options) {
  const {
    text = 'Watermark',
    fontFamily = 'Arial',
    fontSize = 32,
    color = '#ffffff',
    opacity = 0.15,
    rotation = -30,
    spacingX = 200,
    spacingY = 150,
  } = options;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px ${fontFamily}`;

  const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);

  for (let y = -diagonal; y < diagonal * 2; y += spacingY) {
    for (let x = -diagonal; x < diagonal * 2; x += spacingX) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }
  ctx.restore();
}

export function resizeImage(canvas, ctx, img, options) {
  const { width, height, quality = 0.9, fit = 'contain' } = options;

  if (fit === 'cover') {
    const scale = Math.max(width / img.width, height / img.height);
    const sw = width / scale;
    const sh = height / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
  } else {
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
  }

  return quality;
}

function getPosition(canvasW, canvasH, itemW, itemH, position) {
  const pad = 20;
  const positions = {
    'top-left': { x: pad + itemW / 2, y: pad + itemH / 2 },
    'top-center': { x: canvasW / 2, y: pad + itemH / 2 },
    'top-right': { x: canvasW - pad - itemW / 2, y: pad + itemH / 2 },
    'center-left': { x: pad + itemW / 2, y: canvasH / 2 },
    'center': { x: canvasW / 2, y: canvasH / 2 },
    'center-right': { x: canvasW - pad - itemW / 2, y: canvasH / 2 },
    'bottom-left': { x: pad + itemW / 2, y: canvasH - pad - itemH / 2 },
    'bottom-center': { x: canvasW / 2, y: canvasH - pad - itemH / 2 },
    'bottom-right': { x: canvasW - pad - itemW / 2, y: canvasH - pad - itemH / 2 },
  };
  return positions[position] || positions['center'];
}

export function downloadCanvas(canvas, filename = 'watermarked.png', quality = 0.92) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', quality);
  link.click();
}
