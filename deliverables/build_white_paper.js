const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType } = require("docx");
const PAGE = { size: { width: 12240, height: 15840 } };
const accent = "1F6FEB"; const muted = "5B6B7A";

function title(text){ return new Paragraph({ children:[new TextRun({text, bold:true, size:34, color:accent})], spacing:{after:60} }); }
function h1(text){ return new Paragraph({ text, heading:HeadingLevel.HEADING_1, spacing:{before:280,after:140} }); }
function h2(text){ return new Paragraph({ text, heading:HeadingLevel.HEADING_2, spacing:{before:220,after:100} }); }
function p(text){ return new Paragraph({ children:[new TextRun({text, size:20})], spacing:{after:130} }); }
function note(text){ return new Paragraph({ children:[new TextRun({text, italics:true, color:muted, size:19})], spacing:{after:150} }); }
function bullet(text){ return new Paragraph({ text, bullet:{level:0}, spacing:{after:60}, children:undefined }); }
function bulletT(text){ return new Paragraph({ bullet:{level:0}, spacing:{after:60}, children:[new TextRun({text, size:20})] }); }

function table(headers, rows, widths){
  return new Table({
    width:{size: widths.reduce((a,b)=>a+b,0), type:WidthType.DXA},
    columnWidths: widths,
    rows: [
      new TableRow({ children: headers.map((t,i)=> new TableCell({ width:{size:widths[i],type:WidthType.DXA}, shading:{type:ShadingType.CLEAR, fill:accent}, children:[new Paragraph({children:[new TextRun({text:t,bold:true,color:"FFFFFF",size:18})]})] })) }),
      ...rows.map(r => new TableRow({ children: r.map((t,i)=> new TableCell({ width:{size:widths[i],type:WidthType.DXA}, children:[new Paragraph({children:[new TextRun({text:String(t),size:18})]})] })) }))
    ]
  });
}

const rankedRows = [
  [1,"AI/ML for Predictive Maintenance","Digital / Analytics",77.2,"ESTIMATED"],
  [2,"Advanced Sensor Technologies","Materials Science",65.3,"ESTIMATED"],
  [3,"Small Modular Reactors (SMRs)","Reactor Technology",63.8,"VERIFIED"],
  [4,"Robotic Nuclear Inspection Systems","Robotics / Inspection",63.6,"ESTIMATED"],
  [5,"Digital Twins for Nuclear Plants","Digital / Analytics",63.5,"ESTIMATED"],
  [6,"Inspection & Survey Drones","Robotics / Inspection",62.7,"ESTIMATED"],
  [7,"Additive Manufacturing","Advanced Manufacturing",55.0,"ESTIMATED"],
  [8,"Medical Isotope Production","Medical / Isotopes",48.6,"ESTIMATED"],
  [9,"Decommissioning Technologies","Waste & Decommissioning",47.0,"ESTIMATED"],
  [10,"VR/AR Workforce Training","Digital / Analytics",46.7,"ESTIMATED"],
  [11,"Advanced Fission (Gen IV)","Reactor Technology",38.4,"ESTIMATED"],
  [12,"Smart Materials & Sensor Coatings","Materials Science",37.2,"ASSUMPTION"],
  [13,"Fusion Energy Technologies","Reactor Technology",34.2,"ESTIMATED"],
  [14,"Nuclear Waste Management","Waste & Decommissioning",31.6,"ESTIMATED"],
];

const criteriaRows = [
  ["Strategic fit", "0.15", "Alignment to Kinectrics' own stated innovation focus areas — the strongest available proxy for organizational buy-in."],
  ["Revenue/cost-saving impact", "0.13", "Direct proxy for commercial value creation, the core purpose of an Innovation Hub."],
  ["Market growth potential", "0.12", "Larger addressable growth implies larger long-run upside."],
  ["Technical feasibility", "0.12", "Execution risk is independent of market appeal and must be weighted on its own."],
  ["Safety/regulatory complexity (inverted)", "0.10", "Direct proxy for time-to-approval and execution risk in a CNSC-regulated environment."],
  ["Implementation cost (inverted)", "0.10", "Lower cost lowers the bar for a first pilot commitment."],
  ["IP potential", "0.08", "Defensible IP supports long-term competitive advantage."],
  ["Commercialization timeline (inverted)", "0.08", "Faster time-to-value fits a co-op-driven, annually-reported innovation pipeline."],
  ["Sustainability impact", "0.07", "Reflects stated cultural priority without overriding commercial criteria."],
  ["Competitive intensity (inverted)", "0.05", "Lowest weight — a crowded field can still be attractive with a differentiated angle."],
];

