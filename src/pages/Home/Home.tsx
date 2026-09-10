import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// ---------- Data contoh: listing properti dengan harga ----------
const LISTINGS = [
  { lat: -7.5540, lng: 110.8050, price: "Rp1jt" },
  { lat: -7.5555, lng: 110.8075, price: "Rp1,4jt" },
  { lat: -7.5565, lng: 110.8060, price: "Rp950rb" },
  { lat: -7.5580, lng: 110.8090, price: "Rp2,1jt" },

  { lat: -7.5620, lng: 110.8200, price: "Rp1,2jt" },
  { lat: -7.5635, lng: 110.8215, price: "Rp1,8jt" },
  { lat: -7.5610, lng: 110.8230, price: "Rp1,1jt" },

  { lat: -7.5700, lng: 110.8100, price: "Rp3jt" },
  { lat: -7.5715, lng: 110.8115, price: "Rp2,5jt" },

  { lat: -7.5480, lng: 110.8180, price: "Rp1,6jt" },
  { lat: -7.5460, lng: 110.8160, price: "Rp1,3jt" },
  { lat: -7.5470, lng: 110.8195, price: "Rp900rb" },
  { lat: -7.5490, lng: 110.8210, price: "Rp1,7jt" },
  { lat: -7.5455, lng: 110.8145, price: "Rp2,2jt" },
];

const CENTER: LatLngTuple = [-7.5606, 110.8132]; // area Solo
const ZOOM = 13;

export function Home() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Hindari re-init kalau komponen re-render
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current).setView(CENTER, ZOOM);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map);

      const clusterGroup = L.markerClusterGroup({
        maxClusterRadius: 60,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          let sizeClass = "mc-small";
          let size = 38;
          if (count >= 10) {
            sizeClass = "mc-large";
            size = 54;
          } else if (count >= 5) {
            sizeClass = "mc-medium";
            size = 46;
          }
          return L.divIcon({
            html: `<div class="cluster-icon">${count}</div>`,
            className: sizeClass,
            iconSize: L.point(size, size),
          });
        },
      });

      LISTINGS.forEach((item) => {
        const icon = L.divIcon({
          className: "",
          html: `<div class="price-pill">${item.price}</div>`,
          iconAnchor: [30, 15],
        });
        const marker = L.marker([item.lat, item.lng] as LatLngTuple, { icon });
        marker.bindPopup(`Harga: <b>${item.price}</b>`);
        clusterGroup.addLayer(marker);
      });

      map.addLayer(clusterGroup);

      map.whenReady(() => {
        setStatus("ready");
      });
    } catch (err) {
      console.error("Gagal memuat peta:", err);
      queueMicrotask(() => {
        setStatus("error");
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <style>{`
        .price-pill {
          background: #fff;
          color: #2563eb;
          font-weight: 700;
          font-size: 13px;
          padding: 6px 12px;
          border-radius: 999px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          white-space: nowrap;
          text-align: center;
          border: 2px solid #fff;
        }
        .cluster-icon {
          background: #fff;
          color: #111;
          font-weight: 700;
          font-size: 14px;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          border: 2px solid #fff;
        }
        .mc-small .cluster-icon { background: #e0edff; }
        .mc-medium .cluster-icon { background: #bcd6ff; }
        .mc-large .cluster-icon { background: #93bbff; }
        .leaflet-container { background: #e5e7eb; font-family: inherit; }
      `}</style>

      <div ref={mapContainerRef} className="absolute inset-0 z-0" />

      <div className="absolute top-3.5 left-3.5 z-[1000] bg-slate-900/95 border border-slate-700 rounded-2xl px-4 py-3.5 max-w-[250px] shadow-xl">
        <h3 className="text-sm font-semibold mb-1.5">🏘️ Cluster Harga Properti</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Zoom out untuk lihat total listing per area (bulat angka). Zoom in untuk lihat harga tiap unit.
        </p>
      </div>

      {status === "loading" && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-slate-950/70 pointer-events-none">
          <span className="text-sm text-slate-300">Memuat peta...</span>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-slate-950/85">
          <span className="text-sm text-red-400">Gagal memuat Leaflet. Cek koneksi internet lalu refresh.</span>
        </div>
      )}
    </div>
  );
}