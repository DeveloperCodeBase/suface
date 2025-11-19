import { FiBell, FiGlobe, FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import React from 'react';

interface NavbarProps {
  onMenuClick: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  isMenuOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, theme, onThemeToggle, isMenuOpen }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex w-full flex-row-reverse items-center justify-between gap-3 text-right sm:w-auto sm:flex-row">
          <div className="leading-tight">
            <p className="text-sm font-semibold text-brand-600 sm:text-base">شبکه هوشمند ابتکار ویستا</p>
            <p className="text-xs text-slate-500 sm:text-sm">سامانه هوشمند پایش و پیش‌بینی سدهای استان سمنان</p>
          </div>
          <button
            onClick={onMenuClick}
            className="order-first rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={isMenuOpen}
          >
            <FiMenu className="text-xl" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 text-sm text-slate-600 dark:text-slate-100 sm:gap-4">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700">
            <FiGlobe className="text-base" />
            <span>فارسی</span>
          </div>
          <button
            onClick={onThemeToggle}
            className="rounded-full border border-slate-200 p-2 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="تغییر تم"
          >
            {theme === 'light' ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
          </button>
          <button className="relative rounded-full border border-slate-200 p-2 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:hover:bg-slate-800">
            <FiBell className="text-lg" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500"></span>
          </button>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-100 sm:text-sm">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600"></div>
            <span>کاربر نمونه</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
