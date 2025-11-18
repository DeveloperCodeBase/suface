import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
  const [language] = useState('فارسی');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [animations, setAnimations] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">مدیریت تنظیمات نمایش و زبان</p>
        <h1 className="page-title mt-2 text-slate-900 dark:text-white">تنظیمات</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="section-title text-slate-800 dark:text-white">ظاهر و زبان</h3>
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span>زبان فعال</span>
              <span className="rounded-full bg-slate-100 px-4 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-white">
                {language}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>انتخاب تم</span>
              <div className="flex gap-2">
                {['light', 'dark'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTheme(mode as 'light' | 'dark')}
                    className={`rounded-full px-4 py-1 text-xs font-semibold ${
                      theme === mode ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {mode === 'light' ? 'روشن' : 'تیره'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="section-title text-slate-800 dark:text-white">نمایش داده</h3>
          <div className="mt-4 space-y-4 text-sm">
            <label className="flex items-center justify-between">
              <span>به‌روزرسانی خودکار</span>
              <input type="checkbox" checked={autoRefresh} onChange={() => setAutoRefresh((prev) => !prev)} />
            </label>
            <label className="flex items-center justify-between">
              <span>انیمیشن نمودارها</span>
              <input type="checkbox" checked={animations} onChange={() => setAnimations((prev) => !prev)} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
