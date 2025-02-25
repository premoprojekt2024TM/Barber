import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../components/MarketingPage/AppAppBar';
import Main from '../components/MarketingPage/Main';
import Pricing from '../components/MarketingPage/Pricing';
import Features from '../components/MarketingPage/Features';
import FAQ from '../components/MarketingPage/FAQ';
import Footer from '../components/MarketingPage/Footer';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {


  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <Main />
      <div>
        <Divider />
        <Features />
        <Divider />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        
      </div>
    </AppTheme>
  );
}
