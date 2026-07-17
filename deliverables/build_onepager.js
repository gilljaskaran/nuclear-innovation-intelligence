const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, ShadingType } = require("docx");
const PAGE = { size: { width: 12240, height: 15840 } };
const accent = "1F6FEB"; const muted = "5B6B7A";

function h(text, size=24){ return new Paragraph({ children:[new TextRun({text, bold:true, size, color:accent})], spacing:{before:180, after:80} }); }
function p(text){ return new Paragraph({ children:[new TextRun({text, size:19})], spacing:{after:100} }); }
function bullet(text){ return new Paragraph({ text, bullet:{level:0}, spacing:{after:40}, children:undefined }); }

function bulletRun(text){
  return new Paragraph({ bullet:{level:0}, spacing:{after:40}, children:[new TextRun({text, size:19})] });
}

const rankRows = [
  ["1","AI/ML for Predictive Maintenance","77.2"],
  ["2","Advanced Sensor Technologies","65.3"],
  ["3","Small Modular Reactors (SMRs)","63.8"],
  ["4","Robotic Nuclear Inspection","63.6"],
  ["5","Digital Twins for Nuclear Plants","63.5"],
];
function rankTable(){
  const widths=[900,6600,1600];
  return new Table({
    width:{size:widths.reduce((a,b)=>a+b,0), type:WidthType.DXA},
    columnWidths: widths,
    rows: [
      new TableRow({ children:["Rank","Technology","Score"].map((t,i)=> new TableCell({ width:{size:widths[i],type:WidthType.DXA}, shading:{type:ShadingType.CLEAR, fill:"1F6FEB"}, children:[new Paragraph({children:[new TextRun({text:t,bold:true,color:"FFFFFF",size:18})]})] })) }),
      ...rankRows.map(r => new TableRow({ children: r.map((t,i)=> new TableCell({ width:{size:widths[i],type:WidthType.DXA}, children:[new Paragraph({children:[new TextRun({text:t,size:18})]})] })) }))
    ]
  });
}

const doc = new Document({ sections:[{
  properties:{ page:{...PAGE, margin:{top:900,bottom:900,left:900,right:900}} },
  children:[
    new Paragraph({ children:[new TextRun({text:"Nuclear & Clean-Energy Innovation Opportunity Intelligence Platform", bold:true, size:30, color:accent})], spacing:{after:40} }),
    new Paragraph({ children:[new TextRun({text:"Executive Brief — One Page  |  Jaskaran Singh  |  July 2026", italics:true, color:muted, size:19})], spacing:{after:200} }),

    h("Purpose"),
    p("A decision-support platform that identifies, scores, and prioritizes 14 emerging nuclear and clean-energy technologies for research, investment, partnership, or commercialization — built as an independent portfolio project demonstrating the analytical workflow used by innovation and business-development teams in the nuclear sector."),

    h("Method"),
    bulletRun("Structured a 14-technology dataset from public sources (IAEA, OECD NEA, CNSC, DOE, NWMO, peer-reviewed literature), with every field tagged VERIFIED / ESTIMATED / ASSUMPTION."),
    bulletRun("Built a transparent, weighted scoring model (10 criteria, adjustable weights, min-max normalization) with a full sensitivity analysis — the #1 ranking is stable under ±20% perturbation of every individual weight."),
    bulletRun("Applied an NLP pipeline (TF-IDF + KMeans clustering, cosine-similarity semantic search) to a real, source-linked research corpus, validated at 100% category-purity against known technology labels."),
    bulletRun("Built an interactive dashboard (Power BI-ready data model + build guide, plus a working HTML preview) covering executive overview, ranked portfolio, TRL-vs-market matrix, cost-vs-impact, and risk analysis."),

    h("Top-Ranked Opportunities"),
    rankTable(),

    h("Recommendation"),
    p("Proceed with a scoped, low-capital proof-of-concept on AI/ML-based predictive maintenance (full business case in business_case_ai_predictive_maintenance.docx), conditional on confirming historical maintenance/sensor data availability — the one material unknown a desk-based analysis cannot resolve."),

    h("What This Demonstrates"),
    bulletRun("Investigating emerging technologies and synthesizing complex technical information into a defensible ranking."),
    bulletRun("Market/competitive analysis and commercialization judgment grounded in named, checkable public sources."),
    bulletRun("Applied AI/ML and data analytics used to solve a real triage problem, not added for its own sake."),
    bulletRun("Clear, honest separation of verified fact, estimate, and assumption throughout — including where the project's own research method hit real constraints (see technical_white_paper.docx, Limitations)."),

    new Paragraph({ children:[new TextRun({text:"Full repository, dashboard, white paper, market assessment, roadmap, and risk register available on request.", italics:true, color:muted, size:17})], spacing:{before:200} }),
  ]
}]});

Packer.toBuffer(doc).then(buf=>{ require("fs").writeFileSync("deliverables/executive_brief_onepager.docx", buf); console.log("Wrote deliverables/executive_brief_onepager.docx"); });
