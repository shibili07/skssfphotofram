import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

export default function UploadSection({ onImageSelected }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Initial Upload Dropzone */}
      <div
        className={`upload-dropzone ${isDragOver ? 'dragover' : ''}`}
        id="dropzone"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon-circle">
          <Upload size={34} strokeWidth={2.3} />
        </div>
        <div className="dropzone-prompt">
          <h3>നിങ്ങളുടെ ഫോട്ടോ ചേർക്കുക</h3>
          <p>ക്യാമറയിൽ നിന്നോ ഗാലറിയിൽ നിന്നോ തിരഞ്ഞെടുക്കാം</p>
        </div>
        <button
          type="button"
          className="btn-select-photo"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          <ImageIcon size={18} strokeWidth={2} />
          <span>ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക</span>
        </button>
      </div>
    </>
  );
}
