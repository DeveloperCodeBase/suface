import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OverviewPage from './pages/OverviewPage';
import DamDetailPage from './pages/DamDetailPage';
import SemnanPage from './pages/SemnanPage';
import NationalPage from './pages/NationalPage';
import AlertsPage from './pages/AlertsPage';
import DataPage from './pages/DataPage';
import SettingsPage from './pages/SettingsPage';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', 'fa');
    document.documentElement.setAttribute('dir', 'rtl');
  }, []);

  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isNavOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNavOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.removeProperty('overflow');
    };
  }, [isNavOpen]);

  const isBrowser = typeof document !== 'undefined';

  return (
    <DataProvider>
      <div className="isolate min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white" dir="rtl">
        <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
          <aside className="sticky top-0 hidden h-screen w-72 flex-shrink-0 flex-col border-l border-slate-200/70 bg-white/85 backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/70 lg:flex">
            <Sidebar variant="desktop" />
          </aside>

          <div className="flex min-h-screen flex-1 flex-col bg-transparent" style={{ minWidth: 0 }}>
            <Navbar
              onMenuClick={() => setIsNavOpen((prev) => !prev)}
              theme={theme}
              onThemeToggle={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              isMenuOpen={isNavOpen}
            />
            <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-10">
                <Routes>
                  <Route path="/" element={<OverviewPage />} />
                  <Route path="/pilot-dam" element={<DamDetailPage />} />
                  <Route path="/semnan" element={<SemnanPage />} />
                  <Route path="/national" element={<NationalPage />} />
                  <Route path="/alerts" element={<AlertsPage />} />
                  <Route path="/data" element={<DataPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
        {isNavOpen && isBrowser
          ? createPortal(
              <>
                <div
                  role="presentation"
                  className="fixed inset-0 z-[9998] bg-slate-950/60 backdrop-blur-sm lg:hidden"
                  onClick={() => setIsNavOpen(false)}
                />
                <aside className="fixed inset-y-0 right-0 z-[9999] flex w-72 flex-col border-l border-slate-200/70 bg-white/95 shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:hidden">
                  <Sidebar variant="mobile" onClose={() => setIsNavOpen(false)} />
                </aside>
              </>,
              document.body
            )
          : null}
      </div>
    </DataProvider>
  );
};

export default App;
