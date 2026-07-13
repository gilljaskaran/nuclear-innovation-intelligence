# Power BI Build Guide

Power BI Desktop is Windows-only software and could not be run in this project's build environment, so the `.pbix` itself isn't included here. What's provided instead is everything needed to build it in Power BI Desktop in under an hour: a clean, import-ready star schema (`powerbi_dataset/`) and this page-by-page, visual-by-visual build guide, plus a working interactive HTML preview (`dashboard_preview.html`) that mirrors the intended layout so the analytical thinking is demonstrated even before the `.pbix` exists.

## 1. Data model

Import all four CSVs from `powerbi_dataset/` via **Get Data → Text/CSV**:

- `dim_technology.csv` — one row per technology, all descriptive/rationale text fields.
- `fact_scores.csv` — one row per technology, all numeric scoring inputs plus `composite_score` and `rank`.
- `dim_scoring_weights.csv` — one row per scoring criterion, its base weight, and sensitivity range (from `tornado_summary.csv`).
- `fact_sensitivity.csv` — the full ±20% weight-perturbation results (long format: one row per technology × criterion × perturbation direction).

Relate `dim_technology[tech_id]` → `fact_scores[tech_id]` (1:1) and `fact_sensitivity[tech_id]` → `fact_scores[tech_id]` (many:1) in Model view.

## 2. Key DAX measures

```
Composite Score = AVERAGE(fact_scores[composite_score])
Rank = AVERAGE(fact_scores[rank])
Avg TRL = AVERAGE(fact_scores[trl])
# Top 3 Technologies = CALCULATE(COUNTROWS(fact_scores), fact_scores[rank] <= 3)
Cost Numeric = AVERAGE(fact_scores[cost_numeric])
Score Range (Sensitivity) = MAX(fact_sensitivity[score]) - MIN(fact_sensitivity[score])
```

## 3. Pages

**Page 1 — Executive Overview.** Card visuals for: number of technologies evaluated (14), #1-ranked technology name, its composite score, average TRL across the portfolio. A horizontal bar chart of all 14 technologies by `Composite Score`, sorted descending, colored by `category`. A short text box summarizing the top 3.

**Page 2 — Ranked Opportunity Portfolio.** A table visual with `rank`, `technology_name`, `category`, `composite_score`, `trl`, `cost_tier`, `confidence` — sortable, with conditional formatting (color scale) on `composite_score`. Slicers along the top for `category`, `confidence`, and a `trl` range slider.

**Page 3 — TRL vs. Market Potential Matrix.** Scatter chart: X axis `trl`, Y axis `market_growth_potential`, bubble size `composite_score`, color `category`, tooltip showing `technology_name` and `problem_addressed`. Add reference lines at TRL 6 and market-potential 3 to create quadrants (e.g., "near-term bets" vs. "watch list").

**Page 4 — Cost vs. Impact.** Scatter chart: X axis `cost_numeric` (or use `cost_tier` as a categorical axis), Y axis `revenue_numeric`, bubble size `composite_score`, color `category`.

**Page 5 — Risk Analysis.** Matrix/heatmap visual: rows = `technology_name`, columns = `safety_regulatory_complexity` and `competitive_intensity`, values color-scaled (red = higher risk). Add a table of `rank_fragile` criteria from `dim_scoring_weights.csv` so viewers see exactly where the ranking is sensitive to assumptions.

**Page 6 — Technology Profiles.** A single-technology drill-through page: all rationale text fields from `dim_technology`, triggered by clicking any bar/row on pages 1-2 (**Add drill-through filter on `tech_id`**).

## 4. Filters (all pages)

Slicers on `category`, `confidence`, `cost_tier`, and a `trl` range slider — placed in a synced filter pane so one selection updates every page.

## 5. Adjustable scenario weights (What-If parameter)

Power BI's native **What-if parameter** feature (Modeling → New Parameter → Numeric range) can be created for each of the 10 scoring criteria (0.0-0.30 range, step 0.01), replacing the static `dim_scoring_weights[base_weight]` in a DAX measure:

```
Dynamic Composite Score =
SUMX(
    VALUES(fact_scores[tech_id]),
    [Normalized Strategic Fit] * 'Strategic Fit Weight'[Strategic Fit Weight Value] + ...
)
```

This requires normalized (0-100) columns per criterion, which can be added in Power Query using the same min-max logic as `src/scoring_model.py` (documented there), or reused directly from `data/scored_technologies_full.csv`'s normalized intermediate values if you extend `scoring_model.py` to export them (currently it exports only the final composite). This is flagged as a "if time allows" extension in the README — the static base-case model is fully built and defensible without it.

## 6. What's included vs. what needs Power BI Desktop to finish

Included, ready to import: the full star schema, all descriptive text, all sensitivity results. Needs Power BI Desktop (Windows/Windows-in-cloud, not available in this build environment): the actual visual layout, the What-if parameter wiring, and exporting the final `.pbix`/screenshots. `dashboard_preview.html` in this same folder is a working stand-in that renders the Page 1-5 views directly in a browser using the same underlying data, so the analytical output can be reviewed without Power BI Desktop installed.
