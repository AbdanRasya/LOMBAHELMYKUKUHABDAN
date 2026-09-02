import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Package, Plus, Calendar, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function formatRp(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default async function UMKMProductsPage() {
  const session = await auth();
  const umkm = session?.user?.id
    ? await db.umkmProfile.findUnique({ where: { userId: session.user.id } })
    : null;

  const products = umkm
    ? await db.product.findMany({
        where: { umkmId: umkm.id },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Produk & Layanan</h1>
          <p className="text-sm text-slate-500 mt-1">{products.length} produk terdaftar</p>
        </div>
        <Link href="/umkm/profile">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"><Plus className="h-4 w-4" />Tambah Produk</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="py-20 text-center">
          <Package className="mx-auto h-14 w-14 text-slate-200 mb-4" />
          <h3 className="font-semibold text-slate-700">Belum ada produk</h3>
          <p className="text-sm text-slate-500 mt-1 mb-5">Tambahkan produk untuk meningkatkan skor kesiapan bisnis Anda.</p>
          <Link href="/umkm/profile"><Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Tambah Produk Sekarang</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map(p => (
            <Card key={p.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className={`h-1.5 ${p.isActive ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-slate-200"}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                    <Package className="h-5 w-5 text-emerald-600" />
                  </div>
                  <Badge variant={p.isActive ? "default" : "secondary"} className={`text-xs shrink-0 ${p.isActive ? "bg-emerald-100 text-emerald-700" : ""}`}>
                    {p.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                <h3 className="font-semibold text-slate-900 mt-3">{p.name}</h3>
                {p.category && <Badge variant="outline" className="text-xs mt-1">{p.category.name}</Badge>}
                {p.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{p.description}</p>}

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {p.unit && <div className="flex items-center gap-1 text-slate-500"><Layers className="h-3 w-3" />Satuan: {p.unit}</div>}
                  {p.minOrder && <div className="text-slate-500">Min Order: {p.minOrder}</div>}
                  {p.maxCapacity && <div className="text-slate-500">Kapasitas: {p.maxCapacity}</div>}
                  {p.leadTimeDays && <div className="flex items-center gap-1 text-slate-500"><Calendar className="h-3 w-3" />{p.leadTimeDays} hari</div>}
                </div>

                {(p.priceMin || p.priceMax) && (
                  <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2">
                    <p className="text-xs text-emerald-600 font-semibold">
                      {p.priceMin ? formatRp(p.priceMin) : ""}{p.priceMax ? ` – ${formatRp(p.priceMax)}` : ""}
                      {p.unit ? ` / ${p.unit}` : ""}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
