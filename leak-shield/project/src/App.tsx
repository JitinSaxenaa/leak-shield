import Navbar from './components/Navbar';
import Hero from './components/Hero';

import OnboardingForm from './components/OnboardingForm';
import DashboardMockup from './components/DashboardMockup';

import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-dm">
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
