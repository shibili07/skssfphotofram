import {
  MASTER_WIDTH,
  MASTER_HEIGHT,
  MASTER_SLOT,
  PREVIEW_WIDTH,
  PREVIEW_HEIGHT,
  PREVIEW_SCALE,
  PREVIEW_SLOT,
  ASSET_PATHS
} from './constants';

/**
 * Promisified Image Loader with error handling
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Calculate initial scale and position to auto-fit user photo in slot
 */
export function calculateAutoFit(imgWidth, imgHeight) {
  const scaleX = MASTER_SLOT.w / imgWidth;
  const scaleY = MASTER_SLOT.h / imgHeight;
  const baseScale = Math.max(scaleX, scaleY) * 1.08;

  return {
    baseScale,
    scale: baseScale,
    panX: MASTER_SLOT.cx,
    panY: MASTER_SLOT.cy
  };
}

/**
 * Render Interactive Preview Canvas (870 x 1088)
 */
export function drawPreview(ctx, userImg, framePreviewImg, panX, panY, scale) {
  ctx.clearRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Draw User Photo (scaled to preview coordinates)
  if (userImg) {
    ctx.save();
    const px = panX * PREVIEW_SCALE;
    const py = panY * PREVIEW_SCALE;
    const curScale = scale * PREVIEW_SCALE;

    ctx.translate(px, py);
    ctx.scale(curScale, curScale);

    const dw = userImg.width;
    const dh = userImg.height;
    ctx.drawImage(userImg, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  } else {
    // Placeholder inside cutout
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(PREVIEW_SLOT.x, PREVIEW_SLOT.y, PREVIEW_SLOT.w, PREVIEW_SLOT.h);
    ctx.fillStyle = '#94a3b8';
    ctx.font = "bold 15px 'Anek Malayalam', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ഫോട്ടോ ഇവിടെ വരും', PREVIEW_SLOT.cx, PREVIEW_SLOT.cy);
    ctx.restore();
  }

  // 2. Draw Frame Overlay
  if (framePreviewImg) {
    ctx.drawImage(framePreviewImg, 0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
  }
}

/**
 * Render Master Full Resolution Canvas (2611 x 3264)
 */
export function drawMaster(targetCtx, userImg, frameMasterImg, panX, panY, scale) {
  targetCtx.clearRect(0, 0, MASTER_WIDTH, MASTER_HEIGHT);
  targetCtx.imageSmoothingEnabled = true;
  targetCtx.imageSmoothingQuality = 'high';

  // 1. Draw User Photo with full camera detail
  if (userImg) {
    targetCtx.save();
    targetCtx.translate(panX, panY);
    targetCtx.scale(scale, scale);

    const dw = userImg.width;
    const dh = userImg.height;
    targetCtx.drawImage(userImg, -dw / 2, -dh / 2, dw, dh);
    targetCtx.restore();
  }

  // 2. Draw Master Frame Overlay
  if (frameMasterImg) {
    targetCtx.drawImage(frameMasterImg, 0, 0, MASTER_WIDTH, MASTER_HEIGHT);
  }
}

/**
 * Export Master Ultra-HD Blob (2611 x 3264 Full Resolution)
 */
export async function generateExportBlob(userImg, cachedMasterImg, panX, panY, scale) {
  const offscreen = document.createElement('canvas');
  offscreen.width = MASTER_WIDTH;
  offscreen.height = MASTER_HEIGHT;
  const offCtx = offscreen.getContext('2d');

  let masterImg = cachedMasterImg;
  if (!masterImg) {
    try {
      masterImg = await loadImage(ASSET_PATHS.frameMaster);
    } catch {
      masterImg = await loadImage(ASSET_PATHS.framePreview);
    }
  }

  drawMaster(offCtx, userImg, masterImg, panX, panY, scale);

  return new Promise((resolve, reject) => {
    offscreen.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas export failed'));
      }
    }, 'image/png');
  });
}

