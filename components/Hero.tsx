'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';

export default function Hero() {
  const ref = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    mouseX.set(x);
    mouseY.set(y);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
        data-cursor="hover"
      >
        <Image
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&h=1080&fit=crop"
          alt="Hero background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      </motion.div>

      {/* Ukrainian-inspired decorative elements */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" xmlns="http://www.w3.org/2000/svg">
        {/* Тонкі лінії з українськими мотивами */}
        <motion.path
          d="M 0,200 Q 400,150 800,200 T 1600,200"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M 1920,400 Q 1500,350 1200,400 T 600,400"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3.5, delay: 0.5, ease: "easeInOut" }}
        />
        
        {/* Мінімалістичні кола */}
        <circle cx="120" cy="120" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
        <circle cx="120" cy="120" r="30" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none" />
        
        <rect x="1700" y="500" width="50" height="50" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" transform="rotate(45 1725 525)" />
      </svg>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 px-6 md:px-12 lg:px-24 text-center max-w-6xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1
            className="text-7xl md:text-9xl lg:text-[12rem] font-light tracking-tighter mb-6 leading-none"
            style={{
              x: useTransform(mouseXSpring, (value) => value * 0.3),
              y: useTransform(mouseYSpring, (value) => value * 0.3),
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 8px 40px rgba(0,0,0,0.6)',
              WebkitTextFillColor: '#ffffff',
            }}
          >
            Alina
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="text-2xl md:text-3xl text-white/90 font-light mb-12"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            фотографую так, щоб ти впізнавав себе
          </motion.p>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-6 justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.button
            onClick={() => scrollToSection('portfolio')}
            className="group px-12 py-6 rounded-full bg-white text-black text-base font-medium relative overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10">Дивитись роботи</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-stone-100 to-stone-200"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </motion.button>

          <motion.button
            onClick={() => scrollToSection('booking')}
            className="px-12 py-6 rounded-full border-2 border-white/80 text-white text-base font-medium backdrop-blur-md bg-white/5 relative overflow-hidden group shadow-xl"
            whileHover={{ scale: 1.05, y: -2, borderColor: 'rgba(255,255,255,1)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative z-10">Записатись</span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            <motion.span
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-black z-20"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Записатись
            </motion.span>
          </motion.button>
        </motion.div>

      </motion.div>
    </section>
  );
}
