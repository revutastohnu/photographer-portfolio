import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import PortfolioGrid from '@/components/PortfolioGrid';
import About from '@/components/About';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';
import { PhotoSession } from '@/lib/types';

async function PortfolioGridWrapper() {
  let sets: PhotoSession[] = [];

  try {
    // Завантажуємо дані з API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/portfolio`, {
      next: { revalidate: 60 }, // Кешуємо на 60 секунд
    });

    if (response.ok) {
      sets = await response.json();
    }
  } catch (error) {
    console.error('Failed to load portfolio:', error);
  }

  return <PortfolioGrid sets={sets} />;
}

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Full Portfolio */}
        <Section id="portfolio">
          <div className="max-w-[1600px] mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <PortfolioGridWrapper />
            </Suspense>
          </div>
        </Section>

        {/* About Section */}
        <Section id="about" className="bg-stone-50/50">
          <About />
        </Section>

        {/* Booking Section */}
        <Section id="booking">
          <BookingSection />
        </Section>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
