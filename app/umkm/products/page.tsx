import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Package, Plus, Calendar, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AddProductDialog from "@/components/products/add-product-dialog";

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Produk & Layanan B2B</h1>
          <p className="text-sm text-slate-500 mt-1">{products.length} produk terdaftar di katalog sourcing</p>
        </div>
        <AddProductDialog />
      </div>

      {products.length === 0 ? (
        <div className="py-16 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm max-w-2xl mx-auto my-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Belum Ada Produk Terdaftar</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
            Tambahkan produk atau bahan baku olahan Anda secara langsung ke katalog sourcing agar dapat ditemukan oleh pembeli &amp; perusahaan.
          </p>
          <div className="mt-6 flex justify-center">
            <AddProductDialog
              trigger={
                <button type="button" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-emerald-600/20 text-sm inline-flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer border-0">
                  <Plus className="h-5 w-5" /> Tambah Produk Sekarang (Langsung)
                </button>
              }
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => {
            const hasImage = p.images && p.images.length > 0 && p.images[0];
            return (
              <Card key={p.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                <div className={`h-1.5 ${p.isActive ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-slate-200"}`} />
                {hasImage && (
                  <div className="h-36 w-full relative bg-slate-100 overflow-hidden border-b border-slate-100">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div>
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
