'use client';

import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  minDate: Date;
  maxDate: Date;
}

export default function DatePicker({ selected, onSelect, minDate, maxDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Selected Date Display / Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-0 py-4 border-b-2 border-charcoal/20 font-serif text-2xl text-left text-charcoal focus:outline-none focus:border-crimson transition-colors bg-transparent group"
      >
        {selected ? (
          <span className="text-charcoal">
            {format(selected, 'EEEE, MMMM d, yyyy')}
          </span>
        ) : (
          <span className="text-charcoal/30">Select delivery date</span>
        )}
        <span className="float-right text-crimson/40 group-hover:text-crimson transition-colors">
          {isOpen ? '×' : '▾'}
        </span>
      </button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute z-50 mt-2 bg-pearl border border-charcoal/10 shadow-2xl p-6"
          >
            <style jsx global>{`
              /* Override default blue colors with crimson */
              .rdp {
                --rdp-cell-size: 48px;
                --rdp-accent-color: #8b0000 !important;
                --rdp-background-color: #ffe4e1 !important;
                margin: 0;
                font-family: 'Cormorant Garamond', serif;
              }

              /* Caption styling */
              .rdp-caption {
                padding: 0 0 1.5rem 0;
                margin-bottom: 1rem;
              }

              .rdp-caption_label {
                font-family: 'Cormorant Garamond', serif !important;
                font-size: 1.5rem !important;
                font-weight: 300 !important;
                color: #2c2c2c !important;
                letter-spacing: 0.02em;
              }

              /* Navigation buttons - crimson arrows */
              .rdp-nav_button {
                border-radius: 0 !important;
                border: 1px solid rgba(44, 44, 44, 0.1) !important;
              }

              .rdp-nav_button svg {
                stroke: #8b0000 !important;
                fill: none !important;
              }

              .rdp-nav_button:hover:not([disabled]) {
                background: rgba(139, 0, 0, 0.05) !important;
                border-color: #8b0000 !important;
              }

              /* Day labels */
              .rdp-head_cell {
                font-family: 'Raleway', sans-serif !important;
                font-size: 0.625rem !important;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                color: rgba(44, 44, 44, 0.5) !important;
                font-weight: 400;
              }

              /* Date cells */
              .rdp-cell {
                font-family: 'Cormorant Garamond', serif;
              }

              .rdp-button {
                border-radius: 0 !important;
                font-size: 1.125rem;
                font-weight: 300;
                border: 1px solid transparent !important;
              }

              .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                background: rgba(139, 0, 0, 0.05) !important;
                border-color: rgba(139, 0, 0, 0.2) !important;
              }

              /* Selected date - crimson background */
              .rdp-day_selected .rdp-button {
                background-color: #8b0000 !important;
                color: #fefefe !important;
                font-weight: 400 !important;
              }

              .rdp-day_selected .rdp-button:hover {
                background-color: #6d0000 !important;
              }

              /* Today's date - crimson text */
              .rdp-day_today:not(.rdp-day_selected) .rdp-button {
                font-weight: 400 !important;
                color: #8b0000 !important;
              }

              /* Disabled dates */
              .rdp-day_disabled .rdp-button {
                color: rgba(44, 44, 44, 0.15) !important;
                cursor: not-allowed !important;
              }

              /* Outside month dates */
              .rdp-day_outside .rdp-button {
                color: rgba(44, 44, 44, 0.2) !important;
              }
            `}</style>

            <DayPicker
              mode="single"
              selected={selected}
              onSelect={(date) => {
                onSelect(date);
                setIsOpen(false);
              }}
              disabled={[
                { before: minDate },
                { after: maxDate },
              ]}
              showOutsideDays
              fixedWeeks
            />

            <div className="mt-4 pt-4 border-t border-charcoal/10">
              <p className="font-sans text-xs text-charcoal/50 tracking-wide">
                Minimum 2 days advance notice required
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
