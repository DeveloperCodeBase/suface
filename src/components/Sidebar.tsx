import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiActivity,
  FiAlertTriangle,
  FiDatabase,
  FiGlobe,
  FiHome,
  FiLayers,
  FiSettings,
  FiX
} from 'react-icons/fi';

const navItems = [
  { label: 'داشبورد کلان', icon: <FiHome />, path: '/' },
  { label: 'سد پایلوت', icon: <FiActivity />, path: '/pilot-dam' },
  { label: 'استان سمنان', icon: <FiLayers />, path: '/semnan' },
  { label: 'ملی', icon: <FiGlobe />, path: '/national' },
  { label: 'هشدارها', icon: <FiAlertTriangle />, path: '/alerts' },
  { label: 'داده‌ها و گزارش‌ها', icon: <FiDatabase />, path: '/data' },
  { label: 'تنظیمات', icon: <FiSettings />, path: '/settings' }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const focusableSelectors = 'a[href], button:not([disabled]), [tabindex="0"]';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const focusable = sidebar.querySelectorAll<HTMLElement>(focusableSelectors);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && focusable.length > 1) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }

      if (event.key === 'Escape') {
        onClose();
      }
    };

    sidebar.addEventListener('keydown', handleKeyDown);
    return () => {
      sidebar.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <aside
      ref={sidebarRef}
      tabIndex={-1}
      className={`fixed inset-y-0 right-0 z-40 w-72 max-w-xs transform border-l border-slate-200 bg-white/95 px-5 py-6 shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800 dark:bg-slate-900/95 lg:sticky lg:top-24 lg:flex lg:h-[calc(100vh-96px)] lg:w-72 lg:flex-col lg:overflow-y-auto lg:rounded-[32px] lg:border lg:border-slate-200/70 lg:bg-white/80 lg:px-6 lg:py-8 lg:shadow-sm lg:dark:border-slate-800/70 lg:dark:bg-slate-900/70 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}
      role={isOpen ? 'dialog' : undefined}
      aria-modal={isOpen || undefined}
      aria-label="منوی ناوبری"
    >
      <div className="flex items-center justify-between lg:hidden">
        <p className="menu-title text-slate-700 dark:text-slate-200">منوی اصلی</p>
        <button
          onClick={onClose}
          className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="بستن منو"
        >
          <FiX className="text-lg" />
        </button>
      </div>
      <nav className="mt-4 space-y-1 text-sm font-medium lg:mt-0">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex flex-row-reverse items-center gap-3 rounded-2xl px-4 py-3 text-right transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-500/15 dark:text-brand-100'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`
            }
          >
            <span className="text-xl text-slate-400">{item.icon}</span>
            <span className="menu-item text-base font-semibold leading-6">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
