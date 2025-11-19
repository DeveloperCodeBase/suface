import React, { useEffect, useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.removeProperty('overflow');
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.removeProperty('overflow');
    };
  }, [sidebarOpen]);

  return (
    <DataProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <Navbar
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          theme={theme}
          onThemeToggle={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          isMenuOpen={sidebarOpen}
        />
        <div className="flex w-full justify-center">
          <div className="relative flex w-full max-w-[1440px] flex-row-reverse gap-0 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {sidebarOpen && (
              <div
                role="presentation"
                className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <main className="flex-1 lg:pr-8">
              <div className="space-y-8">
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
      </div>
    </DataProvider>
  );
};

export default App;
