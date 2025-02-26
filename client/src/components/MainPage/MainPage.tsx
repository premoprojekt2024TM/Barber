import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../../shared-theme/AppTheme';
import AppAppBar from './AppAppBar';
import Main from './Main';
import Pricing from './Pricing';
import Features from './Features';
import FAQ from './FAQ';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <AppAppBar />
      <div id="Main">
          <Main />
        </div>
      <div>
        <Divider />
        <div id="features">
          <Features />
        </div>
        <Divider />
        <Divider />
        <div id="popular">
          <Pricing />
        </div>
        <Divider />
        <div id="faq">
          <FAQ />
        </div>
        <Divider />
      </div>
    </AppTheme>
  );
}
