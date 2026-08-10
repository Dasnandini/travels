"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Loader2, Navigation, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StopMapPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onSelectCoordinates: (data: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
  }) => void;
}

export function StopMapPicker({
  initialLat,
  initialLng,
  onSelectCoordinates,
}: StopMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [lat, setLat] = useState<number>(initialLat || 20.2961);
  const [lng, setLng] = useState<number>(initialLng || 85.8245);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [addressPreview, setAddressPreview] = useState<string | null>(null);

  // Dynamically initialize Leaflet on client side
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Inject Leaflet stylesheet if not already present
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default marker icon issues with Webpack/Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const startLat = initialLat || 20.2961;
      const startLng = initialLng || 85.8245;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current).setView([startLat, startLng], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([startLat, startLng], { draggable: true }).addTo(map);

        marker.on("dragend", async () => {
          const position = marker.getLatLng();
          setLat(position.lat);
          setLng(position.lng);
          await reverseGeocode(position.lat, position.lng);
        });

        map.on("click", async (e: any) => {
          marker.setLatLng(e.latlng);
          setLat(e.latlng.lat);
          setLng(e.latlng.lng);
          await reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      if (data && data.address) {
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
          "";
        const state = data.address.state || "";
        const displayName = data.display_name || "";

        setAddressPreview(displayName);
        onSelectCoordinates({
          latitude,
          longitude,
          address: displayName,
          city,
          state,
        });
      } else {
        onSelectCoordinates({ latitude, longitude });
      }
    } catch {
      onSelectCoordinates({ latitude, longitude });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleConfirmPin = () => {
    onSelectCoordinates({
      latitude: lat,
      longitude: lng,
      address: addressPreview || undefined,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-[#002B66]" />
          <span>Click or drag pin on map to set bus stop location</span>
        </span>
        {isGeocoding && (
          <span className="text-blue-700 font-semibold flex items-center gap-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Resolving location...</span>
          </span>
        )}
      </div>

      {/* Map Canvas Container */}
      <div
        ref={mapContainerRef}
        className="w-full h-64 rounded-2xl border border-slate-200 shadow-inner overflow-hidden z-0"
      />

      {/* Coordinates Status Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div className="space-y-0.5">
          <span className="font-mono font-bold text-slate-900 block">
            Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
          </span>
          {addressPreview && (
            <span className="text-[11px] text-slate-500 truncate max-w-sm block">
              {addressPreview}
            </span>
          )}
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleConfirmPin}
          className="bg-[#002B66] hover:bg-[#001f4d] text-white font-semibold gap-1.5 h-8 text-xs"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Use Location</span>
        </Button>
      </div>
    </div>
  );
}
