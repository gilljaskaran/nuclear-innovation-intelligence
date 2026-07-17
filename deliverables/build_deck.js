const pptxgen = require("pptxgenjs");

// Palette: "Midnight Executive" + amber accent — navy dominant, ice-blue secondary, amber accent
const NAVY = "0B1F3A";
const NAVY2 = "13315C";
const ICE = "CADCFC";
const AMBER = "EE964B";
const WHITE = "FFFFFF";
const MUTED_ON_DARK = "8FA6C4";
const MUTED_ON_LIGHT = "5B6B7A";
const DARKTEXT = "1B2733";
const CARDBG = "F2F5FA";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5

function iconCircle(slide, x, y, d, fill, label, labelColor) {
  slide.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill } });
  slide.addText(label, { x, y, w: d, h: d, align: "center", valign: "middle", fontFace: "Calibri", fontSize: 20, bold: true, color: labelColor });
}

// ---------------- Slide 1: Title ----------------
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addShape(pres.ShapeType.rect, { x: 0, y: 4.75, w: 13.33, h: 2.75, fill: { color: NAVY2 }, line: { type: "none" } });
  s.addText("NUCLEAR  &  CLEAN-ENERGY  INNOVATION", { x: 0.7, y: 1.3, w: 11.9, h: 0.5, fontFace: "Calibri", fontSize: 15, color: AMBER, bold: true, charSpacing: 3 });
  s.addText("Opportunity Intelligence Platform", { x: 0.7, y: 1.8, w: 11.9, h: 1.4, fontFace: "Cambria", fontSize: 40, color: WHITE, bold: true });
  s.addText("Scoring, ranking, and building a business case for 14 emerging technologies relevant to nuclear innovation and business development.", { x: 0.7, y: 3.15, w: 10.3, h: 1.0, fontFace: "Calibri", fontSize: 16, color: ICE, italic: true });
  s.addText("Karan Gill   |   Portfolio Project   |   July 2026", { x: 0.7, y: 5.15, w: 8, h: 0.5, fontFace: "Calibri", fontSize: 14, color: MUTED_ON_DARK });
  s.addText("Independent research project — not affiliated with, commissioned by, or reviewed by any employer named within.", { x: 0.7, y: 6.85, w: 11.9, h: 0.4, fontFace: "Calibri", fontSize: 10, color: MUTED_ON_DARK, italic: true });
}

// ---------------- Slide 2: Approach ----------------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("How the Platform Works", { x: 0.6, y: 0.45, w: 12, h: 0.7, fontFace: "Cambria", fontSize: 30, bold: true, color: NAVY });
  s.addText("Four stages, one traceable chain from public source to recommendation", { x: 0.6, y: 1.05, w: 12, h: 0.4, fontFace: "Calibri", fontSize: 14, italic: true, color: MUTED_ON_LIGHT });

  const steps = [
    ["1", "Research", "14 technologies profiled from public sources (IAEA, OECD NEA, CNSC, DOE, NWMO). Every field tagged VERIFIED / ESTIMATED / ASSUMPTION."],
    ["2", "Score", "Transparent weighted model, 10 criteria, adjustable weights, full sensitivity analysis on every weight."],
    ["3", "Synthesize", "TF-IDF + KMeans clustering and semantic search over a real, source-linked research corpus — 100% cluster-to-category validation."],
    ["4", "Recommend", "Ranked dashboard, business case, and stage-gated roadmap for the top opportunity."],
  ];
  const cardW = 2.95, gap = 0.25, startX = 0.6, y = 1.85, h = 4.6;
  steps.forEach((st, i) => {
    const x = startX + i * (cardW + gap);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: cardW, h, rectRadius: 0.08, fill: { color: CARDBG }, line: { type: "none" }, shadow: { type: "outer", color: "9AA5B1", opacity: 0.35, blur: 6, offset: 2, angle: 90 } });
    iconCircle(s, x + cardW / 2 - 0.35, y + 0.35, 0.7, i === 3 ? AMBER : NAVY2, st[0], WHITE);
    s.addText(st[1], { x: x + 0.2, y: y + 1.25, w: cardW - 0.4, h: 0.5, fontFace: "Calibri", fontSize: 17, bold: true, color: NAVY, align: "center" });
    s.addText(st[2], { x: x + 0.25, y: y + 1.8, w: cardW - 0.5, h: h - 2.0, fontFace: "Calibri", fontSize: 12.5, color: DARKTEXT, align: "left" });
  });
}

