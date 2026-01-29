'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-auto ${
        isScrolled ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-5 flex items-center justify-between pointer-events-auto">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            href="/" 
            className={`text-xl md:text-2xl font-light tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-foreground' : 'text-white'
            }`}
          >
            Alina Gnusina
          </Link>
        </motion.div>

        {/* Modern Navigation - horizontal menu items */}
        <div className="flex items-center gap-6 md:gap-10 lg:gap-12">
          <motion.button
            onClick={() => scrollToSection('portfolio')}
            className={`text-sm md:text-base font-light transition-all duration-300 relative group whitespace-nowrap ${
              isScrolled ? 'text-foreground/80 hover:text-foreground' : 'text-white/90 hover:text-white'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Роботи
            <motion.div 
              className={`absolute -bottom-1 left-0 right-0 h-[1px] origin-left ${
                isScrolled ? 'bg-foreground' : 'bg-white'
              }`}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <motion.button
            onClick={() => scrollToSection('about')}
            className={`text-sm md:text-base font-light transition-all duration-300 relative group whitespace-nowrap ${
              isScrolled ? 'text-foreground/80 hover:text-foreground' : 'text-white/90 hover:text-white'
            }`}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Про мене
            <motion.div 
              className={`absolute -bottom-1 left-0 right-0 h-[1px] origin-left ${
                isScrolled ? 'bg-foreground' : 'bg-white'
              }`}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <motion.button
            onClick={() => scrollToSection('booking')}
            className={`text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full font-light transition-all duration-300 ${
              isScrolled 
                ? 'bg-foreground text-background hover:bg-foreground/90' 
                : 'bg-white text-black hover:bg-white/90'
            }`}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            Записатись
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
