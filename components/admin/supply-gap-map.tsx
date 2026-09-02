"use client";

import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cityData = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456, region: "Jawa", suppliers: 450, demand: 95, opportunity: 30 },
  { name: "Surabaya", lat: -7.2504, lng: 112.7688, region: "Jawa", suppliers: 280, demand: 88, opportunity: 45 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191, region: "Jawa", suppliers: 195, demand: 80, opportunity: 55 },
  { name: "Medan", lat: 3.5952, lng: 98.6722, region: "Sumatra", suppliers: 120, demand: 70, opportunity: 65 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327, region: "Sulawesi", suppliers: 85, demand: 65, opportunity: 72 },
  { name: "Semarang", lat: -6.9667, lng: 110.4167, region: "Jawa", suppliers: 110, demand: 72, opportunity: 60 },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695, region: "Jawa", suppliers: 90, demand: 68, opportunity: 63 },
  { name: "Palembang", lat: -2.9761, lng: 104.7565, region: "Sumatra", suppliers: 65, demand: 60, opportunity: 78 },
  { name: "Balikpapan", lat: -1.2379, lng: 116.8529, region: "Kalimantan", suppliers: 45, demand: 55, opportunity: 82 },
  { name: "Manado", lat: 1.4827, lng: 124.8436, region: "Sulawesi", suppliers: 20, demand: 45, opportunity: 90 },
];

const regions = ["All", "Jawa", "Sumatra", "Kalimantan", "Sulawesi", "Papua"];

export default function SupplyGapMap() {
  const [filter, setFilter] = useState("All");

  const filteredData = filter === "All" 
    ? cityData 
    : cityData.filter(city => city.region === filter);

  // Helper to get color based on opportunity score
  const getColor = (score: number) => {
    if (score >= 80) return "#ef4444"; // Red (High opportunity)
    if (score >= 60) return "#f97316"; // Orange
    if (score >= 40) return "#eab308"; // Yellow
    return "#22c55e"; // Green (Low opportunity/Well covered)
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <Button
            key={region}
            variant={filter === region ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(region)}
          >
            {region}
          </Button>
        ))}
      </div>

      {/* Map */}
      <div className="h-[600px] w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={[-2.5, 118]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredData.map((city, idx) => (
            <CircleMarker
              key={idx}
              center={[city.lat, city.lng]}
              radius={Math.max(10, city.suppliers / 15)}
              pathOptions={{
                color: getColor(city.opportunity),
                fillColor: getColor(city.opportunity),
                fillOpacity: 0.7,
                weight: 1
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{city.name}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Suppliers:</span>
                      <span className="font-medium">{city.suppliers}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Demand Score:</span>
                      <span className="font-medium">{city.demand}/100</span>
                    </div>
                    <div className="flex justify-between gap-4 items-center mt-2 pt-2 border-t">
                      <span className="text-muted-foreground">Opportunity:</span>
                      <Badge style={{ backgroundColor: getColor(city.opportunity) }} className="text-white">
                        {city.opportunity}/100
                      </Badge>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm mt-4 p-4 bg-slate-50 rounded-lg">
        <span className="font-semibold">Legend (Opportunity Score):</span>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div> &ge; 80 (High)</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#f97316]"></div> 60 - 79</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#eab308]"></div> 40 - 59</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#22c55e]"></div> &lt; 40 (Low/Covered)</div>
        <div className="ml-auto text-muted-foreground text-xs italic">Circle size represents supplier count</div>
      </div>
    </div>
  );
}
