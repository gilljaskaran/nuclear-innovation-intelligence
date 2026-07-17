# Why scripts instead of .ipynb

The analysis pipeline is implemented as plain, git-diffable Python scripts in `../src/` rather than Jupyter notebooks:

- `src/build_dataset.py` — constructs the 14-technology structured dataset
- `src/build_corpus.py` — constructs the real, source-linked NLP research corpus
- `src/scoring_model.py` — the weighted scoring model, normalization, and sensitivity analysis
- `src/topic_modeling.py` — the NLP component (TF-IDF, KMeans clustering, semantic search)
- `src/openalex_pull_template.py` — reference implementation for a full-scale OpenAlex API corpus pull (not run in this project; see its docstring)

Each is runnable end-to-end (`python3 src/scoring_model.py`, etc.) and prints its own results to the console in addition to writing CSV/JSON outputs to `../data/`. This was a deliberate choice over `.ipynb`: notebooks hide execution order and produce large, noisy diffs in git, which matters more for a portfolio piece meant to be read and reviewed than the marginal convenience of inline cell output. Every script's docstring documents its method, its assumptions, and its limitations — read those first.

To reproduce all results from scratch:

```bash
cd nuclear-innovation-intelligence
python3 src/build_dataset.py
python3 src/build_corpus.py
python3 src/scoring_model.py
python3 src/topic_modeling.py
python3 dashboard/build_dashboard_html.py
```
