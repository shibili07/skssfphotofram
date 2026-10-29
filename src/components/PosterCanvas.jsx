import React, { useRef, useEffect, useCallback } from 'react';
import {
  MASTER_WIDTH,
  MASTER_HEIGHT,
  PREVIEW_WIDTH,
  PREVIEW_HEIGHT
} from '../utils/constants';
import { drawPreview } from '../utils/canvasHelper';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

export default function PosterCanvas({
  userImg,
  framePreviewImg,
  panX,
  panY,
  setPan,
  scale,
  setScale,
  baseScale,
  hasUserPhoto,
  onReset
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, startPanX: 0, startPanY: 0 });
  const pinchDistRef = useRef(0);
  const pinchStartScaleRef = useRef(1);

  // Redraw preview canvas whenever dependencies update
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawPreview(ctx, userImg, framePreviewImg, panX, panY, scale);
  }, [userImg, framePreviewImg, panX, panY, scale]);

  // Handle Mouse Dragging
  const handleMouseDown = useCallback((e) => {
    if (!hasUserPhoto) return;
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panX,
      startPanY: panY
    };
  }, [hasUserPhoto, panX, panY]);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rx = MASTER_WIDTH / rect.width;
    const ry = MASTER_HEIGHT / rect.height;

    const dx = (e.clientX - dragStartRef.current.x) * rx;
    const dy = (e.clientY - dragStartRef.current.y) * ry;

    setPan(dragStartRef.current.startPanX + dx, dragStartRef.current.startPanY + dy);
  }, [setPan]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Global mouse up & mouse move to track smoothly outside canvas boundaries
  useEffect(() => {
    const onWindowMouseMove = (e) => {
      if (isDraggingRef.current) {
        handleMouseMove(e);
      }
    };
    const onWindowMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
    };
  }, [handleMouseMove]);

  // Touch and Wheel Handlers with non-passive event listener on wrapper
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onTouchStart = (e) => {
      if (!hasUserPhoto) return;
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        dragStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          startPanX: panX,
          startPanY: panY
        };
      } else if (e.touches.length === 2) {
        isDraggingRef.current = false;
        pinchDistRef.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        pinchStartScaleRef.current = scale;
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        if (e.cancelable) e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const rx = MASTER_WIDTH / rect.width;
        const ry = MASTER_HEIGHT / rect.height;

        const dx = (e.touches[0].clientX - dragStartRef.current.x) * rx;
        const dy = (e.touches[0].clientY - dragStartRef.current.y) * ry;
        setPan(dragStartRef.current.startPanX + dx, dragStartRef.current.startPanY + dy);
      } else if (e.touches.length === 2 && hasUserPhoto && pinchDistRef.current > 0) {
        if (e.cancelable) e.preventDefault();
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const newScale = Math.min(
          Math.max(pinchStartScaleRef.current * (currentDist / pinchDistRef.current), baseScale * 0.3),
          baseScale * 4
        );
        setScale(newScale);
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      pinchDistRef.current = 0;
    };

    const onWheel = (e) => {
      if (!hasUserPhoto) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      setScale((prev) => Math.min(Math.max(prev * factor, baseScale * 0.3), baseScale * 4));
    };

    wrapper.addEventListener('touchstart', onTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', onTouchMove, { passive: false });
    wrapper.addEventListener('touchend', onTouchEnd);
    wrapper.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      wrapper.removeEventListener('touchstart', onTouchStart);
      wrapper.removeEventListener('touchmove', onTouchMove);
      wrapper.removeEventListener('touchend', onTouchEnd);
      wrapper.removeEventListener('wheel', onWheel);
    };
  }, [hasUserPhoto, panX, panY, scale, baseScale, setPan, setScale]);

  // Zoom control helpers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.15, baseScale * 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev * 0.85, baseScale * 0.3));
  };

  const zoomPercent = baseScale ? Math.round((scale / baseScale) * 100) : 100;

  return (
    <section className="poster-card">
      <div
        className="canvas-wrapper"
        ref={wrapperRef}
        onMouseDown={handleMouseDown}
        style={{ cursor: hasUserPhoto ? (isDraggingRef.current ? 'grabbing' : 'grab') : 'default' }}
      >
        <canvas
          id="posterCanvas"
          ref={canvasRef}
          width={PREVIEW_WIDTH}
          height={PREVIEW_HEIGHT}
        />
      </div>

      {/* Floating or Docked Controls for User Photo adjustment */}
      {hasUserPhoto && (
        <div className="canvas-adjust-controls">
          <button
            type="button"
            className="ctrl-btn"
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>

          <div className="zoom-slider-wrap">
            <span className="zoom-label">{zoomPercent}%</span>
            <input
              type="range"
              min={Math.round(baseScale * 0.3 * 1000)}
              max={Math.round(baseScale * 3.5 * 1000)}
              value={Math.round(scale * 1000)}
              onChange={(e) => setScale(Number(e.target.value) / 1000)}
              className="zoom-slider"
              aria-label="Zoom level"
            />
          </div>

          <button
            type="button"
            className="ctrl-btn"
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn size={16} />
          </button>

          <button
            type="button"
            className="ctrl-btn reset-btn"
            onClick={onReset}
            title="റീസെറ്റ് ചെയ്യുക (Reset)"
            aria-label="Reset position"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>
        </div>
      )}

      <div className="poster-hint" id="posterHint">
        <Move size={16} />
        <span>ഫോട്ടോയിൽ അമർത്തിപ്പിടിച്ച് കൃത്യമായി നീക്കാം (Drag or Pinch to adjust)</span>
      </div>
    </section>
  );
}

