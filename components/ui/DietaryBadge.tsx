'use client';

import type { DietaryTag } from '@/lib/types';

const BADGE_LABELS: Record<DietaryTag, string> = {
  'vegan': 'Vegan',
  'vegetarian': 'Vegetarian',
  'gluten-free': 'Gluten-Free',
  'nut-free': 'Nut-Free',
  'dairy-free': 'Dairy-Free',
  'eggless': 'Eggless',
};

interface DietaryBadgeProps {
  tag: DietaryTag;
  size?: 'sm' | 'md';
}

export default function DietaryBadge({ tag, size = 'sm' }: DietaryBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[10px]'
    : 'px-3 py-1 text-xs';

  return (
    <span
      className={`badge-${tag} inline-block rounded-full font-sans uppercase tracking-wider ${sizeClasses}`}
    >
      {BADGE_LABELS[tag]}
    </span>
  );
}
