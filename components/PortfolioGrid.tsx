'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PhotoSet } from '@/lib/types';
import SetModal from './SetModal';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface PortfolioGridProps {
  sets: PhotoSet[];
}

// Placeholder images для кожного сету (по 4-5 фото)
const placeholderSets = [
  [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=800&h=1000&fit=crop',
  ],
  [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&h=1000&fit=crop',
  ],
];

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
      {isHovered && (
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
  const [selectedSet, setSelectedSet] = useState<PhotoSet | null>(null);
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

  const openSetModal = (set: PhotoSet) => {
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
          const images = placeholderSets[index % placeholderSets.length];
          const isHovered = hoveredIndex === index;

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
                  {set.title}
                </h3>
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
