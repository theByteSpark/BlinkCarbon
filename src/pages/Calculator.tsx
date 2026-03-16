import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download, Mail, Sparkles, TrendingUp, Zap } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sectors = {
  Energy: { emoji: "⚡" },
  Industry: { emoji: "🏭" },
  "Waste handling and disposal": { emoji: "♻️" },
};

const renewableCategories = [
  "Solar",
  "Wind",
  "Hydro",
  "Green Hydrogen",
  "Biomass",
  "Captive RE",
];

const industryTypes = [
  "Pharma",
  "Chemical",
  "Textile",
  "Iron And steel",
  "Cement",
  "Other",
];

const fieldLabelClass = "text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 block";
const underlinedInputClass = "w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors text-sm";
const underlinedSelectClass = "w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground focus:outline-none focus:border-primary transition-colors text-sm appearance-none cursor-pointer";

const initialEnergyData = {
  isRenewableProject: "Yes",
  renewableCategory: "N/A",
  plantCapacity: "",
  capacityUnit: "MWh",
  generation: "",
  unit: "MWh",
  projectEmission: "",
};

const initialIndustryData = {
  industryType: "N/A",
  otherIndustryName: "",
  baseline: "",
  projectDescription: "",
  projectEmission: "",
  leakage: "",
};

const initialWasteData = {
  removedGasType: "N/A",
  methane: "",
  isElectricityExported: "No",
  electricityExport: "",
  electricityExportUnit: "MWh",
  projectEmission: "",
};

