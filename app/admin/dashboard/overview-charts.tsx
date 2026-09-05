"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", UMKM: 12, Company: 4 },
  { name: "Feb", UMKM: 18, Company: 7 },
  { name: "Mar", UMKM: 22, Company: 10 },
  { name: "Apr", UMKM: 30, Company: 15 },
  { name: "Mei", UMKM: 45, Company: 18 },
  { name: "Jun", UMKM: 55, Company: 22 },
];

export default function AdminOverviewCharts() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-[230px] w-full bg-slate-50 animate-pulse rounded-xl" />;
  }

  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="UMKM" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Company" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
