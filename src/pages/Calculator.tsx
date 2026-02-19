import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowUpRight, Download, Mail, Sparkles, TrendingUp, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const industryFactors: Record<string, { factor: number; emoji: string }> = {
  "Renewable Energy": { factor: 0.85, emoji: "⚡" },
  "Waste Management": { factor: 0.6, emoji: "♻️" },
  "Industrial Manufacturing": { factor: 0.45, emoji: "🏭" },
  "Agriculture & Forestry": { factor: 0.7, emoji: "🌿" },
  "Transportation": { factor: 0.35, emoji: "🚛" },
  "Construction": { factor: 0.4, emoji: "🏗️" },
};

const Calculator = () => {
  const [industry, setIndustry] = useState("Renewable Energy");
  const [reduction, setReduction] = useState("");
  const [result, setResult] = useState<null | { credits: number; low: number; high: number }>(null);
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({ email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  const calculate = () => {
    const tons = parseFloat(reduction);
    if (isNaN(tons) || tons <= 0) return;
    setIsCalculating(true);
    // Simulate a brief calculation animation
    setTimeout(() => {
      const factor = industryFactors[industry]?.factor || 0.5;
      const credits = Math.round(tons * factor);
      setResult({ credits, low: credits * 300, high: credits * 2500 });
      setIsCalculating(false);
    }, 800);
  };

  const handleExport = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    const report = `CarbonBridge - Carbon Credit Estimate\n\nIndustry: ${industry}\nAnnual CO₂ Reduction: ${reduction} tons\nEstimated Credits: ${result?.credits}\nEstimated Value: ₹${result?.low?.toLocaleString()} - ₹${result?.high?.toLocaleString()}\n\nContact: ${contact.email} | ${contact.phone}\n\nDisclaimer: This is an estimate. Actual credits depend on verification and market conditions.`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "carbon-credit-estimate.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const reductionNum = parseFloat(reduction) || 0;
  const factor = industryFactors[industry]?.factor || 0.5;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 md:pt-36 pb-28 md:pb-36">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Calculator</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mt-4 leading-[0.95]">
              Estimate Your
              <br />
              <span className="italic text-muted-foreground">Earnings</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-6 max-w-lg">Discover how much your emission reductions could be worth in today's carbon credit market.</p>
          </motion.div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Calculator Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-5"
            >
              <div className="md:sticky md:top-32 space-y-8">
                {/* Industry Selector */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 block">Industry Sector</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(industryFactors).map(([k, v]) => (
                      <motion.button
                        key={k}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setIndustry(k); setResult(null); setShowContact(false); setSent(false); }}
                        className={`text-left px-4 py-3 rounded-xl text-xs font-medium transition-all duration-300 ${
                          industry === k
                            ? "bg-gradient-forest text-primary-foreground shadow-glow"
                            : "bg-card border border-border text-muted-foreground hover:border-primary/20 hover:text-foreground hover:shadow-soft"
                        }`}
                      >
                        <span className="text-base mr-1.5">{v.emoji}</span>
                        {k}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Conversion factor display */}
                <motion.div
                  layout
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/8 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Conversion Rate</p>
                    <p className="text-sm font-bold text-foreground">{factor} credits per ton CO₂</p>
                  </div>
                </motion.div>

                {/* CO2 Input with slider */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 block">Annual CO₂ Reduction (metric tons)</label>
                  <input
                    type="number"
                    min="1"
                    value={reduction}
                    onChange={(e) => { setReduction(e.target.value); setResult(null); setShowContact(false); setSent(false); }}
                    className="w-full px-0 py-4 bg-transparent border-0 border-b-2 border-border text-3xl font-serif font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary transition-colors"
                    placeholder="5,000"
                  />
                  {/* Range slider */}
                  <input
                    ref={sliderRef}
                    type="range"
                    min="100"
                    max="50000"
                    step="100"
                    value={reductionNum || 100}
                    onChange={(e) => { setReduction(e.target.value); setResult(null); setShowContact(false); setSent(false); }}
                    className="w-full mt-4 h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-glow [&::-webkit-slider-thumb]:cursor-grab"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">100 tons</span>
                    <span className="text-[10px] text-muted-foreground">50,000 tons</span>
                  </div>
                </div>

                {/* Live preview */}
                {reductionNum > 0 && !result && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-primary/5 border border-primary/10 rounded-2xl p-4 overflow-hidden"
                  >
                    <p className="text-xs text-muted-foreground">Preview: ~<span className="font-bold text-primary text-sm">{Math.round(reductionNum * factor).toLocaleString()}</span> credits</p>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculate}
                  disabled={isCalculating}
                  className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-forest text-primary-foreground font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-glow disabled:opacity-70"
                >
                  {isCalculating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  <span className="relative z-10">{isCalculating ? "Calculating..." : "Calculate"}</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Results */}
            <div className="md:col-span-6 md:col-start-7">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    {/* Main result card */}
                    <div className="bg-deep rounded-3xl p-10 md:p-14 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-amber/5 -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-primary/5 translate-y-1/2 -translate-x-1/2" />

                      <div className="relative z-10">
                        <span className="text-xs font-semibold uppercase tracking-widest text-amber">Estimated Carbon Credits</span>
                        <div className="mt-4 mb-2">
                          <motion.span
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="text-7xl md:text-8xl font-serif font-bold text-primary-foreground inline-block"
                          >
                            {result.credits.toLocaleString()}
                          </motion.span>
                        </div>
                        <p className="text-sm text-primary-foreground/40">credits per year • {industry}</p>

                        {/* Visual bar */}
                        <div className="mt-6">
                          <div className="h-3 bg-primary-foreground/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((result.credits / 50000) * 100, 100)}%` }}
                              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full bg-gradient-to-r from-primary to-amber rounded-full"
                            />
                          </div>
                          <div className="flex justify-between mt-1.5">
                            <span className="text-[10px] text-primary-foreground/30">0</span>
                            <span className="text-[10px] text-primary-foreground/30">50,000 credits</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Value range */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-card border border-border rounded-2xl p-6 group hover:shadow-soft transition-all duration-300"
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Conservative</span>
                        <p className="text-2xl font-serif font-bold text-foreground mt-2">₹{result.low.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">at ₹300/credit</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-card border border-primary/20 rounded-2xl p-6 shadow-glow group hover:shadow-elevated transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-accent">Optimistic</span>
                          <TrendingUp className="w-3 h-3 text-accent" />
                        </div>
                        <p className="text-2xl font-serif font-bold text-primary mt-1">₹{result.high.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">at ₹2,500/credit</p>
                      </motion.div>
                    </div>

                    {/* Export */}
                    {!showContact ? (
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowContact(true)}
                          className="flex-1 group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-card border border-border font-medium text-sm text-foreground hover:border-primary/20 hover:shadow-soft transition-all"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowContact(true)}
                          className="flex-1 group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-card border border-border font-medium text-sm text-foreground hover:border-primary/20 hover:shadow-soft transition-all"
                        >
                          <Mail className="w-4 h-4" />
                          Email Report
                        </motion.button>
                      </div>
                    ) : sent ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/10 rounded-2xl p-6 text-center">
                        <p className="text-primary font-semibold">✓ Report downloaded! We'll reach out shortly.</p>
                      </motion.div>
                    ) : (
                      <motion.form
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleExport}
                        className="bg-card border border-border rounded-2xl p-6 space-y-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Enter details to get your report</p>
                        <input
                          type="email"
                          required
                          placeholder="Email address"
                          value={contact.email}
                          onChange={(e) => setContact({ ...contact, email: e.target.value })}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors text-sm"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone number"
                          value={contact.phone}
                          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors text-sm"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-forest text-primary-foreground font-semibold rounded-2xl transition-all duration-500 hover:shadow-glow"
                        >
                          Get Report
                          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </motion.button>
                      </motion.form>
                    )}

                    <p className="text-[10px] text-muted-foreground text-center">
                      * Estimates based on current market conditions. Actual values depend on verification and market dynamics.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card border border-border border-dashed rounded-3xl p-14 flex flex-col items-center justify-center min-h-[400px]"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
                      <Sparkles className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-muted-foreground text-center max-w-xs">Select your industry and enter your CO₂ reduction to see estimated earnings.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Calculator;
