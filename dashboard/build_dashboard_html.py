"""
build_dashboard_html.py
Generates dashboard/dashboard_preview.html — a self-contained interactive
dashboard (Chart.js via CDN) that mirrors the Power BI page layout in
powerbi_build_guide.md, so the analytical output can be reviewed without
Power BI Desktop installed. Data is embedded inline (read from
dashboard_data.json) so the file works standalone, opened directly in a
browser, with no server or network access required at view-time.
"""
import json

with open("dashboard/dashboard_data.json") as f:
    DATA = json.load(f)

DATA_JSON = json.dumps(DATA)

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Nuclear & Clean-Energy Innovation Opportunity Intelligence — Dashboard Preview</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.0/chart.umd.min.js"></script>
<style>
  :root {
    --bg: #0f1720; --panel: #17212b; --panel2: #1e2b38; --text: #e8edf2; --muted: #9fb0c0;
    --accent: #4fc3f7; --accent2: #81c995; --warn: #f4a261; --danger: #e76f51; --border: #2b3947;
  }
  * { box-sizing: border-box; }
  body { margin:0; font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; background: var(--bg); color: var(--text); }
  header { padding: 20px 28px; border-bottom: 1px solid var(--border); }
  header h1 { margin:0 0 4px 0; font-size: 20px; }
  header p { margin:0; color: var(--muted); font-size: 13px; }
  nav { display:flex; gap:6px; padding: 0 28px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
  nav button { background:none; border:none; color: var(--muted); padding: 12px 14px; cursor:pointer; font-size: 13px; border-bottom: 2px solid transparent; }
  nav button.active { color: var(--text); border-bottom: 2px solid var(--accent); }
  main { padding: 22px 28px 60px; max-width: 1400px; margin: 0 auto; }
  .page { display:none; }
  .page.active { display:block; }
  .kpis { display:flex; gap:14px; flex-wrap:wrap; margin-bottom: 20px; }
  .kpi { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 14px 20px; min-width: 160px; }
  .kpi .val { font-size: 26px; font-weight: 700; color: var(--accent); }
  .kpi .lbl { font-size: 12px; color: var(--muted); margin-top:4px; }
  .grid2 { display:grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .panel { background: var(--panel); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; margin-bottom: 18px; }
  .panel h3 { margin:0 0 10px 0; font-size: 14px; color: var(--muted); font-weight:600; text-transform: uppercase; letter-spacing: .04em; }
  canvas { max-height: 420px; }
  table { width:100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align:left; padding: 8px 10px; border-bottom: 1px solid var(--border); }
  th { color: var(--muted); font-weight: 600; cursor:pointer; }
  tr:hover td { background: var(--panel2); }
  .badge { display:inline-block; padding:2px 8px; border-radius: 999px; font-size: 11px; font-weight:600; }
  .b-verified { background: rgba(129,201,149,.18); color: var(--accent2); }
  .b-estimated { background: rgba(79,195,247,.18); color: var(--accent); }
  .b-assumption { background: rgba(244,162,97,.18); color: var(--warn); }
  .filters { display:flex; gap:10px; margin-bottom: 16px; flex-wrap: wrap; }
  select, input[type=range] { background: var(--panel2); color: var(--text); border: 1px solid var(--border); border-radius: 6px; padding: 6px 10px; font-size: 13px; }
  .risk-cell { text-align:center; font-weight:700; border-radius: 4px; }
  .profile { display:none; }
  .profile.active { display:block; }
  .close-btn { float:right; background:var(--panel2); border:1px solid var(--border); color:var(--text); padding:4px 10px; border-radius:6px; cursor:pointer; }
  .tag { display:inline-block; background: var(--panel2); border:1px solid var(--border); border-radius: 6px; padding: 6px 10px; margin: 4px 6px 0 0; font-size:12px; color: var(--muted); }
  footer { padding: 18px 28px; color: var(--muted); font-size: 12px; border-top: 1px solid var(--border); }
  a { color: var(--accent); }
</style>
</head>
<body>
<header>
  <h1>Nuclear & Clean-Energy Innovation Opportunity Intelligence Platform</h1>
  <p>Interactive HTML preview of the Power BI dashboard build (see <code>powerbi_build_guide.md</code>) &mdash; live-filters the same underlying scored dataset.</p>
</header>
<nav id="nav"></nav>
<main>
  <div id="page-overview" class="page"></div>
  <div id="page-portfolio" class="page"></div>
  <div id="page-matrix" class="page"></div>
  <div id="page-cost" class="page"></div>
  <div id="page-risk" class="page"></div>
  <div id="page-profile" class="page"></div>
</main>
<footer>
  Data confidence: <span class="badge b-verified">VERIFIED</span> = named public source &nbsp;
  <span class="badge b-estimated">ESTIMATED</span> = author judgment informed by public sources &nbsp;
  <span class="badge b-assumption">ASSUMPTION</span> = working assumption, weak/no public evidence.
  Scoring is relative ranking within this 14-technology set, not an absolute investment-grade score. See <code>data/data_dictionary.md</code> and the technical white paper for full methodology and limitations.
</footer>
<script>
const DATA = __DATA_JSON__;
const TECHS = DATA.technologies;
const TORNADO = DATA.tornado;
const CATS = [...new Set(TECHS.map(t => t.category))];

const pages = [
  {id:'overview', label:'Exec Overview'},
  {id:'portfolio', label:'Ranked Portfolio'},
  {id:'matrix', label:'TRL vs Market'},
  {id:'cost', label:'Cost vs Impact'},
  {id:'risk', label:'Risk Analysis'},
];
const nav = document.getElementById('nav');
pages.forEach((p,i) => {
  const b = document.createElement('button');
  b.textContent = p.label; b.dataset.page = p.id;
  if (i===0) b.classList.add('active');
  b.onclick = () => showPage(p.id);
  nav.appendChild(b);
});

function showPage(id) {
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('active', b.dataset.page===id));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-'+id).classList.add('active');
}

const catColors = {};
const palette = ['#4fc3f7','#81c995','#f4a261','#e76f51','#c792ea','#ffd166','#48cae4','#f28482'];
CATS.forEach((c,i) => catColors[c] = palette[i % palette.length]);

function badge(conf) {
  const cls = conf === 'VERIFIED' ? 'b-verified' : conf === 'ASSUMPTION' ? 'b-assumption' : 'b-estimated';
  return `<span class="badge ${cls}">${conf}</span>`;
}

// ---------- Page: Overview ----------
function renderOverview() {
  const top = TECHS.find(t => t.rank === 1);
  const avgTrl = (TECHS.reduce((s,t)=>s+t.trl,0)/TECHS.length).toFixed(1);
  const el = document.getElementById('page-overview');
  el.innerHTML = `
    <div class="kpis">
      <div class="kpi"><div class="val">${TECHS.length}</div><div class="lbl">Technologies evaluated</div></div>
      <div class="kpi"><div class="val">${top.technology_name}</div><div class="lbl">#1 ranked opportunity</div></div>
      <div class="kpi"><div class="val">${top.composite_score.toFixed(1)}</div><div class="lbl">Top composite score (of 100)</div></div>
      <div class="kpi"><div class="val">${avgTrl}</div><div class="lbl">Average TRL across portfolio</div></div>
    </div>
    <div class="panel"><h3>All Technologies — Composite Score (weighted, normalized 0-100)</h3><canvas id="chartOverview"></canvas></div>
    <div class="panel"><h3>Top 3 Summary</h3>
      ${TECHS.filter(t=>t.rank<=3).map(t => `<p><b>#${t.rank} ${t.technology_name}</b> (${t.category}) — score ${t.composite_score.toFixed(1)}. ${t.problem_addressed} ${badge(t.confidence)}</p>`).join('')}
    </div>`;
  const ctx = document.getElementById('chartOverview');
  const sorted = [...TECHS].sort((a,b)=>b.composite_score-a.composite_score);
  new Chart(ctx, {
    type:'bar',
    data:{ labels: sorted.map(t=>t.technology_name),
      datasets:[{ label:'Composite Score', data: sorted.map(t=>t.composite_score),
        backgroundColor: sorted.map(t=>catColors[t.category]) }]},
    options:{ indexAxis:'y', plugins:{legend:{display:false}},
      scales:{ x:{ max:100, ticks:{color:'#9fb0c0'}, grid:{color:'#2b3947'} }, y:{ ticks:{color:'#e8edf2'}, grid:{display:false} } } }
  });
}

// ---------- Page: Portfolio (table + filters) ----------
function renderPortfolio() {
  const el = document.getElementById('page-portfolio');
  el.innerHTML = `
    <div class="filters">
      <select id="fCat"><option value="">All categories</option>${CATS.map(c=>`<option>${c}</option>`).join('')}</select>
      <select id="fConf"><option value="">All confidence levels</option><option>VERIFIED</option><option>ESTIMATED</option><option>ASSUMPTION</option></select>
      <select id="fCost"><option value="">All cost tiers</option><option>Low</option><option>Low-Medium</option><option>Medium</option><option>Medium-High</option><option>High</option></select>
    </div>
    <div class="panel"><table id="portfolioTable">
      <thead><tr><th>Rank</th><th>Technology</th><th>Category</th><th>TRL</th><th>Cost Tier</th><th>Score</th><th>Confidence</th></tr></thead>
      <tbody></tbody>
    </table></div>`;
  function draw() {
    const cat = document.getElementById('fCat').value;
    const conf = document.getElementById('fConf').value;
    const cost = document.getElementById('fCost').value;
    let rows = TECHS.filter(t => (!cat||t.category===cat) && (!conf||t.confidence===conf) && (!cost||t.cost_tier===cost));
    rows = rows.sort((a,b)=>a.rank-b.rank);
    document.querySelector('#portfolioTable tbody').innerHTML = rows.map(t => `
      <tr onclick="showProfile('${t.tech_id}')" style="cursor:pointer">
        <td>${t.rank}</td><td>${t.technology_name}</td><td>${t.category}</td><td>${t.trl}</td>
        <td>${t.cost_tier}</td><td>${t.composite_score.toFixed(1)}</td><td>${badge(t.confidence)}</td>
      </tr>`).join('');
  }
  ['fCat','fConf','fCost'].forEach(id => document.getElementById(id).onchange = draw);
  draw();
}

// ---------- Page: TRL vs Market matrix ----------
function renderMatrix() {
  const el = document.getElementById('page-matrix');
  el.innerHTML = `<div class="panel"><h3>Technology Readiness Level vs. Market Growth Potential (bubble size = composite score)</h3><canvas id="chartMatrix"></canvas></div>`;
  const datasets = CATS.map(cat => ({
    label: cat,
    data: TECHS.filter(t=>t.category===cat).map(t => ({x:t.trl, y:t.market_growth_potential, r: 6 + t.composite_score/6, name:t.technology_name})),
    backgroundColor: catColors[cat] + 'cc',
  }));
  new Chart(document.getElementById('chartMatrix'), {
    type:'bubble', data:{datasets},
    options:{ plugins:{ tooltip:{ callbacks:{ label: (c)=> `${c.raw.name}: TRL ${c.raw.x}, Market ${c.raw.y}` } } },
      scales:{ x:{ title:{display:true,text:'TRL (1-9)',color:'#9fb0c0'}, min:0,max:10, ticks:{color:'#9fb0c0'}, grid:{color:'#2b3947'} },
               y:{ title:{display:true,text:'Market Growth Potential (1-5)',color:'#9fb0c0'}, min:0,max:6, ticks:{color:'#9fb0c0'}, grid:{color:'#2b3947'} } } }
  });
}

// ---------- Page: Cost vs Impact ----------
function renderCost() {
  const el = document.getElementById('page-cost');
  el.innerHTML = `<div class="panel"><h3>Implementation Cost Tier vs. Revenue/Cost-Saving Impact (bubble size = composite score)</h3><canvas id="chartCost"></canvas></div>`;
  const datasets = CATS.map(cat => ({
    label: cat,
    data: TECHS.filter(t=>t.category===cat).map(t => ({x:t.cost_numeric, y:t.revenue_numeric, r: 6 + t.composite_score/6, name:t.technology_name})),
    backgroundColor: catColors[cat] + 'cc',
  }));
  new Chart(document.getElementById('chartCost'), {
    type:'bubble', data:{datasets},
    options:{ plugins:{ tooltip:{ callbacks:{ label:(c)=> `${c.raw.name}: cost tier ${c.raw.x}, impact tier ${c.raw.y}` } } },
      scales:{ x:{ title:{display:true,text:'Cost Tier (1=Low ... 5=High)',color:'#9fb0c0'}, min:0,max:6, ticks:{color:'#9fb0c0'}, grid:{color:'#2b3947'} },
               y:{ title:{display:true,text:'Revenue/Cost-Saving Tier (1=Low ... 5=High)',color:'#9fb0c0'}, min:0,max:6, ticks:{color:'#9fb0c0'}, grid:{color:'#2b3947'} } } }
  });
}

// ---------- Page: Risk analysis ----------
function renderRisk() {
  const el = document.getElementById('page-risk');
  const sorted = [...TECHS].sort((a,b)=>b.rank-a.rank).reverse();
  function cellColor(v){ const t = (v-1)/4; const r = Math.round(80+t*175); const g = Math.round(200-t*140); return `rgb(${r},${g},90)`; }
  el.innerHTML = `
    <div class="panel"><h3>Risk Heat Map — Safety/Regulatory Complexity & Competitive Intensity (1=lowest risk, 5=highest)</h3>
    <table><thead><tr><th>Technology</th><th>Safety/Regulatory Complexity</th><th>Competitive Intensity</th></tr></thead>
    <tbody>${sorted.map(t=>`<tr><td>${t.technology_name}</td>
      <td class="risk-cell" style="background:${cellColor(t.safety_regulatory_complexity)}">${t.safety_regulatory_complexity}</td>
      <td class="risk-cell" style="background:${cellColor(t.competitive_intensity)}">${t.competitive_intensity}</td></tr>`).join('')}</tbody></table></div>
    <div class="panel"><h3>Sensitivity Analysis — Score Range of #1-Ranked Technology Under ±20% Weight Perturbation</h3><canvas id="chartTornado"></canvas>
    <p style="color:var(--muted);font-size:12px;margin-top:10px;">None of the 10 scoring criteria change the #1-ranked technology when perturbed ±20% individually &mdash; the base-case ranking is stable. Full detail in <code>data/tornado_summary.csv</code> and <code>data/sensitivity_analysis.csv</code>.</p></div>`;
  const tSorted = [...TORNADO].sort((a,b)=>b.score_range-a.score_range);
  new Chart(document.getElementById('chartTornado'), {
    type:'bar',
    data:{ labels: tSorted.map(t=>t.criterion),
      datasets:[{ label:'Score range (points)', data: tSorted.map(t=>t.score_range), backgroundColor:'#4fc3f7' }]},
    options:{ indexAxis:'y', plugins:{legend:{display:false}},
      scales:{ x:{ ticks:{color:'#9fb0c0'}, grid:{color:'#2b3947'} }, y:{ ticks:{color:'#e8edf2'}, grid:{display:false} } } }
  });
}

// ---------- Page: Technology profile (drill-through) ----------
function showProfile(techId) {
  const t = TECHS.find(x=>x.tech_id===techId);
  const el = document.getElementById('page-profile');
  el.innerHTML = `
    <button class="close-btn" onclick="showPage('portfolio')">&larr; Back to portfolio</button>
    <div class="panel">
      <h3>${t.technology_name} ${badge(t.confidence)}</h3>
      <p>${t.problem_addressed}</p>
      <div>
        <span class="tag">Category: ${t.category}</span>
        <span class="tag">Rank #${t.rank} of ${TECHS.length}</span>
        <span class="tag">Composite score: ${t.composite_score.toFixed(1)}</span>
        <span class="tag">TRL: ${t.trl}</span>
        <span class="tag">Cost tier: ${t.cost_tier}</span>
        <span class="tag">Revenue/impact tier: ${t.revenue_impact_tier}</span>
        <span class="tag">Timeline: ${t.commercialization_timeline_years}</span>
      </div>
      <p style="margin-top:14px;"><b>Partnership opportunities:</b> ${t.partnership_opportunities}</p>
      <p><b>Evidence source:</b> ${t.evidence_source}</p>
    </div>`;
  document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
}

renderOverview();
renderPortfolio();
renderMatrix();
renderCost();
renderRisk();
</script>
</body>
</html>
"""

HTML = HTML.replace("__DATA_JSON__", DATA_JSON)

with open("dashboard/dashboard_preview.html", "w") as f:
    f.write(HTML)

print("Wrote dashboard/dashboard_preview.html")
