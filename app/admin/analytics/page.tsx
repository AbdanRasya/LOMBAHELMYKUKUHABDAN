"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

const monthlyRfqData = [
  { name: 'Jan', count: 120 }, { name: 'Feb', count: 150 }, { name: 'Mar', count: 180 },
  { name: 'Apr', count: 220 }, { name: 'May', count: 260 }, { name: 'Jun', count: 310 },
  { name: 'Jul', count: 350 }, { name: 'Aug', count: 400 }, { name: 'Sep', count: 380 },
  { name: 'Oct', count: 420 }, { name: 'Nov', count: 480 }, { name: 'Dec', count: 550 },
];

const categoryData = [
  { name: 'Bahan Baku', count: 850 },
  { name: 'Kemasan', count: 620 },
  { name: 'Logistik', count: 450 },
  { name: 'Teknologi', count: 320 },
  { name: 'Peralatan', count: 280 },
  { name: 'Jasa', count: 210 },
];

const roleData = [
  { name: 'UMKM', value: 75 },
  { name: 'Company', value: 25 },
];

const acceptanceRateData = [
  { name: 'W1', rate: 45 }, { name: 'W2', rate: 48 }, { name: 'W3', rate: 52 },
  { name: 'W4', rate: 58 }, { name: 'W5', rate: 65 }, { name: 'W6', rate: 68 },
];

const provinceData = [
  { name: 'Jawa Barat', count: 450 },
  { name: 'Jawa Timur', count: 380 },
  { name: 'DKI Jakarta', count: 320 },
  { name: 'Jawa Tengah', count: 280 },
  { name: 'Banten', count: 150 },
];

export default function AdminAnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-[300px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
          <div className="h-[300px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly RFQ Count</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRfqData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart 1 */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories by RFQ</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={false} />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Quotation Acceptance Rate (%)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={acceptanceRateData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="rate" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart 2 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top 5 Provinces by Supplier Count</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={provinceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
