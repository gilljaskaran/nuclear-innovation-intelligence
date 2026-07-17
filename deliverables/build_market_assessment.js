const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");
const PAGE = { size: { width: 12240, height: 15840 } };
const accent = "1F6FEB"; const muted = "5B6B7A";

function title(text){ return new Paragraph({ children:[new TextRun({text, bold:true, size:34, color:accent})], spacing:{after:60} }); }
function h1(text){ return new Paragraph({ text, heading:HeadingLevel.HEADING_1, spacing:{before:260,after:130} }); }
function h2(text){ return new Paragraph({ text, heading:HeadingLevel.HEADING_2, spacing:{before:200,after:90} }); }
function p(text){ return new Paragraph({ children:[new TextRun({text, size:20})], spacing:{after:130} }); }
function note(text){ return new Paragraph({ children:[new TextRun({text, italics:true, color:muted, size:19})], spacing:{after:150} }); }
function src(text){ return new Paragraph({ children:[new TextRun({text, size:17, color:muted})], spacing:{after:150} }); }

const doc = new Document({ sections:[{
  properties:{ page:{...PAGE, margin:{top:1080,bottom:1080,left:1080,right:1080}} },
  children:[
    title("Market Assessment"),
    new Paragraph({ children:[new TextRun({text:"Nuclear & Clean-Energy Innovation Opportunity Intelligence Platform", size:24})], spacing:{after:40} }),
    new Paragraph({ children:[new TextRun({text:"Jaskaran Singh  |  July 2026  |  Independent portfolio project", italics:true, color:muted, size:19})], spacing:{after:260} }),
    note("This assessment reports only market signals independently found via public web search on 2026-07-17, each cited to its source. Where no specific, checkable figure could be found for a technology category, that gap is stated rather than filled with an invented number. This is directional market context to inform the scoring model's 'market growth potential' field, not a market-research firm's market-sizing report."),

    h1("1. Small Modular Reactors (SMR)"),
    p("The OECD Nuclear Energy Agency's SMR Dashboard, Third Edition (data as of February 2025), tracked 127 distinct SMR designs globally, with 74 analyzed in depth, 51 in pre-licensing or licensing processes, and 85 active siting discussions between developers and site owners — an 81% increase in designs with secured funding or funding announcements versus the prior (2024) edition. In Canada specifically, Ontario Power Generation's Darlington New Nuclear Project (GE Hitachi BWRX-300) is a publicly reported SMR build already underway, making Ontario a live, near-term Canadian SMR market rather than a purely speculative one."),
    src("Source: OECD NEA Small Modular Reactor Dashboard, Third Edition — https://www.oecd-nea.org/jcms/pl_108326/the-nea-small-modular-reactor-dashboard-third-edition; World Nuclear News coverage — https://www.world-nuclear-news.org/articles/there-are-now-127-different-smr-designs-finds-nea-report"),
    note("A commercial market-research estimate found during this search (a claimed 42.31% CAGR and growth from $159.4M in 2024 to $5.17B by 2035) comes from a syndicated market-research press release, not a named primary agency source, and is reported here only as a directional data point, not treated as verified fact in the scoring model."),

    h1("2. Fusion Energy"),
    p("Public reporting describes roughly 50 private fusion companies globally with more than $9 billion in cumulative private investment advancing burning-plasma demonstrations and prototype reactor designs. The US Department of Energy has published a fusion science and technology roadmap targeting commercial fusion power delivery to the grid by the mid-2030s, and named commercial milestones include Helion Energy's power-purchase agreement with Microsoft (targeting 50 MW by 2028) and Commonwealth Fusion Systems' tokamak development in Massachusetts. Canada has its own fusion venture, General Fusion."),
    src("Source: IDTechEx research article — https://www.idtechex.com/en/research-article/fusion-energy-no-longer-30-years-away/33122; US DOE fusion roadmap announcement — https://www.energy.gov/articles/energy-department-announces-fusion-science-and-technology-roadmap-accelerate-commercial"),
    note("Investment growth is well-documented; a commercial-scale revenue or market-size figure for fusion was not found and is not asserted here — this remains the longest-horizon, most speculative category in the portfolio (reflected in its TRL 3 rating and 10-20+ year commercialization-timeline estimate)."),

    h1("3. Medical Isotopes"),
    p("Global demand for cancer-therapy radioisotopes is an active growth area with direct Canadian relevance: public reporting describes Framatome-Kinectrics joint venture Isogen and Germany's ITM Medical Isotopes signing a supply arrangement using Bruce Power's CANDU reactors as a Lu-177 source, and a separate joint venture ('Actineer') between ITM and Canadian Nuclear Laboratories to pursue commercial-scale Ac-225 production. The OECD NEA has held international workshops specifically on securing medical radioisotope supply, citing the risk that limited Lu-177/Ac-225 supply could constrain cancer-treatment availability."),
    src("Source: BioSpace industry reporting — https://www.biospace.com/business/radiopharma-sector-races-to-secure-actinium-225-supply-as-pipelines-expand; OECD NEA workshop coverage — https://www.oecd-nea.org/jcms/pl_98146/securing-medical-radioisotopes-supply-nea-hosts-second-international-workshop"),
    note("This is the one technology category in the portfolio where a Kinectrics-specific public fact (the Isogen joint venture) was independently found — noted here as a genuine data point, not implied elsewhere in this project as a broader claim of Kinectrics involvement in the other 13 technologies."),

    h1("4. AI/ML, Robotics, Digital Twins, and Additive Manufacturing"),
    p("These four categories share a common market pattern in the sources reviewed: strong, well-documented adoption in general industrial/power-generation contexts (predictive maintenance, digital twins, robotics), with nuclear-specific adoption described repeatedly as 'early-stage' or 'growing' rather than mature. The IAEA's Nuclear Technology Review 2025 names AI applications in nuclear power and the fuel cycle, and additive-manufacturing qualification pathways, as active but still-developing areas — consistent with the mid-range TRLs (4-7) assigned to these technologies in the dataset. The NUCOBAM European consortium (13 organizations, 6 countries) developing AM qualification standards is a concrete, named example of active investment in de-risking this category."),
    src("Source: IAEA Nuclear Technology Review 2025 — https://www.iaea.org/sites/default/files/gc/gc69-inf9.pdf; NUCOBAM project — https://www.epj-n.org/articles/epjn/full_html/2025/01/epjn20250025/epjn20250025.html"),

    h1("5. Waste Management and Decommissioning"),
    p("Canada's own program provides a directly relevant, verifiable data point: the Nuclear Waste Management Organization selected the Wabigoon Lake Ojibway Nation-Ignace area (November 2024) as the site for Canada's deep geological repository for used nuclear fuel — a concrete national milestone, not a speculative market. Globally, this category is described as policy-driven and multi-decade rather than fast-growing commercially, which is reflected in the dataset's 'Low' revenue-impact tier for waste management (framed as a public-mandate program, not a commercial revenue play) despite its high sustainability-impact and strategic-importance ratings."),
    src("Source: American Nuclear Society / Nuclear Newswire 2025 update — https://www.ans.org/news/2025-07-25/article-7222/deep-geologic-repository-progress2025-update/; CNSC educational resources on deep geological repositories — https://www.cnsc-ccsn.gc.ca/eng/resources/educational-resources/feature-articles/deep-geological-repositories-DGR/"),

    h1("6. Categories With Limited Independently-Verified Market Signal"),
    p("VR/AR workforce training and smart materials/advanced sensor coatings did not surface strong, nuclear-specific public market data during this research pass beyond their inclusion in Kinectrics' own stated focus-area list. This is disclosed directly rather than papered over with a generic industry figure — both are marked ASSUMPTION or lower-confidence ESTIMATED in the dataset accordingly, and both score in the bottom half of the ranked portfolio partly as a result."),

    h1("7. Implication for the Scoring Model"),
    p("The market-growth-potential field in data/technologies.csv reflects the directional signals summarized above, weighted at 12% in the composite score (Section 3.2 of the technical white paper). Because most of these signals are directional rather than quantified, the scoring model deliberately does not convert any of them into a fabricated market-size dollar figure — the discipline maintained throughout this project is to let 'we don't have a verified number here' show up as a lower-confidence tag, not as an invented one."),
  ]
}]});

Packer.toBuffer(doc).then(buf=>{ require("fs").writeFileSync("deliverables/market_assessment.docx", buf); console.log("Wrote deliverables/market_assessment.docx"); });
