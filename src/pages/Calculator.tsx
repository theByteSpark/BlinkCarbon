import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download, Mail, Sparkles, TrendingUp, Zap } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import emailjs from "@emailjs/browser";
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

const Calculator = () => {
  const [sector, setSector] = useState("Energy");
  const [result, setResult] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [exportMode, setExportMode] = useState("download");
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [sent, setSent] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [energyData, setEnergyData] = useState(initialEnergyData);
  const [industryData, setIndustryData] = useState(initialIndustryData);
  const [wasteData, setWasteData] = useState(initialWasteData);

  const clearEstimate = () => {
    setResult(null);
    setShowContact(false);
    setSent(false);
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

  const calculate = () => {
    const error = getValidationError();
    if (error) {
      setValidationError(error);
      setResult(null);
      return;
    }

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

const downloadPDF = () => {

  const doc = new jsPDF();

  // Header
  doc.setFillColor(34,139,34);
  doc.rect(0,0,210,25,"F");

  doc.setTextColor(255,255,255);
  doc.setFontSize(18);
  doc.text("BlinkCarbon",20,15);

  doc.setFontSize(14);
  doc.text("Carbon Credit Estimation Report",105,15,{align:"center"});

  doc.setTextColor(0,0,0);

  let y = 40;

  // Report Info
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`,150,35);
  doc.text(`Sector: ${sector}`,20,35);

  // Contact Information Table
  autoTable(doc,{
    startY:y,
    head:[["Contact Information",""]],
    body:[
      ["Name",contact.name],
      ["Email",contact.email],
      ["Phone",contact.phone],
      ["Sector",sector]
    ],
    theme:"grid",
    headStyles:{fillColor:[34,139,34]}
  });

  y = ((doc as PdfWithAutoTable).lastAutoTable?.finalY ?? y) + 10;

  // Project Details
  let projectRows = [];

  if(sector==="Energy"){
    projectRows = [
      ["Renewable Project",energyData.isRenewableProject],
      ["Renewable Category", energyData.isRenewableProject === "Yes" ? energyData.renewableCategory : "N/A"],
      ["Plant Capacity", withUnit(energyData.plantCapacity, energyData.capacityUnit)],
      ["Generation", withUnit(energyData.generation, energyData.unit)],
      ["Project Emission", withUnit(energyData.projectEmission, "tCO2e")]
    ];
  }

  if(sector==="Industry"){
    projectRows = [
      ["Industry Type",industryData.industryType],
      ["Baseline", withUnit(industryData.baseline, "tCO2e")],
      ["Project Description",industryData.projectDescription],
      ["Project Emission", withUnit(industryData.projectEmission, "tCO2e")],
      ["Leakage", withUnit(industryData.leakage, "tCO2e")]
    ];
  }

  if(sector==="Waste handling and disposal"){
    projectRows = [
      ["Gas Removed",wasteData.removedGasType],
      ["Methane Destroyed", withUnit(wasteData.methane, "t")],
      ["Electricity Exported",wasteData.isElectricityExported],
      ["Electricity Export Amount", wasteData.isElectricityExported === "Yes" ? withUnit(wasteData.electricityExport, wasteData.electricityExportUnit) : "N/A"],
      ["Project Emission", withUnit(wasteData.projectEmission, "tCO2e")]
    ];
  }

  autoTable(doc,{
    startY:y,
    head:[["Project Details",""]],
    body:projectRows,
    theme:"grid",
    headStyles:{fillColor:[34,139,34]}
  });

  y = ((doc as PdfWithAutoTable).lastAutoTable?.finalY ?? y) + 15;

  // Carbon Credit Summary Box
  doc.setFillColor(240,248,240);
  doc.rect(15,y-5,180,40,"F");

  doc.setFontSize(14);
  doc.setFont(undefined,"bold");
  doc.text("Carbon Credit Estimate",20,y+5);

  doc.setFont(undefined,"normal");
  doc.setFontSize(12);

  doc.text(`Estimated Credits: ${result?.credits}`,20,y+15);
  doc.text(`Estimated Value (Low): Rs. ${formatCurrency(result?.low)}`,20,y+25);
  doc.text(`Estimated Value (High): Rs. ${formatCurrency(result?.high)}`,20,y+35);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(
    "Generated by BlinkCarbon Carbon Credit Calculator",
    105,
    285,
    {align:"center"}
  );

  doc.save("carbon-credit-report.pdf");
};

const handleExport = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("name", contact.name);
  formData.append("email", contact.email);
  formData.append("phone", contact.phone);
  formData.append("sector", sector);

  formData.append("renewableProject", energyData.isRenewableProject);
  formData.append("renewableCategory", energyData.renewableCategory);
  formData.append("plantCapacity", energyData.plantCapacity);
  formData.append("generation", energyData.generation);
  formData.append("energyEmission", energyData.projectEmission);

  formData.append("industryType", industryData.industryType);
  formData.append("baseline", industryData.baseline);
  formData.append("projectDescription", industryData.projectDescription);
  formData.append("industryEmission", industryData.projectEmission);
  formData.append("leakage", industryData.leakage);

  formData.append("removedGas", wasteData.removedGasType);
  formData.append("methane", wasteData.methane);
  formData.append("electricityExported", wasteData.isElectricityExported);
  formData.append("electricityExport", wasteData.electricityExport);
  formData.append("wasteEmission", wasteData.projectEmission);

  formData.append("credits", result?.credits);
  formData.append("low", result?.low);
  formData.append("high", result?.high);

  // Store in Google Sheet (background request)
  fetch(
    "https://script.google.com/macros/s/AKfycbzUMvlHT9sgRzWgvBJz3mnD0GmNIxUcqWTvWH57hzIePdritSGt1RUftIYif8uLK06J/exec",
    {
      method: "POST",
      body: formData
    }
  ).catch(err => console.log("Sheet error:", err));

  // DOWNLOAD MODE
  if (exportMode === "download") {
    downloadPDF();
    setSent(true);
    return;
  }

  let sectorData = {};

  if (sector === "Energy") {
    sectorData = {
      renewableProject: energyData.isRenewableProject,
      renewableCategory: energyData.isRenewableProject === "Yes" ? energyData.renewableCategory : "N/A",
      plantCapacity: energyData.plantCapacity,
      generation: energyData.generation,
      energyEmission: energyData.projectEmission,
    };
  }

  if (sector === "Industry") {
    sectorData = {
      industryType: industryData.industryType,
      baseline: industryData.baseline,
      projectDescription: industryData.projectDescription,
      industryEmission: industryData.projectEmission,
      leakage: industryData.leakage,
    };
  }

  if (sector === "Waste handling and disposal") {
    sectorData = {
      removedGas: wasteData.removedGasType,
      methane: wasteData.methane,
      electricityExported: wasteData.isElectricityExported,
      electricityExport: wasteData.electricityExport,
      wasteEmission: wasteData.projectEmission,
    };
  }

  const templateParams = {
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    sector: sector,
    credits: result?.credits,
    low: result?.low,
    high: result?.high,
    ...sectorData
  };

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAIL_SERVICE,
      import.meta.env.VITE_EMAIL_TEMPLATE,
      templateParams,
      import.meta.env.VITE_EMAIL_PUBLIC_KEY
    );

    setSent(true);

  } catch (error) {
    console.error("Email sending failed:", error);
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
                    {!showContact ? (
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setExportMode("download");
                            setSent(false);
                            setShowContact(true);
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
                            setShowContact(true);
                          }}
                          className="flex-1 group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-card border border-border font-medium text-sm text-foreground hover:border-primary/20 hover:shadow-soft transition-all"
                        >
                          <Mail className="w-4 h-4" />
                          Email Report
                        </motion.button>
                      </div>
                    ) : sent ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/10 rounded-2xl p-6 text-center">
                        <p className="text-primary font-semibold">
                          {exportMode === "download"
                            ? "✓ Report downloaded successfully."
                            : "✓ Report sent! We'll reach out shortly."}
                        </p>
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
                          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary transition-colors text-sm"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-forest text-primary-foreground font-semibold rounded-2xl transition-all duration-500 hover:shadow-glow"
                        >
                          {exportMode === "download" ? "Download Report" : "Send Report"}
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
