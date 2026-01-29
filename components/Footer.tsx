'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-24 py-12 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <motion.p
          className="text-sm text-foreground/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          © 2024 Alina Gnusina
        </motion.p>
        <div className="flex gap-6 text-sm">
          <motion.a
            href="mailto:hello@example.com"
            className="hover:opacity-60 transition-opacity duration-300"
            whileHover={{ y: -2 }}
          >
            Email
          </motion.a>
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60 transition-opacity duration-300"
            whileHover={{ y: -2 }}
          >
            Instagram
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
