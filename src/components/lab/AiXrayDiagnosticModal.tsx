import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Eye, Sparkles, FileText, CheckCircle2, AlertTriangle, 
  Layers, Upload, RefreshCw, ZoomIn, ShieldCheck, Download
} from 'lucide-react';

interface AiXrayDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientMrin?: string;
}

interface XrayCase {
  id: string;
  name: string;
  view: string;
  findings: string;
  gradCamZone: { x: number; y: number; width: number; height: number };
  scores: {
    pneumonia: number;
    tuberculosis: number;
    cardiomegaly: number;
    effusion: number;
    normal: number;
  };
  primaryDiagnosis: string;
  radiologistImpression: string;
  recommendation: string;
}

const XRAY_CASES: XrayCase[] = [
  {
    id: 'case-pneumonia',
    name: 'Patient X-Ray: Right Middle Lobe Consolidation',
    view: 'PA Erect Chest X-Ray',
    findings: 'Dense patchy alveolar opacification in the right mid-to-lower zone obscuring the right cardiac border (positive silhouette sign). Costophrenic angles sharp.',
    gradCamZone: { x: 170, y: 130, width: 90, height: 80 },
    scores: {
      pneumonia: 94.6,
      tuberculosis: 18.2,
      cardiomegaly: 12.1,
      effusion: 22.4,
      normal: 2.1
    },
    primaryDiagnosis: 'Bacterial Lobar Pneumonia (Right Lung)',
    radiologistImpression: 'Right middle lobe lobar consolidation consistent with community-acquired acute bacterial pneumonia. No pneumothorax detected.',
    recommendation: 'Start empiric IV/Oral respiratory antibiotics (Ceftriaxone + Azithromycin). Follow-up chest radiograph in 10 days.'
  },
  {
    id: 'case-tb',
    name: 'Patient X-Ray: Upper Lobe Cavitary Infiltrate',
    view: 'PA Erect Chest X-Ray',
    findings: 'Fibrocavitary lesions and reticulonodular opacities in the left apical-posterior segment with volume loss.',
    gradCamZone: { x: 70, y: 65, width: 85, height: 75 },
    scores: {
      pneumonia: 34.1,
      tuberculosis: 91.8,
      cardiomegaly: 8.5,
      effusion: 15.0,
      normal: 1.5
    },
    primaryDiagnosis: 'Active Pulmonary Tuberculosis (Cavitary)',
    radiologistImpression: 'Apical cavitary disease with bronchogenic spread strongly indicative of active Mycobacterium tuberculosis infection.',
    recommendation: 'STAT Sputum GeneXpert MTB/RIF test, acid-fast bacilli (AFB) smear, and airborne isolation precautions.'
  },
  {
    id: 'case-cardiomegaly',
    name: 'Patient X-Ray: Cardiothoracic Ratio Enlargement',
    view: 'PA Erect Chest X-Ray',
    findings: 'Cardiothoracic ratio (CTR) elevated at 0.62 (>0.50). Prominence of pulmonary venous vasculature indicating mild interstitial congestion.',
    gradCamZone: { x: 110, y: 150, width: 140, height: 90 },
    scores: {
      pneumonia: 14.2,
      tuberculosis: 6.1,
      cardiomegaly: 96.4,
      effusion: 42.1,
      normal: 3.4
    },
    primaryDiagnosis: 'Marked Cardiomegaly with Early Congestive Failure',
    radiologistImpression: 'Gross cardiac enlargement with bilateral upper lobe venous diversion. Suspected biventricular hypertensive/dilated cardiomyopathy.',
    recommendation: 'Urgent 2D Transthoracic Echocardiogram (TTE) for LVEF estimation and NT-proBNP biomarker assay.'
  }
];

