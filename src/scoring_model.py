"""
scoring_model.py
Transparent, weighted, min-max-normalized scoring model for ranking the
technology opportunities in data/technologies.csv.

DESIGN NOTES (defend these in an interview):

1. NORMALIZATION — every criterion is rescaled to a common 0-100 range using
   min-max scaling *within this dataset* (score = (x - min) / (max - min) * 100).
   This is a relative ranking tool: it tells you which of these 14 technologies
   look most attractive RELATIVE TO EACH OTHER, not an absolute investment-grade
   score. That's an explicit limitation, stated here and in the white paper.

2. DIRECTION OF EACH CRITERION — some criteria are "higher is better"
   (market growth, strategic fit, feasibility, revenue impact, IP potential,
   sustainability) and some are "lower is better" (cost, regulatory
   complexity, competitive intensity, longer commercialization timeline).
   Lower-is-better criteria are inverted after normalization (100 - x) so that,
   after inversion, 100 always means "good for this technology's ranking" for
   every criterion.

3. WEIGHTS are explicit, adjustable, and sum to 1.0 (see WEIGHTS dict below).
   They are not fitted — they are a judgment call, stated with a one-line
   rationale for each, which is exactly what should be interrogated and
   challenged by a reader (or an interviewer).

4. SENSITIVITY ANALYSIS — each weight is perturbed +/-20% (with the freed-up
   or absorbed weight redistributed proportionally across the remaining
   criteria so weights still sum to 1.0), and we record how much the top-5
   ranking shakes out. Criteria whose perturbation changes the #1 or #2 rank
   are flagged as "rank-fragile" and should be discussed as a limitation.

5. LIMITATIONS (see also data_dictionary.md and technical_white_paper.docx):
   - Inputs are mostly ESTIMATED/ASSUMPTION-tagged, not primary industry data.
   - Min-max normalization means adding/removing a technology can shift every
     other technology's normalized score, even if its own inputs didn't change.
   - The model cannot capture interaction effects between technologies
     (e.g., sensors and digital twins are complementary, not independent).
"""
import pandas as pd
import numpy as np
import json

# ---------------------------------------------------------------------------
# 1. Load data
# ---------------------------------------------------------------------------
df = pd.read_csv("data/technologies.csv")

# ---------------------------------------------------------------------------
# 2. Map qualitative tiers to numeric 1-5 scales so everything can be
#    min-max normalized on a common footing.
# ---------------------------------------------------------------------------
COST_TIER_MAP = {
    "Low": 1, "Low-Medium": 2, "Medium": 3, "Medium-High": 4, "High": 5,
}
REVENUE_TIER_MAP = {
    "Low": 1, "Low-Medium": 2, "Medium": 3, "Medium-High": 4, "High": 5,
    "High (long-term)": 4, "High (very long-term)": 3,
    "Low (public-mandate program, not a commercial revenue play)": 1,
}

def parse_timeline_to_years(s):
    """Parse strings like '2-5', '0-1 (mature)', '10-20+' into a numeric
    midpoint estimate of years-to-commercialization, used as a 'lower is
    better' criterion (sooner commercialization scores higher)."""
    s = str(s)
    digits = "".join(c if c.isdigit() or c in "-." else " " for c in s)
    parts = [p for p in digits.split() if p]
    nums = []
    for p in parts:
        for token in p.split("-"):
            token = token.strip(".")
            if token.isdigit():
                nums.append(float(token))
    if not nums:
        return 5.0
    return sum(nums) / len(nums)

df["cost_numeric"] = df["cost_tier"].map(COST_TIER_MAP)
df["revenue_numeric"] = df["revenue_impact_tier"].map(REVENUE_TIER_MAP)
df["timeline_years_numeric"] = df["commercialization_timeline_years"].apply(parse_timeline_to_years)

# ---------------------------------------------------------------------------
# 3. Define criteria: direction = "higher_is_better" or "lower_is_better"
# ---------------------------------------------------------------------------
CRITERIA = {
    "market_growth_potential":   dict(direction="higher_is_better", weight=0.12, rationale="Larger addressable growth = larger long-run upside for Kinectrics."),
    "strategic_fit":             dict(direction="higher_is_better", weight=0.15, rationale="Highest weight: alignment to Kinectrics' own stated focus areas is the single best proxy for organizational buy-in and resourcing likelihood."),
    "technical_feasibility":     dict(direction="higher_is_better", weight=0.12, rationale="Technologies that are harder to build in principle carry higher execution risk regardless of market appeal."),
    "timeline_years_numeric":    dict(direction="lower_is_better",  weight=0.08, rationale="Faster time-to-value is preferred, especially for a co-op-driven innovation pipeline with quarterly/annual reporting cycles."),
    "cost_numeric":              dict(direction="lower_is_better",  weight=0.10, rationale="Lower implementation cost lowers the bar for a first pilot/proof-of-concept commitment."),
    "safety_regulatory_complexity": dict(direction="lower_is_better", weight=0.10, rationale="Regulatory complexity is a direct proxy for time-to-approval and execution risk in a CNSC-regulated environment."),
    "competitive_intensity":     dict(direction="lower_is_better",  weight=0.05, rationale="Lower weight: crowded fields can still be attractive if Kinectrics has a differentiated angle, so this is a minor rather than major penalty."),
    "revenue_numeric":           dict(direction="higher_is_better", weight=0.13, rationale="Direct proxy for commercial value creation, the core purpose of the Innovation Hub."),
    "ip_potential":              dict(direction="higher_is_better", weight=0.08, rationale="Defensible IP supports long-term competitive advantage and licensing revenue."),
    "sustainability_impact":     dict(direction="higher_is_better", weight=0.07, rationale="Reflects Kinectrics' stated culture around sustainability, without overriding commercial criteria."),
}

