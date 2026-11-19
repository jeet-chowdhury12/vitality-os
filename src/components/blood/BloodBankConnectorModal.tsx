import React, { useState } from 'react';
import { 
  X, Droplet, Heart, Search, CheckCircle2, AlertTriangle, 
  Phone, MapPin, Send, ShieldCheck, Filter, Users, Clock,
  Map as MapIcon
} from 'lucide-react';
import { OpenStreetMapViewer, MapMarkerItem, MapCircleItem } from '../common/OpenStreetMapViewer';

interface BloodBankConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
}

interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  rhFactor: 'Positive' | 'Negative';
  area: string;
  lat: number;
  lng: number;
  distanceKm: number;
  lastDonationDaysAgo: number;
  isEligible: boolean;
  contactPhone: string;
  donorBadge: 'VERIFIED REGULAR' | 'FIRST RESPONDER' | 'COMMUNITY';
}

const DONOR_REGISTRY: BloodDonor[] = [
  {
    id: 'donor-01',
    name: 'Tanvir Hossain',
    bloodGroup: 'O',
    rhFactor: 'Negative',
    area: 'Dhanmondi, Dhaka',
    lat: 23.7465,
    lng: 90.3760,
    distanceKm: 2.8,
    lastDonationDaysAgo: 110,
    isEligible: true,
    contactPhone: '+880 1700-000001',
    donorBadge: 'FIRST RESPONDER'
  },
  {
    id: 'donor-02',
    name: 'Sayeda Nasrin',
    bloodGroup: 'B',
    rhFactor: 'Positive',
    area: 'Mohammadpur, Dhaka',
    lat: 23.7550,
    lng: 90.3600,
    distanceKm: 3.5,
    lastDonationDaysAgo: 140,
    isEligible: true,
    contactPhone: '+880 1800-000002',
    donorBadge: 'VERIFIED REGULAR'
  },
  {
    id: 'donor-03',
    name: 'Mahbubur Rahman',
    bloodGroup: 'A',
    rhFactor: 'Positive',
    area: 'Mirpur-10, Dhaka',
    lat: 23.8070,
    lng: 90.3686,
    distanceKm: 6.2,
    lastDonationDaysAgo: 98,
    isEligible: true,
    contactPhone: '+880 1900-000003',
    donorBadge: 'VERIFIED REGULAR'
  },
  {
    id: 'donor-04',
    name: 'Farhan Kabir',
    bloodGroup: 'AB',
    rhFactor: 'Positive',
    area: 'Uttara Sector 7',
    lat: 23.8759,
    lng: 90.3795,
    distanceKm: 12.0,
    lastDonationDaysAgo: 45,
    isEligible: false, // Less than 90 days
    contactPhone: '+880 1600-000004',
    donorBadge: 'COMMUNITY'
  }
];

