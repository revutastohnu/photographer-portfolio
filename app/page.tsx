import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import PortfolioGrid from '@/components/PortfolioGrid';
import About from '@/components/About';
import BookingSection from '@/components/BookingSection';
import Footer from '@/components/Footer';
import { getAllPhotoSets } from '@/lib/content';

function PortfolioGridWrapper() {
  const sets = getAllPhotoSets();
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
