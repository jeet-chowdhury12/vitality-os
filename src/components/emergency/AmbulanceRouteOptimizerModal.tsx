import React, { useState, useEffect } from 'react';
import { 
  X, Navigation, MapPin, AlertTriangle, ShieldAlert, CheckCircle2,
  Clock, Zap, Activity, Radio, Phone, Compass, ArrowRight, TrendingDown,
  Layers, Map as MapIcon
} from 'lucide-react';
import { OpenStreetMapViewer, MapMarkerItem, MapRouteItem } from '../common/OpenStreetMapViewer';

interface AmbulanceRouteOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  standardEtaMin: number;
  aiOptimizedEtaMin: number;
  trafficLevel: 'HEAVY CONGESTION' | 'MODERATE' | 'CLEAR CORRIDOR';
  chokepoints: string[];
  sirenGreenWaveAvailable: boolean;
  recommended: boolean;
  coords: [number, number][];
}

const DHAKA_EMERGENCY_ROUTES: RouteOption[] = [
  {
    id: 'route-ai-corridor',
    name: 'Corridor Alpha • Elevated Expressway & Direct ER Ramp',
    distanceKm: 8.6,
    standardEtaMin: 34,
    aiOptimizedEtaMin: 12,
    trafficLevel: 'CLEAR CORRIDOR',
    chokepoints: ['Kuril Interchange (Pre-cleared)', 'Banani Link Overpass'],
    sirenGreenWaveAvailable: true,
    recommended: true,
    coords: [
      [23.8580, 90.4040],
      [23.8340, 90.4120],
      [23.8180, 90.4160],
      [23.8050, 90.4100],
      [23.7925, 90.4078]
    ]
  },
  {
    id: 'route-vip-road',
    name: 'Corridor Beta • Airport Road & Mohakhali Flyover',
    distanceKm: 9.4,
    standardEtaMin: 42,
    aiOptimizedEtaMin: 21,
    trafficLevel: 'MODERATE',
    chokepoints: ['Mohakhali Intersection', 'Jahangir Gate Bottleneck'],
    sirenGreenWaveAvailable: true,
    recommended: false,
    coords: [
      [23.8580, 90.4040],
      [23.8300, 90.4010],
      [23.8120, 90.3980],
      [23.7850, 90.3980],
      [23.7925, 90.4078]
    ]
  },
  {
    id: 'route-mirpur-rd',
    name: 'Corridor Gamma • Mirpur Road Arterial',
    distanceKm: 11.2,
    standardEtaMin: 55,
    aiOptimizedEtaMin: 31,
    trafficLevel: 'HEAVY CONGESTION',
    chokepoints: ['Asad Gate', 'Dhanmondi 27 Signal', 'Science Lab Crossing'],
    sirenGreenWaveAvailable: false,
    recommended: false,
    coords: [
      [23.8580, 90.4040],
      [23.8200, 90.3650],
      [23.7900, 90.3700],
      [23.7650, 90.3800],
      [23.7925, 90.4078]
    ]
  }
];

