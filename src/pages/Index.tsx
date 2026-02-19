import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronRight, Leaf, TrendingUp, Shield, Users, Send, CheckCircle, Plus, Minus } from "lucide-react";
import heroImage from "@/assets/hero-abstract.jpg";
import carbonImage from "@/assets/carbon-abstract.jpg";
import leafImage from "@/assets/leaf-detail.jpg";
import AnimatedCounter from "@/components/AnimatedCounter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  { q: "What are carbon credits?", a: "Permits allowing emission of one ton of CO₂. Companies reducing emissions below limits can sell excess credits to generate revenue." },
  { q: "How do I start trading?", a: "Assess your carbon footprint, register with a verified registry, then either generate credits through reduction projects or purchase them for offsetting." },
  { q: "Is carbon trading government-regulated?", a: "Yes — India's Bureau of Energy Efficiency (BEE) under the Ministry of Power oversees the Indian Carbon Market (ICM) with full regulatory backing." },
  { q: "Who can sell carbon credits?", a: "Any organization demonstrably reducing greenhouse gas emissions — renewable energy plants, reforestation projects, waste management facilities, and more." },
  { q: "What is the price per credit?", a: "Voluntary market prices in India range from ₹300 to ₹2,500 per credit depending on project quality, verification standard, and vintage year." },
  { q: "How is carbon reduction verified?", a: "Independent third-party auditors verify reductions using methodologies approved by Verra (VCS), Gold Standard, or India's ICM framework." },
];

