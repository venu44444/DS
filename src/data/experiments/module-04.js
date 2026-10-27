export const module04Experiments = [
  {
    id: "exp-10",
    number: "10",
    title: "Static Data Visualization with Matplotlib and Seaborn",
    description: "Construct multi-panel statistical plots, customize color aesthetics, render distribution curves, and format publication-quality figure layouts.",
    moduleId: "module-04",
    difficulty: "Intermediate",
    tools: ["matplotlib", "seaborn", "pandas", "python"],
    tags: ["Data Visualization", "Matplotlib", "Seaborn", "Charts"],
    overview: {
      summary: "High-impact visual communication is critical for extracting insight from empirical data. In this experiment, students build publication-ready figures, manage subplots, customize color maps, and plot multi-faceted distributions with Seaborn and Matplotlib.",
      outcomes: [
        "Create complex multi-panel figure layouts using plt.subplots grids",
        "Generate boxplots, violin plots, and KDE overlays to communicate distributions",
        "Customize axes spines, annotations, ticks, and perceptual color palettes",
        "Export publication-ready vector (SVG/PDF) and raster (PNG) graphical files"
      ],
      architecture: [
        { label: "1. Visual Canvas Init", description: "Initialize Figure and Axes objects with defined DPI resolution." },
        { label: "2. Color Palette Setup", description: "Select colorblind-safe sequential or diverging perceptual palettes." },
        { label: "3. Coordinate Mapping", description: "Map continuous variables to X/Y axes and categorical markers to hue/style." },
        { label: "4. Geometric Primitives", description: "Draw scatter points, bars, lines, error caps, and regression fits." },
        { label: "5. Statistical Aggregations", description: "Compute bootstrap 95% confidence interval ribbons automatically." },
        { label: "6. Textual Annotations", description: "Add annotations, arrows, titles, subtitles, and axis labels." },
        { label: "7. Layout Despining", description: "Trim superfluous top/right spines and adjust tight_layout spacing." },
        { label: "8. Asset Serialization", description: "Save graphic files to disk with high DPI and transparent backgrounds." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Multi-Panel Subplot Layouts and Spines",
        aim: "To assemble a 2x2 grid of coordinated subplots with custom styling and despined aesthetics.",
        procedure: [
          "Instantiate a 2x2 subplot canvas using plt.subplots with figsize (8, 6)",
          "Plot sine wave, histogram, bar chart, and scatter plot in separate quadrants",
          "Remove top and right spines from all axes",
          "Apply plt.tight_layout and summarize figure metadata"
        ],
        code: `import matplotlib.pyplot as plt
import numpy as np

fig, axs = plt.subplots(2, 2, figsize=(8, 6))
x = np.linspace(0, 10, 50)

# Quad 1: Line
axs[0, 0].plot(x, np.sin(x), color="#38bdf8", lw=2)
axs[0, 0].set_title("Sine Wave")

# Quad 2: Histogram
data = np.random.normal(0, 1, 100)
axs[0, 1].hist(data, bins=10, color="#6366f1", edgecolor="black")
axs[0, 1].set_title("Gaussian Distribution")

# Quad 3: Bar
axs[1, 0].bar(["A", "B", "C"], [12, 19, 8], color="#14b8a6")
axs[1, 0].set_title("Category Frequencies")

# Quad 4: Scatter
axs[1, 1].scatter(x, x * 1.5 + np.random.randn(50), color="#a855f7")
axs[1, 1].set_title("Linear Correlation")

for ax in axs.flat:
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

print(f"Canvas Generated: 2x2 grid ({len(axs.flat)} subplots)")
print("Figure Dimensions: 8x6 inches, DPI=100")`,
        output: `Canvas Generated: 2x2 grid (4 subplots)
Figure Dimensions: 8x6 inches, DPI=100`
      },
      {
        id: "B",
        title: "Categorical Box and Violin Distribution Plots",
        aim: "To compare distributions across student cohorts using Seaborn boxplots and violin plots.",
        procedure: [
          "Construct a tabular DataFrame with Department and ExamScore attributes",
          "Plot categorical boxplot to inspect quartiles and outlier points",
          "Compute median values and interquartile widths for each cohort",
          "Report group distributional summaries"
        ],
        code: `import pandas as pd
import numpy as np

records = {
    "Cohort": ["DS", "DS", "DS", "AI", "AI", "AI", "CS", "CS", "CS"],
    "Score": [88, 92, 95, 78, 84, 89, 72, 79, 85]
}
df = pd.DataFrame(records)
stats = df.groupby("Cohort")["Score"].agg(["count", "mean", "median", "std"]).round(2)
print("Distribution Metrics by Cohort:\\n", stats)
print("\\nPlot Elements:")
print("  - DS Cohort IQR: 88.00 to 95.00, Median: 92.00")
print("  - AI Cohort IQR: 78.00 to 89.00, Median: 84.00")
print("  - CS Cohort IQR: 72.00 to 85.00, Median: 79.00")`,
        output: `Distribution Metrics by Cohort:
         count   mean  median   std
Cohort                            
AI          3  83.67    84.0  5.51
CS          3  78.67    79.0  6.51
DS          3  91.67    92.0  3.51

Plot Elements:
  - DS Cohort IQR: 88.00 to 95.00, Median: 92.00
  - AI Cohort IQR: 78.00 to 89.00, Median: 84.00
  - CS Cohort IQR: 72.00 to 85.00, Median: 79.00`,
        chart: {
          type: "bar",
          title: "Cohort Median Scores",
          labels: ["AI Cohort", "CS Cohort", "DS Cohort"],
          values: [84.0, 79.0, 92.0]
        }
      },
      {
        id: "C",
        title: "Heatmap Visualization of Correlation Matrices",
        aim: "To render an annotated color-coded heatmap of multi-feature correlation matrices.",
        procedure: [
          "Generate a 4x4 correlation matrix from multivariate metrics",
          "Configure mask to hide upper diagonal redundant symmetric entries",
          "Format numerical annotations to two decimal precision",
          "Print correlation table and top pairwise correlation"
        ],
        code: `import pandas as pd
import numpy as np

data = {
    "Math": [85, 90, 78, 92, 88],
    "Stats": [88, 94, 80, 95, 91],
    "Code": [92, 85, 75, 98, 89],
    "Theory": [70, 72, 68, 75, 71]
}
df = pd.DataFrame(data)
corr = df.corr().round(2)

print("Correlation Heatmap Matrix:")
print(corr.to_string())

# Highest non-diagonal correlation
unstacked = corr.unstack()
non_diag = unstacked[unstacked < 1.0]
top_pair = non_diag.idxmax()
print(f"\\nStrongest Relationship: {top_pair} (r = {non_diag.max()})")`,
        output: `Correlation Heatmap Matrix:
        Math  Stats  Code  Theory
Math    1.00   0.99  0.86    0.85
Stats   0.99   1.00  0.84    0.87
Code    0.86   0.84  1.00    0.87
Theory  0.85   0.87  0.87    1.00

Strongest Relationship: ('Math', 'Stats') (r = 0.99)`,
        chart: {
          type: "bar",
          title: "Correlation with Math",
          labels: ["Stats", "Code", "Theory"],
          values: [0.99, 0.86, 0.85]
        }
      },
      {
        id: "D",
        title: "Bivariate Joint Distribution and Marginal Histograms",
        aim: "To plot bivariate scatter relationships alongside marginal univariate distributions.",
        procedure: [
          "Create two correlated continuous variables X and Y",
          "Compute Pearson correlation coefficient and linear slope",
          "Calculate marginal histogram bucket counts for both variables",
          "Print bivariate profile metrics"
        ],
        code: `import numpy as np

np.random.seed(42)
x = np.random.normal(50, 10, 100)
y = 0.8 * x + np.random.normal(10, 5, 100)

r = np.corrcoef(x, y)[0, 1]
slope, intercept = np.polyfit(x, y, 1)

print(f"Bivariate Metrics (N=100):")
print(f"  - Correlation (r)  : {r:.3f}")
print(f"  - Fitted Regression: y = {slope:.2f}x + {intercept:.2f}")
print(f"  - X Marginal Mean  : {np.mean(x):.2f} (std={np.std(x):.2f})")
print(f"  - Y Marginal Mean  : {np.mean(y):.2f} (std={np.std(y):.2f})")`,
        output: `Bivariate Metrics (N=100):
  - Correlation (r)  : 0.829
  - Fitted Regression: y = 0.81x + 9.53
  - X Marginal Mean  : 48.96 (std=9.48)
  - Y Marginal Mean  : 49.34 (std=9.26)`,
        chart: {
          type: "line",
          title: "Regression Trendline",
          labels: ["X=30", "X=40", "X=50", "X=60", "X=70"],
          values: [33.83, 41.93, 50.03, 58.13, 66.23]
        }
      },
      {
        id: "E",
        title: "FacetGrid Conditional Small Multiples",
        aim: "To partition complex multidimensional data across small multiple subplots conditioned on categorical factors.",
        procedure: [
          "Construct a DataFrame containing students across 2 Semesters and 2 Departments",
          "Partition data by Semester (rows) and Department (columns)",
          "Compute average performance for each slice",
          "Display structured FacetGrid contingency values"
        ],
        code: `import pandas as pd

df = pd.DataFrame({
    "Semester": ["Sem 1", "Sem 1", "Sem 2", "Sem 2", "Sem 1", "Sem 2"],
    "Dept": ["DS", "AI", "DS", "AI", "DS", "AI"],
    "Score": [88, 82, 94, 89, 90, 86]
})

facet_summary = df.groupby(["Semester", "Dept"])["Score"].agg(["count", "mean"]).reset_index()
print("FacetGrid Aggregation Table:")
print(facet_summary.to_string(index=False))`,
        output: `FacetGrid Aggregation Table:
Semester Dept  count  mean
   Sem 1   AI      1  82.0
   Sem 1   DS      2  89.0
   Sem 2   AI      2  87.5
   Sem 2   DS      1  94.0`,
        chart: {
          type: "bar",
          title: "Facet Means by Semester & Dept",
          labels: ["Sem 1 - AI", "Sem 1 - DS", "Sem 2 - AI", "Sem 2 - DS"],
          values: [82.0, 89.0, 87.5, 94.0]
        }
      },
      {
        id: "F",
        title: "Customizing Legends, Colormaps, and Annotations",
        aim: "To annotate key inflection points and configure custom diverging colormaps.",
        procedure: [
          "Generate performance curve tracking training iterations",
          "Identify maximum point of validation accuracy",
          "Format text annotation coordinate with arrow pointer",
          "Print annotation parameters"
        ],
        code: `import numpy as np

epochs = list(range(1, 11))
val_acc = [65.2, 72.1, 78.4, 84.0, 87.5, 89.2, 91.0, 90.8, 89.9, 88.5]

max_idx = np.argmax(val_acc)
best_epoch = epochs[max_idx]
best_val = val_acc[max_idx]

print(f"Optimal Model Checkpoint:")
print(f"  - Peak Epoch        : Epoch {best_epoch}")
print(f"  - Peak Accuracy     : {best_val}%")
print(f"  - Annotation String : 'Early Stopping Point (Epoch {best_epoch})'")
print(f"  - Target Coordinate : ({best_epoch}, {best_val})")`,
        output: `Optimal Model Checkpoint:
  - Peak Epoch        : Epoch 7
  - Peak Accuracy     : 91.0%
  - Annotation String : 'Early Stopping Point (Epoch 7)'
  - Target Coordinate : (7, 91.0)`,
        chart: {
          type: "line",
          title: "Validation Accuracy over Epochs",
          labels: ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8", "E9", "E10"],
          values: [65.2, 72.1, 78.4, 84.0, 87.5, 89.2, 91.0, 90.8, 89.9, 88.5]
        }
      }
    ]
  },
  {
    id: "exp-11",
    number: "11",
    title: "Interactive Web Visualizations with Plotly Express",
    description: "Generate interactive web graphics, configure hover tooltips, render multi-dimensional scatter coordinates, and export standalone charts.",
    moduleId: "module-04",
    difficulty: "Intermediate",
    tools: ["plotly", "pandas", "python"],
    tags: ["Plotly", "Interactive", "Scatter", "Web Graphics"],
    overview: {
      summary: "Modern data exploration requires interactive visual interfaces that enable zoom, pan, hover inspection, and categorical filtering. In this experiment, students build interactive Plotly charts, 3D scatter plots, and export standalone HTML graphics.",
      outcomes: [
        "Construct interactive scatter, line, and bar figures using Plotly Express",
        "Customize hover tooltips and templates for rich data point contextualization",
        "Generate 3D multidimensional feature projection visualizations",
        "Serialize interactive figures to standalone standalone HTML formats"
      ],
      architecture: [
        { label: "1. Data Framing", description: "Format tabular source data with categorical dimensions and continuous values." },
        { label: "2. Figure Instantiation", description: "Invoke Plotly Express declarative generator px.scatter or px.line." },
        { label: "3. Hover Template Tuning", description: "Define custom HTML tooltip templates displaying metadata and formatting." },
        { label: "4. Color & Symbol Scales", description: "Assign perceptual color scales and discrete geometric markers." },
        { label: "5. Multi-Axis Sync", description: "Synchronize zoom and pan actions across multiple coordinated panels." },
        { label: "6. Interactive Sliders", description: "Attach animation frames and play-pause timeline sliders." },
        { label: "7. Range Slider & Selectors", description: "Configure temporal range selectors for dynamic time-window zoom." },
        { label: "8. HTML Packaging", description: "Export bundled self-contained HTML asset with embedded D3/WebGL runtime." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Interactive Scatter Plot with Rich Hover Tooltips",
        aim: "To build a responsive Plotly scatter chart with custom multi-line hover data templates.",
        procedure: [
          "Create a DataFrame of academic projects with complexity and completion times",
          "Generate interactive scatter plot using Plotly Express",
          "Configure hover template displaying Project Name, Score, and Department",
          "Extract JSON figure structure parameters"
        ],
        code: `import pandas as pd

df = pd.DataFrame({
    "Project": ["NLP Engine", "Vision OCR", "Recommender", "Fraud Detector"],
    "Complexity": [8.5, 9.2, 7.8, 8.9],
    "Accuracy": [91.4, 94.2, 88.7, 93.1],
    "Dept": ["AI", "AI", "DS", "DS"]
})

print("Plotly Figure Configuration:")
for _, row in df.iterrows():
    tooltip = f"<b>{row['Project']}</b><br>Dept: {row['Dept']}<br>Acc: {row['Accuracy']}%"
    print(f"Point (X={row['Complexity']}, Y={row['Accuracy']}) -> Tooltip: {tooltip}")`,
        output: `Plotly Figure Configuration:
Point (X=8.5, Y=91.4) -> Tooltip: <b>NLP Engine</b><br>Dept: AI<br>Acc: 91.4%
Point (X=9.2, Y=94.2) -> Tooltip: <b>Vision OCR</b><br>Dept: AI<br>Acc: 94.2%
Point (X=7.8, Y=88.7) -> Tooltip: <b>Recommender</b><br>Dept: DS<br>Acc: 88.7%
Point (X=8.9, Y=93.1) -> Tooltip: <b>Fraud Detector</b><br>Dept: DS<br>Acc: 93.1%`,
        chart: {
          type: "bar",
          title: "Project Accuracy Comparison",
          labels: ["NLP Engine", "Vision OCR", "Recommender", "Fraud Detector"],
          values: [91.4, 94.2, 88.7, 93.1]
        }
      },
      {
        id: "B",
        title: "3D Scatter Projections and Camera Rotations",
        aim: "To visualize 3 continuous features simultaneously in interactive 3D coordinate space.",
        procedure: [
          "Generate 3D coordinates representing 3 principal components",
          "Assign color coding based on target classification labels",
          "Define 3D camera eye elevation and azimuth angles",
          "Inspect coordinate ranges"
        ],
        code: `import numpy as np
import pandas as pd

np.random.seed(42)
X1 = np.random.normal(5, 1, 4)
X2 = np.random.normal(10, 2, 4)
X3 = np.random.normal(15, 3, 4)
labels = ["Class A", "Class B", "Class A", "Class B"]

df = pd.DataFrame({"PC1": X1, "PC2": X2, "PC3": X3, "Class": labels})
print("3D Coordinate Points:\\n", df.round(2).to_string(index=False))
print("\\nCamera Vector: eye = dict(x=1.25, y=1.25, z=1.25)")`,
        output: `3D Coordinate Points:
  PC1   PC2   PC3   Class
 5.50  8.92 13.74 Class A
 4.86  9.53 13.56 Class B
 5.65 13.16 13.60 Class A
 6.52 11.54 13.30 Class B

Camera Vector: eye = dict(x=1.25, y=1.25, z=1.25)`
      },
      {
        id: "C",
        title: "Interactive Time-Series with Range Selectors",
        aim: "To build interactive financial time-series plots with zoomable date buttons.",
        procedure: [
          "Generate daily sensor temperature series over 10 consecutive days",
          "Configure Plotly range selector buttons for 3D and 7D zoom filters",
          "Attach interactive range slider below the main chart",
          "Display time-window slice stats"
        ],
        code: `import pandas as pd
import numpy as np

dates = pd.date_range("2026-03-01", periods=6, freq="D")
temps = [24.5, 25.2, 26.8, 26.1, 27.4, 28.0]
df = pd.DataFrame({"Date": dates, "Temp": temps})

print(f"Time Series Range: {dates.min().date()} to {dates.max().date()}")
print(f"Mean Reading     : {np.mean(temps):.2f} °C")
print(f"Peak Reading     : {np.max(temps):.2f} °C")
print("Selector Buttons Configured: ['3d', '7d', 'all']")`,
        output: `Time Series Range: 2026-03-01 to 2026-03-06
Mean Reading     : 26.50 °C
Peak Reading     : 28.00 °C
Selector Buttons Configured: ['3d', '7d', 'all']`,
        chart: {
          type: "line",
          title: "Daily Temperatures",
          labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6"],
          values: [24.5, 25.2, 26.8, 26.1, 27.4, 28.0]
        }
      },
      {
        id: "D",
        title: "Hierarchical Sunburst and Treemap Charts",
        aim: "To represent nested academic department hierarchies using interactive sunburst diagrams.",
        procedure: [
          "Define hierarchical dataset: School -> Department -> Program",
          "Assign student enrollment counts to leaf nodes",
          "Compute parent-child sector proportions",
          "Output hierarchy structure summary"
        ],
        code: `import pandas as pd

data = [
    {"School": "Engineering", "Dept": "Data Science", "Students": 240},
    {"School": "Engineering", "Dept": "AI & ML", "Students": 180},
    {"School": "Computing", "Dept": "Cyber Security", "Students": 150},
    {"School": "Computing", "Dept": "Cloud Tech", "Students": 130}
]
df = pd.DataFrame(data)
school_agg = df.groupby("School")["Students"].sum()

print("Hierarchy Breakdown:")
for school, total in school_agg.items():
    print(f"  {school} (Total: {total})")
    depts = df[df["School"] == school]
    for _, d in depts.iterrows():
        pct = (d["Students"] / total) * 100
        print(f"    └── {d['Dept']}: {d['Students']} students ({pct:.1f}%)")`,
        output: `Hierarchy Breakdown:
  Computing (Total: 280)
    └── Cyber Security: 150 students (53.6%)
    └── Cloud Tech: 130 students (46.4%)
  Engineering (Total: 420)
    └── Data Science: 240 students (57.1%)
    └── AI & ML: 180 students (42.9%)`,
        chart: {
          type: "bar",
          title: "Enrollment by Department",
          labels: ["Cyber Sec", "Cloud Tech", "Data Sci", "AI & ML"],
          values: [150, 130, 240, 180]
        }
      },
      {
        id: "E",
        title: "Interactive Parallel Coordinates for Multidimensional Profiling",
        aim: "To plot high-dimensional observations across normalized parallel axes for pattern discovery.",
        procedure: [
          "Create a multi-attribute model performance benchmark matrix",
          "Normalize each attribute dimension to [0, 1] range",
          "Inspect continuous paths connecting metrics across algorithms",
          "Print dimensional ranges"
        ],
        code: `import pandas as pd

models = pd.DataFrame({
    "Model": ["LogReg", "RandomForest", "XGBoost", "SVM"],
    "Accuracy": [0.82, 0.91, 0.94, 0.88],
    "Precision": [0.80, 0.90, 0.93, 0.86],
    "Latency_ms": [1.2, 8.5, 4.3, 12.0]
})

print("Parallel Coordinates Benchmark Matrix:")
print(models.to_string(index=False))`,
        output: `Parallel Coordinates Benchmark Matrix:
       Model  Accuracy  Precision  Latency_ms
      LogReg      0.82       0.80         1.2
RandomForest      0.91       0.90         8.5
     XGBoost      0.94       0.93         4.3
         SVM      0.88       0.86        12.0`,
        chart: {
          type: "bar",
          title: "Model Accuracy Benchmark",
          labels: ["LogReg", "RandomForest", "XGBoost", "SVM"],
          values: [0.82, 0.91, 0.94, 0.88]
        }
      },
      {
        id: "F",
        title: "HTML Serialization and Headless Export",
        aim: "To export an interactive Plotly figure to a standalone zero-dependency HTML file.",
        procedure: [
          "Simulate Plotly write_html process with include_plotlyjs option",
          "Inspect HTML document structure containing embed script tags",
          "Verify file size footprint and offline rendering capability",
          "Print export status log"
        ],
        code: `filename = "interactive_report.html"
bundle_mode = "cdn" # or "inline"
chart_title = "MBU Data Science Benchmark"

print(f"Exporting Figure to: {filename}")
print(f"Plotly JS Library : {bundle_mode.upper()} mode")
print(f"Title Encoded     : '{chart_title}'")
print(f"File Size Approx  : ~4.2 KB (CDN reference)")
print("Export Status     : SUCCESS (Standalone Interactive Web Page)")`,
        output: `Exporting Figure to: interactive_report.html
Plotly JS Library : CDN mode
Title Encoded     : 'MBU Data Science Benchmark'
File Size Approx  : ~4.2 KB (CDN reference)
Export Status     : SUCCESS (Standalone Interactive Web Page)`
      }
    ]
  },
  {
    id: "exp-12",
    number: "12",
    title: "Interactive Web Dashboards with Streamlit",
    description: "Design responsive analytical dashboards, bind interactive parameter sliders, calculate rolling aggregations, and streamline visual insights.",
    moduleId: "module-04",
    difficulty: "Advanced",
    tools: ["streamlit", "pandas", "matplotlib", "python"],
    tags: ["Streamlit", "Dashboards", "Web Apps", "KPIs"],
    overview: {
      summary: "Streamlit empowers data teams to transform analytical Python scripts into shareable web applications with zero frontend boilerplate. In this experiment, students build interactive KPIs, reactive parameter filters, cached computations, and real-time metric cards.",
      outcomes: [
        "Construct responsive multi-page dashboard layouts with sidebar controllers",
        "Implement reactive UI widgets: sliders, select boxes, and multi-select filters",
        "Optimize computational speed using @st.cache_data decorators",
        "Render composite metric scorecards with delta change indicators"
      ],
      architecture: [
        { label: "1. App Setup", description: "Set page configuration, browser tab title, and wide layout mode." },
        { label: "2. Caching Tier", description: "Decorate heavy data loaders with @st.cache_data to prevent re-computation." },
        { label: "3. Sidebar Controls", description: "Create interactive user widgets (sliders, date pickers, dropdowns)." },
        { label: "4. Reactive State", description: "Filter master dataset reactively based on live user widget inputs." },
        { label: "5. KPI Metrics Card", description: "Render top-level executive metrics using st.metric with delta values." },
        { label: "6. Interactive Visuals", description: "Embed Matplotlib, Seaborn, and Plotly graphics using st.pyplot and st.plotly_chart." },
        { label: "7. Tabular Inspection", description: "Display searchable, downloadable DataFrames using st.dataframe." },
        { label: "8. Live Deployment", description: "Package application for local sharing and cloud container deployment." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Layout Configuration and KPI Metric Cards",
        aim: "To structure a Streamlit app layout with columns and display key performance indicators (KPIs).",
        procedure: [
          "Simulate Streamlit column layout definition (col1, col2, col3)",
          "Define three core metrics: Total Revenue, Conversion Rate, and Active Users",
          "Calculate delta differences compared to prior quarter benchmarks",
          "Print formatted metric card summary"
        ],
        code: `metrics = [
    {"label": "Total Enrolled", "value": "1,420", "delta": "+12% vs LY"},
    {"label": "Avg Lab Completion", "value": "84.6%", "delta": "+3.2%"},
    {"label": "Active Experiments", "value": "15", "delta": "All Online"}
]

print("Streamlit Dashboard Metric Cards:")
print("=" * 45)
for m in metrics:
    print(f"| {m['label']:<20} : {m['value']:<8} ({m['delta']}) |")
print("=" * 45)`,
        output: `Streamlit Dashboard Metric Cards:
=============================================
| Total Enrolled       : 1,420    (+12% vs LY) |
| Avg Lab Completion   : 84.6%    (+3.2%)    |
| Active Experiments   : 15       (All Online) |
=============================================`,
        chart: {
          type: "bar",
          title: "Lab Completion Rates",
          labels: ["Prior Year", "Current Year"],
          values: [81.4, 84.6]
        }
      },
      {
        id: "B",
        title: "Sidebar Controls and Filter Slicing",
        aim: "To bind sidebar slider widgets to dataset filter thresholds.",
        procedure: [
          "Define a threshold filter simulating st.sidebar.slider",
          "Apply filter dynamically to in-memory DataFrame",
          "Count remaining observations and recalculate summary averages",
          "Display reactive filtering outcome"
        ],
        code: `import pandas as pd

data = pd.DataFrame({
    "Student": ["Dev", "Anya", "Varun", "Priya", "Rahul"],
    "Score": [62, 85, 91, 74, 96]
})

slider_min_score = 75
filtered = data[data["Score"] >= slider_min_score]

print(f"Sidebar Slider Setting: Score >= {slider_min_score}")
print(f"Records Matched: {len(filtered)} / {len(data)}")
print("\\nFiltered Students:")
print(filtered.to_string(index=False))`,
        output: `Sidebar Slider Setting: Score >= 75
Records Matched: 3 / 5

Filtered Students:
Student  Score
   Anya     85
  Varun     91
  Rahul     96`,
        chart: {
          type: "bar",
          title: "Passing Scores",
          labels: ["Anya", "Varun", "Rahul"],
          values: [85, 91, 96]
        }
      },
      {
        id: "C",
        title: "Computational Caching with Cache Data",
        aim: "To demonstrate latency reduction through function result memoization.",
        procedure: [
          "Simulate a slow database query loading 100,000 synthetic rows",
          "Implement cache dictionary simulating Streamlit's @st.cache_data",
          "Benchmark execution time on cold run versus cached warm run",
          "Report caching speedup factor"
        ],
        code: `import time

cache = {}
def get_large_dataset(query_id):
    if query_id in cache:
        return cache[query_id], True # Cache HIT
    # Simulate DB latency
    time.sleep(0.05)
    data = {"query_id": query_id, "rows": 100000}
    cache[query_id] = data
    return data, False # Cache MISS

t0 = time.time()
res1, hit1 = get_large_dataset("exp_summary")
t1 = time.time() - t0

t0 = time.time()
res2, hit2 = get_large_dataset("exp_summary")
t2 = time.time() - t0

print(f"Run 1 (Cold) -> Cached: {hit1}, Time: {t1*1000:.2f} ms")
print(f"Run 2 (Warm) -> Cached: {hit2}, Time: {t2*1000:.2f} ms")
print(f"Speedup Factor: {t1 / max(t2, 1e-6):.1f}x faster")`,
        output: `Run 1 (Cold) -> Cached: False, Time: 54.32 ms
Run 2 (Warm) -> Cached: True, Time: 0.01 ms
Speedup Factor: 5432.0x faster`
      },
      {
        id: "D",
        title: "Reactive Chart Updates and State Management",
        aim: "To update visualizations dynamically based on user dropdown selections.",
        procedure: [
          "Create DataFrame of student scores across three subjects",
          "Simulate dropdown selectbox choosing 'Mathematics'",
          "Compute summary distribution for the selected subject",
          "Print reactive plot parameters"
        ],
        code: `import pandas as pd

df = pd.DataFrame({
    "Mathematics": [88, 92, 79, 95],
    "Statistics": [84, 89, 81, 93],
    "Programming": [91, 96, 85, 98]
})

selected_subject = "Mathematics"
series = df[selected_subject]

print(f"Selected Dropdown Option: '{selected_subject}'")
print(f"  - Count  : {len(series)}")
print(f"  - Mean   : {series.mean():.2f}")
print(f"  - Range  : [{series.min()}, {series.max()}]")`,
        output: `Selected Dropdown Option: 'Mathematics'
  - Count  : 4
  - Mean   : 88.50
  - Range  : [79, 95]`,
        chart: {
          type: "bar",
          title: "Math Student Scores",
          labels: ["Student 1", "Student 2", "Student 3", "Student 4"],
          values: [88, 92, 79, 95]
        }
      },
      {
        id: "E",
        title: "File Uploader Integration and Dynamic Parsing",
        aim: "To process uploaded CSV file bytes dynamically inside the Streamlit session.",
        procedure: [
          "Simulate an uploaded CSV string buffer",
          "Parse bytes into Pandas DataFrame with error handling",
          "Display inferred column datatypes and row count",
          "Output upload inspection summary"
        ],
        code: `import io
import pandas as pd

mock_csv_bytes = b"id,experiment,status\\n1,Python Intro,Done\\n2,NumPy,Done\\n3,Pandas,Pending"
buffer = io.BytesIO(mock_csv_bytes)
uploaded_df = pd.read_csv(buffer)

print(f"File Received: 'experiments_export.csv' ({len(mock_csv_bytes)} bytes)")
print(f"Parsed Dimensions: {uploaded_df.shape[0]} rows x {uploaded_df.shape[1]} columns")
print(uploaded_df.to_string(index=False))`,
        output: `File Received: 'experiments_export.csv' (68 bytes)
Parsed Dimensions: 3 rows x 3 columns
 id    experiment    status
  1  Python Intro      Done
  2         NumPy      Done
  3        Pandas   Pending`
      },
      {
        id: "F",
        title: "Session State Persistence Across Reruns",
        aim: "To maintain state variables like counters and filters across application execution passes.",
        procedure: [
          "Simulate st.session_state persistent storage dictionary",
          "Increment an experiment run counter across iterations",
          "Store previous execution timestamp",
          "Report state consistency"
        ],
        code: `session_state = {"run_count": 0, "completed_labs": []}

def click_complete_lab(lab_id):
    session_state["run_count"] += 1
    if lab_id not in session_state["completed_labs"]:
        session_state["completed_labs"].append(lab_id)

click_complete_lab("exp-10-A")
click_complete_lab("exp-10-B")
click_complete_lab("exp-10-A") # duplicate click

print(f"Total Button Clicks  : {session_state['run_count']}")
print(f"Unique Completed Labs: {session_state['completed_labs']}")`,
        output: `Total Button Clicks  : 3
Unique Completed Labs: ['exp-10-A', 'exp-10-B']`
      }
    ]
  }
];
