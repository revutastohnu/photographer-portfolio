'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="max-w-4xl space-y-16">
      <div className="space-y-6">
        <motion.div
          className="w-16 h-[2px] bg-foreground"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.h2
          className="text-5xl md:text-7xl font-light tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Привіт!
        </motion.h2>
      </div>

      <motion.div
        className="space-y-8 text-xl md:text-2xl text-foreground/70 leading-relaxed font-light"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p>
          Я Аліна. Фотографую людей — портрети, весілля, всяке різне.
        </p>
        <p>
          Моя фішка — зробити так, щоб тобі було комфортно. Без дивних поз і натягнутих посмішок. 
          Просто ти, як є.
        </p>
        <p>
          Люблю природне світло, мінімалізм і чесні емоції. 
          Щоб через 10 років подивився на фото і сказав: "о, це справді я".
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8 pt-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="space-y-3 group"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-[2px] bg-foreground/20 group-hover:bg-foreground transition-colors duration-300" />
          <h3 className="text-sm font-medium uppercase tracking-wider">Локація</h3>
          <p className="text-foreground/60 text-lg">Київ, Україна</p>
        </motion.div>

        <motion.div
          className="space-y-3 group"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-[2px] bg-foreground/20 group-hover:bg-foreground transition-colors duration-300" />
          <h3 className="text-sm font-medium uppercase tracking-wider">Що знімаю</h3>
          <p className="text-foreground/60 text-lg">Портрети, весілля, editorial</p>
        </motion.div>

        <motion.div
          className="space-y-3 group"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-[2px] bg-foreground/20 group-hover:bg-foreground transition-colors duration-300" />
          <h3 className="text-sm font-medium uppercase tracking-wider">Стиль</h3>
          <p className="text-foreground/60 text-lg">Природньо, мінімально, чесно</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
