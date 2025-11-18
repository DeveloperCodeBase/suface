import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiActivity, FiAlertTriangle, FiDatabase, FiGlobe, FiHome, FiLayers, FiSettings } from 'react-icons/fi';

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
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside
      className={`fixed inset-y-0 right-0 z-40 w-64 transform border-l border-slate-200 bg-white/95 px-4 py-6 shadow-lg transition-transform dark:border-slate-800 dark:bg-slate-900/95 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      }`}
    >
      <nav className="space-y-1 text-sm font-medium">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl px-4 py-3 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-100'
                  : 'text-slate-600 dark:text-slate-200'
              }`
            }
          >
            <span className="text-base">{item.label}</span>
            <span className="text-lg text-slate-400">{item.icon}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
