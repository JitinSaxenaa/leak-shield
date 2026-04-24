import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveTicker from './components/LiveTicker';
import StatsBar from './components/StatsBar';
import HowItWorks from './components/HowItWorks';
import OnboardingForm from './components/OnboardingForm';
import DashboardMockup from './components/DashboardMockup';
import Impact from './components/Impact';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-dm">
      <Navbar />
      <Hero />
      <LiveTicker />
      <StatsBar />
      <HowItWorks />
      <OnboardingForm />
      <DashboardMockup />
      <Impact />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