assert abs(sum(c["weight"] for c in CRITERIA.values()) - 1.0) < 1e-9, "Base weights must sum to 1.0"

# ---------------------------------------------------------------------------
# 4. Min-max normalize each criterion to 0-100, inverting lower-is-better ones
# ---------------------------------------------------------------------------
def normalize(series, direction):
    lo, hi = series.min(), series.max()
    if hi == lo:
        return pd.Series(50.0, index=series.index)  # no discriminating power
    norm = (series - lo) / (hi - lo) * 100
    if direction == "lower_is_better":
        norm = 100 - norm
    return norm

norm_df = pd.DataFrame(index=df.index)
for crit, meta in CRITERIA.items():
    norm_df[crit] = normalize(df[crit], meta["direction"])

def weighted_score(weights: dict) -> pd.Series:
    return sum(norm_df[c] * w for c, w in weights.items())

BASE_WEIGHTS = {c: meta["weight"] for c, meta in CRITERIA.items()}
df["composite_score"] = weighted_score(BASE_WEIGHTS)
df["rank"] = df["composite_score"].rank(ascending=False, method="min").astype(int)

ranked = df.sort_values("rank")[["tech_id", "technology_name", "category", "composite_score", "rank"]]
ranked.to_csv("data/scored_technologies.csv", index=False)
df.sort_values("rank").to_csv("data/scored_technologies_full.csv", index=False)

print("=== BASE CASE RANKING ===")
print(ranked.to_string(index=False))

# ---------------------------------------------------------------------------
# 5. Sensitivity analysis — perturb each weight +/-20%, renormalize the rest
#    proportionally, and record how the composite score / rank of every
#    technology moves. Used to build a tornado chart and to flag
#    "rank-fragile" technologies (see white paper).
# ---------------------------------------------------------------------------
sensitivity_records = []
for crit in CRITERIA:
    for direction, factor in [("minus20", 0.8), ("plus20", 1.2)]:
        new_weights = dict(BASE_WEIGHTS)
        new_val = BASE_WEIGHTS[crit] * factor
        delta = new_val - BASE_WEIGHTS[crit]
        others = [c for c in CRITERIA if c != crit]
        others_total = sum(BASE_WEIGHTS[c] for c in others)
        for c in others:
            new_weights[c] = BASE_WEIGHTS[c] - delta * (BASE_WEIGHTS[c] / others_total)
        new_weights[crit] = new_val
        assert abs(sum(new_weights.values()) - 1.0) < 1e-6

        scores = weighted_score(new_weights)
        ranks = scores.rank(ascending=False, method="min").astype(int)
        top_tech = df.loc[ranks.idxmin(), "technology_name"]
        for idx in df.index:
            sensitivity_records.append(dict(
                perturbed_criterion=crit,
                perturbation=direction,
                tech_id=df.loc[idx, "tech_id"],
                technology_name=df.loc[idx, "technology_name"],
                score=round(scores[idx], 2),
                rank=int(ranks[idx]),
            ))

sens_df = pd.DataFrame(sensitivity_records)
sens_df.to_csv("data/sensitivity_analysis.csv", index=False)

# Tornado-chart summary: for each criterion, the range of the #1-ranked
# technology's composite score across the -20%/+20% perturbation
tornado = []
base_top = df.loc[df["rank"] == 1, "technology_name"].iloc[0]
for crit in CRITERIA:
    sub = sens_df[(sens_df.perturbed_criterion == crit) & (sens_df.technology_name == base_top)]
    lo = sub.score.min()
    hi = sub.score.max()
    rank_changes = sens_df[(sens_df.perturbed_criterion == crit) & (sens_df.rank == 1)]["technology_name"].unique().tolist()
    tornado.append(dict(
        criterion=crit,
        base_weight=BASE_WEIGHTS[crit],
        score_low=round(lo, 2),
        score_high=round(hi, 2),
        score_range=round(hi - lo, 2),
        top_ranked_techs_under_perturbation=", ".join(rank_changes),
        rank_fragile=len(rank_changes) > 1,
    ))
tornado_df = pd.DataFrame(tornado).sort_values("score_range", ascending=False)
tornado_df.to_csv("data/tornado_summary.csv", index=False)

print("\n=== TORNADO SUMMARY (sensitivity of #1-ranked tech's score to each weight) ===")
print(tornado_df.to_string(index=False))

print("\n=== RANK-FRAGILE CRITERIA (weight swings that change the #1 technology) ===")
fragile = tornado_df[tornado_df.rank_fragile]
print(fragile[["criterion", "top_ranked_techs_under_perturbation"]].to_string(index=False) if len(fragile) else "None — the #1 ranking is stable to +/-20% weight perturbation on every individual criterion.")

# Save weights/config for transparency + reuse in the dashboard
with open("data/scoring_config.json", "w") as f:
    json.dump({
        "base_weights": BASE_WEIGHTS,
        "criteria_meta": {c: {"direction": m["direction"], "weight": m["weight"], "rationale": m["rationale"]} for c, m in CRITERIA.items()},
        "normalization_method": "min-max scaling within dataset (0-100), inverted for lower-is-better criteria",
    }, f, indent=2)

print("\nWrote: data/scored_technologies.csv, data/scored_technologies_full.csv, data/sensitivity_analysis.csv, data/tornado_summary.csv, data/scoring_config.json")
