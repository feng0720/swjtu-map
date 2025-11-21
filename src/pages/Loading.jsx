import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Loading() {
  const navigate = useNavigate();
  const name = localStorage.getItem('userName') || '';
  const language = localStorage.getItem('language') || 'zh';

  useEffect(() => {
    const t = setTimeout(() => {
      navigate('/main');
    }, 2000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-cyan-400 via-sky-200 to-indigo-200 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 900 200" className="w-[720px] h-[160px]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="blueGrad" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="white" />
            </linearGradient>
            <mask id="reveal">
              <rect x="0" y="0" width="0%" height="100%" fill="#fff" className="reveal-rect" />
            </mask>
          </defs>

          {/* Outline text (visible before fill) */}
          <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="800" fontSize="140" fill="none" stroke="#0f172a" strokeWidth="6">
            SWJTU
          </text>

          {/* Filled text masked by animated rect */}
          <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="800" fontSize="140" fill="url(#blueGrad)" mask="url(#reveal)">
            SWJTU
          </text>

          <style>{`
            .reveal-rect {
              animation: revealAnim 1.05s ease-in-out forwards;
            }
            @keyframes revealAnim {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </svg>

        <div className="text-center text-lg font-medium text-gray-800 dark:text-gray-100">
          {language === 'zh' ? `欢迎，${name}` : `Welcome, ${name}`}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">{language === 'zh' ? '正在载入，请稍候...' : 'Loading, please wait...'}</div>
      </div>
    </div>
  );
}
