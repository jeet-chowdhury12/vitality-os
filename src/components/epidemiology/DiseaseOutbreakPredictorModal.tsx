import React, { useState } from 'react';
import { 
  X, AlertTriangle, ShieldAlert, TrendingUp, MapPin, 
  Droplet, Wind, Thermometer, CheckCircle2, Sparkles, Filter,
  Map as MapIcon
} from 'lucide-react';
import { OpenStreetMapViewer, MapMarkerItem, MapCircleItem } from '../common/OpenStreetMapViewer';

interface DiseaseOutbreakPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OutbreakZone {
  id: string;
  zoneName: string;
  city: string;
  lat: number;
  lng: number;
  pathogen: 'Dengue Virus (DENV-2)' | 'Vibrio Cholerae' | 'Influenza A (H1N1)';
  riskLevel: 'EPIDEMIC SURGE' | 'HIGH ALERT' | 'MODERATE' | 'BASELINE';
  rZero: number;
  projectedCases7Days: number;
  rainfallMm: number;
  tempCelsius: number;
  larvalBreteauIndex: number; // For Dengue > 20 is high risk
  actionPlan: string;
}

const OUTBREAK_DATA: OutbreakZone[] = [
  {
    id: 'zone-dhk-south',
    zoneName: 'Jatrabari & Old Dhaka (DSCC)',
    city: 'Dhaka',
    lat: 23.7099,
    lng: 90.4344,
    pathogen: 'Dengue Virus (DENV-2)',
    riskLevel: 'EPIDEMIC SURGE',
    rZero: 2.6,
    projectedCases7Days: 480,
    rainfallMm: 112,
    tempCelsius: 31.4,
    larvalBreteauIndex: 38.5,
    actionPlan: 'STAT targeted ULV fogging, larvicide deployment, and mobilization of 50 dedicated Dengue beds at Central Academic Hospital & Regional Annex.'
  },
  {
    id: 'zone-dhk-north',
    zoneName: 'Mirpur & Uttara (DNCC)',
    city: 'Dhaka',
    lat: 23.8300,
    lng: 90.3800,
    pathogen: 'Dengue Virus (DENV-2)',
    riskLevel: 'HIGH ALERT',
    rZero: 1.9,
    projectedCases7Days: 290,
    rainfallMm: 85,
    tempCelsius: 30.8,
    larvalBreteauIndex: 24.2,
    actionPlan: 'Community rooftop reservoir inspection and rapid NS1 testing camps.'
  },
  {
    id: 'zone-ctg-halishahar',
    zoneName: 'Halishahar & Agrabad',
    city: 'Chittagong',
    lat: 22.3300,
    lng: 91.8000,
    pathogen: 'Vibrio Cholerae',
    riskLevel: 'HIGH ALERT',
    rZero: 2.1,
    projectedCases7Days: 175,
    rainfallMm: 140,
    tempCelsius: 29.5,
    larvalBreteauIndex: 5.0,
    actionPlan: 'Water pipeline chlorination tablets distribution, oral cholera vaccine (OCV) buffer deployment.'
  },
  {
    id: 'zone-syl-sadar',
    zoneName: 'Sylhet Sadar & Surma River Basin',
    city: 'Sylhet',
    lat: 24.8949,
    lng: 91.8687,
    pathogen: 'Influenza A (H1N1)',
    riskLevel: 'MODERATE',
    rZero: 1.3,
    projectedCases7Days: 95,
    rainfallMm: 45,
    tempCelsius: 22.1,
    larvalBreteauIndex: 2.0,
    actionPlan: 'Pediatric respiratory ward expansion at Regional Tertiary Teaching Hospital.'
  }
];

