"use client";
import { useState, useEffect } from "react";
import { Tag, Plus, Edit2, Trash2, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  _count: {
    products: number;
    rfqs: number;
  };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        toast.success("Kategori berhasil ditambahkan");
        setName("");
        setDescription("");
        setOpen(false);
        fetchCategories();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola Kategori</h1>
          <p className="text-sm text-slate-500">Buat dan atur kategori produk/jasa industri di platform</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="bg-slate-900 hover:bg-slate-800 text-white gap-2 inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-4 py-2 transition-colors">
            <Plus className="h-4 w-4" /> Tambah Kategori
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kategori Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid gap-1.5">
                <Label htmlFor="catName">Nama Kategori</Label>
                <Input id="catName" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Bahan Bangunan" required />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="catDesc">Deskripsi</Label>
                <Input id="catDesc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Deskripsi singkat kategori..." />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Buat Kategori
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-xs text-slate-400">Total Kategori</p><p className="text-2xl font-bold">{categories.length}</p></div>
            <Tag className="h-8 w-8 text-blue-600 opacity-20" />
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-slate-900" /></div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>RFQ</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold">{c.name}</TableCell>
                    <TableCell className="font-mono text-xs">{c.slug}</TableCell>
                    <TableCell className="max-w-xs truncate">{c.description || "-"}</TableCell>
                    <TableCell>{c._count.products}</TableCell>
                    <TableCell>{c._count.rfqs}</TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleDateString("id-ID")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
