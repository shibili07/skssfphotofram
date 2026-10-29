import React from 'react';
import { Calendar, Clock, MapPin, User, Award, Sparkles } from 'lucide-react';

export default function EventDetails() {
  return (
    <div className="event-info-box">
      <div className="event-info-title">
        <Calendar size={18} strokeWidth={2} />
        <span>പരിപാടി വിവരങ്ങൾ (Event Details)</span>
      </div>
      <div className="info-grid">
        <div className="info-item">
          <Clock size={16} strokeWidth={2} />
          <div>
            <span className="info-label">തീയതി & സമയം</span>
            <span className="info-val">2026 ഒക്ടോബർ 30 വെള്ളി | 07:00 PM</span>
          </div>
        </div>

        <div className="info-item">
          <MapPin size={16} strokeWidth={2} />
          <div>
            <span className="info-label">വേദി</span>
            <span className="info-val">ആമപ്പൊയിൽ (Amapoyil)</span>
          </div>
        </div>

        <div className="info-item">
          <Award size={16} strokeWidth={2} />
          <div>
            <span className="info-label">ഉദ്ഘാടനം</span>
            <span className="info-val">ഉസ്താദ് ബഹാവുദ്ധീൻ ഫൈസി</span>
          </div>
        </div>

        <div className="info-item">
          <User size={16} strokeWidth={2} />
          <div>
            <span className="info-label">നേതൃത്വം</span>
            <span className="info-val">മൻസൂർ പുത്തനത്താണി</span>
          </div>
        </div>

        <div className="info-item full-width-item">
          <Sparkles size={16} strokeWidth={2} />
          <div>
            <span className="info-label">പരിപാടി</span>
            <span className="info-val">ശാഖ പ്രവർത്തനോദ്ഘാടനവും ഇഷ്ഖ് മജ്‌ലിസും</span>
          </div>
        </div>
      </div>
    </div>
  );
}