const impacts = [
  { icon: <Leaf className="w-5 h-5" />, title: "End-to-End Guidance", desc: "From assessment to credit issuance — we walk every step with you.", num: 500, suffix: "+", label: "Projects Guided" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Market Intelligence", desc: "Real-time analytics and forecasts for optimal trading decisions.", num: 98, suffix: "%", label: "Client Satisfaction" },
  { icon: <Shield className="w-5 h-5" />, title: "Govt. Compliant", desc: "Fully aligned with ICM framework and international standards.", num: 12, suffix: "+", label: "Standards Covered" },
  { icon: <Users className="w-5 h-5" />, title: "Trusted Network", desc: "Connect with verified buyers & sellers in a secure marketplace.", num: 2000, suffix: "+", label: "Active Traders" },
];

const contactReasons = [
  "Submit a question for our FAQ",
  "General inquiry about services",
  "Partnership / Collaboration",
  "Media / Press inquiry",
];

const Index = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", reason: contactReasons[0], message: "" });
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Marquee text
  const marqueeText = "CARBON CREDITS · SUSTAINABILITY · GREEN FUTURE · NET ZERO · CARBON TRADING · CLIMATE ACTION · ";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-24">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <img src={heroImage} alt="Forest meets molecular science" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-green via-deep-green/70 to-deep-green/30" />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-amber/40 animate-float" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-primary-foreground/10 animate-float-delayed" />
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-amber/30 animate-float-slow" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 container mx-auto px-4 pb-20 md:pb-28">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
                  <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
                  <span className="text-xs font-medium text-primary-foreground/70 uppercase tracking-widest">Carbon Credit Trading Platform</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary-foreground leading-[0.95] mb-8">
                  Turn Your{" "}
                  <span className="italic text-amber">Green</span>
                  <br />
                  Impact Into
                  <br />
                  <span className="text-gradient-green">Value</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="text-base md:text-lg text-primary-foreground/50 max-w-md leading-relaxed mb-10"
              >
                Navigate the carbon credit market with confidence. We make trading accessible, transparent, and profitable.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to="/calculator"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-amber text-accent-foreground font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-glow"
                >
                  <span className="relative z-10">Calculate Your Earnings</span>
                  <ArrowUpRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber to-amber-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
                <Link
                  to="/onboarding"
                  className="group inline-flex items-center gap-3 px-8 py-4 glass text-primary-foreground font-semibold rounded-2xl transition-all duration-300 hover:bg-primary-foreground/10"
                >
                  How It Works
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>

            {/* Stats sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="md:col-span-4 hidden md:flex flex-col gap-6"
            >
              {[
                { val: "₹50K Cr+", label: "Market potential by 2030" },
                { val: "35M+", label: "Credits issued in India" },
                { val: "1000+", label: "Registered projects" },
              ].map((s, i) => (
                <div key={i} className="glass rounded-2xl p-5 group hover:bg-primary-foreground/8 transition-all duration-300">
                  <p className="text-2xl font-serif font-bold text-primary-foreground mb-1">{s.val}</p>
                  <p className="text-xs text-primary-foreground/40">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div className="bg-primary py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/60 mx-0">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      {/* ─── FAQ — SPLIT LAYOUT ─── */}
      <section className="py-28 md:py-36">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20">
            {/* Left sticky header */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-4 md:sticky md:top-32 md:self-start"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Knowledge</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 leading-tight">
                Questions
                <br />
                <span className="italic text-muted-foreground">Answered.</span>
              </h2>
              <div className="mt-6 w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">Everything you need to know about carbon credit trading, demystified.</p>
            </motion.div>

            {/* Right - FAQ items */}
            <div className="md:col-span-8 space-y-0">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                    className="w-full text-left group py-6 border-b border-border"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xs font-mono text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                          <h3 className="text-lg md:text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                            {faq.q}
                          </h3>
                        </div>
                        <AnimatePresence>
                          {activeFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="text-muted-foreground leading-relaxed pt-3 pl-10 pr-4">{faq.a}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-300 ${activeFaq === i ? "bg-primary border-primary" : "group-hover:border-primary"}`}>
                        {activeFaq === i ? <Minus className="w-3.5 h-3.5 text-primary-foreground" /> : <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />}
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GOVERNMENT SECTION — EDITORIAL OVERLAP ─── */}
      <section className="relative py-28 md:py-36 bg-deep overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/5 to-transparent" />
        <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Images - editorial layout with parallax & reveal */}
            <motion.div
              initial={{ opacity: 0, x: -60, rotateY: 8 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="md:col-span-5 relative"
            >
              <div className="relative">
                <motion.div
                  whileInView={{ scale: [1.1, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl overflow-hidden"
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={carbonImage}
                    alt="Aerial view of lush forest with winding river"
                    className="w-full aspect-square object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-8 -right-4 md:-right-8 w-40 h-52 rounded-2xl overflow-hidden shadow-elevated border-4 border-deep-green"
                >
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={leafImage}
                    alt="Macro leaf with dew drops"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                {/* Decorative ring */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute -top-6 -left-6 w-24 h-24 rounded-full border border-amber/20"
                />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-6 md:col-start-7"
            >
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-amber"
              >
                Policy & Framework
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mt-4 mb-8 leading-tight">
                Government-Backed.
                <br />
                <span className="italic text-primary-foreground/50">Future-Ready.</span>
              </h2>

              <div className="space-y-6">
                {[
                  { tag: "2022 ACT", text: "India's Energy Conservation Amendment Act established the Indian Carbon Market, creating a sovereign trading framework." },
                  { tag: "BEE OVERSIGHT", text: "The Bureau of Energy Efficiency ensures market integrity with mandatory compliance and transparent pricing mechanisms." },
                  { tag: "NET ZERO 2070", text: "India's long-term commitment creates decades of sustained demand — making carbon credits one of the most promising green investments." },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-5 group"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber bg-amber/10 px-2.5 py-1 rounded-md group-hover:bg-amber/20 transition-colors">{item.tag}</span>
                    </div>
                    <p className="text-sm text-primary-foreground/60 leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── IMPACT — HORIZONTAL SCROLL CARDS ─── */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Why CarbonBridge</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4">
                Built <span className="italic">Different.</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">Four pillars that set us apart in the carbon trading ecosystem.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-border rounded-3xl overflow-hidden">
            {impacts.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative p-8 cursor-default transition-all duration-500 hover:bg-primary/3 border-b md:border-b-0 md:border-r border-border last:border-0"
              >
                {/* Hover accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="relative z-10 h-full flex flex-col min-h-[220px]">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      {item.icon}
                    </div>
                    <span className="text-xs font-mono text-muted-foreground/40">{String(i + 1).padStart(2, "0")}</span>
                  </div>

                  <h3 className="text-lg font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">{item.desc}</p>

                  <div className="mt-auto">
                    <AnimatedCounter
                      end={item.num}
                      suffix={item.suffix}
                      className="text-2xl font-serif font-bold text-primary"
                    />
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT — SPLIT ─── */}
      <section className="py-28 md:py-36 bg-gradient-sage">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12 md:gap-20">
            {/* Left info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-4 md:sticky md:top-32 md:self-start"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mt-4 leading-tight">
                Let's
                <br />
                <span className="italic text-muted-foreground">Talk.</span>
              </h2>
              <div className="mt-6 w-16 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">Whether you have a question or want to list it on our site — we're here.</p>

              <div className="mt-10 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center"><Send className="w-3.5 h-3.5 text-primary" /></div>
                  hello@carbonbridge.in
                </div>
              </div>
            </motion.div>

            {/* Right form */}
            <div className="md:col-span-7 md:col-start-6">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
                  <div className="relative inline-block mb-6">
                    <CheckCircle className="w-16 h-16 text-primary" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-ring" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-foreground mb-3">Thank You!</h3>
                  <p className="text-muted-foreground">We've received your message and will respond soon.</p>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-5">
                    {[
                      { label: "Name", type: "text", key: "name", placeholder: "Your name" },
                      { label: "Email", type: "email", key: "email", placeholder: "you@company.com" },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 block">{field.label}</label>
                        <input
                          type={field.type}
                          required
                          value={contactForm[field.key as keyof typeof contactForm]}
                          onChange={(e) => setContactForm({ ...contactForm, [field.key]: e.target.value })}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors text-sm"
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 block">Reason</label>
                    <select
                      value={contactForm.reason}
                      onChange={(e) => setContactForm({ ...contactForm, reason: e.target.value })}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground focus:outline-none focus:border-primary transition-colors text-sm appearance-none cursor-pointer"
                    >
                      {contactReasons.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 block">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors resize-none text-sm"
                      placeholder="Tell us more..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-forest text-primary-foreground font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-glow"
                  >
                    <span className="relative z-10">Send Message</span>
                    <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </motion.button>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
