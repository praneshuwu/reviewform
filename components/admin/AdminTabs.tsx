'use client';

import { motion } from 'framer-motion';

interface AdminTabsProps {
  activeTab: 'reviews' | 'menu';
  onTabChange: (tab: 'reviews' | 'menu') => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = [
    { id: 'reviews' as const, label: 'Reviews' },
    { id: 'menu' as const, label: 'Menu' },
  ];

  return (
    <div className="flex gap-0 border-b border-charcoal/10 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] transition-colors ${
            activeTab === tab.id
              ? 'text-crimson'
              : 'text-charcoal/50 hover:text-charcoal/80'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="admin-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-crimson"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
