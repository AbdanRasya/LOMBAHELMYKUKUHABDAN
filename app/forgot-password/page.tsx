'use client';
import { useState } from 'react';
import { forgotPasswordAction } from '@/actions/auth';
import Link from 'next/link';
import { Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await forgotPasswordAction(email);
    setLoading(false);
    if (result.success) setSent(true);
    else setError(result.error || 'Terjadi kesalahan');
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
          <span className="text-xl font-bold text-slate-800">PUSAKA</span>
        </div>
        {sent ? (
          <div className="text-center">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Email Terkirim!</h1>
            <p className="text-slate-500 mb-6">Cek inbox email Anda untuk link reset password. Link valid selama 1 jam.</p>
            <Link href="/login" className="text-emerald-600 font-medium hover:underline">Kembali ke Login</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Lupa Password?</h1>
            <p className="text-slate-500 mb-6">Masukkan email Anda dan kami akan kirimkan link untuk reset password.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@perusahaan.com" required className="mt-1" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700">
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/login" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
