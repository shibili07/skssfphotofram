import React from 'react';
import { ASSET_PATHS } from '../utils/constants';

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand-section">
        <img
          src={ASSET_PATHS.logo}
          alt="SKSSF Media Wing Amapoyil Unit"
          className="brand-logo-img"
        />
        <div className="brand-info">
          <h1>SKSSF <span className="green-text">AMAPOYIL</span></h1>
          <p>മീഡിയ വിംഗ് • ആമപ്പൊയിൽ ശാഖ 2026-29</p>
        </div>
      </div>

      <div className="event-pill">
        <span className="pulse-dot"></span>
        <span>പ്രവർത്തനോദ്ഘാടനവും ഇഷ്ഖ് മജ്‌ലിസും</span>
      </div>
    </header>
  );
}

