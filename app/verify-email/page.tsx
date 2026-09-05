'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyEmailAction } from '@/actions/auth';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2, Sparkles } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      queueMicrotask(() => {
        setStatus('error');
        setMessage('Token tidak ditemukan');
      });
      return;
    }
    verifyEmailAction(token).then(result => {
      if (result.success) { setStatus('success'); setMessage(result.message || 'Email berhasil diverifikasi!'); }
      else { setStatus('error'); setMessage(result.error || 'Token tidak valid'); }
    });
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div>
          <span className="text-xl font-bold text-slate-800">PUSAKA</span>
        </div>
        
        {status === 'loading' && (
          <><Loader2 className="w-16 h-16 text-emerald-600 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-800 mb-2">Memverifikasi Email</h1>
          <p className="text-slate-500">Mohon tunggu sebentar...</p></>
        )}
        {status === 'success' && (
          <><CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Email Terverifikasi!</h1>
          <p className="text-slate-500 mb-6">{message}</p>
          <Link href="/login" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-3 font-semibold transition-colors">Masuk Sekarang</Link></>
        )}
        {status === 'error' && (
          <><XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Verifikasi Gagal</h1>
          <p className="text-slate-500 mb-6">{message}</p>
          <Link href="/register" className="block w-full border border-slate-200 rounded-full py-3 font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Daftar Ulang</Link></>
        )}
      </div>
    </div>
  );
}
