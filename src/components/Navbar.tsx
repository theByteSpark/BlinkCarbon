import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/onboarding", label: "Get Started" },
  { to: "/calculator", label: "Calculator" },
  { to: "/market-info", label: "Market Insights" },
];

const Navbar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 md:mx-8 mt-4">
          <div className="glass-light rounded-2xl px-6 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-forest flex items-center justify-center relative overflow-hidden">
                <span className="text-primary-foreground font-bold text-sm relative z-10">CB</span>
              </div>
              <span className="font-serif text-lg font-bold text-foreground">CarbonBridge</span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/8"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/calculator"
                className="ml-3 group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-forest text-primary-foreground rounded-xl overflow-hidden transition-all duration-300 hover:shadow-glow"
              >
                <span className="relative z-10">Calculate Earnings</span>
                <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-forest-light opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Mobile toggle */}
            <button className="md:hidden text-foreground p-2 rounded-xl hover:bg-muted/50 transition-colors" onClick={() => setOpen(!open)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center gap-6"
            >
              {navLinks.map((link, i) => (
                <motion.div key={link.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`text-3xl font-serif font-bold transition-colors ${
                      location.pathname === link.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
