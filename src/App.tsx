import { MotionConfig } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ArchitecturalJourney } from './components/ArchitecturalJourney';
import { PhilosophyAndSpecs } from './components/PhilosophyAndSpecs';
import { LifestyleAndLocation } from './components/LifestyleAndLocation';
import { EditorialGallery } from './components/EditorialGallery';
import { PrivateViewingSection } from './components/PrivateViewingSection';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <div className="min-h-screen bg-[#F7F4EF] text-[#171614]">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#171614] focus:text-[#F7F4EF] focus:text-xs focus:uppercase focus:tracking-widest"
          >
            Skip to main content
          </a>

          <Navbar />

          <main id="main-content">
            <HeroSection />
            <ArchitecturalJourney />
            <PhilosophyAndSpecs />
            <LifestyleAndLocation />
            <EditorialGallery />
            <PrivateViewingSection />
          </main>

          <Footer />
        </div>
      </ErrorBoundary>
    </MotionConfig>
  );
}