export function AmbulanceRouteOptimizerModal({
  isOpen,
  onClose,
  patientName = 'Kazi Mohammad Tareq'
}: AmbulanceRouteOptimizerModalProps) {
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(DHAKA_EMERGENCY_ROUTES[0]);
  const [isSirenActive, setIsSirenActive] = useState<boolean>(true);
  const [greenWaveTriggered, setGreenWaveTriggered] = useState<boolean>(true);
  const [hospitalTarget, setHospitalTarget] = useState<string>('Apex Quaternary ER / Trauma Bay');

  const mapMarkers: MapMarkerItem[] = [
    {
      id: 'origin',
      lat: 23.8580,
      lng: 90.4040,
      title: 'Emergency Scene (Origin)',
      subtitle: `Patient: ${patientName} • STAT Pickup`,
      color: '#ef4444',
      iconEmoji: '📍',
      badge: 'INCIDENT'
    },
    {
      id: 'ambulance',
      lat: selectedRoute.coords[Math.floor(selectedRoute.coords.length / 2)][0],
      lng: selectedRoute.coords[Math.floor(selectedRoute.coords.length / 2)][1],
      title: 'Medic Ambulance Unit 04',
      subtitle: `Speed: 64 km/h • Siren: ${isSirenActive ? 'Active' : 'Off'}`,
      color: '#38bdf8',
      iconEmoji: '🚑',
      badge: 'IN TRANSIT'
    },
    {
      id: 'destination',
      lat: 23.7925,
      lng: 90.4078,
      title: hospitalTarget,
      subtitle: 'Trauma Resuscitation Bay #02 Prepped',
      color: '#10b981',
      iconEmoji: '🏥',
      badge: 'RECEIVING ER'
    },
    {
      id: 'signal-1',
      lat: 23.8180,
      lng: 90.4160,
      title: 'Kuril V2X Traffic Signal',
      subtitle: 'Preemption: Signal Forced GREEN (60s early)',
      color: '#22c55e',
      iconEmoji: '🚦',
      badge: 'GREEN WAVE'
    }
  ];

  const mapRoutes: MapRouteItem[] = [
    {
      id: selectedRoute.id,
      coords: selectedRoute.coords,
      color: selectedRoute.recommended ? '#14b8a6' : '#f59e0b',
      weight: 5
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-950/90 via-slate-900 to-teal-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 animate-pulse">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Ambulance Route AI & Green Wave Corridor</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  OpenStreetMap + Real-Time Telematics
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Predictive emergency transit routing, automated traffic light preemption & receiving ER telemetry
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

        {/* Status Bar */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Target ER: <strong className="text-white">{hospitalTarget}</strong></span>
            <span>•</span>
            <span className="text-slate-400">Patient: <strong className="text-teal-300">{patientName}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSirenActive(!isSirenActive)}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                isSirenActive 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isSirenActive ? 'SIREN CORRIDOR ACTIVE' : 'SIREN OFF'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Live OpenStreetMap Navigation View */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-teal-400" />
                Live OpenStreetMap GPS Corridor View
              </span>
              <span className="text-[11px] text-teal-300 font-mono">
                Active Corridor: {selectedRoute.name.split(' • ')[0]}
              </span>
            </div>
            <OpenStreetMapViewer
              center={[23.8250, 90.4070]}
              zoom={12}
              height="260px"
              markers={mapMarkers}
              routes={mapRoutes}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Route Choices */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>Traffic-Evaluated Corridors</span>
              <span>Predicted Golden Hour ETA</span>
            </div>

            {DHAKA_EMERGENCY_ROUTES.map(route => {
              const isSelected = selectedRoute.id === route.id;
              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500/60 shadow-xl'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{route.name}</h4>
                        {route.recommended && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            AI RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-400" />
                        Distance: {route.distanceKm} km • {route.chokepoints.join(', ')}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-400">
                        {route.aiOptimizedEtaMin} Mins
                      </div>
                      <div className="text-[10px] text-slate-400 line-through">
                        Standard: {route.standardEtaMin}m
                      </div>
                    </div>
                  </div>

                  {/* Impact pill */}
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
                    <span className={`font-bold ${
                      route.trafficLevel === 'CLEAR CORRIDOR' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      ● {route.trafficLevel}
                    </span>
                    <span className="text-teal-300 font-medium flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                      Saved {(route.standardEtaMin - route.aiOptimizedEtaMin)} Minutes
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Live Green Wave Preemption Alert */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <strong className="text-indigo-200 block flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-indigo-400 animate-ping" />
                  Traffic Signal V2X Preemption (Green Wave Active)
                </strong>
                <p className="text-slate-400">
                  Dhaka Metropolitan Police Traffic Signals automatically turning green 60s ahead of ambulance.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                4 Signals Pre-Empted
              </span>
            </div>
          </div>

          {/* Right Column: Telemetry & Receiving Hospital Handoff */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  En-Route Patient Telemetry
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  LIVE SOCKET ACTIVE
                </span>
              </div>

              {/* Vitals Stream to ER */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block">Heart Rate</span>
                  <span className="text-xl font-black text-rose-400">114 BPM</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold block">SpO2 Oxygen</span>
                  <span className="text-xl font-black text-cyan-300">92% (On 4L O2)</span>
                </div>
              </div>

              {/* Receiving ER Team Status */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Receiving Emergency Team:</span>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Trauma Resuscitation Bay #02 Prepped</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Cardiac registrar, perfusionist, and airway trolley ready for arrival in <strong>{selectedRoute.aiOptimizedEtaMin} minutes</strong>.
                </p>
              </div>

              <button
                onClick={() => alert(`Ambulance Green Corridor locked! ETA: ${selectedRoute.aiOptimizedEtaMin}m to ${hospitalTarget}.`)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 font-bold text-xs text-white shadow-lg shadow-rose-950 flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4" />
                <span>Confirm Corridor &amp; Signal Lock</span>
              </button>
            </div>
          </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with National 999 Ambulance Dispatch &amp; Dhaka Traffic Police Telematics</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Route AI
          </button>
        </div>

      </div>
    </div>
  );
}