const doc = new Document({ sections:[{
  properties:{ page:{...PAGE, margin:{top:1080,bottom:1080,left:1080,right:1080}} },
  children:[
    title("Technical White Paper"),
    new Paragraph({ children:[new TextRun({text:"Nuclear & Clean-Energy Innovation Opportunity Intelligence Platform", size:24})], spacing:{after:40} }),
    new Paragraph({ children:[new TextRun({text:"Jaskaran Singh  |  July 2026  |  Independent portfolio project", italics:true, color:muted, size:19})], spacing:{after:260} }),
    note("Not affiliated with, commissioned by, or reviewed by Kinectrics Inc. All company/technology names are used for illustrative, educational purposes based on public information."),

    h1("1. Purpose and Scope"),
    p("This white paper documents the methodology behind a decision-support platform that identifies, evaluates, and ranks 14 emerging nuclear and clean-energy technologies for research, investment, partnership, or commercialization decisions. It is written to be defensible in a technical or business review: every method choice below is stated with its rationale and its limitation, not just its result."),

    h1("2. Technology Universe and Data Collection"),
    p("The 14 technologies were scoped directly from the focus-area list in a public Kinectrics job posting (Strategic Growth & Innovation Co-op), spanning digital/analytics, robotics, advanced manufacturing, materials science, medical isotopes, waste/decommissioning, and reactor technology categories. Each technology was profiled across 15 structured fields (problem addressed, TRL, market growth potential, strategic fit, commercialization timeline, cost tier, regulatory complexity, technical feasibility, competitive intensity, revenue impact, IP potential, sustainability impact, partnership opportunities, evidence source, and a confidence tag)."),
    p("Data honesty policy: every field carries one of three confidence tags — VERIFIED (a specific, checkable claim from a named public source), ESTIMATED (the author's reasoned judgment, informed by public sources, not a number published verbatim), or ASSUMPTION (a working assumption with weak or no public evidence located). Across the 14-technology dataset, 1 technology (Small Modular Reactors) carries a VERIFIED confidence tag on its headline data point (the OECD NEA's count of 127 tracked SMR designs globally); the remainder are ESTIMATED, and one (Smart Materials & Advanced Sensor Coatings) is flagged ASSUMPTION because no independent public source specific to that technology was located during this research pass. This distribution is disclosed, not smoothed over — see data/data_dictionary.md for the full policy and data/source_register.csv for every source used."),

    h1("3. Scoring Model Methodology"),
    h2("3.1 Normalization"),
    p("Every criterion is rescaled to a common 0-100 range using min-max scaling within this dataset: score = (x - min) / (max - min) × 100. This is a relative ranking tool — it identifies which of these 14 technologies look most attractive relative to each other, not an absolute investment-grade score. Adding or removing a technology from the set can shift every other technology's normalized score even if that technology's own inputs are unchanged; this is an explicit, stated limitation of min-max normalization, not an oversight."),
    h2("3.2 Direction and Weights"),
    p("Six criteria are 'higher is better' (market growth, strategic fit, feasibility, revenue impact, IP potential, sustainability) and four are 'lower is better' (cost, regulatory complexity, competitive intensity, commercialization timeline) — the latter are inverted after normalization so that 100 always means 'favorable to ranking' across every criterion. Weights are explicit and sum to 1.0:"),
    table(["Criterion","Weight","Rationale"], criteriaRows, [3200, 900, 5000]),
    h2("3.3 Sensitivity Analysis"),
    p("Each weight was perturbed ±20%, with the freed or absorbed weight redistributed proportionally across the remaining nine criteria so weights continue to sum to 1.0. Across all 10 perturbations (20 scenarios total), the #1-ranked technology (AI/ML for Predictive Maintenance) never changed rank — the largest observed swing in its composite score was 2.68 points (driven by the IP-potential weight), out of a maximum theoretical range and well short of displacing the #2-ranked technology (Advanced Sensor Technologies, base score 65.3 vs. 77.2). This stability is a meaningful finding: it means the top recommendation does not depend on a fragile or contestable weighting choice. Full results: data/sensitivity_analysis.csv and data/tornado_summary.csv."),

    h1("4. Ranked Results (Base Case)"),
    table(["Rank","Technology","Category","Score","Confidence"], rankedRows, [700,3300,2600,1200,1400]),

    h1("5. NLP / AI Component"),
    p("The problem this component solves: one analyst cannot manually read the full literature and industry-news landscape across 14 distinct technology areas before making a recommendation. A TF-IDF vectorization + KMeans clustering pipeline was built and run against a real, source-linked corpus of 34 public documents (research papers, agency reports, and industry coverage) spanning 8 of the 14 technology categories, gathered via live web search on 2026-07-17 (see data/research_corpus.csv)."),
    p("Method choice: TF-IDF + KMeans was chosen over transformer/sentence-embedding models because the build environment could not reliably support large model-weight downloads, and — more importantly — TF-IDF is fully interpretable: every clustering decision traces back to specific weighted terms, which matters when defending the method to a non-technical audience. This trade-off is stated explicitly, not hidden."),
    p("Validation: clustering was checked against the known category label for each document (a label the clustering algorithm never saw). All 8 clusters achieved 100% category purity — every cluster's dominant category matched its members' true labels — which is strong evidence the term-based clustering is capturing real topical structure, not noise."),
    p("Semantic search: a cosine-similarity search function over the same TF-IDF vectors was demonstrated against five natural-language queries (e.g., 'using robots to inspect radioactive equipment without human exposure'), each returning the correct topically-relevant real documents with working source URLs — see data/nlp_semantic_search_demo.csv. Every returned result is a real, checkable document; nothing is generated or hallucinated."),
    p("Scale note: the corpus covers 8 of 14 technologies because outbound requests to bulk literature APIs (OpenAlex, arXiv) were blocked by this project's build-environment network policy (confirmed via direct connection test). src/openalex_pull_template.py documents the exact, ready-to-run code for a full 14-technology, API-scale corpus pull in an environment with open network access — the clustering/search logic itself is corpus-agnostic and requires no changes."),

    h1("6. Dashboard"),
    p("A Power BI-ready star schema (dashboard/powerbi_dataset/) and a page-by-page build guide (dashboard/powerbi_build_guide.md) were produced covering an executive overview, ranked portfolio, TRL-vs-market matrix, cost-vs-impact view, and risk analysis, plus a technology-profile drill-through. Because Power BI Desktop is Windows-only desktop software unavailable in this project's build environment, the .pbix file itself could not be produced directly; a working interactive HTML dashboard (dashboard/dashboard_preview.html) mirroring the same page layout and using the same underlying data was built as a substitute, so the analytical output is reviewable without Power BI installed."),

    h1("7. Limitations and Assumptions"),
    bulletT("This is a public-information research and modeling exercise, not a market-research report — most inputs are the author's ESTIMATED judgment, not primary industry data (see Section 2)."),
    bulletT("Min-max normalization makes rankings set-relative; scores should not be read as absolute investment grades (Section 3.1)."),
    bulletT("The scoring model cannot capture interaction effects between technologies (e.g., sensors and digital twins are complementary, not independent) — each technology is scored in isolation."),
    bulletT("The NLP corpus covers 8 of 14 technologies due to a network constraint in the build environment, not a design choice (Section 5)."),
    bulletT("No dollar figures in the dataset or business case are invented; where a specific public figure could not be verified, a qualitative tier (Low/Medium/High) or the word 'illustrative' is used instead."),
    bulletT("The platform does not imply nuclear-engineering expertise beyond what a public-information analyst role would require, and does not use or imply access to any Kinectrics-proprietary data or relationship."),

    h1("8. Ethical Considerations"),
    p("Every quantitative claim in this platform is traceable to either a named public source or is explicitly labeled as the author's estimate or assumption — this distinction is preserved through every deliverable (dataset, scoring model, business case, dashboard) rather than collapsed into a single polished-looking number. No content in this project claims Kinectrics involvement, endorsement, or proprietary data access, and no persuasive or market figures were fabricated to make the project 'look' more impressive than the underlying research supports."),
  ]
}]});

Packer.toBuffer(doc).then(buf=>{ require("fs").writeFileSync("deliverables/technical_white_paper.docx", buf); console.log("Wrote deliverables/technical_white_paper.docx"); });
