import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Layers, Navigation, ZoomIn, ZoomOut, Compass, Globe, Sparkles } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string; // e.g. 'bg-emerald-500'
  color?: string; // e.g. '#10b981' or '#ef4444'
  iconEmoji?: string; // e.g. '🚑', '🏥', '🩸', '⚠️'
  popupContent?: React.ReactNode | string;
  onClick?: () => void;
}

export interface MapRouteItem {
  id: string;
  coords: [number, number][]; // [lat, lng]
  color?: string;
  weight?: number;
  dashArray?: string;
  opacity?: number;
}

export interface MapCircleItem {
  id: string;
  center: [number, number]; // [lat, lng]
  radiusMeters: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  label?: string;
}

export type MapViewMode = 'liberty' | 'bright' | 'positron' | 'embed';

interface OpenStreetMapViewerProps {
  center: [number, number]; // [lat, lng]
  zoom?: number;
  height?: string | number;
  className?: string;
  markers?: MapMarkerItem[];
  routes?: MapRouteItem[];
  circles?: MapCircleItem[];
  selectedMarkerId?: string;
  onMarkerSelect?: (markerId: string) => void;
  showTileToggle?: boolean;
  defaultStyle?: MapViewMode;
}

export const OpenStreetMapViewer: React.FC<OpenStreetMapViewerProps> = ({
  center,
  zoom = 13,
  height = '360px',
  className = '',
  markers = [],
  routes = [],
  circles = [],
  selectedMarkerId,
  onMarkerSelect,
  showTileToggle = true,
  defaultStyle = 'liberty'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeGroupRef = useRef<L.LayerGroup | null>(null);
  const circleGroupRef = useRef<L.LayerGroup | null>(null);

  const [viewMode, setViewMode] = useState<MapViewMode>(defaultStyle);
  const [is3DMode, setIs3DMode] = useState<boolean>(false);

  // Tile URL resolver - 100% Free, Zero API Key, Zero Watermark
  const getTileUrl = useCallback((mode: MapViewMode) => {
    switch (mode) {
      case 'liberty':
        // High-DPI clean street map with ZERO API KEY and ZERO WATERMARKS (ESRI World Street / OpenFree style)
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
      case 'bright':
        // Official OpenStreetMap Standard (Fast, open, zero watermark)
        return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'positron':
        // Deep Dark Canvas (Zero watermark, night emergency mode)
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
      default:
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (viewMode === 'embed') return;
    if (!mapContainerRef.current) return;

    // Clean up previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Add minimal attribution
    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" style="color:#0ea5e9;font-weight:700;">OpenStreetMap</a> • OpenFreeMap')
      .addTo(map);

    // Initial tile layer
    const tileLayer = L.tileLayer(getTileUrl(viewMode), {
      maxZoom: 19,
      subdomains: 'abcd',
      crossOrigin: true
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer groups
    circleGroupRef.current = L.layerGroup().addTo(map);
    routeGroupRef.current = L.layerGroup().addTo(map);
    markerGroupRef.current = L.layerGroup().addTo(map);

    // CRITICAL: ResizeObserver + multiple timeouts to prevent modal blank white container
    const invalidate = () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      } catch (e) {}
    };

    const timer1 = setTimeout(invalidate, 50);
    const timer2 = setTimeout(invalidate, 250);
    const timer3 = setTimeout(invalidate, 600);
    const timer4 = setTimeout(invalidate, 1200);

    const resizeObserver = new ResizeObserver(() => {
      invalidate();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [viewMode, getTileUrl]);

  // Update tile layer on viewMode switch
  useEffect(() => {
    if (viewMode === 'embed') return;
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileLayer = L.tileLayer(getTileUrl(viewMode), {
      maxZoom: 19,
      subdomains: 'abcd',
      crossOrigin: true
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current.invalidateSize();
  }, [viewMode, getTileUrl]);

  // Sync Center & Zoom
  useEffect(() => {
    if (viewMode === 'embed') return;
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(center, zoom, { animate: true });
    mapInstanceRef.current.invalidateSize();
  }, [center[0], center[1], zoom, viewMode]);

  // Sync Markers
  useEffect(() => {
    if (viewMode === 'embed') return;
    if (!markerGroupRef.current || !mapInstanceRef.current) return;
    markerGroupRef.current.clearLayers();

    markers.forEach(m => {
      const isSelected = selectedMarkerId === m.id;
      const markerColor = m.color || (isSelected ? '#14b8a6' : '#ef4444');

      const iconHtml = `
        <div style="transform: translate(-50%, -100%); cursor: pointer;">
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? `
              <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: ${markerColor}33; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            ` : ''}
            <div style="
              width: 32px; 
              height: 32px; 
              border-radius: 12px; 
              background: ${isSelected ? markerColor : '#0f172a'}; 
              border: 2px solid ${markerColor}; 
              color: white; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 14px; 
              font-weight: 900; 
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
              transition: transform 0.2s;
            ">
              ${m.iconEmoji || '📍'}
            </div>
            <div style="
              position: absolute; 
              bottom: -6px; 
              width: 0; 
              height: 0; 
              border-left: 6px solid transparent; 
              border-right: 6px solid transparent; 
              border-top: 6px solid ${markerColor};
            "></div>
          </div>
          ${m.badge ? `
            <div style="
              position: absolute; 
              top: -8px; 
              right: -10px; 
              background: #047857; 
              color: white; 
              font-size: 8px; 
              font-weight: 800; 
              padding: 2px 4px; 
              border-radius: 6px; 
              border: 1px solid rgba(255,255,255,0.4); 
              white-space: nowrap;
            ">
              ${m.badge}
            </div>
          ` : ''}
        </div>
      `;

      const divIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-osm-pin',
        iconSize: [0, 0]
      });

      const marker = L.marker([m.lat, m.lng], { icon: divIcon })
        .addTo(markerGroupRef.current!);

      marker.on('click', () => {
        if (m.onClick) m.onClick();
        if (onMarkerSelect) onMarkerSelect(m.id);
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4; color: #0f172a; padding: 4px;">
          <div style="font-weight: 800; font-size: 13px; color: #0b0f17; margin-bottom: 2px;">${m.title}</div>
          ${m.subtitle ? `<div style="font-size: 11px; color: #475569;">${m.subtitle}</div>` : ''}
        </div>
      `, {
        closeButton: false,
        offset: [0, -32]
      });
    });
  }, [markers, selectedMarkerId, onMarkerSelect, viewMode]);

  // Sync Routes (Polylines)
  useEffect(() => {
    if (viewMode === 'embed') return;
    if (!routeGroupRef.current) return;
    routeGroupRef.current.clearLayers();

    routes.forEach(r => {
      // Glow underlay
      L.polyline(r.coords, {
        color: r.color || '#14b8a6',
        weight: (r.weight || 4) + 4,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(routeGroupRef.current!);

      // Main line
      L.polyline(r.coords, {
        color: r.color || '#14b8a6',
        weight: r.weight || 4,
        dashArray: r.dashArray,
        opacity: r.opacity || 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(routeGroupRef.current!);
    });
  }, [routes, viewMode]);

  // Sync Circles
  useEffect(() => {
    if (viewMode === 'embed') return;
    if (!circleGroupRef.current) return;
    circleGroupRef.current.clearLayers();

    circles.forEach(c => {
      const circle = L.circle(c.center, {
        radius: c.radiusMeters,
        color: c.color || '#ef4444',
        fillColor: c.fillColor || c.color || '#ef4444',
        fillOpacity: c.fillOpacity ?? 0.18,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(circleGroupRef.current!);

      if (c.label) {
        circle.bindTooltip(c.label, { permanent: false, direction: 'center' });
      }
    });
  }, [circles, viewMode]);

  // Controls Handlers
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
      mapInstanceRef.current.invalidateSize();
    }
  };

  const handleToggle3D = () => {
    setIs3DMode(prev => !prev);
  };

  // Compute OpenStreetMap Embed Iframe URL
  const delta = 0.05;
  const bbox = `${center[1] - delta},${center[0] - delta / 1.5},${center[1] + delta},${center[0] + delta / 1.5}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${center[0]},${center[1]}`;

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#0c1322] ${className} ${
        is3DMode ? 'transform -rotate-x-12 perspective-1000' : ''
      }`}
      style={{ height }}
    >
      {/* View Mode 1: Interactive Leaflet Map Container */}
      {viewMode !== 'embed' ? (
        <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#0c1322]" />
      ) : (
        /* View Mode 2: Official OpenStreetMap Direct Embed Iframe */
        <iframe
          title="OpenStreetMap Official Embed"
          src={embedUrl}
          className="w-full h-full border-0 z-0 bg-[#0c1322]"
          loading="lazy"
        />
      )}

      {/* Style Switcher Pills */}
      {showTileToggle && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-xl">
          <button
            type="button"
            onClick={() => setViewMode('liberty')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
              viewMode === 'liberty'
                ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="OpenFreeMap Liberty Style (Default)"
          >
            <span>🗽</span>
            <span>Liberty</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('bright')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
              viewMode === 'bright'
                ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="OpenFreeMap Bright Style"
          >
            <span>☀️</span>
            <span>Bright</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('positron')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
              viewMode === 'positron'
                ? 'bg-sky-400 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Dark Matter / Positron"
          >
            <span>🪐</span>
            <span className="hidden sm:inline">Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('embed')}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
              viewMode === 'embed'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Embed Live OpenStreetMap"
          >
            <span>🌐</span>
            <span className="hidden sm:inline">Embed</span>
          </button>
        </div>
      )}

      {/* Floating Map Navigation Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 shadow-lg">
        <button
          type="button"
          onClick={handleToggle3D}
          title={is3DMode ? 'Reset 2D Flat View' : '3D Perspective Tilt'}
          className={`p-2 rounded-xl border backdrop-blur-md transition flex items-center justify-center ${
            is3DMode 
              ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-teal-500/30' 
              : 'bg-slate-900/90 hover:bg-slate-800 text-teal-300 border-slate-700'
          }`}
        >
          <Compass className={`w-4 h-4 transition-transform duration-500 ${is3DMode ? 'rotate-45' : ''}`} />
        </button>

        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter Map"
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-teal-300 border border-slate-700 backdrop-blur-md transition flex items-center justify-center"
        >
          <Navigation className="w-4 h-4" />
        </button>

        {viewMode !== 'embed' && (
          <>
            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition flex items-center justify-center"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 backdrop-blur-md transition flex items-center justify-center"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Live Map Watermark Pill */}
      <div className="absolute bottom-2 left-2 z-10 px-2.5 py-1 rounded-lg bg-black/80 border border-white/10 text-[10px] font-mono text-slate-300 backdrop-blur-md flex items-center gap-1.5 pointer-events-none shadow-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-bold text-white">OpenFreeMap</span>
        <span className="text-slate-400">•</span>
        <span className="text-teal-300 font-semibold uppercase">{viewMode}</span>
        <span className="hidden sm:inline text-slate-500">• Embedded Map Ready</span>
      </div>
    </div>
  );
};
