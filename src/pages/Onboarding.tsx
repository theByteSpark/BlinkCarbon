import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Factory, ShoppingCart, ArrowUpRight, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sellerSteps = [
  { title: "Assess Your Emissions", detail: "Conduct a thorough audit of your industrial processes to identify where you're emitting less than your allocated quota or where reduction projects can generate credits.", icon: "01" },
  { title: "Choose a Standard", detail: "Select a verification standard — Verra (VCS), Gold Standard, or the Indian Carbon Market (ICM) framework — based on your project type and target buyers.", icon: "02" },
  { title: "Develop Your Project", detail: "Design and implement your emission reduction or removal project — from renewable energy installations to methane capture or reforestation.", icon: "03" },
  { title: "Third-Party Verification", detail: "An accredited auditor validates your project design and verifies the actual emission reductions achieved over a monitoring period.", icon: "04" },
  { title: "Credit Issuance", detail: "Upon successful verification, credits are issued to your registry account. Each credit = one metric ton of CO₂ equivalent reduced.", icon: "05" },
  { title: "Trade on the Market", detail: "List credits on exchanges or connect with buyers directly through CarbonBridge. Set your price or accept market rates.", icon: "06" },
];

const buyerSteps = [
  { title: "Understand Your Footprint", detail: "Calculate total GHG emissions across Scope 1, 2, and 3 to understand how many credits you need to offset.", icon: "01" },
  { title: "Set Offset Goals", detail: "Define whether you aim for carbon neutrality, net-zero, or partial offset. This determines volume and type of credits needed.", icon: "02" },
  { title: "Select Credit Type", detail: "Choose between compliance credits (mandatory markets) or voluntary credits based on your regulatory requirements.", icon: "03" },
  { title: "Due Diligence", detail: "Verify credit quality by checking project verification standard, vintage year, additionality, and co-benefits.", icon: "04" },
  { title: "Purchase & Retire", detail: "Buy credits through registries or trading platforms. Retire them to officially claim the offset — retired credits cannot be resold.", icon: "05" },
  { title: "Report & Communicate", detail: "Document offsets in sustainability reports. Transparent communication builds stakeholder trust and regulatory compliance.", icon: "06" },
];

const Onboarding = () => {
  const [tab, setTab] = useState<"seller" | "buyer">("seller");
  const [activeStep, setActiveStep] = useState(0);
  const steps = tab === "seller" ? sellerSteps : buyerSteps;
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll-driven step progression
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (index !== -1) {
              setActiveStep(index);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [tab]);

  // Reset refs when tab changes
  useEffect(() => {
    stepRefs.current = stepRefs.current.slice(0, steps.length);
    setActiveStep(0);
  }, [tab, steps.length]);

  // Progress percentage
  const progress = ((activeStep) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Onboarding</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mt-4 leading-[0.95]">
              Your Path to
              <br />
              Carbon <span className="italic text-muted-foreground">Trading</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-6 max-w-lg">Whether you're generating credits or purchasing offsets — here's your roadmap. Scroll down to explore each step.</p>
          </motion.div>
        </div>
      </section>

      {/* Tab Switch */}
      <div className="container mx-auto px-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-3">
          {[
            { key: "seller" as const, label: "For Sellers", icon: <Factory className="w-4 h-4" /> },
            { key: "buyer" as const, label: "For Buyers", icon: <ShoppingCart className="w-4 h-4" /> },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`group inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                tab === t.key
                  ? "bg-gradient-forest text-primary-foreground shadow-glow"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Sticky progress bar */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
            Step {activeStep + 1} of {steps.length}
          </span>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-forest rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <span className="text-xs font-bold text-primary whitespace-nowrap">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Scroll-driven Steps */}
      <section className="pb-28 md:pb-36" ref={stepsContainerRef}>
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {steps.map((step, i) => (
                <div
                  key={i}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  className="min-h-[70vh] flex items-center py-12"
                >
                  <div className="grid md:grid-cols-12 gap-8 w-full items-center">
                    {/* Left - Step indicator */}
                    <div className="md:col-span-5">
                      <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="relative pl-16"
                      >
                        {/* Vertical connector */}
                        {i < steps.length - 1 && (
                          <div className="absolute left-[22px] top-14 bottom-0 w-px bg-border" />
                        )}

                        {/* Step circle */}
                        <div className={`absolute left-0 top-1 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
                          i < activeStep
                            ? "bg-primary border-primary scale-100"
                            : i === activeStep
                            ? "border-primary bg-primary/10 scale-110 shadow-glow"
                            : "border-border bg-background scale-100"
                        }`}>
                          {i < activeStep ? (
                            <Check className="w-5 h-5 text-primary-foreground" />
                          ) : (
                            <span className={`text-xs font-bold ${i === activeStep ? "text-primary" : "text-muted-foreground"}`}>
                              {step.icon}
                            </span>
                          )}
                        </div>

                        {/* Mini-labels for all steps */}
                        <div className="space-y-3">
                          {steps.map((s, j) => (
                            <div
                              key={j}
                              className={`flex items-center gap-3 transition-all duration-500 ${
                                j === i ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
                              }`}
                            >
                              <div>
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest block">Step {s.icon}</span>
                                <h3 className={`text-2xl md:text-3xl font-serif font-bold mt-1 transition-colors duration-500 ${
                                  j === activeStep ? "text-foreground" : "text-muted-foreground"
                                }`}>
                                  {s.title}
                                </h3>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </div>

                    {/* Right - Detail card */}
                    <div className="md:col-span-6 md:col-start-7">
                      <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className={`rounded-3xl p-10 md:p-14 relative overflow-hidden transition-all duration-700 ${
                          i === activeStep
                            ? "bg-deep shadow-elevated"
                            : "bg-card border border-border"
                        }`}
                      >
                        {/* Decorative elements for active */}
                        {i === activeStep && (
                          <>
                            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-amber/5 translate-y-1/2 -translate-x-1/2" />
                          </>
                        )}

                        <div className="relative z-10">
                          <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className={`text-7xl font-serif font-bold ${
                              i === activeStep ? "text-primary-foreground/10" : "text-muted-foreground/10"
                            }`}
                          >
                            {step.icon}
                          </motion.span>
                          <h3 className={`text-3xl font-serif font-bold mt-4 mb-6 ${
                            i === activeStep ? "text-primary-foreground" : "text-foreground"
                          }`}>
                            {step.title}
                          </h3>
                          <p className={`leading-relaxed text-base ${
                            i === activeStep ? "text-primary-foreground/60" : "text-muted-foreground"
                          }`}>
                            {step.detail}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Onboarding;
