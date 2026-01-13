import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SkipLink } from "@/components/SkipLink";
import { AIChatbot } from "@/components/AIChatbot";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ApplicationStatus from "./pages/ApplicationStatus";
import Admissions from "./pages/Admissions";
import Schedule from "./pages/Schedule";
import Results from "./pages/Results";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="admission-portal-theme">
      <AuthProvider>
        <TooltipProvider>
          <SkipLink />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/register" element={<Register />} />
              <Route path="/application-status" element={<ApplicationStatus />} />
              <Route path="/admissions" element={<Admissions />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/results" element={<Results />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <AIChatbot />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
