// import { Button } from "@/components/ui/button";
// import { ArrowRight, FileText, CheckCircle, GraduationCap } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";

// export const HeroSection = () => {
//   const navigate = useNavigate();
//   const {
//     user
//   } = useAuth();
//   const handleNewRegistration = () => {
//     if (user) {
//       navigate("/dashboard");
//     } else {
//       navigate("/auth");
//     }
//   };
//   const handleCheckStatus = () => {
//     navigate("/application-status");
//   };

//   return (
//     <section className="relative bg-hero-gradient text-primary-foreground overflow-hidden">
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

//       <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
//         <div className="max-w-3xl">
//           <div className="inline-block mb-4 px-4 py-1.5 bg-secondary/20 backdrop-blur-sm rounded-full text-sm font-medium">
//             Admissions Open for 2025-26
//           </div>

//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
//             Welcome to Student Admission Portal
//           </h1>

//           <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
//             Apply for undergraduate and postgraduate programs. Complete your application process online with ease.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 mb-12">
//             <Button
//               size="lg"
//               variant="secondary"
//               className="gap-2 shadow-lg hover:shadow-xl transition-all"
//               onClick={handleNewRegistration}
//             >
//               <FileText className="h-5 w-5" />
//               New Registration
//               <ArrowRight className="h-4 w-4" />
//             </Button>
//             <Button
//               size="lg"
//               variant="outline"
//               className="gap-2 bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20 text-white"
//               onClick={handleCheckStatus}
//             >
//               <CheckCircle className="h-5 w-5" />
//               Check Application Status
//             </Button>
//           </div>

//           <ScrollReveal animation="fade-up" delay={400}>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/20">
//               <div>
//                 <div className="text-3xl font-bold mb-1">50K+</div>
//                 <div className="text-sm text-primary-foreground/80">Applications Received</div>
//               </div>
//               <div>
//                 <div className="text-3xl font-bold mb-1">100+</div>
//                 <div className="text-sm text-primary-foreground/80">Participating Institutes</div>
//               </div>
//               <div>
//                 <div className="text-3xl font-bold mb-1">15+</div>
//                 <div className="text-sm text-primary-foreground/80">Available Courses</div>
//               </div>
//             </div>
//           </ScrollReveal>
//         </div>

//         {/* Hero Visual */}
//         <ScrollReveal animation="scale-in" delay={500} className="hidden lg:block relative">
//           <div className="relative animate-float">
//             <div className="relative z-10 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-2xl rounded-2xl border border-white/10 p-8 shadow-2xl">
//               <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent rounded-full blur-2xl opacity-40"></div>
//               <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary rounded-full blur-2xl opacity-40"></div>

//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 border-b border-border pb-6">
//                   <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
//                     <GraduationCap className="h-6 w-6 text-primary" />
//                   </div>
//                   <div>
//                     <div className="text-sm text-muted-foreground">Application Status</div>
//                     <div className="text-lg font-semibold">In Progress</div>
//                   </div>
//                   <div className="ml-auto">
//                     <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
//                       <div className="h-full w-2/3 bg-primary rounded-full animate-shimmer bg-[size:200%_100%]"></div>
//                     </div>
//                   </div>
//                 </div>

//                 {[1, 2, 3].map((i) => (
//                   <div key={i} className="flex items-center gap-4">
//                     <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
//                       {i}
//                     </div>
//                     <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Decorative Elements */}
//             <div className="absolute -z-10 top-10 right-10 w-full h-full border border-primary/20 rounded-2xl"></div>
//           </div>
//         </ScrollReveal>
//       </div>
//     </section>
//   );
// };






import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle, GraduationCap, Globe, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNewRegistration = () => navigate(user ? "/dashboard" : "/auth");
  const handleCheckStatus = () => navigate("/application-status");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  } as any;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background selection:bg-cyan-500/30">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] rounded-full bg-primary/20 blur-[80px] md:blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -left-[20%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-secondary/10 blur-[60px] md:blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10 w-full py-12 md:py-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-6 md:space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs md:text-sm font-medium backdrop-blur-sm">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Admissions Open for 2025–26
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Shape Your Future <br />
              <span className="text-gradient">With Excellence</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
              The official portal for undergraduate and postgraduate admissions.
              Streamlined, secure, and paperless application process.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={handleNewRegistration}
                className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                Start Application <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleCheckStatus}
                className="h-12 px-8 text-base border-primary/20 hover:bg-primary/5 bg-transparent backdrop-blur-sm transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Check Status
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-border/50">
              <StatItem number="50K+" label="Applicants" />
              <StatItem number="120+" label="Institutes" />
              <StatItem number="99%" label="Success Rate" />
            </motion.div>
          </motion.div>

          {/* Right Visual (Glass Cards) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative lg:block h-[400px] md:h-[600px] mt-8 lg:mt-0"
          >
            {/* Floating Elements Animation */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 md:top-10 md:right-10 z-20"
            >
              <GlassCard className="p-4 md:p-6 w-64 md:w-72 backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base md:text-lg">Verified</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">Documents approved instantly</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-0 md:bottom-20 md:left-10 z-30"
            >
              <GlassCard className="p-4 md:p-6 w-72 md:w-80 backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Application Status</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-medium">In Progress</span>
                  </div>
                  <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.5, delay: 1 }}
                      className="h-full bg-gradient-to-r from-primary to-cyan-500"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Personal Info</span>
                    <span>75%</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Center Graphic */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px]">
                <div className="absolute inset-0 rounded-full border border-primary/10 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-10 rounded-full border border-dashed border-cyan-500/20 animate-[spin_40s_linear_infinite_reverse]" />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-cyan-500/5 rounded-full blur-3xl" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

const StatItem = ({ number, label }: { number: string; label: string }) => (
  <div>
    <h4 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{number}</h4>
    <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium text-primary/80">{label}</p>
  </div>
);

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border shadow-xl ${className}`}>
    {children}
  </div>
);
