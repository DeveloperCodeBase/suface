import clsx from 'clsx';
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
  variant: 'desktop' | 'mobile';
  onClose?: () => void;
}

const focusableSelectors = 'a[href], button:not([disabled]), [tabindex="0"]';

const Sidebar: React.FC<SidebarProps> = ({ variant, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== 'mobile') return;
    const container = containerRef.current;
    if (!container) return;

    const focusable = container.querySelectorAll<HTMLElement>(focusableSelectors);
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }

      if (event.key === 'Tab' && focusable.length > 1) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [variant, onClose]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'flex h-full flex-col gap-6 overflow-y-auto bg-white/90 text-slate-700 dark:bg-slate-900/80 dark:text-slate-100',
        variant === 'desktop'
          ? 'w-full px-6 py-8'
          : 'w-full px-5 py-6'
      )}
    >
      {variant === 'mobile' && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">منوی اصلی</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="بستن منو"
          >
            <FiX className="text-lg" />
          </button>
        </div>
      )}
      <nav className="space-y-1 text-sm font-medium">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={variant === 'mobile' ? onClose : undefined}
            className={({ isActive }) =>
              clsx(
                'flex flex-row-reverse items-center gap-3 rounded-2xl px-4 py-3 text-base leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm dark:bg-brand-500/20 dark:text-brand-50'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              )
            }
          >
            <span className="text-xl text-slate-400 dark:text-slate-300">{item.icon}</span>
            <span className="flex-1 text-right font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
