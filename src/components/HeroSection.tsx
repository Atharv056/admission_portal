import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
export const HeroSection = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const handleNewRegistration = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };
  const handleCheckStatus = () => {
    navigate("/application-status");
  };
  return <section className="relative bg-hero-gradient text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 px-4 py-1.5 backdrop-blur-sm rounded-full text-sm font-medium text-white bg-neutral-800">
            Admissions Open for 2025-26
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Welcome to Student Admission Portal
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
            Apply for undergraduate and postgraduate programs. Complete your application process online with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" variant="secondary" className="" onClick={handleNewRegistration}>
              <FileText className="h-5 w-5" />
              New Registration
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white" onClick={handleCheckStatus}>
              <CheckCircle className="h-5 w-5" />
              Check Application Status
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-sm text-primary-foreground/80">Applications Received</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">100+</div>
              <div className="text-sm text-primary-foreground/80">Affiliated Institutes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">15+</div>
              <div className="text-sm text-primary-foreground/80">Courses Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};