export function BloodBankConnectorModal({
  isOpen,
  onClose,
  patientName = 'Kazi Mohammad Tareq'
}: BloodBankConnectorModalProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('O-');
  const [searchArea, setSearchArea] = useState<string>('');
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);

  const donorMarkers: MapMarkerItem[] = [
    {
      id: 'bank-1',
      lat: 23.7380,
      lng: 90.3950,
      title: 'Metropolitan Central Blood Center',
      subtitle: `Available: 8 Bags (${selectedGroup}) • 24/7 STAT Bank`,
      badge: `8 Bags`,
      color: '#10b981',
      iconEmoji: '🏥'
    },
    {
      id: 'bank-2',
      lat: 23.7420,
      lng: 90.4120,
      title: 'Regional Blood Transfusion Depot',
      subtitle: `Available: 5 Bags (${selectedGroup}) • Cryo Reserve`,
      badge: `5 Bags`,
      color: '#10b981',
      iconEmoji: '🏥'
    },
    {
      id: 'bank-3',
      lat: 23.7925,
      lng: 90.4078,
      title: 'Apex Clinical Blood Reserve',
      subtitle: `Low Stock: 2 Bags (${selectedGroup})`,
      badge: `2 Bags`,
      color: '#ef4444',
      iconEmoji: '🏥'
    },
    ...DONOR_REGISTRY.map(d => ({
      id: d.id,
      lat: d.lat,
      lng: d.lng,
      title: `${d.name} (${d.bloodGroup}${d.rhFactor === 'Positive' ? '+' : '-'})`,
      subtitle: `${d.area} • ${d.distanceKm} km away • ${d.isEligible ? 'Eligible' : 'Recent donor'}`,
      badge: `${d.distanceKm}km`,
      color: d.isEligible ? '#e11d48' : '#64748b',
      iconEmoji: '🩸'
    }))
  ];

  const donorCircles: MapCircleItem[] = [
    {
      id: 'donor-radius',
      center: [23.7700, 90.3900],
      radiusMeters: 6000,
      color: '#e11d48',
      fillColor: '#e11d48',
      fillOpacity: 0.08,
      label: '5km Rapid Donor Dispatch Zone'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-950/90 via-slate-900 to-indigo-950/90 border-b border-rose-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">National Blood Bank &amp; Donor Connector</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  OpenStreetMap + ABO/Rh Geolocation
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time donor matchmaking, cross-city blood bank inventories &amp; emergency broadcast
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

        {/* Filter Bar */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase">Required Blood Group:</span>
            {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const).map(grp => (
              <button
                key={grp}
                onClick={() => setSelectedGroup(grp)}
                className={`px-3 py-1 rounded-lg font-black transition ${
                  selectedGroup === grp
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {grp}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setBroadcastSent(true);
              alert(`STAT Emergency Blood Broadcast triggered for group ${selectedGroup}! SMS dispatched to 14 verified donors in 5km radius.`);
            }}
            disabled={broadcastSent}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{broadcastSent ? 'STAT Call Broadcasted' : `Broadcast ${selectedGroup} STAT Call`}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 flex-1 overflow-y-auto">
          {/* Live OpenStreetMap Donor & Bank Mesh */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-rose-400" />
                Live OpenStreetMap Donor Geolocation Grid
              </span>
              <span className="text-[11px] text-rose-300 font-mono">
                Matching Group: {selectedGroup}
              </span>
            </div>
            <OpenStreetMapViewer
              center={[23.7700, 90.3900]}
              zoom={12}
              height="220px"
              markers={donorMarkers}
              circles={donorCircles}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Metropolitan Central Blood Center</span>
              <span className="text-xl font-black text-emerald-400 mt-1 block">8 Bags ({selectedGroup})</span>
              <span className="text-[10px] text-slate-400">Tested &amp; Cross-Matched</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Regional Blood Transfusion Depot</span>
              <span className="text-xl font-black text-emerald-400 mt-1 block">5 Bags ({selectedGroup})</span>
              <span className="text-[10px] text-slate-400">Available 24/7</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Apex Clinical Blood Reserve</span>
              <span className="text-xl font-black text-rose-400 mt-1 block">2 Bags (Low Stock)</span>
              <span className="text-[10px] text-slate-400">Donor mobilization required</span>
            </div>
          </div>

          {/* Matched Donors List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Nearby Compatible Donors ({DONOR_REGISTRY.length})</span>
              <span>Eligibility &amp; Proximity</span>
            </div>

            {DONOR_REGISTRY.map(donor => (
              <div
                key={donor.id}
                className="p-4 rounded-2xl border bg-slate-800/40 border-slate-700 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-black text-base">
                    {donor.bloodGroup}{donor.rhFactor === 'Positive' ? '+' : '-'}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{donor.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-700 text-slate-300">
                        {donor.donorBadge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      {donor.area} • <strong>{donor.distanceKm} km away</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div>
                    {donor.isEligible ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ✓ Eligible to Donate ({donor.lastDonationDaysAgo}d ago)
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Wait {90 - donor.lastDonationDaysAgo} Days
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-teal-300">
                    {donor.contactPhone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Synced with DGHS National Safe Blood Transfusion Program</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close Blood Hub
          </button>
        </div>

      </div>
    </div>
  );
}