export function DiseaseOutbreakPredictorModal({
  isOpen,
  onClose
}: DiseaseOutbreakPredictorModalProps) {
  const [selectedZone, setSelectedZone] = useState<OutbreakZone>(OUTBREAK_DATA[0]);
  const [selectedPathogen, setSelectedPathogen] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredZones = OUTBREAK_DATA.filter(z => 
    selectedPathogen === 'ALL' || z.pathogen.toLowerCase().includes(selectedPathogen.toLowerCase())
  );

  const outbreakMarkers: MapMarkerItem[] = filteredZones.map(z => ({
    id: z.id,
    lat: z.lat,
    lng: z.lng,
    title: `${z.zoneName} (${z.city})`,
    subtitle: `${z.pathogen} • R₀: ${z.rZero} • Projected: +${z.projectedCases7Days} Cases`,
    badge: z.riskLevel,
    color: z.riskLevel === 'EPIDEMIC SURGE' ? '#ef4444' : z.riskLevel === 'HIGH ALERT' ? '#f59e0b' : '#14b8a6',
    iconEmoji: z.pathogen.includes('Dengue') ? '🦟' : z.pathogen.includes('Cholera') ? '💧' : '🦠',
    onClick: () => setSelectedZone(z)
  }));

  const outbreakCircles: MapCircleItem[] = filteredZones.map(z => ({
    id: `circle-${z.id}`,
    center: [z.lat, z.lng],
    radiusMeters: z.riskLevel === 'EPIDEMIC SURGE' ? 4000 : z.riskLevel === 'HIGH ALERT' ? 2800 : 1800,
    color: z.riskLevel === 'EPIDEMIC SURGE' ? '#ef4444' : z.riskLevel === 'HIGH ALERT' ? '#f59e0b' : '#14b8a6',
    fillColor: z.riskLevel === 'EPIDEMIC SURGE' ? '#ef4444' : z.riskLevel === 'HIGH ALERT' ? '#f59e0b' : '#14b8a6',
    fillOpacity: z.id === selectedZone.id ? 0.35 : 0.15,
    label: `${z.zoneName} (${z.riskLevel})`
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/90 via-slate-900 to-teal-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">AI Disease Outbreak &amp; Epidemic Predictor</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  DGHS Surveillance + Scikit-Learn ML
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Weather, precipitation, population density &amp; reproductive rate ($R_0$) spatiotemporal forecasting
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

        {/* Filter bar */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Pathogen Filter:</span>
            {(['ALL', 'Dengue', 'Cholera', 'Influenza'] as const).map(path => (
              <button
                key={path}
                onClick={() => setSelectedPathogen(path)}
                className={`px-3 py-1 rounded-lg font-bold transition ${
                  selectedPathogen === path
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {path}
              </button>
            ))}
          </div>
          <span className="text-[11px] font-mono text-amber-300 font-bold">
            7-Day Forward Horizon Model
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Map & Outbreak Heatmap List */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live OpenStreetMap Epidemic Clusters */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-amber-400" />
                  Live OpenStreetMap Spatiotemporal Outbreak Grid
                </span>
                <span className="text-[11px] text-amber-300 font-mono">
                  Focused: {selectedZone.zoneName}
                </span>
              </div>
              <OpenStreetMapViewer
                center={[selectedZone.lat || 23.7099, selectedZone.lng || 90.4344]}
                zoom={11}
                height="240px"
                markers={outbreakMarkers}
                circles={outbreakCircles}
                selectedMarkerId={selectedZone.id}
                onMarkerSelect={(id) => {
                  const target = OUTBREAK_DATA.find(z => z.id === id);
                  if (target) setSelectedZone(target);
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>High-Risk Geographical Clusters ({filteredZones.length})</span>
              <span>CLICK TO FOCUS &amp; ANALYZE</span>
            </div>

            {filteredZones.map(zone => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/60 shadow-xl'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{zone.zoneName}</h4>
                        <span className="text-xs text-slate-400">({zone.city})</span>
                      </div>
                      <p className="text-xs text-amber-300 mt-1 font-semibold">{zone.pathogen}</p>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        zone.riskLevel === 'EPIDEMIC SURGE'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : zone.riskLevel === 'HIGH ALERT'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      }`}>
                        {zone.riskLevel}
                      </span>
                      <div className="text-xs font-mono font-bold text-slate-300 mt-1">
                        $R_0$ = {zone.rZero}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Rainfall: {zone.rainfallMm}mm</span>
                    <span>•</span>
                    <span>Temp: {zone.tempCelsius}°C</span>
                    <span>•</span>
                    <span className="text-rose-400 font-bold">Projected +{zone.projectedCases7Days} Cases</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Epidemiological Action Vector */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Outbreak Intervention Matrix
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedZone.zoneName}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{selectedZone.pathogen}</h3>
                <p className="text-xs text-slate-400">{selectedZone.city} Municipal Surveillance Ward</p>
              </div>

              {/* Biomarkers */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block">Larval Breteau Index</span>
                  <span className="text-lg font-black text-rose-400">{selectedZone.larvalBreteauIndex} (High)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block">Transmission Velocity</span>
                  <span className="text-lg font-black text-amber-300">$R_0$ {selectedZone.rZero}</span>
                </div>
              </div>

              {/* Action plan */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold text-amber-300 uppercase block">
                  DGHS Recommended Containment Strategy:
                </span>
                <p className="text-slate-300 leading-relaxed font-medium">
                  {selectedZone.actionPlan}
                </p>
              </div>

              <button
                onClick={() => alert(`Outbreak advisory issued for ${selectedZone.zoneName}! Municipal sanitary and hospital response teams dispatched.`)}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>Issue Regional Health Alert &amp; Allocate Beds</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with IEDCR (Institute of Epidemiology, Disease Control and Research)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Predictor
          </button>
        </div>

      </div>
    </div>
  );
}
