# Mohan Babu University (MBU) — Data Science Learning Portal

A complete, production-grade, multi-page web application and interactive curriculum platform built for the **Department of Data Science at Mohan Babu University (MBU)**.

Everything displayed across the portal — student credentials, curriculum modules, laboratory experiments, sub-experiments, software tools, and study materials — is **fully editable, addable, and removable directly from within the application UI**, backed by persistent client-side storage.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### 1. Installation
Install all pinned dependencies:
```bash
npm install
```

### 2. Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser at: `http://localhost:3000` (or the terminal port indicated).

### 3. Production Build
Verify and assemble an optimized production bundle:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Architecture & Data Files

All portal data is organized cleanly under `src/data/` with strict ID relationships:

```
src/
├── data/
│   ├── student.js                 # Student credentials & faculty mentor profile
│   ├── modules.js                 # 5 Data science course modules & syllabi
│   ├── experiments.js             # Master index importing all module experiments
│   ├── experiments/
│   │   ├── module-01.js           # Experiments 01 - 03 (Python & Vectorization)
│   │   ├── module-02.js           # Experiments 04 - 06 (Ingestion & Preprocessing)
│   │   ├── module-03.js           # Experiments 07 - 09 (EDA & Statistical Testing)
│   │   ├── module-04.js           # Experiments 10 - 12 (Data Visualization & Dashboards)
│   │   └── module-05.js           # Experiments 13 - 15 (Machine Learning & Clustering)
│   ├── tools.js                   # 24 Data science tools across 9 categories
│   └── materials.js               # 20 Study materials (4 per module) linked to PDFs
public/
└── pdfs/                          # PDF laboratory manuals and reference guides
```

### Data Shapes & Invariants
- **15 Experiments & 90 Sub-Experiments**: 3 experiments per module, each with 6 sub-experiments (A through F).
- **15-Word Descriptions**: Every experiment description has **exactly 15 words** for clean visual rhythm.
- **Relational Integrity**: Experiments reference `moduleId` (e.g. `"module-01"`) and `tools` (e.g. `["pandas", "numpy"]`).
- **Student Profile**: Uses explicit placeholders (`"YOUR_STUDENT_ID"`, `"YOUR_ROLL_NUMBER"`, `"YOUR_FACULTY_NAME"`) that display as muted italic text until edited.

---

## 📄 How to Replace Study Material PDFs

The application generates 20 valid, multi-page PDF placeholder files into `public/pdfs/` on setup:

```
public/pdfs/
├── python-basics-guide.pdf
├── numpy-pandas-cheatsheet.pdf
├── data-structures-algorithms.pdf
├── functional-python-ds.pdf
├── data-collection-techniques.pdf
├── data-cleaning-handbook.pdf
├── feature-engineering-guide.pdf
├── sql-nosql-data-prep.pdf
├── eda-statistical-methods.pdf
├── hypothesis-testing-manual.pdf
├── correlation-covariance-study.pdf
├── multivariate-eda-guide.pdf
├── data-viz-principles.pdf
├── matplotlib-seaborn-mastery.pdf
├── interactive-dashboards-plotly.pdf
├── spatial-temporal-viz.pdf
├── ml-algorithms-foundations.pdf
├── model-evaluation-metrics.pdf
├── hyperparameter-tuning-guide.pdf
└── ensemble-methods-xgboost.pdf
```

### Steps to Replace:
1. Place your official course PDF inside `public/pdfs/`.
2. Either name the file to match one of the existing filenames above (drop-in replacement), **or**
3. Open the portal, navigate to **Manage (`/manage?tab=materials`)**, click **Edit** on any material, and update the **PDF Path** field (e.g., `/pdfs/my-custom-guide.pdf`) and page count.

---

## 🐍 How to Connect a Python Execution Backend

By default, the Interactive Execution Sandbox runs in **Transparent Demo Mode**:
- Displays a visible amber disclaimer: *"Demo mode, no Python backend connected"*.
- Runs client-side syntax checks (empty script detection, unbalanced brackets/parentheses).
- Renders the verified benchmark sample output when baseline code is executed.
- Warns clearly that edited code cannot be executed without a live Python backend.

### To Connect a Live Backend:
1. Create a `.env` file in the project root:
   ```env
   VITE_PYTHON_API_URL=http://localhost:8000
   ```
2. Set up a simple Python microservice (e.g., FastAPI or Flask) exposing a `POST /run` endpoint:
   ```python
   # Example FastAPI runner (server.py)
   from fastapi import FastAPI
   from pydantic import BaseModel
   import sys, io

   app = FastAPI()

   class CodeRequest(BaseModel):
       code: str

   @app.post("/run")
   def execute_code(req: CodeRequest):
       stdout_capture = io.StringIO()
       sys.stdout = stdout_capture
       try:
           exec(req.code, {})
           output = stdout_capture.getvalue()
           return {"stdout": output, "error": None}
       except Exception as e:
           return {"stdout": "", "error": str(e)}
       finally:
           sys.stdout = sys.__stdout__
   ```
3. Run the microservice (`uvicorn server:app --port 8000`).
4. Restart the Vite development server. The sandbox will immediately recognize the backend, showing a green connection badge and sending code to your execution service!

---

## 🔄 How to Manage, Export, and Reset Data

All modifications (edited student credentials, newly added modules, custom experiments, adjusted sub-experiments) are saved in browser `localStorage` under `mbu_ds_portal_v1`.

### To Manage Content:
- Visit **`/manage`** or click the **Settings icon** in the top navigation.
- Switch between **Student**, **Modules**, **Tools**, **Materials**, and **Backup** tabs.
- Add, Edit, or Delete items using modal forms.
- If you delete a module or tool that is currently referenced by an experiment, the system warns you beforehand and handles missing references gracefully (displaying `"Unassigned"` instead of crashing).

### To Export a Backup:
1. Go to **`/manage` -> Backup & Restore**.
2. Click **Export Snapshot** to download `mbu_ds_portal_backup.json`.

### To Restore from a Backup:
1. Go to **`/manage` -> Backup & Restore**.
2. Click **Choose JSON File** and upload your previously saved `.json` file.
3. The system validates the JSON schema before applying changes.

### To Reset to Factory Defaults:
1. Go to **`/manage` -> Backup & Restore**.
2. Click **Reset All Data**.
3. Confirm in the dialog. The browser cache will be cleared and the original template datasets reloaded immediately.

---

## 🎨 Design & Accessibility Features
- **Glassmorphic Theme**: Dark mode default with full light mode support, defined via CSS variables.
- **Three.js 3D Background**: Floating particles + connected network lines + floating wireframe polyhedra reacting subtly to mouse movement. Lazy-loaded, pointer-events none, automatically suppressed on mobile, when WebGL is unavailable, or when `prefers-reduced-motion` is enabled.
- **Global Search (`Ctrl+K` / `Cmd+K`)**: Live scored indexing of all 15 experiments, 90 sub-experiments, 5 modules, 24 tools, and 20 study materials with keyboard navigation.
- **Small SVG Chart Component**: Lightweight zero-dependency SVG renderer supporting bar and line charts.
- **Prism React Renderer**: Clean syntax highlighting with line numbering and one-click copy feedback.

---

## 📜 Academic Attribution
**Mohan Babu University (MBU)**  
Department of Data Science — Laboratory Manual & Curriculum Portal  
*Designed for student experimentation, algorithmic research, and interactive data science education.*
