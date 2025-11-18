import { FiBell, FiGlobe, FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import React from 'react';

interface NavbarProps {
  onMenuClick: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, theme, onThemeToggle }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 text-right">
          <button
            onClick={onMenuClick}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label="باز کردن منو"
          >
            <FiMenu className="text-xl" />
          </button>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-brand-600 sm:text-base">شبکه هوشمند ابتکار ویستا</p>
            <p className="text-xs text-slate-500 sm:text-sm">سامانه هوشمند پایش و پیش‌بینی سدهای استان سمنان</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-100">
            <FiGlobe className="text-base" />
            <span>فارسی</span>
          </div>
          <button
            onClick={onThemeToggle}
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            aria-label="تغییر تم"
          >
            {theme === 'light' ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
          </button>
          <button className="relative rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            <FiBell className="text-lg" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500"></span>
          </button>
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:flex">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600"></div>
            <span>کاربر نمونه</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
