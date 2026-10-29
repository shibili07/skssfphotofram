// Master Design Dimensions (2611 x 3264)
export const MASTER_WIDTH = 2611;
export const MASTER_HEIGHT = 3264;

export const MASTER_SLOT = {
  x: 1478,
  y: 1063,
  w: 543,
  h: 694,
  cx: 1749.5,
  cy: 1410
};

// Preview Dimensions for UI (870 x 1088)
export const PREVIEW_WIDTH = 870;
export const PREVIEW_HEIGHT = 1088;
export const PREVIEW_SCALE = PREVIEW_WIDTH / MASTER_WIDTH;

export const PREVIEW_SLOT = {
  x: MASTER_SLOT.x * PREVIEW_SCALE,
  y: MASTER_SLOT.y * PREVIEW_SCALE,
  w: MASTER_SLOT.w * PREVIEW_SCALE,
  h: MASTER_SLOT.h * PREVIEW_SCALE,
  cx: MASTER_SLOT.cx * PREVIEW_SCALE,
  cy: MASTER_SLOT.cy * PREVIEW_SCALE
};

const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export const ASSET_PATHS = {
  logo: `${BASE}assets/logo.png`,
  framePreview: `${BASE}assets/frame_preview.png`,
  frameMaster: `${BASE}assets/frame_master_hq.png`,
  samplePhoto: `${BASE}assets/sample_photo.jpg`
};