const toNumber = (value) => {
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5000";

const Calculator = () => {
  const [sector, setSector] = useState("Energy");
  const [result, setResult] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [exportMode, setExportMode] = useState("download");
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [isSheetSubmitted, setIsSheetSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [energyData, setEnergyData] = useState(initialEnergyData);
  const [industryData, setIndustryData] = useState(initialIndustryData);
  const [wasteData, setWasteData] = useState(initialWasteData);

  const clearEstimate = () => {
    setResult(null);
    setShowContact(false);
    setSent(false);
    setIsSheetSubmitted(false);
    setValidationError("");
  };

  const resetAllForms = () => {
    setEnergyData({ ...initialEnergyData });
    setIndustryData({ ...initialIndustryData });
    setWasteData({ ...initialWasteData });
  };

  const updateEnergyData = (patch) => {
    setEnergyData((prev) => ({ ...prev, ...patch }));
    clearEstimate();
  };

  const updateIndustryData = (patch) => {
    setIndustryData((prev) => ({ ...prev, ...patch }));
    clearEstimate();
  };

  const updateWasteData = (patch) => {
    setWasteData((prev) => ({ ...prev, ...patch }));
    clearEstimate();
  };

  const calculateEnergy = () => {
    const generation = toNumber(energyData.generation);
    const emission = toNumber(energyData.projectEmission);
    const isCaptiveRenewable = energyData.isRenewableProject === "Yes" && energyData.renewableCategory === "Captive RE";

    if (isCaptiveRenewable) {
      return energyData.unit === "MWh" ? generation * 0.710 : generation * 0.00010;
    }

    return energyData.unit === "MWh"
      ? generation * 0.710 - emission
      : generation * 0.000710 - emission;
  };

  const calculateIndustry = () => {
    const baseline = toNumber(industryData.baseline);
    const projectEmission = toNumber(industryData.projectEmission);
    const leakage = toNumber(industryData.leakage);
    return baseline - projectEmission - leakage;
  };

  const calculateWaste = () => {
    const methane = toNumber(wasteData.methane);
    const projectEmission = toNumber(wasteData.projectEmission);

    if (wasteData.isElectricityExported === "Yes") {
      const electricityExport = toNumber(wasteData.electricityExport);
      const exportFactor = wasteData.electricityExportUnit === "MWh" ? 0.710 : 0.000710;
      return methane * 29 - projectEmission + electricityExport * exportFactor;
    }

    return methane * 29 - projectEmission;
  };

  const isFilled = (value) => String(value).trim() !== "";

  const getValidationError = () => {
    if (sector === "Energy") {
      if (!isFilled(energyData.generation)) return "Enter average yearly electricity generation.";
      if (energyData.isRenewableProject === "Yes" && energyData.renewableCategory === "N/A") {
        return "Select renewable project category.";
      }
      const requiresEmission = energyData.isRenewableProject === "No" || energyData.renewableCategory !== "Captive RE";
      if (requiresEmission && !isFilled(energyData.projectEmission)) return "Enter project emission.";
    }

    if (sector === "Industry") {
      if (industryData.industryType === "N/A") return "Select industry type.";
      if (!isFilled(industryData.baseline)) return "Enter baseline emission.";
      if (!isFilled(industryData.projectEmission)) return "Enter project emission.";
      if (!isFilled(industryData.leakage)) return "Enter leakage emission.";
    }

    if (sector === "Waste handling and disposal") {
      if (wasteData.removedGasType === "N/A") return "Select gas type.";
      if (!isFilled(wasteData.methane)) return "Enter amount of methane destroyed.";
      if (!isFilled(wasteData.projectEmission)) return "Enter project emission.";
      if (wasteData.isElectricityExported === "Yes" && !isFilled(wasteData.electricityExport)) {
        return "Enter amount of electricity exported.";
      }
    }

    return "";
  };

  const getContactValidationError = () => {
    const email = String(contact.email ?? "").trim();
    const phone = String(contact.phone ?? "").trim();

    if (!isFilled(contact.name)) return "Enter your full name to continue.";
    if (!email) return "Enter your email address to continue.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    if (!phone) return "Enter your phone number to continue.";
    if (!/^\d{10}$/.test(phone)) return "Phone number must be exactly 10 digits.";
    return "";
  };

  const calculate = () => {
    const error = getValidationError();
    if (error) {
      setValidationError(error);
      setResult(null);
      return;
    }

    const contactError = getContactValidationError();
    if (contactError) {
      setValidationError(contactError);
      setResult(null);
      setShowContact(true);
      return;
    }

    setShowContact(false);
    setValidationError("");

    const credits =
      sector === "Energy"
        ? calculateEnergy()
        : sector === "Industry"
          ? calculateIndustry()
          : calculateWaste();

    const roundedCredits = Math.max(0, Math.round(credits));

    if (roundedCredits === 0) {
      setValidationError("please enter valid information");
    }

    setResult({
      credits: roundedCredits,
      low: roundedCredits * 300,
      high: roundedCredits * 2500,
    });
    setIsSheetSubmitted(false);
  };

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-IN").format(num);

const withUnit = (value, unit) => {
  const cleanValue = String(value ?? "").trim();
  const cleanUnit = String(unit ?? "").trim();
  if (!cleanValue || !cleanUnit || cleanUnit === "N/A") return "N/A";
  return `${cleanValue} ${unit}`;
};

type PdfWithAutoTable = jsPDF & {
  lastAutoTable?: {
    finalY?: number;
  };
};

// PDF /////////////////////////////////

const buildPDFDocument = () => {
  const doc = new jsPDF();
  const PAGE_W = 210;
  const PAGE_H = 297;

  // ── Palette ──────────────────────────────────────────────
  const DARK_GREEN  = [22,  55,  46 ]; // header / section titles
  const MID_GREEN   = [45, 106,  79 ]; // accent stripe, table head
  const LIGHT_GREEN = [220, 237, 225]; // highlight box background
  const ACCENT_GOLD = [180, 140,  60]; // decorative rule
  const GRAY_TEXT   = [90,  95,  95 ];
  const BODY_TEXT   = [30,  30,  30 ];

  // ── Helpers ───────────────────────────────────────────────
  const rgb  = (arr) => arr;                    // just an alias for clarity
  const setFill   = (c) => doc.setFillColor(...c);
  const setDraw   = (c) => doc.setDrawColor(...c);
  const setColor  = (c) => doc.setTextColor(...c);

  // Thin horizontal rule
  const rule = (y, color = ACCENT_GOLD, lw = 0.4) => {
    doc.setLineWidth(lw);
    setDraw(color);
    doc.line(20, y, PAGE_W - 20, y);
  };

  // Filled section-header band
  const sectionBand = (label, y) => {
    setFill(DARK_GREEN);
    doc.roundedRect(20, y, PAGE_W - 40, 9, 1, 1, "F");
    setColor([255, 255, 255]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label.toUpperCase(), 25, y + 6);
    return y + 14;
  };

  // Two-column key/value row (no table lib needed for simple pairs)
  const kvRows = (rows, startY) => {
    let y = startY;
    rows.forEach(([key, val], i) => {
      if (i % 2 === 0) {
        setFill([245, 248, 246]);
        doc.rect(20, y - 4, PAGE_W - 40, 8, "F");
      }
      setColor(GRAY_TEXT);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(key, 25, y);
      setColor(BODY_TEXT);
      doc.setFont("helvetica", "bold");
      doc.text(String(val ?? "—"), 105, y);
      y += 9;
    });
    return y + 4;
  };

  // ── PAGE BACKGROUND ───────────────────────────────────────
  // Subtle left-edge accent bar
  setFill(DARK_GREEN);
  doc.rect(0, 0, 7, PAGE_H, "F");

  // Light top strip behind header
  setFill(DARK_GREEN);
  doc.rect(7, 0, PAGE_W - 7, 46, "F");

  // ── HEADER ────────────────────────────────────────────────
  // Company name
  setColor([255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("BlinkCarbon", 105, 18, { align: "center" });

  // Thin gold rule under name
  doc.setLineWidth(0.6);
  setDraw(ACCENT_GOLD);
  doc.line(55, 21, 155, 21);

  // Report title
  setColor([200, 230, 210]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("CARBON CREDIT ESTIMATION REPORT", 105, 29, { align: "center" });

  // Date badge
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
  setColor([160, 200, 175]);
  doc.setFontSize(8);
  doc.text(`Generated: ${date}`, 105, 38, { align: "center" });

  let y = 56;

  // ── CLIENT INFORMATION ────────────────────────────────────
  y = sectionBand("Client Information", y);

  y = kvRows([
    ["Full Name",     contact.name ],
    ["Email Address", contact.email],
    ["Phone Number",  contact.phone],
  ], y);

  y += 4;
  rule(y, MID_GREEN, 0.2);
  y += 10;

  // ── PROJECT DETAILS ───────────────────────────────────────
  y = sectionBand("Project Details", y);

  let projectRows = [["Sector", sector]];

  if (sector === "Energy") {
    projectRows.push(
      ["Renewable Project",    energyData.isRenewableProject],
      ["Renewable Category",   energyData.isRenewableProject === "Yes"
                                  ? energyData.renewableCategory : "N/A"],
      ["Plant Capacity",       withUnit(energyData.plantCapacity, energyData.capacityUnit)],
      ["Generation",           withUnit(energyData.generation, energyData.unit)],
      ["Project Emission",     withUnit(energyData.projectEmission, "tCO2e")],
    );
  }
  if (sector === "Industry") {
    projectRows.push(
      ["Industry Type",        industryData.industryType],
      ["Baseline",             withUnit(industryData.baseline, "tCO2e")],
      ["Project Description",  industryData.projectDescription],
      ["Project Emission",     withUnit(industryData.projectEmission, "tCO2e")],
      ["Leakage",              withUnit(industryData.leakage, "tCO2e")],
    );
  }
  if (sector === "Waste handling and disposal") {
    projectRows.push(
      ["Gas Removed",              wasteData.removedGasType],
      ["Methane Destroyed",        withUnit(wasteData.methane, "t")],
      ["Electricity Exported",     wasteData.isElectricityExported],
      ["Electricity Export Amount",wasteData.isElectricityExported === "Yes"
                                      ? withUnit(wasteData.electricityExport, wasteData.electricityExportUnit)
                                      : "N/A"],
      ["Project Emission",         withUnit(wasteData.projectEmission, "tCO2e")],
    );
  }

  y = kvRows(projectRows, y);

  y += 4;
  rule(y, MID_GREEN, 0.2);
  y += 10;

  // ── CARBON CREDIT ESTIMATION — Highlight Card ─────────────
  y = sectionBand("Carbon Credit Estimation", y);

  // Card background
  const cardH = 44;
  setFill(LIGHT_GREEN);
  doc.roundedRect(20, y, PAGE_W - 40, cardH, 2, 2, "F");

  // Left accent stripe on card
  setFill(MID_GREEN);
  doc.roundedRect(20, y, 4, cardH, 1, 1, "F");

  // Estimated Credits (large)
  setColor(DARK_GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Estimated Credits", 32, y + 10);

  doc.setFontSize(20);
  doc.text(`${result?.credits ?? "—"} Credits`, 32, y + 24);

  // Value range on right
  setColor(GRAY_TEXT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("ESTIMATED VALUE RANGE", PAGE_W - 25, y + 9, { align: "right" });

  rule(y + 12, [150, 180, 160], 0.2);

  setColor(MID_GREEN);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`Low:   Rs. ${formatCurrency(result?.low)}`, PAGE_W - 25, y + 21, { align: "right" });


  setColor(DARK_GREEN);
  doc.setFontSize(11);
  doc.text(`High:  Rs. ${formatCurrency(result?.high)}`, PAGE_W - 25, y + 34, { align: "right" });

  y += cardH + 6;

  // ── DISCLAIMER ────────────────────────────────────────────
  setColor([140, 150, 145]);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  const disclaimer =
    "This report provides an estimated carbon credit potential based on the inputs provided and should not " +
    "be treated as a certified audit or compliance document. Results may vary with verification.";
  doc.text(disclaimer, 25, y, { maxWidth: PAGE_W - 50 });

  y += 14;
  rule(y, ACCENT_GOLD, 0.5);

  // ── FOOTER ────────────────────────────────────────────────
  setFill(DARK_GREEN);
  doc.rect(7, PAGE_H - 18, PAGE_W - 7, 18, "F");

  setColor([200, 225, 210]);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("BlinkCarbon  ·  contact@blinkcarbon.com", PAGE_W / 2 + 3, PAGE_H - 7, { align: "center" });

  // Page number
  setColor([130, 170, 150]);
  doc.setFontSize(7);
  doc.text("Page 1 of 1", PAGE_W - 22, PAGE_H - 7);

  return doc;
};

const getSectorData = () => {
  if (sector === "Energy") {
    return {
      renewableProject: energyData.isRenewableProject,
      renewableCategory: energyData.isRenewableProject === "Yes" ? energyData.renewableCategory : "N/A",
      plantCapacity: withUnit(energyData.plantCapacity, energyData.capacityUnit),
      generation: withUnit(energyData.generation, energyData.unit),
      energyEmission: withUnit(energyData.projectEmission, "tCO2e"),
    };
  }

  if (sector === "Industry") {
    return {
      industryType: industryData.industryType,
      baseline: withUnit(industryData.baseline, "tCO2e"),
      projectDescription: industryData.projectDescription,
      industryEmission: withUnit(industryData.projectEmission, "tCO2e"),
      leakage: withUnit(industryData.leakage, "tCO2e"),
    };
  }

  return {
    removedGas: wasteData.removedGasType,
    methane: withUnit(wasteData.methane, "t"),
    electricityExported: wasteData.isElectricityExported,
    electricityExport:
      wasteData.isElectricityExported === "Yes"
        ? withUnit(wasteData.electricityExport, wasteData.electricityExportUnit)
        : "N/A",
    wasteEmission: withUnit(wasteData.projectEmission, "tCO2e"),
  };
};

const handleExport = async (mode) => {
  const contactError = getContactValidationError();
  if (contactError) {
    setValidationError(contactError);
    setShowContact(true);
    return;
  }

 if (!isSheetSubmitted) {
  setIsSheetSubmitted(true);

  fetch(`${BACKEND_BASE_URL}/api/sheet/save-sheet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project: "blinkcarbon",
      data: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        sector: sector,
        renewableProject: energyData.isRenewableProject,
        renewableCategory: energyData.renewableCategory,
        plantCapacity: energyData.plantCapacity,
        generation: energyData.generation,
        energyEmission: energyData.projectEmission,
        industryType: industryData.industryType,
        baseline: industryData.baseline,
        projectDescription: industryData.projectDescription,
        industryEmission: industryData.projectEmission,
        leakage: industryData.leakage,
        removedGas: wasteData.removedGasType,
        methane: wasteData.methane,
        electricityExported: wasteData.isElectricityExported,
        electricityExport: wasteData.electricityExport,
        wasteEmission: wasteData.projectEmission,
        credits: result?.credits,
        low: result?.low,
        high: result?.high,
      }
    })
  }).catch(err => {
    console.error("Sheet error:", err);
    setIsSheetSubmitted(false);
  });
} 

  // DOWNLOAD MODE
  if (mode === "download") {
    const doc = buildPDFDocument();
    doc.save("carbon-credit-report.pdf");
    setValidationError("");
    setSent(true);
    return;
  }

  const sectorData = getSectorData();

try {
  const doc = buildPDFDocument();
  const pdfDataUri = doc.output("datauristring");
  const pdfBase64 = pdfDataUri.includes(",") ? pdfDataUri.split(",")[1] : pdfDataUri;

  const generatedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
      <p>Hello ${contact.name},</p>
      <p>Thank you for using the BlinkCarbon Carbon Credit Calculator.</p>
      <p>Your carbon credit estimation report has been generated on ${generatedDate} based on the project details you provided. The detailed report is attached to this email as a PDF.</p>
      <p>If you would like to explore verified carbon credit opportunities, project registration, or market insights, our team would be happy to assist you.</p>
      <p>Best regards,<br/>BlinkCarbon Team<br/>
      <a href="mailto:contact@blinkcarbon.com">contact@blinkcarbon.com</a></p>
    </div>
  `;

  const response = await fetch(`${BACKEND_BASE_URL}/api/email/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project: "blinkcarbon",
      from: "BlinkCarbon <digesh@thebytespark.com>",
      to: contact.email,
      subject: "Carbon Credit Report",
      html: html,
      pdf: pdfBase64,
    }),
  });

  // ... rest of your code

    const responseData = await response.json().catch(() => null);

    if (!response.ok || !responseData?.success) {
      throw new Error(responseData?.message || "Email sending failed");
    }

    setValidationError("");
    setSent(true);

  } catch (error) {
    console.error("Email sending failed:", error);
    setValidationError("Unable to send report email right now. Please try again.");
  }
};

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
              Earnings
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
                {/* sector Selector */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 block">sector Sector</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(sectors).map(([k, v]) => (
                      <motion.button
                        key={k}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setSector(k);
                          resetAllForms();
                          clearEstimate();
                        }}
                        className={`text-left px-4 py-3 rounded-xl text-xs font-medium transition-all duration-300 ${
                          sector === k
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

                {sector === "Energy" && (
                  <div className="space-y-6">
                    <div>
                      <p className={fieldLabelClass}>Is this renewable project?</p>
                      <div className="flex items-center gap-5">
                        <label className="flex items-center gap-2 text-sm text-foreground">
                          <input
                            type="radio"
                            name="isRenewableProject"
                            value="Yes"
                            checked={energyData.isRenewableProject === "Yes"}
                            onChange={() => {
                              updateEnergyData({ isRenewableProject: "Yes" });
                            }}
                            className="accent-primary"
                          />
                          Yes
                        </label>
                        <label className="flex items-center gap-2 text-sm text-foreground">
                          <input
                            type="radio"
                            name="isRenewableProject"
                            value="No"
                            checked={energyData.isRenewableProject === "No"}
                            onChange={() => {
                              updateEnergyData({ isRenewableProject: "No", renewableCategory: "N/A" });
                            }}
                            className="accent-primary"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    {energyData.isRenewableProject === "Yes" && (
                      <div>
                        <label className={fieldLabelClass}>Select renewable project category</label>
                        <select
                          value={energyData.renewableCategory}
                          onChange={(e) => {
                            updateEnergyData({ renewableCategory: e.target.value });
                          }}
                          className={underlinedSelectClass}
                        >
                          <option value="N/A">Select</option>
                          {renewableCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className={fieldLabelClass}>Capacity of the plant</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <input
                          type="number"
                          placeholder="Enter capacity"
                          value={energyData.plantCapacity}
                          onChange={(e) => {
                            updateEnergyData({ plantCapacity: e.target.value });
                          }}
                          className={`${underlinedInputClass} sm:col-span-2`}
                        />
                        <select
                          value={energyData.capacityUnit}
                          onChange={(e) => {
                            updateEnergyData({ capacityUnit: e.target.value });
                          }}
                          className={underlinedSelectClass}
                        >
                          <option value="MWh">MWh</option>
                          <option value="KWh">KWh</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={fieldLabelClass}>Avg electricity generation yearly</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                        <input
                          type="number"
                          placeholder="Enter yearly generation"
                          value={energyData.generation}
                          onChange={(e) => {
                            updateEnergyData({ generation: e.target.value });
                          }}
                          className={`${underlinedInputClass} sm:col-span-2`}
                        />
                        <select
                          value={energyData.unit}
                          onChange={(e) => {
                            updateEnergyData({ unit: e.target.value });
                          }}
                          className={underlinedSelectClass}
                        >
                          <option value="MWh">MWh</option>
                          <option value="KWh">KWh</option>
                        </select>
                      </div>
                    </div>

                    {(energyData.isRenewableProject === "No" || energyData.renewableCategory !== "Captive RE") && (
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <label className={`${fieldLabelClass} mb-0`}>Project Emission</label>
                          <span className="text-xs text-muted-foreground">* tCO2e</span>
                        </div>
                        <input
                          type="number"
                          placeholder="Enter project emission"
                          value={energyData.projectEmission}
                          onChange={(e) => {
                            updateEnergyData({ projectEmission: e.target.value });
                          }}
                          className={underlinedInputClass}
                        />
                      </div>
                    )}
                  </div>
                )}

{sector === "Industry" && (
  <div className="space-y-6">
    <div>
      <label className={fieldLabelClass}>Type of Industry</label>
      <select
        value={industryData.industryType}
        onChange={(e) => {
          updateIndustryData({ industryType: e.target.value });
        }}
        className={underlinedSelectClass}
      >
        <option value="N/A">Select</option>
        {industryTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>

    {industryData.industryType === "Other" && (
      <div>
        <label className={fieldLabelClass}>Industry Name</label>
        <input
          type="text"
          placeholder="Enter industry name"
          value={industryData.otherIndustryName}
          onChange={(e) => {
            updateIndustryData({ otherIndustryName: e.target.value });
          }}
          className={underlinedInputClass}
        />
      </div>
    )}

    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <label className={`${fieldLabelClass} mb-0`}>Baseline Emission</label>
        <span className="text-xs text-muted-foreground">* tCO2e</span>
      </div>
      <input
        type="number"
        placeholder="Enter baseline emission"
        value={industryData.baseline}
        onChange={(e) => {
          updateIndustryData({ baseline: e.target.value });
        }}
        className={underlinedInputClass}
      />
    </div>

    <div>
      <label className={fieldLabelClass}>Project Description</label>
      <textarea
        rows={3}
        placeholder="Enter project description"
        value={industryData.projectDescription}
        onChange={(e) => {
          updateIndustryData({ projectDescription: e.target.value });
        }}
        className={`${underlinedInputClass} resize-none`}
      />
    </div>

    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <label className={`${fieldLabelClass} mb-0`}>Project Emission</label>
        <span className="text-xs text-muted-foreground">* tCO2e</span>
      </div>
      <input
        type="number"
        placeholder="Enter project emission"
        value={industryData.projectEmission}
        onChange={(e) => {
          updateIndustryData({ projectEmission: e.target.value });
        }}
        className={underlinedInputClass}
      />
    </div>

    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <label className={`${fieldLabelClass} mb-0`}>Leakage Emission</label>
        <span className="text-xs text-muted-foreground">* tCO2e</span>
      </div>
      <input
        type="number"
        placeholder="Enter leakage emission"
        value={industryData.leakage}
        onChange={(e) => {
          updateIndustryData({ leakage: e.target.value });
        }}
        className={underlinedInputClass}
      />
    </div>
  </div>
)}

{sector === "Waste handling and disposal" && (
  <div className="space-y-6">
    <div>
      <label className={fieldLabelClass}>Remove Gas</label>
      <select
        value={wasteData.removedGasType}
        onChange={(e) => {
          updateWasteData({ removedGasType: e.target.value });
        }}
        className={underlinedSelectClass}
      >
        <option value="N/A">Select</option>
        <option value="Methane">Methane</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <label className={`${fieldLabelClass} mb-0`}>Amount of methane Destroyed</label>
        <span className="text-xs text-muted-foreground">* t</span>
      </div>
      <input
        type="number"
        placeholder="Enter amount destroyed"
        value={wasteData.methane}
        onChange={(e) => {
          updateWasteData({ methane: e.target.value });
        }}
        className={underlinedInputClass}
      />
    </div>

    <div>
      <p className={fieldLabelClass}>Electricity exported</p>
      <div className="flex items-center gap-5">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="isElectricityExported"
            value="Yes"
            checked={wasteData.isElectricityExported === "Yes"}
            onChange={() => {
              updateWasteData({ isElectricityExported: "Yes" });
            }}
            className="accent-primary"
          />
          Yes
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="isElectricityExported"
            value="No"
            checked={wasteData.isElectricityExported === "No"}
            onChange={() => {
              updateWasteData({ isElectricityExported: "No" });
            }}
            className="accent-primary"
          />
          No
        </label>
      </div>
    </div>

    {wasteData.isElectricityExported === "Yes" && (
      <div>
        <label className={fieldLabelClass}>Amount of electricity exported</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <input
            type="number"
            placeholder="Enter electricity exported"
            value={wasteData.electricityExport}
            onChange={(e) => {
              updateWasteData({ electricityExport: e.target.value });
            }}
            className={`${underlinedInputClass} sm:col-span-2`}
          />
          <select
            value={wasteData.electricityExportUnit}
            onChange={(e) => {
              updateWasteData({ electricityExportUnit: e.target.value });
            }}
            className={underlinedSelectClass}
          >
            <option value="MWh">MWh</option>
            <option value="KWh">KWh</option>
          </select>
        </div>
      </div>
    )}

    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <label className={`${fieldLabelClass} mb-0`}>Project Emission</label>
        <span className="text-xs text-muted-foreground">* tCO2e</span>
      </div>
      <input
        type="number"
        placeholder="Enter project emission"
        value={wasteData.projectEmission}
        onChange={(e) => {
          updateWasteData({ projectEmission: e.target.value });
        }}
        className={underlinedInputClass}
      />
    </div>
  </div>
)}

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
                    <p className="text-sm font-bold text-foreground">Sector based carbon credit calculation</p>
                  </div>
                </motion.div>

                {validationError && (
                  <p className="text-xs text-destructive">{validationError}</p>
                )}

                {showContact && !result && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      calculate();
                    }}
                    className="bg-card border border-border rounded-2xl p-6 space-y-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Enter details to view results</p>
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
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
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      inputMode="numeric"
                      maxLength={10}
                      pattern="\d{10}"
                      title="Enter exactly 10 digits"
                      className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-forest text-primary-foreground font-semibold rounded-2xl transition-all duration-500 hover:shadow-glow"
                    >
                      Continue to Results
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </motion.button>
                  </motion.form>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculate}
                  className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-forest text-primary-foreground font-semibold rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-glow"
                >
                  <Sparkles className="w-5 h-5" />
                  <span className="relative z-10">Calculate</span>
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
                        <p className="text-sm text-primary-foreground/40">credits per year • {sector}</p>

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
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setExportMode("download");
                          setSent(false);
                          handleExport("download");
                        }}
                        className="flex-1 group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-card border border-border font-medium text-sm text-foreground hover:border-primary/20 hover:shadow-soft transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setExportMode("email");
                          setSent(false);
                          handleExport("email");
                        }}
                        className="flex-1 group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-card border border-border font-medium text-sm text-foreground hover:border-primary/20 hover:shadow-soft transition-all"
                      >
                        <Mail className="w-4 h-4" />
                        Email Report
                      </motion.button>
                    </div>
                    {sent && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/10 rounded-2xl p-6 text-center">
                        <p className="text-primary font-semibold">
                          {exportMode === "download"
                            ? "✓ Report downloaded successfully."
                            : "✓ Report sent! We'll reach out shortly."}
                        </p>
                      </motion.div>
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
                    <p className="text-muted-foreground text-center max-w-xs">Select your sector and enter project details to see estimated earnings.</p>
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
