import React, { useEffect, useRef, useState } from 'react';
import { Save, Settings, Sparkles, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CertificateBuilder() {
  const canvasRef = useRef(null);
  const [titleSize, setTitleSize] = useState(24);
  const [primaryColor, setPrimaryColor] = useState('#0a3d91');
  const [accentColor, setAccentColor] = useState('#f97316');
  const [signatory, setSignatory] = useState('Rahul Krishnamurthy, COO');

  const drawPreview = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#fcfdff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw border frame
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 15;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Title text
    ctx.fillStyle = primaryColor;
    ctx.font = `black ${titleSize}px Outfit, Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 90);

    // Body
    ctx.fillStyle = '#64748b';
    ctx.font = 'semibold 13px Inter, sans-serif';
    ctx.fillText('This credential verifies that', canvas.width / 2, 140);

    // Student Name placeholder
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText('RAHUL KRISHNAMURTHY', canvas.width / 2, 180);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 12px Inter, sans-serif';
    ctx.fillText('has successfully fulfilled course criteria for the study track', canvas.width / 2, 220);

    // Course Title placeholder
    ctx.fillStyle = primaryColor;
    ctx.font = 'black 16px Inter, sans-serif';
    ctx.fillText('PMP® Certification Training Framework', canvas.width / 2, 255);

    // Verification ID
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'mono 10px monospace';
    ctx.fillText('Verification ID: LK-PMP-8201A-932', canvas.width / 2, 305);

    // Draw signature line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 100, 340);
    ctx.lineTo(canvas.width / 2 + 100, 340);
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(signatory, canvas.width / 2, 358);
  };

  useEffect(() => {
    drawPreview();
  }, [titleSize, primaryColor, accentColor, signatory]);

  const handleSave = () => {
    toast.success('Certificate Canvas template configurations updated successfully!');
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="text-left select-none">
        <h1 className="text-2xl font-black text-slate-800">Certificate Designer</h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Configure layout, colors, and signature lines for verifiable credential generation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left select-none">
        
        {/* SETTINGS PARAMETERS CONTROLS */}
        <div className="bg-white border border-slate-100 p-5 rounded-panel shadow-sm h-fit space-y-4">
          <h3 className="font-extrabold text-slate-800 text-xs border-b border-slate-50 pb-2 mb-4 flex items-center gap-1">
            <Settings size={15} />
            Canvas Adjusters
          </h3>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Title Text Font Size</label>
            <input
              type="range"
              min="18"
              max="32"
              value={titleSize}
              onChange={(e) => setTitleSize(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Primary Color</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-8 rounded border cursor-pointer bg-transparent"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Accent Border</label>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-full h-8 rounded border cursor-pointer bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Authorized Signatory Label</label>
            <input
              type="text"
              value={signatory}
              onChange={(e) => setSignatory(e.target.value)}
              className="w-full border border-slate-200 px-3 py-2 text-xs rounded-xl outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <Save size={14} />
            Save Canvas Template
          </button>
        </div>

        {/* CANVAS PREVIEW PANEL */}
        <div className="lg:col-span-2 space-y-4 flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-start">A4 Landscape Canvas Preview</span>
          
          <div className="bg-slate-900/5 p-4 rounded-xl border border-slate-100 max-w-full flex items-center justify-center overflow-x-auto shadow-sm">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="bg-white border shadow-md rounded-lg max-w-full"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
