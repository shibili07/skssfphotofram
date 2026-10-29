import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import PosterCanvas from './components/PosterCanvas';
import UploadSection from './components/UploadSection';
import ActionControls from './components/ActionControls';
import EventDetails from './components/EventDetails';
import Footer from './components/Footer';
import Toast from './components/Toast';
import { ASSET_PATHS, MASTER_SLOT } from './utils/constants';
import {
  loadImage,
  calculateAutoFit,
  generateExportBlob
} from './utils/canvasHelper';

export default function App() {
  const [framePreviewImg, setFramePreviewImg] = useState(null);
  const [frameMasterImg, setFrameMasterImg] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [hasUserPhoto, setHasUserPhoto] = useState(false);

  // Position and Scale in Master Coordinates
  const [panX, setPanX] = useState(MASTER_SLOT.cx);
  const [panY, setPanY] = useState(MASTER_SLOT.cy);
  const [scale, setScale] = useState(1.0);
  const [baseScale, setBaseScale] = useState(1.0);

  const [isDownloading, setIsDownloading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const posterCardRef = useRef(null);

  // Show Toast Helper
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 350);
    }, 3200);
  }, []);

  // Preload frames on mount
  useEffect(() => {
    // 1. Preview Frame
    loadImage(ASSET_PATHS.framePreview)
      .then((img) => setFramePreviewImg(img))
      .catch((err) => {
        console.error('Failed to load preview frame:', err);
        showToast('ഫ്രെയിം ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല', 'error');
      });

    // 2. Preload Master HQ Frame in background
    loadImage(ASSET_PATHS.frameMaster)
      .then((img) => setFrameMasterImg(img))
      .catch((err) => {
        console.warn('Could not preload master frame:', err);
      });
  }, [showToast]);

  // Set user image and calculate initial auto-fit
  const applyUserImage = useCallback((img) => {
    const { baseScale: bScale, scale: sScale, panX: pX, panY: pY } = calculateAutoFit(
      img.width,
      img.height
    );

    setUserImg(img);
    setHasUserPhoto(true);
    setBaseScale(bScale);
    setScale(sScale);
    setPanX(pX);
    setPanY(pY);

    showToast('പോസ്റ്റർ തയ്യാറായി! ഫോട്ടോ അഡ്ജസ്റ്റ് ചെയ്യാൻ ഡ്രാഗ് ചെയ്യാം', 'success');

    // Confetti burst
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#009640', '#005baa', '#d97706', '#ffffff']
      });
    } catch {}

    // On mobile devices, smoothly scroll to preview if desired
    if (window.innerWidth < 960 && posterCardRef.current) {
      setTimeout(() => {
        posterCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  }, [showToast]);

  // Handle file selection
  const handleImageSelected = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('ദയവായി ഒരു ചിത്രം തിരഞ്ഞെടുക്കുക', 'info');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => applyUserImage(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, [applyUserImage, showToast]);

  // Reset to auto-fit
  const handleReset = useCallback(() => {
    if (!userImg) return;
    const { baseScale: bScale, scale: sScale, panX: pX, panY: pY } = calculateAutoFit(
      userImg.width,
      userImg.height
    );
    setBaseScale(bScale);
    setScale(sScale);
    setPanX(pX);
    setPanY(pY);
    showToast('ഫോട്ടോ സ്ഥാനം റീസെറ്റ് ചെയ്തു', 'info');
  }, [userImg, showToast]);

  // Helper to set both pan coordinates
  const handleSetPan = useCallback((x, y) => {
    setPanX(x);
    setPanY(y);
  }, []);

  // Download Ultra-HD Poster
  const handleDownload = useCallback(async () => {
    if (!userImg) {
      showToast('ദയവായി ഒരു ഫോട്ടോ തിരഞ്ഞെടുക്കുക', 'info');
      return;
    }

    setIsDownloading(true);
    try {
      const blob = await generateExportBlob(
        userImg,
        frameMasterImg,
        panX,
        panY,
        scale
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timeStr = new Date().toISOString().slice(0, 10);
      a.download = `SKSSF_Amapoyil_Poster_UltraHD_${timeStr}.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('അൾട്രാ-എച്ച്ഡി പോസ്റ്റർ ഡൗൺലോഡ് ചെയ്തു! 🎉', 'success');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#009640', '#005baa', '#f59e0b']
        });
      } catch {}
    } catch (err) {
      console.error(err);
      showToast('ഡൗൺലോഡ് ചെയ്യുമ്പോൾ തകരാർ സംഭവിച്ചു', 'error');
    } finally {
      setIsDownloading(false);
    }
  }, [userImg, frameMasterImg, panX, panY, scale, showToast]);

  // WhatsApp Share
  const handleShareWhatsApp = useCallback(async () => {
    if (!userImg) {
      showToast('ദയവായി ഒരു ഫോട്ടോ തിരഞ്ഞെടുക്കുക', 'info');
      return;
    }

    const shareText = `SKSSF ആമപൊയിൽ ശാഖ 2026-29
പ്രവർത്തനോദ്ഘാടനവും & ഇഷ്ഖ് മജ്ലിസും

*“ഞാനും പങ്കെടുക്കുന്നു“*
പ്രൊഫൈൽ ക്യാമ്പയിൻ

> SKSSF AMAPOYIL UNIT

https://skssfishkmajlis-nine.vercel.app/`;

    setIsDownloading(true);
    try {
      const blob = await generateExportBlob(
        userImg,
        frameMasterImg,
        panX,
        panY,
        scale
      );
      const file = new File([blob], 'SKSSF_Amapoyil_Poster_UltraHD.png', {
        type: 'image/png'
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'SKSSF ആമപ്പൊയിൽ ശാഖ',
          text: shareText
        });
        showToast('ഷെയർ ചെയ്തു!', 'success');
        setIsDownloading(false);
        return;
      }
    } catch (err) {
      console.warn('Navigator share error or cancelled:', err);
    } finally {
      setIsDownloading(false);
    }

    // Fallback: trigger download and open WhatsApp Web/App
    handleDownload();
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
    showToast('പോസ്റ്റർ സേവ് ചെയ്ത് വാട്സ്ആപ്പ് സ്റ്റാറ്റസ് ആക്കൂ!', 'info');
  }, [userImg, frameMasterImg, panX, panY, scale, showToast, handleDownload]);

  return (
    <div className="app-wrapper">
      <Header />

      <main className="main-layout">
        {/* Interactive Poster Canvas with controls */}
        <div ref={posterCardRef} className="poster-card-container">
          <PosterCanvas
            userImg={userImg}
            framePreviewImg={framePreviewImg}
            panX={panX}
            panY={panY}
            setPan={handleSetPan}
            scale={scale}
            setScale={setScale}
            baseScale={baseScale}
            hasUserPhoto={hasUserPhoto}
            onReset={handleReset}
          />
        </div>

        {/* Actions Card: കാമ്പയിൻ പോസ്റ്റർ ഫ്രെയിം മേക്കർ */}
        <section className="action-card">
          <div className="action-header">
            <h2 className="action-title">കാമ്പയിൻ പോസ്റ്റർ ഫ്രെയിം മേക്കർ</h2>
            <p className="action-subtitle">
              ഫോട്ടോ തിരഞ്ഞെടുക്കുക • അൾട്രാ-എച്ച്ഡി പോസ്റ്റർ ഡൗൺലോഡ് ചെയ്യുക
            </p>
          </div>

          {!hasUserPhoto ? (
            <UploadSection
              onImageSelected={handleImageSelected}
            />
          ) : (
            <ActionControls
              onDownload={handleDownload}
              onShareWhatsApp={handleShareWhatsApp}
              onChangePhoto={handleImageSelected}
              isDownloading={isDownloading}
            />
          )}
        </section>

        {/* Event Details */}
        <EventDetails />
      </main>

      <Footer />

      <Toast toasts={toasts} />
    </div>
  );
}
