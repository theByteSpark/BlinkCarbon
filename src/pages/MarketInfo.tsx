import { motion } from "framer-motion";
import { TrendingUp, Globe, FileText, Shield, BarChart3, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedCounter from "@/components/AnimatedCounter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { label: "Avg Rate (India)", value: 1500, prefix: "₹", suffix: "", sub: "per voluntary credit" },
  { label: "Global Market", value: 2, prefix: "$", suffix: "B+", sub: "traded in 2024" },
  { label: "India 2030 Target", value: 45, prefix: "", suffix: "%", sub: "emission intensity cut" },
  { label: "Credits Issued", value: 35, prefix: "", suffix: "M+", sub: "in India since inception" },
];

const sections = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    tag: "OPPORTUNITY",
    title: "Market Scope",
    points: [
      "India's carbon market projected to grow to ₹50,000+ crore by 2030 as compliance mechanisms activate.",
      "Over 1,000+ registered projects generating credits across renewable energy, waste management, and forestry.",
      "Global demand for quality credits continues to outstrip supply, especially for nature-based solutions.",
    ],
  },
  {
    icon: <FileText className="w-6 h-6" />,
    tag: "COMPLIANCE",
    title: "Government Requirements",
    points: [
      "Energy Conservation (Amendment) Act, 2022 mandates carbon emission intensity targets via BEE.",
      "Registration with Grid Controller (POSOCO) or accredited agencies required for credit issuance.",
      "Projects must follow approved methodologies and undergo third-party verification by BEE-accredited VVBs.",
    ],
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    tag: "GROWTH",
    title: "Future Potential",
    points: [
      "India's net-zero 2070 target creates decades of sustained demand for carbon credits.",
      "Article 6 of the Paris Agreement could enable Indian credits to trade globally, boosting prices.",
      "Corporate ESG and BRSR reporting requirements drive voluntary demand from India's largest companies.",
    ],
  },
  {
    icon: <Shield className="w-6 h-6" />,
    tag: "SECURITY",
    title: "Government Safeguards",
    points: [
      "Indian Carbon Market is sovereign — backed by GoI with regulatory certainty and investor protection.",
      "National registry tracks all credit issuance, transfer, and retirement, preventing double-counting.",
      "Built-in dispute resolution and grievance redressal mechanisms for both buyers and sellers.",
    ],
  },
];

const MarketInfo = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="pt-28 md:pt-36 pb-20">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl mb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Market Insights</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mt-4 leading-[0.95]">
            Carbon Market
            <br />
            <span className="italic text-muted-foreground">at a Glance</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-6 max-w-lg">Current rates, scope, regulations, and the massive opportunity ahead.</p>
        </motion.div>

        {/* Stats - Bento */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-3xl p-7 overflow-hidden ${
                i === 0
                  ? "bg-deep text-primary-foreground col-span-2 lg:col-span-1"
                  : "bg-card border border-border"
              }`}
            >
              {i === 0 && <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/10 -translate-y-1/2 translate-x-1/2" />}

              <div className="relative z-10">
                <AnimatedCounter
                  end={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className={`text-4xl md:text-5xl font-serif font-bold ${i === 0 ? "text-amber" : "text-primary"}`}
                />
                <p className={`text-sm font-semibold mt-3 ${i === 0 ? "text-primary-foreground" : "text-foreground"}`}>{s.label}</p>
                <p className={`text-xs mt-1 ${i === 0 ? "text-primary-foreground/40" : "text-muted-foreground"}`}>{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Content - Alternating layout */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-3xl p-8 md:p-12 relative overflow-hidden ${
                i % 2 === 0
                  ? "bg-card border border-border"
                  : "bg-deep text-primary-foreground"
              }`}
            >
              {i % 2 !== 0 && (
                <>
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-amber/5 translate-y-1/2 -translate-x-1/2" />
                </>
              )}

              <div className="relative z-10 grid md:grid-cols-12 gap-8">
                <div className="md:col-span-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${
                    i % 2 === 0 ? "bg-primary/8 text-primary" : "bg-primary-foreground/10 text-primary-foreground"
                  }`}>
                    {section.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                    i % 2 === 0 ? "text-accent" : "text-amber"
                  }`}>{section.tag}</span>
                  <h2 className={`text-3xl font-serif font-bold mt-2 ${
                    i % 2 === 0 ? "text-foreground" : "text-primary-foreground"
                  }`}>{section.title}</h2>
                </div>

                <div className="md:col-span-8 space-y-4">
                  {section.points.map((p, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        i % 2 === 0 ? "bg-accent" : "bg-amber"
                      }`} />
                      <p className={`leading-relaxed ${
                        i % 2 === 0 ? "text-muted-foreground" : "text-primary-foreground/60"
                      }`}>{p}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 relative bg-gradient-forest rounded-3xl p-12 md:p-20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent)]" />
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full border border-primary-foreground/5 animate-float" />
          <div className="absolute bottom-10 left-20 w-16 h-16 rounded-full border border-primary-foreground/5 animate-float-delayed" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <Globe className="w-10 h-10 text-amber mb-4" />
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary-foreground leading-tight">
                Ready to Enter the
                <br />
                Carbon Market?
              </h2>
              <p className="text-primary-foreground/50 mt-4 max-w-md">Whether selling or buying — CarbonBridge is your trusted partner.</p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                to="/calculator"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-amber text-accent-foreground font-semibold rounded-2xl hover:shadow-glow transition-all duration-500"
              >
                Calculate Earnings
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/onboarding"
                className="group inline-flex items-center gap-3 px-8 py-4 glass text-primary-foreground font-semibold rounded-2xl transition-all hover:bg-primary-foreground/10"
              >
                View Steps
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default MarketInfo;
