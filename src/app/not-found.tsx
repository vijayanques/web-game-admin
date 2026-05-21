"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full px-6 py-10 sm:px-10 sm:py-12 bg-slate-900/70 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-700 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 font-[nunito]">404</div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-semibold font-[nunito]">Page not found</h1>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto md:mx-0 font-[nunito]">We couldn't find the page you're looking for. It may have moved or never existed.</p>

            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center md:justify-start gap-3">
              <Link href="/" className="inline-flex items-center justify-center px-5 py-3 min-w-[120px] bg-gradient-to-br from-purple-600 to-pink-600 hover:opacity-95 text-white rounded-full font-medium font-[nunito]">Home</Link>
              <button
                onClick={() => router.back()}
                className="inline-flex cursor-pointer items-center justify-center px-5 py-3 min-w-[120px] border border-slate-700 text-slate-200 rounded-full hover:bg-slate-800 font-[nunito]"
              >
                Go back
              </button>
              <Link href="/bug-reports" className="inline-flex items-center justify-center px-5 py-3 min-w-[140px] text-slate-200 border border-slate-700 rounded-full hover:bg-slate-800 font-[nunito]">Report an issue</Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 bg-gradient-to-br from-purple-700/20 to-pink-600/10 rounded-3xl flex items-center justify-center text-pink-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="140" height="140" className="opacity-95">
                <rect x="6" y="18" width="52" height="28" rx="6" fill="#0f172a" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="22" cy="32" r="5" fill="currentColor" />
                <g transform="translate(38,28)">
                  <rect x="-1" y="-6" width="2" height="4" rx="1" fill="currentColor" />
                  <rect x="5" y="-1" width="2" height="2" rx="0.5" fill="currentColor" />
                </g>
                <path d="M18 42c2 2 6 3 14 3s12-1 14-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