export function AiXrayDiagnosticModal({
  isOpen,
  onClose,
  patientName = 'Kazi Mohammad Tareq',
  patientMrin = 'HS-2026-00421'
}: AiXrayDiagnosticModalProps) {
  const [selectedCase, setSelectedCase] = useState<XrayCase>(XRAY_CASES[0]);
  const [showGradCam, setShowGradCam] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  // Render Simulated Chest X-ray & Grad-CAM Attention Heatmap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Dark Radiography Background
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Anatomical Thoracic Silhouette
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 3;

    // Spine & Mediastinum center
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(150, 20, 20, 240);

    // Rib cage arches
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(160, 40 + i * 30, 90 + i * 4, Math.PI * 0.8, Math.PI * 2.2);
      ctx.strokeStyle = 'rgba(74, 85, 104, 0.4)';
      ctx.stroke();
    }

    // Bilateral Lung Radiolucency (Lungs are darker)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(95, 130, 45, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(225, 130, 45, 80, 0, 0, Math.PI * 2);
    ctx.fill();

    // Heart Silhouette (Left-sided opacity)
    ctx.fillStyle = selectedCase.id === 'case-cardiomegaly' ? '#334155' : '#273449';
    ctx.beginPath();
    const heartWidth = selectedCase.id === 'case-cardiomegaly' ? 65 : 42;
    ctx.ellipse(150, 160, heartWidth, 50, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Pathology Infiltration Opacity
    ctx.fillStyle = 'rgba(203, 213, 225, 0.65)';
    const z = selectedCase.gradCamZone;
    ctx.beginPath();
    ctx.ellipse(z.x + z.width / 2, z.y + z.height / 2, z.width / 2.2, z.height / 2.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Grad-CAM Attention Heatmap Overlay (Red-Yellow Gradient)
    if (showGradCam) {
      const grad = ctx.createRadialGradient(
        z.x + z.width / 2, z.y + z.height / 2, 5,
        z.x + z.width / 2, z.y + z.height / 2, z.width / 1.5
      );
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.8)');   // Deep Red hot-spot
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.5)'); // Yellow attention
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');     // Transparent green edge

      ctx.fillStyle = grad;
      ctx.fillRect(z.x - 20, z.y - 20, z.width + 40, z.height + 40);

      // Bounding Box
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(z.x, z.y, z.width, z.height);
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px monospace';
      ctx.fillText(`AI FOCUS (${selectedCase.scores.pneumonia > 80 ? 'Pneumonia' : selectedCase.scores.tuberculosis > 80 ? 'TB Cavity' : 'Cardiomegaly'})`, z.x, z.y - 5);
    }
  }, [selectedCase, showGradCam]);

  const handleSelectCase = (c: XrayCase) => {
    setIsAnalyzing(true);
    setSelectedCase(c);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/90 via-slate-900 to-indigo-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Chester AI™ Deep Chest X-Ray Diagnostic Engine</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  DenseNet-121 + Grad-CAM Heatmap
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automated detection of Pneumonia, Tuberculosis, and Cardiomegaly with visual explainability
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action ribbon */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Pre-loaded Case Studies:</span>
            {XRAY_CASES.map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectCase(c)}
                className={`px-3 py-1 rounded-xl font-bold transition ${
                  selectedCase.id === c.id
                    ? 'bg-teal-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {c.primaryDiagnosis.split('(')[0]}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-bold text-teal-300">
            <input
              type="checkbox"
              checked={showGradCam}
              onChange={e => setShowGradCam(e.target.checked)}
              className="rounded text-teal-500"
            />
            <span>Show Grad-CAM Saliency Heatmap</span>
          </label>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visual Canvas Viewer */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={320}
                height={280}
                className="rounded-2xl border border-slate-800 shadow-2xl"
              />
              <div className="absolute top-2 left-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300 border border-slate-700">
                {selectedCase.view} • DICOM 16-Bit
              </div>
            </div>

            <div className="flex items-center justify-between w-full text-xs text-slate-400 px-2 font-mono">
              <span>Resolution: 2048 x 2048</span>
              <span className="text-emerald-400 font-bold">Inference: 142ms</span>
            </div>
          </div>

          {/* Right Column: AI Multi-Disease Probabilities & Radiologist Report */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Multi-Disease Probabilities */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                DenseNet-121 Multi-Label Pathology Confidence
              </span>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-white">Bacterial / Viral Pneumonia</span>
                    <strong className={selectedCase.scores.pneumonia > 70 ? 'text-rose-400' : 'text-slate-300'}>
                      {selectedCase.scores.pneumonia}%
                    </strong>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${selectedCase.scores.pneumonia}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-white">Pulmonary Tuberculosis (Cavity/Infiltrate)</span>
                    <strong className={selectedCase.scores.tuberculosis > 70 ? 'text-amber-400' : 'text-slate-300'}>
                      {selectedCase.scores.tuberculosis}%
                    </strong>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${selectedCase.scores.tuberculosis}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-white">Cardiomegaly (CTR {'>'} 0.50)</span>
                    <strong className={selectedCase.scores.cardiomegaly > 70 ? 'text-teal-400' : 'text-slate-300'}>
                      {selectedCase.scores.cardiomegaly}%
                    </strong>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${selectedCase.scores.cardiomegaly}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Structured Radiologist Report */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-teal-300 uppercase">AI Radiologist Structured Finding</span>
                <span className="font-mono text-[10px] text-slate-400">HL7 / DICOM SR</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Radiological Impression:</span>
                <p className="text-white font-medium mt-0.5 leading-relaxed">
                  {selectedCase.radiologistImpression}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-teal-950/30 border border-teal-500/20">
                <span className="text-[10px] font-bold text-teal-300 uppercase block">Clinical Action Advice:</span>
                <p className="text-slate-300 mt-0.5 font-medium">
                  {selectedCase.recommendation}
                </p>
              </div>

              <button
                onClick={() => alert('PACS Imaging Diagnostic Report appended to patient digital EHR dossier!')}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign &amp; Transmit Imaging Report to Doctor Cockpit</span>
              </button>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Trained on NIH ChestX-ray14 &amp; CheXpert Datasets (224,000 Radiographs)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
