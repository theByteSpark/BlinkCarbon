import { Link } from "react-router-dom";
import { ArrowUpRight, Leaf, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/onboarding", label: "Get Started" },
  { to: "/calculator", label: "Calculator" },
  { to: "/market-info", label: "Market Insights" },
];

const Footer = () => (
  <footer className="relative overflow-hidden">
    {/* Top CTA Band */}
    <div className="bg-gradient-forest relative">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--amber)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--sage)) 0%, transparent 50%)' }} />
      <div className="container mx-auto px-6 py-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
            Ready to make an impact?
          </h3>
          <p className="text-primary-foreground/80 font-medium">
            Start trading carbon credits today.
          </p>
        </div>
        <Link
          to="/calculator"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-primary-foreground text-primary rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-elevated"
        >
          Get Started
          <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>

    {/* Main Footer */}
    <div className="bg-deep relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber/5 blur-[100px]" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="container mx-auto px-6 pt-20 pb-8 relative z-10">
        {/* Large brand statement */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-foreground/20 to-primary-foreground/5 flex items-center justify-center border border-primary-foreground/10">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-3xl font-bold text-primary-foreground">CarbonBridge</span>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground/15 max-w-3xl leading-[1.1] select-none"
          >
            Bridging industries with sustainability
          </motion.p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-primary-foreground/10">
          {/* About */}
          <div className="md:col-span-4">
            <p className="text-primary-foreground/90 leading-relaxed font-medium max-w-xs">
              Simplifying carbon credit trading for a greener tomorrow. We connect businesses with verified environmental impact.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 md:col-start-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-6">Navigate</h4>
            <div className="flex flex-col gap-4">
              {footerLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-primary-foreground/90 font-semibold hover:text-primary-foreground transition-colors"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-accent transition-all duration-300" />
                    {link.label}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-6">Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:hello@carbonbridge.in" className="group flex items-center gap-3 text-primary-foreground/90 font-semibold hover:text-primary-foreground transition-colors">
                <Mail className="w-4 h-4 text-accent" />
                hello@carbonbridge.in
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/90 font-semibold">
                <Phone className="w-4 h-4 text-accent" />
                +91 98765 43210
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/90 font-semibold">
                <MapPin className="w-4 h-4 text-accent" />
                Mumbai, India
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70 font-semibold">
            © 2026 CarbonBridge. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/70 font-semibold">
            <span>Built for a sustainable future</span>
            <span className="inline-block animate-float">🌱</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
