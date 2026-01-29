'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { PhotoSet } from '@/lib/types';
import Image from 'next/image';

interface SetModalProps {
  set: PhotoSet | null;
  onClose: () => void;
}

const placeholderGallery = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&h=1600&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=1600&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=800&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=1600&fit=crop',
];

export default function SetModal({ set, onClose }: SetModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (set) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeButtonRef.current?.focus(), 100);
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [set]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (!modalRef.current || !set) return;
      
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('keydown', handleTab);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('keydown', handleTab);
    };
  }, [onClose, set]);

  const handleBookThisStyle = () => {
    onClose();
    setTimeout(() => {
      const element = document.getElementById('booking');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  if (!set) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/98 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className="fixed inset-0 z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="min-h-screen px-6 md:px-12 lg:px-24 py-24 flex items-start justify-center">
              <motion.div
                className="w-full max-w-6xl"
                initial={{ scale: 0.9, y: 60 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 60 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Close Button */}
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  className="fixed top-8 right-8 w-12 h-12 rounded-full bg-foreground text-background hover:scale-110 flex items-center justify-center transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-foreground/40 z-10"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Header */}
                <div className="mb-16 text-center">
                  <motion.h2
                    id="modal-title"
                    className="text-5xl md:text-7xl font-light tracking-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {set.title}
                  </motion.h2>
                </div>

                {/* Gallery - Masonry style */}
                <div className="columns-1 md:columns-2 gap-6 space-y-6 mb-16">
                  {placeholderGallery.map((image, index) => (
                    <motion.div
                      key={index}
                      className="break-inside-avoid"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + index * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div className="relative overflow-hidden rounded-xl group cursor-pointer" data-cursor="hover">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <Image
                            src={image}
                            alt={`${set.title} image ${index + 1}`}
                            width={1200}
                            height={index % 2 === 0 ? 1600 : 800}
                            className="w-full h-auto"
                            unoptimized
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.button
                    onClick={handleBookThisStyle}
                    className="px-12 py-5 rounded-full bg-foreground text-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/40 relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Book this style</span>
                    <motion.div
                      className="absolute inset-0 bg-foreground/80"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
