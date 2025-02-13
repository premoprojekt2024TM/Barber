import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/MarketingPage/AppAppBar';
import Hero from '../components/MarketingPage/Hero';
import LogoCollection from '../components/MarketingPage/LogoCollection';
import Highlights from '../components/MarketingPage/Highlights';
import Pricing from '../components/MarketingPage/Pricing';
import Features from '../components/MarketingPage/Features';
import Testimonials from '../components/MarketingPage/Testimonials';
import FAQ from '../components/MarketingPage/FAQ';
import Footer from '../components/MarketingPage/Footer';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        <Divider />
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
