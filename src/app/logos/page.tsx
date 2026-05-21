'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Redirect legacy Logo Management route to Settings */
export default function LogosRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <p className="text-slate-400 font-[nunito]">Redirecting to Settings…</p>
    </div>
  );
}
