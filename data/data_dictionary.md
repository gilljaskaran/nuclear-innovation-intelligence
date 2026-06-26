# Data Dictionary — technologies.csv

Each row is one candidate technology. Fields marked **(1-5)** use the scale: 1 = lowest/worst, 5 = highest/best on that dimension (see field-specific rationale text for what "high" means for that field — e.g. for `safety_regulatory_complexity`, 5 means *most* complex, which is a negative for scoring purposes).

| Field | Type | Description |
|---|---|---|
| `tech_id` | string | Short unique identifier (T01-T14) |
| `technology_name` | string | Name of the technology/opportunity |
| `category` | string | Grouping used for dashboard filtering |
| `problem_addressed` | text | The operational, safety, or market problem this technology solves |
| `trl` | int (1-9) | Technology Readiness Level, per the standard 9-level NASA/IAEA-style scale |
| `trl_basis` | text | Rationale/source for the TRL estimate, and confidence tag |
| `market_growth_potential` | int (1-5) | Estimated growth trajectory of demand for this technology |
| `market_growth_rationale` | text | Basis for the rating |
| `strategic_fit` | int (1-5) | Alignment to Kinectrics' publicly stated innovation focus areas |
| `strategic_fit_rationale` | text | Basis for the rating |
| `commercialization_timeline_years` | string | Estimated years to commercial deployment (range) |
| `cost_tier` | string (Low/Medium/High) | Relative implementation cost tier — deliberately not a dollar figure unless directly sourced |
| `cost_rationale` | text | Basis for the tier |
| `safety_regulatory_complexity` | int (1-5) | How complex the regulatory/safety-case pathway is (5 = most complex — treated as a cost in scoring) |
| `reg_rationale` | text | Basis for the rating |
| `technical_feasibility` | int (1-5) | How achievable the technology is with current engineering knowledge |
| `feasibility_rationale` | text | Basis for the rating |
| `competitive_intensity` | int (1-5) | How crowded the competitive/vendor field is (5 = most crowded) |
| `competitive_rationale` | text | Basis for the rating |
| `revenue_impact_tier` | string | Relative revenue/cost-saving potential tier |
| `revenue_rationale` | text | Basis for the tier |
| `ip_potential` | int (1-5) | Estimated potential for defensible/patentable IP |
| `ip_rationale` | text | Basis for the rating |
| `sustainability_impact` | int (1-5) | Estimated contribution to environmental/social sustainability goals |
| `sustainability_rationale` | text | Basis for the rating |
| `partnership_opportunities` | text | Illustrative real organizations/institution types relevant to this technology (not confirmed relationships with Kinectrics) |
| `evidence_source` | text | General public source category grounding this row — see `source_register.csv` for full citations |
| `confidence` | string (VERIFIED / ESTIMATED / ASSUMPTION) | See policy below |

## Confidence policy

- **VERIFIED** — a specific, checkable claim (a number, program, or fact) drawn directly from a named public source.
- **ESTIMATED** — the author's reasoned judgment, informed by public sources and general industry knowledge, but not a figure published verbatim by a named source. This is the majority of ratings in this dataset — it is a strategy/scoring exercise, not a market-research report, and should be read that way.
- **ASSUMPTION** — a working assumption used only to make the scoring model runnable, with weak or no public evidence located during this research pass.

No dollar figures in this dataset are invented; where cost/revenue could not be tied to a specific public number, a qualitative tier (Low/Medium/High) is used instead. See `source_register.csv` for the specific sources used and `notebooks/02_scoring_model.py` docstring for how these ratings feed the scoring model.
