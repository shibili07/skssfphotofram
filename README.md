# SKSSF ആമപ്പൊയിൽ ശാഖ | ഫോട്ടോ ഫ്രെയിം ജനറേറ്റർ (React App)

A modern, high-performance React application for generating campaign DP posters with Ultra-HD 4K (2611 x 3264) lossless export.

---

## 🚀 Features

- **React 19 + Vite 6**: Blazing fast modern development and production build.
- **Master-Quality Dual Rendering Engine**:
  - **Lightweight 60FPS UI Preview Canvas (870 x 1088)** for responsive pan, pinch, and zoom.
  - **Studio Ultra-HD Canvas (2611 x 3264)** for lossless, print-ready full resolution PNG export.
- **Interactive Gestures & Fine-Tuning**:
  - Smooth drag & pan with mouse or single-touch.
  - Pinch-to-zoom on mobile and mouse-wheel zoom on desktop.
  - Fine-tuning controls: Zoom slider, Zoom In (`+`), Zoom Out (`-`), and Reset (`↺`) button.
- **Smart Image Auto-Fit**: Automatically sizes and centers user photos to perfectly fill the photo slot with no empty edges.
- **Quick Sample Testing**: One-click "Try Sample Photo" button.
- **Social Sharing**: Direct WhatsApp sharing with campaign text via `navigator.share` (or fallback to WhatsApp Web / app).
- **Celebratory Confetti & Real-time Toast Notifications**: Visual feedback when posters are created and downloaded.
- **Responsive & Mobile-First**: Optimized for all screen sizes and smartphones.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
├── public/
│   └── assets/              # Master frame, preview frame, logo, and sample photo
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Branding & event pill badge
│   │   ├── PosterCanvas.jsx   # Interactive canvas, gesture handlers & zoom controls
│   │   ├── UploadSection.jsx  # File dropzone & sample photo trigger
│   │   ├── ActionControls.jsx # Download Ultra HD, WhatsApp share, change photo
│   │   ├── EventDetails.jsx   # Event schedule and venue details
│   │   ├── Footer.jsx         # Media wing footer
│   │   └── Toast.jsx          # Animated notification toasts
│   ├── utils/
│   │   ├── constants.js       # Master dimensions, slot coordinates, asset paths
│   │   └── canvasHelper.js    # Canvas rendering, image loaders, master PNG exporter
│   ├── App.jsx                # Main application state and workflow orchestration
│   ├── index.css              # Styling, gradients, animations, responsive rules
│   └── main.jsx               # React entry point
├── legacy/                    # Backup of original vanilla HTML/JS/CSS files
├── index.html                 # HTML shell for Vite
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies and scripts
```

