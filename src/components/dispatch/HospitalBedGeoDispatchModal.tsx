import React, { useState } from 'react';
import { 
  X, MapPin, Navigation, Phone, CheckCircle2, AlertTriangle, 
  Bed, Heart, Activity, Wind, ShieldCheck, Search, Filter,
  Send, ExternalLink, Clock, Map as MapIcon, List
} from 'lucide-react';
import { OpenStreetMapViewer, MapMarkerItem, MapCircleItem } from '../common/OpenStreetMapViewer';

interface HospitalBedGeoDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBedReserved?: (hospitalName: string, bedType: string) => void;
}

interface HospitalCenter {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  distanceKm: number;
  ambulanceEtaMin: number;
  totalBeds: number;
  availableBeds: {
    icuVentilator: number;
    ccuCardiac: number;
    hdu: number;
    generalWard: number;
    isolationDengue: number;
  };
  oxygenPlantStatus: 'SURPLUS (99.8%)' | 'OPTIMAL' | 'RESERVE';
  contactPhone: string;
  isGovernment: boolean;
  acceptingEmergency: boolean;
}

const REGIONAL_HOSPITALS: HospitalCenter[] = [
  {
    id: 'camc_er',
    name: 'Central Academic Medical Center',
    area: 'South Sector, Medical District',
    lat: 23.7258,
    lng: 90.3976,
    distanceKm: 3.4,
    ambulanceEtaMin: 12,
    totalBeds: 2600,
    availableBeds: {
      icuVentilator: 4,
      ccuCardiac: 6,
      hdu: 11,
      generalWard: 42,
      isolationDengue: 18
    },
    oxygenPlantStatus: 'OPTIMAL',
    contactPhone: '+880 2-0000001',
    isGovernment: true,
    acceptingEmergency: true
  },
  {
    id: 'apex_er',
    name: 'Apex Quaternary Hospital & Heart Institute',
    area: 'North City Health Zone',
    lat: 23.8130,
    lng: 90.4260,
    distanceKm: 7.8,
    ambulanceEtaMin: 18,
    totalBeds: 425,
    availableBeds: {
      icuVentilator: 8,
      ccuCardiac: 5,
      hdu: 14,
      generalWard: 28,
      isolationDengue: 9
    },
    oxygenPlantStatus: 'SURPLUS (99.8%)',
    contactPhone: '+880 2-0000002',
    isGovernment: false,
    acceptingEmergency: true
  },
  {
    id: 'horizon_er',
    name: 'Horizon Multispecialty Hospital',
    area: 'Central Commercial Avenue',
    lat: 23.7516,
    lng: 90.3871,
    distanceKm: 4.1,
    ambulanceEtaMin: 14,
    totalBeds: 350,
    availableBeds: {
      icuVentilator: 3,
      ccuCardiac: 4,
      hdu: 7,
      generalWard: 19,
      isolationDengue: 6
    },
    oxygenPlantStatus: 'SURPLUS (99.8%)',
    contactPhone: '+880 2-0000003',
    isGovernment: false,
    acceptingEmergency: true
  },
  {
    id: 'ncce_er',
    name: 'National Cardiovascular Center of Excellence',
    area: 'West Health Precinct',
    lat: 23.7711,
    lng: 90.3695,
    distanceKm: 5.2,
    ambulanceEtaMin: 16,
    totalBeds: 800,
    availableBeds: {
      icuVentilator: 6,
      ccuCardiac: 12,
      hdu: 16,
      generalWard: 35,
      isolationDengue: 0
    },
    oxygenPlantStatus: 'OPTIMAL',
    contactPhone: '+880 2-0000004',
    isGovernment: true,
    acceptingEmergency: true
  },
  {
    id: 'northzone_er',
    name: 'North Zone General & Trauma Hospital',
    area: 'Airport Corridor District',
    lat: 23.8260,
    lng: 90.4080,
    distanceKm: 11.2,
    ambulanceEtaMin: 22,
    totalBeds: 500,
    availableBeds: {
      icuVentilator: 5,
      ccuCardiac: 3,
      hdu: 9,
      generalWard: 31,
      isolationDengue: 22
    },
    oxygenPlantStatus: 'OPTIMAL',
    contactPhone: '+880 2-0000005',
    isGovernment: true,
    acceptingEmergency: true
  }
];

