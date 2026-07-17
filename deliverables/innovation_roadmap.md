# Innovation Roadmap — AI/ML for Predictive Maintenance

Independent portfolio project. Illustrative timeline for a hypothetical internal pilot; not a Kinectrics-approved plan.

| Stage | Deliverables | Owner / Stakeholder Group | Dependencies | Stage Gate (must pass to proceed) | Illustrative Timeline |
|---|---|---|---|---|---|
| 1. Research & Validation | Confirmed target equipment class; confirmed data availability (≥12 months history); literature/benchmark review | Innovation Hub analyst (project owner), Reliability/Asset Mgmt team | Access to historical maintenance/sensor data | Data access confirmed for ≥1 equipment class | Weeks 1-4 |
| 2. Proof of Concept | Trained model, back-tested accuracy vs. baseline, explainability review | Analyst, technical mentor | Stage 1 data access | Back-tested accuracy clears an agreed threshold; model is interpretable enough for engineer review | Weeks 5-10 |
| 3. Pilot (Shadow Mode) | Deployed advisory tool (recommendations shown, not auto-acted on) for one operating cycle | Plant maintenance engineers, IT/OT security | Stage 2 model; IT/OT integration approval | Engineer adoption/feedback positive; no unresolved security findings | Months 3-8 (one operating cycle) |
| 4. Regulatory / Safety Review | Confirm advisory-tool status does not require CNSC review; document if scope ever touches the safety basis | CNSC liaison (internal), safety case owner | Stage 3 pilot results | Documented determination of regulatory scope | In parallel with Stage 3 |
| 5. Partnership Development | Explore EPRI / university ML-lab collaboration for model refinement (not yet confirmed relationships) | Innovation Hub leadership | Stage 3 results worth expanding | Partner interest confirmed, if pursued | Months 6-9 |
| 6. Commercialization / Scale | Extend to additional equipment classes; formal before/after cost-savings comparison | Innovation Hub leadership, Reliability/Asset Mgmt | Stage 3 success criteria met | Positive before/after comparison on pilot equipment class | Months 9-18 |

## Stage Gate Philosophy

Each stage gate exists to stop the project cheaply if a real-world constraint (data availability, engineer trust, security approval) turns out to invalidate the desk-based assumptions in this portfolio project. The single largest identified risk — historical data availability — is deliberately the very first gate, before any model-development time is spent.

## Cross-Reference

See `risk_register.xlsx` for the full risk list behind this roadmap, and `business_case_ai_predictive_maintenance.docx` Section 9 for the narrative version of this same pathway.
