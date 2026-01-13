import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { NoticesSection } from "@/components/NoticesSection";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { ImportantDatesSection } from "@/components/ImportantDatesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <HeroSection />
        <NoticesSection />
        <QuickLinksSection />
        <ImportantDatesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