// ---------------- Slide 3: Ranked results (native chart) ----------------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("Ranked Opportunity Portfolio", { x: 0.6, y: 0.4, w: 12, h: 0.7, fontFace: "Cambria", fontSize: 30, bold: true, color: NAVY });
  s.addText("Composite score (0-100), weighted model — top 8 of 14 technologies shown", { x: 0.6, y: 1.0, w: 12, h: 0.4, fontFace: "Calibri", fontSize: 14, italic: true, color: MUTED_ON_LIGHT });

  const labels = ["AI/ML Predictive\nMaintenance", "Advanced Sensor\nTech", "SMRs", "Robotic\nInspection", "Digital\nTwins", "Inspection\nDrones", "Additive\nManufacturing", "Medical\nIsotopes"];
  const values = [77.2, 65.3, 63.8, 63.6, 63.5, 62.7, 55.0, 48.6];
  const colors = values.map((v, i) => (i === 0 ? AMBER : NAVY2));

  s.addChart(pres.ChartType.bar, [{ name: "Composite Score", labels, values }], {
    x: 0.6, y: 1.55, w: 12.1, h: 5.5,
    barDir: "bar",
    chartColors: colors,
    showTitle: false,
    showLegend: false,
    showValue: true,
    dataLabelPosition: "outEnd",
    dataLabelColor: DARKTEXT,
    dataLabelFontSize: 11,
    catAxisLabelColor: DARKTEXT,
    catAxisLabelFontSize: 11,
    valAxisLabelColor: MUTED_ON_LIGHT,
    valAxisLabelFontSize: 10,
    valAxisMaxVal: 100,
    valGridLine: { color: "E3E8EF", size: 1 },
    catGridLine: { style: "none" },
  });
}

// ---------------- Slide 4: Recommendation ----------------
{
  const s = pres.addSlide();
  s.background = { color: NAVY };
  s.addText("Recommendation", { x: 0.6, y: 0.45, w: 12, h: 0.7, fontFace: "Cambria", fontSize: 30, bold: true, color: WHITE });
  s.addText("AI/ML-Based Predictive Maintenance — highest-ranked, rank-stable under sensitivity testing", { x: 0.6, y: 1.05, w: 12, h: 0.5, fontFace: "Calibri", fontSize: 15, italic: true, color: ICE });

  const stats = [
    ["77.2", "Composite score\n(highest of 14)"],
    ["Low", "Implementation\ncost tier"],
    ["5 / 5", "Technical\nfeasibility rating"],
    ["2 / 5", "Regulatory\ncomplexity (lower = better)"],
  ];
  const cw = 2.85, gap = 0.25, sx = 0.6, sy = 1.95;
  stats.forEach((st, i) => {
    const x = sx + i * (cw + gap);
    s.addShape(pres.ShapeType.roundRect, { x, y: sy, w: cw, h: 1.9, rectRadius: 0.08, fill: { color: NAVY2 }, line: { type: "none" } });
    s.addText(st[0], { x, y: sy + 0.2, w: cw, h: 0.9, align: "center", fontFace: "Cambria", fontSize: 34, bold: true, color: AMBER });
    s.addText(st[1], { x: x + 0.15, y: sy + 1.15, w: cw - 0.3, h: 0.65, align: "center", fontFace: "Calibri", fontSize: 12, color: ICE });
  });

  s.addText("GO — proceed to a scoped proof-of-concept", { x: 0.6, y: 4.15, w: 12, h: 0.5, fontFace: "Calibri", fontSize: 18, bold: true, color: WHITE });
  const bullets = [
    { text: "Condition: confirm 12-24 months of historical maintenance/sensor data for one equipment class before committing model-development time.", options: { bullet: true, breakLine: true } },
    { text: "Phased path: research & validation → proof of concept → shadow-mode pilot → scale, each gated on the prior stage's success criteria.", options: { bullet: true, breakLine: true } },
    { text: "Full detail: business_case_ai_predictive_maintenance.docx and innovation_roadmap.md.", options: { bullet: true } },
  ];
  s.addText(bullets, { x: 0.6, y: 4.7, w: 12, h: 2.2, fontFace: "Calibri", fontSize: 14, color: ICE, paraSpaceAfter: 10 });
}

// ---------------- Slide 5: What this demonstrates ----------------
{
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText("What This Demonstrates", { x: 0.6, y: 0.45, w: 12, h: 0.7, fontFace: "Cambria", fontSize: 30, bold: true, color: NAVY });
  s.addText("Mapped directly to the Strategic Growth & Innovation Co-op role", { x: 0.6, y: 1.05, w: 12, h: 0.4, fontFace: "Calibri", fontSize: 14, italic: true, color: MUTED_ON_LIGHT });

  const rows = [
    ["Investigate & synthesize", "14-technology public-source dataset with full confidence labeling (VERIFIED / ESTIMATED / ASSUMPTION)."],
    ["Market & competitive analysis", "Market assessment grounded in named, checkable sources — including a real Kinectrics-adjacent fact (the Isogen medical-isotope joint venture)."],
    ["Applied AI/ML", "NLP pipeline solving a real triage problem, validated at 100% cluster-to-category accuracy — not added for its own sake."],
    ["Business case & roadmap", "Full CAPEX/OPEX framing, stage-gated roadmap, risk register, and an honest go/no-go call with a stated open condition."],
  ];
  const rowH = 1.15, startY = 1.75;
  rows.forEach((r, i) => {
    const y = startY + i * (rowH + 0.12);
    iconCircle(s, 0.6, y + 0.12, 0.65, i % 2 === 0 ? NAVY2 : AMBER, String(i + 1), WHITE);
    s.addText(r[0], { x: 1.55, y: y, w: 3.6, h: rowH, valign: "middle", fontFace: "Calibri", fontSize: 16, bold: true, color: NAVY });
    s.addText(r[1], { x: 5.3, y: y, w: 7.4, h: rowH, valign: "middle", fontFace: "Calibri", fontSize: 13, color: DARKTEXT });
  });
}

pres.writeFile({ fileName: "deliverables/executive_presentation.pptx" }).then(() => console.log("Wrote deliverables/executive_presentation.pptx"));
