# Nuclear & Clean-Energy Innovation Opportunity Intelligence Platform

An independent portfolio project: a decision-support platform that identifies, scores, and prioritizes 14 emerging nuclear and clean-energy technologies for research, investment, partnership, or commercialization decisions — built to demonstrate the analytical workflow used by innovation and business-development teams in the nuclear sector (investigating emerging technologies, synthesizing technical information, market/competitive analysis, business-case development, applied AI/ML, and communicating recommendations to technical and business audiences).

**This project is not affiliated with, commissioned by, or reviewed by Kinectrics Inc. or any other company named within it.** The 14-technology scope was drawn from a public Kinectrics job posting's stated innovation focus areas, used here only to ground the project in a realistic, real-world technology set.

## Start here

| If you want to... | Open |
|---|---|
| See the one-page summary | `deliverables/executive_brief_onepager.docx` |
| See the ranked results interactively | `dashboard/dashboard_preview.html` (open directly in any browser) |
| See the top recommendation in depth | `deliverables/business_case_ai_predictive_maintenance.docx` |
| See the full methodology | `deliverables/technical_white_paper.docx` |
| See a 5-slide summary | `deliverables/executive_presentation.pptx` |
| Run the analysis yourself | `notebooks/README.md` (reproduce-from-scratch instructions) |

## What's in this repository

```
data/            structured dataset, data dictionary, source register, all model outputs
src/             the pipeline: build_dataset.py, build_corpus.py, scoring_model.py, topic_modeling.py
dashboard/       Power BI-ready data model + build guide + interactive HTML dashboard preview
deliverables/    business case, white paper, market assessment, one-pager, roadmap, risk register, deck
diagrams/        architecture diagram (SVG + rendered PNG)
notebooks/       explains why scripts (not .ipynb) were used, and how to reproduce every result
```

## Method summary (see `deliverables/technical_white_paper.docx` for full detail)

**Dataset.** 14 technologies profiled across 15 structured fields from public sources (IAEA, OECD NEA, CNSC, NRCan, DOE, NWMO, peer-reviewed literature). Every field is tagged **VERIFIED** (a specific, checkable public claim), **ESTIMATED** (author judgment informed by public sources), or **ASSUMPTION** (a working assumption with weak/no public evidence) — see `data/data_dictionary.md`.

**Scoring model.** A transparent, weighted, min-max-normalized model across 10 criteria (strategic fit, feasibility, cost, regulatory complexity, market growth, revenue impact, IP potential, sustainability, competitive intensity, commercialization timeline), with explicit adjustable weights and a full ±20% sensitivity analysis on every weight. Result: **AI/ML-based predictive maintenance ranks #1** (composite score 77.2/100) and that ranking is stable — it does not change under any single-weight ±20% perturbation.

**NLP component.** TF-IDF vectorization + KMeans clustering + cosine-similarity semantic search over a real, 34-document, source-linked research corpus spanning 8 of the 14 technology categories. Validated at **100% cluster-to-category purity** against ground-truth labels the algorithm never saw. The corpus covers 8 (not all 14) technologies because this project's sandboxed build environment blocked outbound requests to bulk literature APIs (OpenAlex, arXiv) — `src/openalex_pull_template.py` is a ready-to-run reference for a full-scale pull in an open-network environment. This limitation is disclosed, not hidden.

**Dashboard.** Power BI Desktop is Windows-only desktop software and wasn't available in this project's Linux build environment, so a `.pbix` file isn't included directly. Instead: a full Power BI-ready star schema (`dashboard/powerbi_dataset/`), a page-by-page build guide (`dashboard/powerbi_build_guide.md`), and a working interactive HTML dashboard (`dashboard/dashboard_preview.html`) that mirrors the intended Power BI layout using the same underlying data — open it directly in any browser, no server required.

**Business case.** Full business case for the #1-ranked opportunity (AI/ML predictive maintenance), including an honest, conditional go/no-go recommendation (GO, pending confirmation of historical data availability — the one real unknown a desk-based analysis can't resolve on its own).

## Honesty policy (applies to every deliverable in this repo)

No dollar figures, market-size numbers, or technical results are invented. Every claim is either linked to a named public source (`data/source_register.csv`) or explicitly labeled as an estimate/assumption/illustrative figure. Where this project's own method hit a real constraint — blocked network access, no Power BI Desktop, a partial research corpus — that constraint is stated directly in the relevant document rather than worked around silently. See `deliverables/technical_white_paper.docx`, Section 7 ("Limitations and Assumptions"), for the complete list.

## Reproducing the results

```bash
cd nuclear-innovation-intelligence
pip install pandas numpy scikit-learn openpyxl --break-system-packages
python3 src/build_dataset.py
python3 src/build_corpus.py
python3 src/scoring_model.py
python3 src/topic_modeling.py
python3 dashboard/build_dashboard_html.py
```

The `deliverables/build_*.js` and `build_risk_register.py` scripts regenerate the Word/PowerPoint/Excel deliverables (Node `docx`/`pptxgenjs` and Python `openpyxl` respectively — see `package.json`).

## Author

Karan Gill — July 2026.
