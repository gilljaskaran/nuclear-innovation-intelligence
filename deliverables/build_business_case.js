const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, BorderStyle, AlignmentType, LevelFormat, convertInchesToTwip
} = require("docx");

const PAGE = { size: { width: 12240, height: 15840 } }; // US Letter

const muted = "5B6B7A";
const accent = "1F6FEB";

function h1(text) { return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 150 } }); }
function h2(text) { return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } }); }
function p(text, opts = {}) { return new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 140 } }); }
function bullet(text) { return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 60 } }); }
function label(text) { return new TextRun({ text, bold: true }); }
function note(text) { return new Paragraph({ children: [new TextRun({ text, italics: true, color: muted, size: 20 })], spacing: { after: 160 } }); }

function twoCol(rows, widths = [3000, 6500]) {
  return new Table({
    width: { size: widths[0] + widths[1], type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map(([k, v]) => new TableRow({
      children: [
        new TableCell({ width: { size: widths[0], type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill: "F0F3F7" },
          children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, size: 20 })] })] }),
        new TableCell({ width: { size: widths[1], type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: v, size: 20 })] })] }),
      ]
    }))
  });
}

const doc = new Document({
  sections: [{
    properties: { page: { ...PAGE, margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
    children: [
      new Paragraph({ children: [new TextRun({ text: "Business Case", bold: true, size: 40, color: accent })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: "AI/ML-Based Predictive Maintenance for Nuclear Plant Equipment", size: 28 })], spacing: { after: 40 } }),
      new Paragraph({ children: [new TextRun({ text: "Nuclear & Clean-Energy Innovation Opportunity Intelligence Platform — Portfolio Project", italics: true, color: muted, size: 20 })], spacing: { after: 20 } }),
      new Paragraph({ children: [new TextRun({ text: "Prepared by Karan Gill  |  July 2026", color: muted, size: 20 })], spacing: { after: 300 } }),

      note("Independent portfolio research project. Not affiliated with, commissioned by, or reviewed by Kinectrics Inc. Figures marked \"illustrative\" are the author's estimates for demonstration purposes and are not derived from any Kinectrics-internal data. See data/data_dictionary.md and the technical white paper for the full confidence-labeling policy (VERIFIED / ESTIMATED / ASSUMPTION)."),

      h1("1. Executive Summary"),
      p("This business case evaluates AI/ML-based predictive maintenance as the top-ranked opportunity from a 14-technology innovation portfolio screen, using a transparent weighted-scoring model (composite score 77.2 of 100 — highest in the set; see the innovation roadmap and white paper for the full ranked list). The opportunity: apply machine-learning models to existing plant sensor and maintenance-history data to predict equipment failure before it occurs, reducing unplanned outages and reactive-maintenance cost."),
      p("Predictive maintenance scores highest in this model primarily because it combines the lowest implementation-cost tier, the lowest regulatory-complexity rating, and the highest technical-feasibility rating of any technology in the portfolio, while directly matching Kinectrics' own publicly stated AI/ML innovation focus area. The recommendation is a phased, low-capital pilot rather than a large upfront commitment: start with a single, well-instrumented equipment class, validate model performance against historical failure records, and expand only after that validation clears a defined accuracy threshold."),
      p("Recommendation: ", { bold: true }),
      p("GO — proceed to a scoped proof-of-concept (Phase 1 of the roadmap), conditional on securing 12-24 months of historical maintenance/sensor data for at least one equipment class. This condition is the single largest risk to the business case and is discussed in Section 13."),

      h1("2. Customer / Operational Problem"),
      p("Unplanned equipment failures on nuclear plant auxiliary and balance-of-plant systems drive both direct cost (emergency repair, replacement parts, overtime labour) and indirect cost (outage duration, capacity factor loss). Traditional maintenance approaches are either time-based (fixed schedules regardless of actual equipment condition, which over-maintains healthy equipment and under-protects against atypical failure modes) or reactive (repair after failure, the costliest and highest-risk mode). Condition-based, predictive maintenance aims to intervene in the narrow window after a failure signature appears but before failure occurs — the problem is detecting that signature reliably enough to act on it with confidence."),

      h1("3. Proposed Solution"),
      p("A machine-learning pipeline that ingests existing sensor telemetry (vibration, temperature, pressure, flow) and historical maintenance/work-order records for a defined equipment class, trains anomaly-detection and remaining-useful-life models, and outputs a prioritized, explainable maintenance work list to plant engineers — augmenting, not replacing, engineering judgment. Explainability is a deliberate design constraint: published research on this exact application area notes that low model explainability is one of the main adoption barriers in nuclear predictive maintenance (see white paper source register), so the recommended approach favours interpretable models (gradient-boosted trees, survival analysis) over black-box deep learning where performance is comparable."),

      h1("4. Market Opportunity"),
      p("Cross-industry predictive-maintenance adoption (aviation, oil & gas, general power generation) is well-established and generally reports meaningful reductions in unplanned downtime; nuclear-specific adoption is earlier-stage but is explicitly named as an active growth area in the IAEA's Nuclear Technology Review 2025. This is treated as a directional, not quantified, market signal in this business case — no nuclear-specific predictive-maintenance market-size figure could be independently verified during this research and none is asserted here."),

      h1("5. Strategic Fit"),
      p("Directly named in Kinectrics' own listed Innovation Hub focus areas (AI-ML). Ranked #1 of 14 in the composite scoring model on strategic fit, technical feasibility, and cost, and rank-stable under ±20% sensitivity testing on every individual scoring weight (see white paper, Section on Sensitivity Analysis) — meaning this recommendation does not depend on a fragile weighting assumption."),

      h1("6. Stakeholder Analysis"),
      twoCol([
        ["Plant maintenance engineers", "Primary end users of model output; must trust and act on recommendations. Early involvement in defining explainability requirements is critical to adoption."],
        ["Reliability/asset management team", "Owns maintenance scheduling; needs the tool to integrate with existing CMMS (computerized maintenance management system) workflows, not replace them."],
        ["Innovation Hub leadership", "Sponsors the pilot; needs a low-cost, low-risk proof-of-concept structure to justify continued funding."],
        ["CNSC (regulator)", "Indirect stakeholder — a decision-support tool does not itself require licensing review, but any resulting change to a maintenance program tied to the safety basis would."],
        ["IT/OT security team", "Must approve any new data pipeline connecting operational technology (OT) sensor networks to an analytics environment."],
      ]),

      h1("7. Competitor / Alternative Analysis"),
      p("Established industrial vendors (e.g., GE, Siemens) and EPRI-affiliated programs already offer predictive-maintenance platforms for power generation broadly. The competitive angle for an internal Kinectrics initiative is not out-innovating these vendors on core ML technique, but building nuclear-specific, explainable models calibrated to Kinectrics' own equipment and failure-history data — a differentiation that generic vendor platforms cannot offer out of the box. The alternative to building is buying/licensing an existing platform; this business case recommends a build-small, prove-value-first approach specifically because a small pilot is cheap enough to de-risk that build-vs-buy decision before committing to either path at scale."),

      h1("8. Technical Feasibility"),
      p("Rated 5/5 (highest in the portfolio) in the scoring model. Feasibility rests on three assumptions that should be validated in Phase 1, not assumed: (1) sufficient historical labeled failure data exists for the chosen equipment class, (2) sensor data quality/sampling rate is adequate for the chosen model type, and (3) IT/OT integration is achievable without new hardware investment. None of these were independently verified against Kinectrics-specific systems for this project, since no such internal data was accessible — this is the single most important gap between this desk-based business case and a decision a real sponsor could act on unconditionally."),

      h1("9. Commercialization Pathway"),
      p("Recommended path (see the full innovation_roadmap.md for stage gates and owners): (1) Research & validation — confirm data availability and define the target equipment class and success metric; (2) Proof of concept — train and back-test a model against 12-24 months of historical data on one equipment class; (3) Pilot — deploy in shadow mode (recommendations shown to engineers, not acted on automatically) for one operating cycle; (4) Review — compare pilot-period outcomes to the prior baseline; (5) Scale — extend to additional equipment classes only after the pilot clears a pre-agreed accuracy/adoption threshold."),

      h1("10. Partnership Strategy"),
      p("Potential collaborators: EPRI (existing predictive-maintenance research programs), university machine-learning departments (e.g., Ontario Tech/UOIT's nuclear engineering program) for model-development support, and internal IT/OT teams for data-pipeline integration. No partnership has been discussed with, or confirmed by, any of the organizations named here — these are illustrative candidates based on public information about their general activity in this space, not existing relationships."),

      h1("11. Preliminary CAPEX and Operating-Cost Assumptions (Illustrative)"),
      note("All figures below are ILLUSTRATIVE planning assumptions for a small internal pilot, built from general knowledge of typical data-science tooling and staffing costs — not quotes, not Kinectrics figures, and not derived from any named source. They exist to show the shape of a cost model, not to assert a specific budget."),
      twoCol([
        ["Phase 1-2 (research + PoC)", "Illustrative: primarily labour (1 analyst/co-op, part-time technical mentor), plus commodity cloud-compute cost for model training. No new hardware capex assumed."],
        ["Phase 3 (pilot)", "Illustrative: modest cloud-hosting/inference cost for shadow-mode deployment; no plant-system modification, since output is advisory only."],
        ["Ongoing (post-scale)", "Illustrative: cost driven mainly by data-pipeline maintenance and periodic model retraining, not by new capital equipment."],
      ]),

      h1("12. Benefits and Potential Impact"),
      p("The realistic, evidence-grounded claim is directional, not quantified: predictive maintenance is broadly reported (across industries, and increasingly in early nuclear-specific literature) to reduce unplanned-outage frequency and reactive-maintenance cost relative to time-based maintenance alone. Kinectrics-specific savings cannot be estimated without access to Kinectrics' own outage-cost and failure-rate data, which this project does not have. The pilot design in Section 9 is deliberately structured so that Phase 3 (shadow-mode pilot) generates exactly the before/after comparison data needed to replace this directional claim with a Kinectrics-specific number before any scale-up decision is made."),

      h1("13. Risks and Mitigations"),
      twoCol([
        ["Data availability/quality", "Highest risk to this entire business case. Mitigation: make data-access confirmation the explicit Phase 1 gate before any model development spend."],
        ["Model explainability / engineer trust", "Predictive-maintenance literature flags this as a primary adoption barrier. Mitigation: favour interpretable model classes and run in advisory (shadow) mode before any automated action."],
        ["OT/IT security integration", "New data pipelines touching operational technology require security review. Mitigation: engage IT/OT security early, in Phase 1, not at deployment."],
        ["False positives eroding trust", "Over-alerting engineers on low-confidence predictions can cause the tool to be ignored. Mitigation: set a conservative confidence threshold for Phase 3 and tune based on shadow-mode feedback."],
        ["Scope creep beyond one equipment class", "Mitigation: the roadmap's stage-gate structure explicitly blocks expansion until Phase 3 success criteria are met."],
      ]),

      h1("14. Key Performance Indicators"),
      bullet("Phase 1 gate: confirmed access to ≥12 months of historical maintenance/sensor data for the target equipment class (binary go/no-go)."),
      bullet("Phase 2 (PoC): model back-tested accuracy/precision-recall on historical failure events, versus a defined baseline."),
      bullet("Phase 3 (pilot): engineer adoption rate of model recommendations during shadow-mode operation; qualitative engineer feedback."),
      bullet("Phase 3 (pilot): change in unplanned-maintenance-event rate on the pilot equipment class versus the prior comparable period."),
      bullet("Post-scale: reduction in outage-hours attributable to the pilot equipment class (requires a full operating cycle of data to assess)."),

      h1("15. Go/No-Go Recommendation"),
      p("GO, conditional on the Phase 1 data-access gate in Section 13.", { bold: true }),
      p("This recommendation rests on three factors that are independently defensible without invoking any unverified market-size figure: predictive maintenance is the lowest-cost, lowest-regulatory-complexity, highest-feasibility opportunity in the full 14-technology portfolio screen; the ranking is stable under sensitivity testing rather than an artifact of a single weighting choice; and the proposed phased structure requires only a small, reversible commitment before any larger investment decision, directly addressing the one genuine unknown (data availability) that this desk-based analysis cannot resolve on its own."),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  require("fs").writeFileSync("deliverables/business_case_ai_predictive_maintenance.docx", buf);
  console.log("Wrote deliverables/business_case_ai_predictive_maintenance.docx");
});
