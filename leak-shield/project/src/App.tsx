import { useState } from 'react';
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

import OnboardingForm from './components/OnboardingForm';
import DashboardMockup from './components/DashboardMockup';

import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-dm">
      {!introComplete && (
        <IntroAnimation onDone={() => setIntroComplete(true)} />
      )}
      <Navbar />
      <Hero />


      <OnboardingForm />
      <DashboardMockup />

      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