export function HospitalBedGeoDispatchModal({
  isOpen,
  onClose,
  onBedReserved
}: HospitalBedGeoDispatchModalProps) {
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [filterType, setFilterType] = useState<'ALL' | 'ICU' | 'CCU' | 'DENGUE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<HospitalCenter>(REGIONAL_HOSPITALS[1]);
  const [bedLockConfirmed, setBedLockConfirmed] = useState(false);
  const [dispatching, setDispatching] = useState(false);

  // Filter hospitals based on search, distance and bed type availability
  const filteredHospitals = REGIONAL_HOSPITALS.filter(h => {
    const matchesDistance = h.distanceKm <= maxDistance;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.area.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesDistance || !matchesSearch) return false;

    if (filterType === 'ICU') return h.availableBeds.icuVentilator > 0;
    if (filterType === 'CCU') return h.availableBeds.ccuCardiac > 0;
    if (filterType === 'DENGUE') return h.availableBeds.isolationDengue > 0;
    return true;
  });

  // Map markers and distance radius circle
  const hospitalMarkers: MapMarkerItem[] = filteredHospitals.map(h => ({
    id: h.id,
    lat: h.lat,
    lng: h.lng,
    title: h.name,
    subtitle: `${h.area} • ICU: ${h.availableBeds.icuVentilator} | CCU: ${h.availableBeds.ccuCardiac}`,
    badge: `ICU: ${h.availableBeds.icuVentilator}`,
    color: selectedHospital.id === h.id ? '#14b8a6' : '#38bdf8',
    iconEmoji: '🏥',
    onClick: () => {
      setSelectedHospital(h);
      setBedLockConfirmed(false);
    }
  }));

  const mapCircles: MapCircleItem[] = [
    {
      id: 'radius-circle',
      center: [23.7800, 90.4000],
      radiusMeters: maxDistance * 1000,
      color: '#14b8a6',
      fillColor: '#14b8a6',
      fillOpacity: 0.1,
      label: `${maxDistance} km Emergency Search Radius`
    }
  ];

  if (!isOpen) return null;

  const handleReserveBed = (hospital: HospitalCenter, bedName: string) => {
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      setBedLockConfirmed(true);
      if (onBedReserved) {
        onBedReserved(hospital.name, bedName);
      }
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-teal-950/80 via-slate-900 to-sky-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide">Live Bed Telemetry & Geo-Dispatch</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-400/10 text-teal-300 border border-teal-400/30">
                  Regional Mesh Network
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Proximity-based ICU/CCU bed reservation with automated ambulance pre-arrival notification
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

        {/* Filters Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospital name or area..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
              {(['ALL', 'ICU', 'CCU', 'DENGUE'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    filterType === type 
                      ? 'bg-teal-600 text-white shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Radius Slider */}
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-teal-400" />
              Radius: <strong className="text-white">{maxDistance} km</strong>
            </span>
            <input
              type="range"
              min="2"
              max="25"
              value={maxDistance}
              onChange={e => setMaxDistance(Number(e.target.value))}
              className="w-28 accent-teal-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Map & Hospital List */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live OpenStreetMap Hospital Mesh Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-teal-400" />
                  Live OpenStreetMap Regional Bed Capacity
                </span>
                <span className="text-[11px] text-teal-300 font-mono">
                  {selectedHospital.name} Selected
                </span>
              </div>
              <OpenStreetMapViewer
                center={[selectedHospital.lat || 23.7800, selectedHospital.lng || 90.4000]}
                zoom={12}
                height="240px"
                markers={hospitalMarkers}
                circles={mapCircles}
                selectedMarkerId={selectedHospital.id}
                onMarkerSelect={(id) => {
                  const target = REGIONAL_HOSPITALS.find(h => h.id === id);
                  if (target) {
                    setSelectedHospital(target);
                    setBedLockConfirmed(false);
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>HOSPITALS WITH OPEN CAPACITY ({filteredHospitals.length})</span>
              <span>CLICK TO FOCUS &amp; RESERVE</span>
            </div>

            {filteredHospitals.map(h => {
              const isSelected = selectedHospital.id === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => {
                    setSelectedHospital(h);
                    setBedLockConfirmed(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-950/40 border-teal-500/60 shadow-xl shadow-teal-950/50'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{h.name}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          h.isGovernment 
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' 
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {h.isGovernment ? 'GOVT TERTIARY' : 'PRIVATE JCI'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-400" />
                        {h.area}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-teal-300">{h.distanceKm} km away</div>
                      <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ETA: {h.ambulanceEtaMin} mins
                      </div>
                    </div>
                  </div>

                  {/* Bed counts grid */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-700/60 text-center">
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold block">ICU Ventilator</span>
                      <span className="text-xs font-black text-rose-400">{h.availableBeds.icuVentilator} Open</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold block">CCU Cardiac</span>
                      <span className="text-xs font-black text-amber-400">{h.availableBeds.ccuCardiac} Open</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold block">HDU Step-down</span>
                      <span className="text-xs font-black text-sky-400">{h.availableBeds.hdu} Open</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold block">Dengue / Iso</span>
                      <span className="text-xs font-black text-emerald-400">{h.availableBeds.isolationDengue} Open</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Hospital Dispatch Console */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Dispatch & Bed Reservation Desk
                </span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Socket Ready
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{selectedHospital.name}</h3>
                <p className="text-xs text-slate-400">{selectedHospital.area}</p>
                <div className="flex items-center gap-3 text-xs pt-1 text-slate-300">
                  <span>Emergency Hotline: <strong className="text-white">{selectedHospital.contactPhone}</strong></span>
                </div>
              </div>

              {/* Oxygen & Infrastructure Index */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Cryogenic Oxygen Plant:</span>
                  <span className="font-bold text-emerald-400">{selectedHospital.oxygenPlantStatus}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Ambulance Siren Corridor:</span>
                  <span className="font-bold text-teal-300">Active (ETA ~{selectedHospital.ambulanceEtaMin}m)</span>
                </div>
              </div>

              {/* Bed Lock Confirmation or Action */}
              {bedLockConfirmed ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-center animate-fade-in">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-white">Bed Locked & Emergency Team Alerted!</h4>
                  <p className="text-xs text-slate-300">
                    Bed #ICU-04 reserved for 45 minutes at <strong>{selectedHospital.name}</strong>.
                    Patient triage vitals streamed to duty ER registrar.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-300 pt-1">
                    Passcode: ER-DISPATCH-9902
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => handleReserveBed(selectedHospital, 'ICU Ventilator Bed')}
                    disabled={dispatching || selectedHospital.availableBeds.icuVentilator === 0}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-950 flex items-center justify-center gap-2 transition-all"
                  >
                    <Bed className="w-4 h-4" />
                    <span>{dispatching ? 'Reserving Bed on Hospital Cloud...' : 'Lock ICU Ventilator Bed & Dispatch'}</span>
                  </button>

                  <button
                    onClick={() => handleReserveBed(selectedHospital, 'CCU Cardiac Bed')}
                    disabled={dispatching || selectedHospital.availableBeds.ccuCardiac === 0}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs border border-teal-500/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Lock Coronary Care (CCU) Bed</span>
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with DGHS National Emergency Bed Registry & 999 Dispatch Interface</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
