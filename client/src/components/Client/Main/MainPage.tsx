import Navbar from "./AppBar";
import Main from "./Main";
import Features from "./Features";
import FAQPage from "./FAQ";

export default function MainPage() {
  return (
    <div>
      <Navbar />
      <div id="main">
        <Main />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="faq">
        <FAQPage />
      </div>
    </div>
  );
}
