"""
openalex_pull_template.py
REFERENCE SCRIPT — NOT RUN AS PART OF THIS PROJECT'S DELIVERED RESULTS.

This shows exactly how data/research_corpus.csv would be built at scale from
the free OpenAlex API (no key required, CC0 data, ~250M works) in an
environment with open network access. It was written and reasoned through
during development but could not be executed here because outbound requests
to api.openalex.org were blocked by this project's sandboxed environment's
network allowlist (confirmed via direct connection test, 2026-07-17).

Swapping this in for build_corpus.py requires zero changes to
topic_modeling.py — both scripts produce the same
`tech_id, category, title, publisher, url, snippet` CSV schema.
"""
import requests
import pandas as pd
import time

SEARCH_TERMS = {
    "T01": ("AI/ML Predictive Maintenance", "nuclear power plant predictive maintenance machine learning"),
    "T02": ("Robotic Inspection", "nuclear reactor robotic inspection steam generator"),
    "T03": ("Drones", "drone radiological survey inspection nuclear facility"),
    "T04": ("Digital Twins", "nuclear power plant digital twin"),
    "T05": ("VR/AR Training", "virtual reality augmented reality nuclear workforce training"),
    "T06": ("Additive Manufacturing", "additive manufacturing nuclear component qualification"),
    "T07": ("Smart Materials", "smart materials self-sensing nuclear structural monitoring"),
    "T08": ("Advanced Sensors", "radiation sensor nuclear structural health monitoring"),
    "T09": ("Medical Isotopes", "medical isotope production lutetium-177 actinium-225"),
    "T10": ("Waste Management", "nuclear waste deep geological repository"),
    "T11": ("Decommissioning", "nuclear reactor decommissioning technology"),
    "T12": ("SMR", "small modular reactor deployment"),
    "T13": ("Advanced Fission", "generation IV reactor molten salt sodium fast reactor"),
    "T14": ("Fusion", "fusion energy commercialization"),
}

BASE_URL = "https://api.openalex.org/works"
MAILTO = "gill857185@gmail.com"  # OpenAlex "polite pool" — faster, more reliable rate limits


def pull_for_term(tech_id: str, category: str, query: str, per_term: int = 10) -> list[dict]:
    params = {
        "search": query,
        "per-page": per_term,
        "mailto": MAILTO,
        "sort": "cited_by_count:desc",
    }
    resp = requests.get(BASE_URL, params=params, timeout=30)
    resp.raise_for_status()
    results = []
    for work in resp.json().get("results", []):
        results.append(dict(
            tech_id=tech_id,
            category=category,
            title=work.get("title"),
            publisher=(work.get("host_venue") or {}).get("display_name") or work.get("primary_location", {}).get("source", {}).get("display_name"),
            url=work.get("doi") or work.get("id"),
            snippet=_reconstruct_abstract(work.get("abstract_inverted_index")),
            cited_by_count=work.get("cited_by_count"),
            publication_year=work.get("publication_year"),
        ))
    return results


def _reconstruct_abstract(inverted_index) -> str:
    """OpenAlex returns abstracts as an inverted index (word -> [positions])
    for copyright reasons; this reconstructs plain text from it."""
    if not inverted_index:
        return ""
    position_word = {}
    for word, positions in inverted_index.items():
        for p in positions:
            position_word[p] = word
    return " ".join(position_word[i] for i in sorted(position_word))


if __name__ == "__main__":
    all_rows = []
    for tech_id, (category, query) in SEARCH_TERMS.items():
        rows = pull_for_term(tech_id, category, query)
        all_rows.extend(rows)
        time.sleep(0.2)  # be polite to the API
    df = pd.DataFrame(all_rows)
    df.insert(0, "doc_id", ["D" + str(i + 1).zfill(3) for i in range(len(df))])
    df.to_csv("data/research_corpus_full_openalex.csv", index=False)
    print(f"Pulled {len(df)} works across {len(SEARCH_TERMS)} technologies from OpenAlex.")
