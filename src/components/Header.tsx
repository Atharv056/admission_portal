// import { Button } from "@/components/ui/button";
// import { Menu, Bell, User, LogIn, LogOut, Shield, ChevronRight } from "lucide-react";
// import { useState, useEffect } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { motion, AnimatePresence } from "framer-motion";
// import { cn } from "@/lib/utils";

// export const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const { user, signOut } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleSignOut = async () => {
//     await signOut();
//     navigate("/");
//   };

//   const navLinks = [
//     { href: "/", label: "Home" },
//     { href: "/admissions", label: "Admissions" },
//     { href: "/schedule", label: "Schedule" },
//     { href: "/results", label: "Results" },
//     { href: "/application-status", label: "Status" },
//     { href: "/contact", label: "Contact" },
//   ];

//   return (
//     <motion.header
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, ease: "circOut" }}
//       className={cn(
//         "fixed z-50 transition-all duration-300 w-full lg:w-fit lg:left-1/2 lg:-translate-x-1/2",
//         scrolled || isMenuOpen
//           ? "top-0 lg:top-6"
//           : "top-0 lg:top-10"
//       )}
//     >
//       <div
//         className={cn(
//           "flex items-center justify-between px-4 lg:px-8 h-16 lg:h-14 transition-all duration-300",
//           "bg-background/80 lg:bg-background/60 backdrop-blur-xl border-b lg:border border-white/10 shadow-lg",
//           "lg:rounded-full lg:min-w-[800px] lg:shadow-xl dark:shadow-primary/5 dark:bg-zinc-900/60"
//         )}
//       >
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-3 group relative z-50">
//           <div className="relative">
//             <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full group-hover:bg-cyan-500/40 transition-colors" />
//             <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-inner overflow-hidden">
//               <span className="relative z-10">SA</span>
//               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-y-full group-hover:-translate-y-full transition-transform duration-700" />
//             </div>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">Smart Admission</span>
//           </div>
//         </Link>

//         {/* Desktop Nav */}
//         <nav className="hidden lg:flex items-center gap-1">
//           {navLinks.map((link) => {
//             const isActive = location.pathname === link.href;
//             return (
//               <Link
//                 key={link.href}
//                 to={link.href}
//                 className={cn(
//                   "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
//                   isActive ? "text-primary" : "text-muted-foreground"
//                 )}
//               >
//                 {isActive && (
//                   <motion.div
//                     layoutId="navbar-indicator"
//                     className="absolute inset-0 bg-primary/10 rounded-full -z-10"
//                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                   />
//                 )}
//                 {link.label}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* Actions */}
//         <div className="flex items-center gap-2 lg:gap-4">
//           <ThemeToggle />

//           <div className="h-6 w-px bg-border/50 hidden lg:block" />

//           {user ? (
//             <div className="flex items-center gap-2">
//               <Link to="/dashboard">
//                 <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
//                   <User className="h-5 w-5" />
//                 </Button>
//               </Link>
//               <Button onClick={handleSignOut} variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
//                 <LogOut className="h-4 w-4" />
//               </Button>
//             </div>
//           ) : (
//             <div className="hidden lg:flex items-center gap-2">
//               <Button asChild variant="ghost" className="hover:bg-primary/10 hover:text-primary rounded-full px-6">
//                 <Link to="/auth">Sign In</Link>
//               </Button>
//               <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
//                 <Link to="/auth">Get Started</Link>
//               </Button>
//             </div>
//           )}

//           <Button
//             variant="ghost"
//             size="icon"
//             className="lg:hidden"
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//           >
//             {isMenuOpen ? <ChevronRight className="h-6 w-6 rotate-90" /> : <Menu className="h-6 w-6" />}
//           </Button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0, marginTop: 0 }}
//             animate={{ opacity: 1, height: "auto", marginTop: 16 }}
//             exit={{ opacity: 0, height: 0, marginTop: 0 }}
//             className="lg:hidden mx-4 overflow-hidden rounded-2xl border border-white/10 bg-background/90 backdrop-blur-2xl shadow-xl"
//           >
//             <nav className="flex flex-col p-4 gap-2">
//               {navLinks.map((link) => (
//                 <Link
//                   key={link.href}
//                   to={link.href}
//                   onClick={() => setIsMenuOpen(false)}
//                   className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 text-sm font-medium transition-colors"
//                 >
//                   {link.label}
//                   <ChevronRight className="h-4 w-4 text-muted-foreground" />
//                 </Link>
//               ))}
//               <div className="h-px bg-border/50 my-2" />
//               {!user && (
//                 <Button className="w-full rounded-xl" onClick={() => setIsMenuOpen(false)}>
//                   <Link to="/auth">Get Started</Link>
//                 </Button>
//               )}
//               {user && (
//                 <Button variant="destructive" className="w-full rounded-xl" onClick={handleSignOut}>
//                   Sign Out
//                 </Button>
//               )}
//             </nav>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.header>
//   );
// };






import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/admissions", label: "Admissions" },
    { href: "/schedule", label: "Schedule" },
    { href: "/results", label: "Results" },
    { href: "/application-status", label: "Status" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className={cn(
        "fixed z-50 w-full flex justify-center transition-all duration-300",
        scrolled || isMenuOpen ? "top-2" : "top-6"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between h-14 px-6 lg:px-8",
          "bg-background/70 backdrop-blur-xl border border-white/10 shadow-xl",
          "rounded-full max-w-7xl w-[95%] lg:w-auto",
          "dark:bg-zinc-900/60 dark:shadow-primary/5"
        )}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full group-hover:bg-cyan-500/40 transition-colors" />
            <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              SA
            </div>
          </div>
          <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
            Smart Admission
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              asChild
              className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Link to="/auth">Get Started</Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <ChevronRight className="h-6 w-6 rotate-90" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 w-[95%] max-w-md rounded-2xl bg-background/90 backdrop-blur-2xl border border-white/10 shadow-xl"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex justify-between items-center p-3 rounded-xl hover:bg-primary/5"
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
