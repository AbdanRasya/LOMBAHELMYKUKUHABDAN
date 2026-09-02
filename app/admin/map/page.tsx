"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Dynamically import the map component with SSR disabled
const MapComponent = dynamic(() => import('@/components/admin/supply-gap-map'), { 
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-slate-100 rounded-lg animate-pulse">
      <p className="text-muted-foreground">Loading Map Data...</p>
    </div>
  )
});

export default function AdminMapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Supply Gap Map</h1>
        <p className="text-muted-foreground">Visualize regions with high demand but low supplier coverage.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Map</CardTitle>
          <CardDescription>Opportunity score indicates areas that need more suppliers (Red = High Opportunity).</CardDescription>
        </CardHeader>
        <CardContent>
          <MapComponent />
        </CardContent>
      </Card>
    </div>
  );
}
