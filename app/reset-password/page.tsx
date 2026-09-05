'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resetPasswordAction } from '@/actions/auth';
import Link from 'next/link';
import { Sparkles, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Password tidak cocok'); return; }
    if (password.length < 8) { setError('Password minimal 8 karakter'); return; }
    setLoading(true); setError('');
    const result = await resetPasswordAction(token, password);
    setLoading(false);
    if (result.success) setSuccess(true);
    else setError(result.error || 'Terjadi kesalahan');
  };
  
  if (!token) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
        <p className="text-red-500">Token tidak valid.</p>
        <Link href="/forgot-password" className="mt-4 block text-emerald-600 hover:underline">Minta link baru</Link>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
          <span className="text-xl font-bold text-slate-800">PUSAKA</span>
        </div>
        {success ? (
          <div className="text-center">
            <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Password Berhasil Diubah!</h1>
            <p className="text-slate-500 mb-6">Silakan login dengan password baru Anda.</p>
            <Link href="/login" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-3 font-semibold text-center transition-colors">Masuk Sekarang</Link>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center"><Lock className="w-5 h-5 text-emerald-600" /></div>
              <div><h1 className="text-xl font-bold text-slate-800">Buat Password Baru</h1><p className="text-sm text-slate-500">Minimal 8 karakter</p></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Password Baru</Label>
                <div className="relative mt-1">
                  <Input id="password" type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirm">Konfirmasi Password</Label>
                <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="mt-1" />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700">
                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
