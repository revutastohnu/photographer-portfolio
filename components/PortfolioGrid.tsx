'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PhotoSession } from '@/lib/types';
import SetModal from './SetModal';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface PortfolioGridProps {
  sets: PhotoSession[];
}

function ImageCarousel({ images, isHovered }: { images: string[]; isHovered: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2000); // Змінюємо кожні 2 секунди

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt="Portfolio image"
            fill
            className="object-cover"
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {/* Індикатори */}
      {isHovered && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-8 bg-white' : 'w-1 bg-white/50'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PortfolioGrid({ sets }: PortfolioGridProps) {
  const [selectedSet, setSelectedSet] = useState<PhotoSession | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const setSlug = searchParams.get('set');
    if (setSlug) {
      const set = sets.find((s) => s.slug === setSlug);
      if (set) {
        setSelectedSet(set);
      }
    }
  }, [searchParams, sets]);

  const openSetModal = (set: PhotoSession) => {
    setSelectedSet(set);
    router.push(`?set=${set.slug}`, { scroll: false });
  };

  const closeSetModal = () => {
    setSelectedSet(null);
    router.push('/', { scroll: false });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sets.map((set, index) => {
          // Використовуємо реальні фото з сесії
          const images = set.images.map(img => img.url);
          const isHovered = hoveredIndex === index;

          // Якщо немає фото, пропускаємо цю сесію
          if (images.length === 0) return null;

          return (
            <motion.button
              key={set.slug}
              onClick={() => openSetModal(set)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative text-left"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {/* Назва фотосесії */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
              >
                <h3 className="text-2xl md:text-3xl font-light tracking-tight">
                  {set.titleUk}
                </h3>
                <p className="text-sm text-foreground/60 mt-1">{set.year} • {set.locationUk}</p>
              </motion.div>

              {/* Карусель фото */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-200" data-cursor="hover">
                <motion.div
                  animate={{
                    scale: isHovered ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                >
                  <ImageCarousel images={images} isHovered={isHovered} />
                </motion.div>

                {/* Оверлей при hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-black/20 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: isHovered ? 1 : 0.8,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-white text-sm font-medium"
                  >
                    Відкрити цю фотосесію
                  </motion.div>
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <SetModal set={selectedSet} onClose={closeSetModal} />
    </>
  );
}
