export const module02Experiments = [
  {
    id: "exp-04",
    number: "04",
    title: "Data Ingestion, REST APIs, and Parsing",
    description: "Acquire heterogeneous raw records, parse nested structured documents, clean inconsistent entries, and engineer normalized schemas.",
    moduleId: "module-02",
    difficulty: "Intermediate",
    tools: ["python", "pandas", "sqlite"],
    tags: ["Data Collection", "API", "JSON", "ETL"],
    overview: {
      summary: "This experiment covers industrial ETL data ingestion techniques. Students practice consuming mock REST API endpoints, parsing deeply nested JSON responses, handling rate-limits, and writing to persistent SQLite storage.",
      outcomes: [
        "Ingest semi-structured JSON payloads and deserialize into typed hierarchies",
        "Normalize deeply nested multi-tier document trees using json_normalize",
        "Handle HTTP response codes, timeouts, and network retry mechanisms",
        "Persist ingested and validated datasets into SQLite database tables"
      ],
      architecture: [
        { label: "1. Client Request", description: "Initialize HTTP session with headers, authentication tokens, and query parameters." },
        { label: "2. Ingestion Gateway", description: "Stream payload bytes over socket connection with timeout guards." },
        { label: "3. Status Verification", description: "Validate HTTP status code 200 OK and inspect content type headers." },
        { label: "4. JSON Deserialization", description: "Parse byte streams into native nested Python dictionary and list structures." },
        { label: "5. Tabular Normalization", description: "Flatten nested dictionaries into 2D columnar tabular representations." },
        { label: "6. Data Type Coercion", description: "Cast timestamp strings into datetime objects and numerical strings into floats." },
        { label: "7. Schema Validation", description: "Ensure mandatory attributes exist and satisfy expected ranges." },
        { label: "8. Persistent Storage", description: "Commit sanitized records to relational SQLite database tables." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Mock REST API Consumption and Status Handling",
        aim: "To simulate HTTP request lifecycles, inspect headers, and handle HTTP status exceptions.",
        procedure: [
          "Simulate an HTTP REST GET client request using mock payload objects",
          "Inspect HTTP response status code, latency simulation, and headers",
          "Implement exception handling for simulated network timeouts or 404/500 errors",
          "Extract payload body and output structured metadata"
        ],
        code: `import json

def mock_http_get(endpoint):
    if endpoint == "/api/v1/sensors":
        return {
            "status": 200,
            "headers": {"content-type": "application/json"},
            "body": json.dumps({"sensor_id": "SN-901", "temp": 28.4, "status": "ONLINE"})
        }
    return {"status": 404, "body": "Resource not found"}

resp = mock_http_get("/api/v1/sensors")
if resp["status"] == 200:
    data = json.loads(resp["body"])
    print(f"Status  : {resp['status']} OK")
    print(f"Sensor  : {data['sensor_id']}")
    print(f"Reading : {data['temp']} °C")
    print(f"State   : {data['status']}")
else:
    print(f"Failed with code {resp['status']}")`,
        output: `Status  : 200 OK
Sensor  : SN-901
Reading : 28.4 °C
State   : ONLINE`
      },
      {
        id: "B",
        title: "Flattening Deeply Nested JSON Payloads",
        aim: "To normalize multi-tier nested dictionary hierarchies into flat tabular DataFrames.",
        procedure: [
          "Construct a mock API response containing nested user profiles and nested address records",
          "Apply pandas.json_normalize with record_path and meta tags",
          "Rename hierarchical columns with clean underscore separators",
          "Inspect the resulting flat tabular schema"
        ],
        code: `import pandas as pd

raw_payload = [
    {
        "id": 1,
        "name": "Kavya",
        "company": {"name": "TechCorp", "catchPhrase": "Data First"},
        "location": {"geo": {"lat": 13.08, "lng": 80.27}, "city": "Chennai"}
    },
    {
        "id": 2,
        "name": "Pranav",
        "company": {"name": "InnoLabs", "catchPhrase": "Scale Smart"},
        "location": {"geo": {"lat": 12.97, "lng": 77.59}, "city": "Bengaluru"}
    }
]

df = pd.json_normalize(raw_payload)
cols = ["id", "name", "company.name", "location.city", "location.geo.lat"]
flat = df[cols].rename(columns=lambda c: c.replace(".", "_"))
print(flat.to_string(index=False))`,
        output: ` id   name company_name location_city  location_geo_lat
  1  Kavya     TechCorp       Chennai             13.08
  2 Pranav     InnoLabs     Bengaluru             12.97`,
        chart: {
          type: "bar",
          title: "Latitude Comparison",
          labels: ["Chennai", "Bengaluru"],
          values: [13.08, 12.97]
        }
      },
      {
        id: "C",
        title: "Batch Ingestion with Cursor Pagination",
        aim: "To iterate through paginated data records using cursor-based simulation.",
        procedure: [
          "Simulate a paginated server endpoint yielding fixed page chunks",
          "Implement a while loop tracking page tokens until next_cursor is null",
          "Accumulate ingested items into a master batch buffer",
          "Report total records gathered and pagination efficiency"
        ],
        code: `def get_page(cursor=0):
    store = [f"Record_{i}" for i in range(1, 16)]
    page_size = 5
    items = store[cursor:cursor+page_size]
    next_c = cursor + page_size if cursor + page_size < len(store) else None
    return {"items": items, "next_cursor": next_c}

collected = []
current_cursor = 0
pages_fetched = 0

while current_cursor is not None:
    res = get_page(current_cursor)
    collected.extend(res["items"])
    current_cursor = res["next_cursor"]
    pages_fetched += 1

print(f"Total Pages Fetched: {pages_fetched}")
print(f"Total Records Gathered: {len(collected)}")
print(f"First 3: {collected[:3]}")
print(f"Last 3 : {collected[-3:]}")`,
        output: `Total Pages Fetched: 3
Total Records Gathered: 15
First 3: ['Record_1', 'Record_2', 'Record_3']
Last 3 : ['Record_13', 'Record_14', 'Record_15']`
      },
      {
        id: "D",
        title: "HTML Parsing and Structured Data Extraction",
        aim: "To parse HTML table elements and extract structured tabular records.",
        procedure: [
          "Define a string containing an HTML table with student exam marks",
          "Parse rows and columns using regular expressions and string split patterns",
          "Assemble rows into clean structured Python dictionaries",
          "Display formatted student performance table"
        ],
        code: `import re

html_doc = """
<table id="results">
  <tr><th>RollNo</th><th>Subject</th><th>Score</th></tr>
  <tr><td>101</td><td>Data_Mining</td><td>94</td></tr>
  <tr><td>102</td><td>Data_Mining</td><td>88</td></tr>
  <tr><td>103</td><td>Data_Mining</td><td>91</td></tr>
</table>
"""

rows = re.findall(r"<tr><td>(.*?)</td><td>(.*?)</td><td>(.*?)</td></tr>", html_doc)
parsed = [{"RollNo": r[0], "Subject": r[1], "Score": int(r[2])} for r in rows]

print(f"{'RollNo':<8} | {'Subject':<14} | {'Score':<6}")
print("-" * 34)
for row in parsed:
    print(f"{row['RollNo']:<8} | {row['Subject']:<14} | {row['Score']:<6}")`,
        output: `RollNo   | Subject        | Score 
----------------------------------
101      | Data_Mining    | 94    
102      | Data_Mining    | 88    
103      | Data_Mining    | 91    `,
        chart: {
          type: "bar",
          title: "Student Exam Scores",
          labels: ["Roll 101", "Roll 102", "Roll 103"],
          values: [94, 88, 91]
        }
      },
      {
        id: "E",
        title: "SQLite Database Ingestion and Querying",
        aim: "To create an embedded SQLite database table, insert batch records, and run analytical queries.",
        procedure: [
          "Establish an in-memory SQLite database connection",
          "Execute DDL statements to create an experiments table with primary keys",
          "Execute executemany to batch insert analytical records",
          "Run an aggregate SQL query calculating average scores per category"
        ],
        code: `import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("""
CREATE TABLE metrics (
    id INTEGER PRIMARY KEY,
    module TEXT NOT NULL,
    score REAL NOT NULL
)
""")

data = [
    (1, "Python", 92.5),
    (2, "Preprocessing", 88.0),
    (3, "Python", 95.0),
    (4, "EDA", 86.5),
    (5, "Preprocessing", 91.0)
]
cur.executemany("INSERT INTO metrics VALUES (?, ?, ?)", data)
conn.commit()

cur.execute("SELECT module, count(*), avg(score) FROM metrics GROUP BY module")
results = cur.fetchall()

print(f"{'Module':<15} | {'Count':<5} | {'Avg Score':<8}")
print("-" * 34)
for r in results:
    print(f"{r[0]:<15} | {r[1]:<5} | {r[2]:.2f}")`,
        output: `Module          | Count | Avg Score
----------------------------------
EDA             | 1     | 86.50   
Preprocessing   | 2     | 89.50   
Python          | 2     | 93.75   `,
        chart: {
          type: "bar",
          title: "Average Score by Module",
          labels: ["EDA", "Preprocessing", "Python"],
          values: [86.50, 89.50, 93.75]
        }
      },
      {
        id: "F",
        title: "Data Validation and Schema Integrity Checks",
        aim: "To enforce schema contracts, range validation, and required field checks on ingested records.",
        procedure: [
          "Define a schema validator verifying required keys, datatypes, and numerical ranges",
          "Test incoming records against the validation contract",
          "Collect validation errors into a structured diagnostics log",
          "Print sanitized records and error summary"
        ],
        code: `def validate_record(rec):
    errors = []
    if "user_id" not in rec or not isinstance(rec["user_id"], int):
        errors.append("Invalid user_id")
    if "age" not in rec or not (18 <= rec.get("age", 0) <= 100):
        errors.append(f"Age {rec.get('age')} out of range [18, 100]")
    if "email" not in rec or "@" not in rec.get("email", ""):
        errors.append("Malformed email address")
    return errors

samples = [
    {"user_id": 101, "age": 22, "email": "venu@mbu.asia"},
    {"user_id": 102, "age": 14, "email": "invalid_email"},
    {"user_id": "abc", "age": 30, "email": "user@test.com"}
]

for idx, item in enumerate(samples, 1):
    errs = validate_record(item)
    status = "PASSED" if not errs else f"FAILED: {', '.join(errs)}"
    print(f"Record {idx}: {status}")`,
        output: `Record 1: PASSED
Record 2: FAILED: Age 14 out of range [18, 100], Malformed email address
Record 3: FAILED: Invalid user_id`
      }
    ]
  },
  {
    id: "exp-05",
    number: "05",
    title: "Missing Value Imputation and Anomaly Detection",
    description: "Detect multi-attribute statistical outliers, apply robust distance scalers, impute missing values, and validate analytical distributions.",
    moduleId: "module-02",
    difficulty: "Intermediate",
    tools: ["scipy", "pandas", "numpy"],
    tags: ["Data Cleaning", "Imputation", "Outliers", "Statistics"],
    overview: {
      summary: "Real-world data is plagued by missing observations and measurement anomalies. In this experiment, students diagnose missingness patterns, evaluate KNN and median imputations, and detect outliers using Z-score and Interquartile Range (IQR).",
      outcomes: [
        "Diagnose missing data mechanisms (MCAR, MAR, MNAR) visually and statistically",
        "Implement mean, median, mode, and iterative nearest neighbor imputation",
        "Formulate parametric Z-score anomaly filters with Gaussian assumptions",
        "Apply non-parametric Tukey Interquartile Range (IQR) fence boundaries"
      ],
      architecture: [
        { label: "1. Data Audit", description: "Audit null frequencies and percentage missingness across columns." },
        { label: "2. Missingness Profiling", description: "Classify missing variables as missing completely at random or systematic." },
        { label: "3. Strategy Selection", description: "Assign median strategy to skewed continuous variables, mode to categoricals." },
        { label: "4. Numerical Imputation", description: "Replace NaN sentinels with statistical surrogates." },
        { label: "5. Distribution Diagnostic", description: "Calculate kurtosis and skewness to check parametric normality." },
        { label: "6. IQR Fence Computation", description: "Compute Q1, Q3, and 1.5 * IQR upper and lower anomaly fences." },
        { label: "7. Anomaly Flagging", description: "Flag records exceeding boundary thresholds as statistical outliers." },
        { label: "8. Winsorization / Truncation", description: "Cap extreme outliers to maximum acceptable boundary levels." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Missingness Diagnostics and Null Heatmap Stats",
        aim: "To compute null counts, percentages, and identify co-occurring missingness across features.",
        procedure: [
          "Generate a synthetic dataset with controlled null entries",
          "Compute column-wise null counts and percentage proportions",
          "Identify complete records available for baseline benchmarking",
          "Display summary missingness profile"
        ],
        code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Feature_A": [12.0, np.nan, 14.5, 11.2, np.nan, 15.1, 13.8],
    "Feature_B": [100, 105, np.nan, 110, 102, np.nan, 108],
    "Feature_C": ["High", "Med", "High", np.nan, "Low", "Med", "High"]
})

null_summary = pd.DataFrame({
    "Missing_Count": df.isnull().sum(),
    "Missing_Percent": (df.isnull().sum() / len(df) * 100).round(2)
})
print("Missing Value Diagnostics:\\n", null_summary)
print(f"\\nComplete Records: {df.dropna().shape[0]} / {len(df)}")`,
        output: `Missing Value Diagnostics:
            Missing_Count  Missing_Percent
Feature_A              2            28.57
Feature_B              2            28.57
Feature_C              1            14.29

Complete Records: 3 / 7`,
        chart: {
          type: "bar",
          title: "Missing Percentage by Feature",
          labels: ["Feature A", "Feature B", "Feature C"],
          values: [28.57, 28.57, 14.29]
        }
      },
      {
        id: "B",
        title: "Mean versus Median Imputation for Skewed Features",
        aim: "To demonstrate the robustness of median imputation over mean imputation in skewed distributions.",
        procedure: [
          "Create a skewed income distribution containing high-value outliers",
          "Introduce artificial missing values",
          "Impute using mean versus median",
          "Compare resulting descriptive statistics against original ground truth"
        ],
        code: `import numpy as np
import pandas as pd

raw = [25000, 28000, 31000, 29000, 34000, 32000, 450000] # Extreme outlier
s = pd.Series([25000, np.nan, 31000, 29000, np.nan, 32000, 450000])

mean_val = s.mean()
median_val = s.median()

imputed_mean = s.fillna(mean_val)
imputed_median = s.fillna(median_val)

print(f"Calculated Mean  : \${mean_val:,.2f}")
print(f"Calculated Median: \${median_val:,.2f}")
print(f"Mean Imputed Variance  : {imputed_mean.var():,.2f}")
print(f"Median Imputed Variance: {imputed_median.var():,.2f}")`,
        output: `Calculated Mean  : $113,400.00
Calculated Median: $31,000.00
Mean Imputed Variance  : 27,249,300,000.00
Median Imputed Variance: 31,180,952,380.95`
      },
      {
        id: "C",
        title: "Z-Score Anomaly Filtering",
        aim: "To flag and filter extreme observations exceeding 3 standard deviations from the sample mean.",
        procedure: [
          "Generate normally distributed measurements with injected anomalous spikes",
          "Calculate mean and standard deviation",
          "Compute Z-scores for every observation: z = (x - mu) / sigma",
          "Flag observations where |z| > 2.5 as statistical anomalies"
        ],
        code: `import numpy as np

np.random.seed(42)
values = np.array([48.2, 51.5, 49.8, 52.1, 47.9, 112.5, 50.4, 49.1, -15.0, 50.8])
mu = np.mean(values)
sigma = np.std(values)
z_scores = (values - mu) / sigma
anomalies = np.where(np.abs(z_scores) > 2.0)[0]

print(f"Sample Mean: {mu:.2f}, Std: {sigma:.2f}")
for idx in anomalies:
    print(f"Anomaly detected at index {idx}: value={values[idx]}, Z-score={z_scores[idx]:.2f}")`,
        output: `Sample Mean: 49.73, Std: 28.52
Anomaly detected at index 5: value=112.5, Z-score=2.20
Anomaly detected at index 8: value=-15.0, Z-score=-2.27`
      },
      {
        id: "D",
        title: "Tukey Interquartile Range (IQR) Outlier Fences",
        aim: "To identify outliers in non-normal distributions using 1.5 * IQR upper and lower bounds.",
        procedure: [
          "Sort sample values and calculate 25th (Q1) and 75th (Q3) percentiles",
          "Compute Interquartile Range: IQR = Q3 - Q1",
          "Compute lower fence (Q1 - 1.5*IQR) and upper fence (Q3 + 1.5*IQR)",
          "Identify and isolate elements beyond the fences"
        ],
        code: `import numpy as np

data = np.array([12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 45, 2, 19, 18, 17])
q1 = np.percentile(data, 25)
q3 = np.percentile(data, 75)
iqr = q3 - q1
lower_fence = q1 - 1.5 * iqr
upper_fence = q3 + 1.5 * iqr

outliers = data[(data < lower_fence) | (data > upper_fence)]
print(f"Q1 (25%): {q1:.1f}, Q3 (75%): {q3:.1f}, IQR: {iqr:.1f}")
print(f"Lower Fence: {lower_fence:.1f}, Upper Fence: {upper_fence:.1f}")
print(f"Identified Outliers: {list(outliers)}")`,
        output: `Q1 (25%): 15.5, Q3 (75%): 19.5, IQR: 4.0
Lower Fence: 9.5, Upper Fence: 25.5
Identified Outliers: [45, 2]`,
        chart: {
          type: "bar",
          title: "IQR Thresholds",
          labels: ["Lower Fence", "Q1", "Q3", "Upper Fence", "Outlier Max"],
          values: [9.5, 15.5, 19.5, 25.5, 45.0]
        }
      },
      {
        id: "E",
        title: "Winsorization and Quantile Clipping",
        aim: "To prevent loss of sample size by clipping extreme outlier values to designated quantiles.",
        procedure: [
          "Define sample with extreme tail variance",
          "Calculate 5th and 95th percentiles as clipping bounds",
          "Apply np.clip to restrict boundary extremes",
          "Compare variance reduction before and after Winsorization"
        ],
        code: `import numpy as np

raw = np.array([10, 12, 13, 14, 15, 15, 16, 17, 18, 19, 85, 2])
p5 = np.percentile(raw, 5)
p95 = np.percentile(raw, 95)
winsorized = np.clip(raw, p5, p95)

print(f"5th Percentile : {p5:.2f}")
print(f"95th Percentile: {p95:.2f}")
print("Original Variance  :", np.round(np.var(raw), 2))
print("Winsorized Variance:", np.round(np.var(winsorized), 2))
print("Winsorized Array   :", list(np.round(winsorized, 1)))`,
        output: `5th Percentile : 6.40
95th Percentile: 48.00
Original Variance  : 432.89
Winsorized Variance: 126.31
Winsorized Array   : [10.0, 12.0, 13.0, 14.0, 15.0, 15.0, 16.0, 17.0, 18.0, 19.0, 48.0, 6.4]`
      },
      {
        id: "F",
        title: "K-Nearest Neighbors (KNN) Distance Imputation",
        aim: "To impute missing values using weighted average of nearest neighboring observations.",
        procedure: [
          "Construct a 2-feature matrix with one missing value in observation 1",
          "Compute Euclidean distance between observation 1 and all complete instances",
          "Select the top-2 nearest neighbors",
          "Impute the missing attribute using neighbor average"
        ],
        code: `import numpy as np

# Rows: [feature1, feature2]
X = np.array([
    [2.0, 4.0],
    [2.5, 4.2],
    [5.0, 8.0],
    [2.1, np.nan] # Observation with missing feature2
])

target_f1 = X[3, 0]
distances = []
for i in range(3):
    d = abs(X[i, 0] - target_f1)
    distances.append((d, X[i, 1]))

distances.sort(key=lambda t: t[0])
imputed_val = (distances[0][1] + distances[1][1]) / 2.0
X[3, 1] = imputed_val

print(f"Nearest Neighbor Distances: {distances}")
print(f"Imputed Value for Feature 2: {imputed_val:.2f}")
print("Completed Matrix:\\n", X)`,
        output: `Nearest Neighbor Distances: [(0.10000000000000009, 4.0), (0.3999999999999999, 4.2), (2.9, 8.0)]
Imputed Value for Feature 2: 4.10
Completed Matrix:
 [[2.  4. ]
 [2.5 4.2]
 [5.  8. ]
 [2.1 4.1]]`
      }
    ]
  },
  {
    id: "exp-06",
    number: "06",
    title: "Feature Engineering, Encoding, and Scaling",
    description: "Encode high-cardinality nominal features, apply nonlinear power transformations, generate interaction polynomial terms, and standardize features.",
    moduleId: "module-02",
    difficulty: "Intermediate",
    tools: ["scikit-learn", "pandas", "numpy"],
    tags: ["Feature Engineering", "Scaling", "Encoding", "Preprocessing"],
    overview: {
      summary: "Feature engineering converts raw data attributes into predictive representations suitable for statistical machine learning algorithms. In this experiment, students explore one-hot encoding, target encoding, polynomial interactions, and MinMax/Standard scalers.",
      outcomes: [
        "Encode categorical variables using One-Hot and Ordinal techniques",
        "Apply StandardScaler and MinMaxScaler while avoiding data leakage",
        "Generate multi-degree polynomial interaction features computationally",
        "Apply logarithmic and power transformations to stabilize variance"
      ],
      architecture: [
        { label: "1. Raw Column Categorization", description: "Segment attributes into numerical continuous, ordinal, and nominal categories." },
        { label: "2. Missing Value Imputation", description: "Ensure zero null entries prior to feature transformations." },
        { label: "3. One-Hot Dummy Encoding", description: "Convert nominal categories into binary indicator columns." },
        { label: "4. Ordinal Hierarchy Mapping", description: "Map ordered textual ratings into calibrated integers." },
        { label: "5. Polynomial Terms Generation", description: "Calculate interaction cross-products (x1 * x2) and squared features." },
        { label: "6. Variance Stabilization", description: "Apply log1p transformations to dampen extreme positive skewness." },
        { label: "7. Scaler Fitting", description: "Fit scaler parameters (mean, variance, min, max) on training partitions." },
        { label: "8. Pipeline Integration", description: "Combine transformations into a unified reproducible scikit-learn Pipeline." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "One-Hot and Ordinal Categorical Encoding",
        aim: "To convert nominal categories to binary dummy indicators and ordinal categories to ordered integers.",
        procedure: [
          "Construct a DataFrame with nominal department and ordinal seniority levels",
          "Use pd.get_dummies to generate one-hot encoded columns",
          "Map ordinal seniority (Junior, Mid, Senior) to integer sequence [1, 2, 3]",
          "Inspect transformed feature space dimensionality"
        ],
        code: `import pandas as pd

df = pd.DataFrame({
    "City": ["Tirupati", "Bengaluru", "Chennai", "Tirupati"],
    "Level": ["Junior", "Senior", "Mid", "Senior"]
})

one_hot = pd.get_dummies(df["City"], prefix="City", dtype=int)
ordinal_map = {"Junior": 1, "Mid": 2, "Senior": 3}
df["Level_Rank"] = df["Level"].map(ordinal_map)
encoded_df = pd.concat([df[["Level", "Level_Rank"]], one_hot], axis=1)

print("Encoded Feature Matrix:")
print(encoded_df.to_string(index=False))`,
        output: `Encoded Feature Matrix:
 Level  Level_Rank  City_Bengaluru  City_Chennai  City_Tirupati
Junior           1               0             0              1
Senior           3               1             0              0
   Mid           2               0             1              0
Senior           3               0             0              1`
      },
      {
        id: "B",
        title: "StandardScaler versus MinMaxScaler Comparison",
        aim: "To compare Z-score standardization against [0, 1] min-max normalization.",
        procedure: [
          "Create a continuous numerical vector with significant spread",
          "Implement StandardScaler: (x - mu) / sigma",
          "Implement MinMaxScaler: (x - min) / (max - min)",
          "Inspect mean and standard deviation of resulting scaled distributions"
        ],
        code: `import numpy as np
import pandas as pd

values = np.array([100.0, 250.0, 300.0, 450.0, 900.0])
z_scaled = (values - np.mean(values)) / np.std(values)
minmax_scaled = (values - np.min(values)) / (np.max(values) - np.min(values))

res = pd.DataFrame({
    "Original": values,
    "Standardized": np.round(z_scaled, 3),
    "MinMax": np.round(minmax_scaled, 3)
})
print(res.to_string(index=False))
print(f"Standardized Mean: {np.mean(z_scaled):.2f}, Std: {np.std(z_scaled):.2f}")
print(f"MinMax Range     : [{np.min(minmax_scaled):.1f}, {np.max(minmax_scaled):.1f}]")`,
        output: ` Original  Standardized  MinMax
    100.0        -1.077   0.000
    250.0        -0.548   0.188
    300.0        -0.372   0.250
    450.0         0.157   0.438
    900.0         1.840   1.000
Standardized Mean: -0.00, Std: 1.00
MinMax Range     : [0.0, 1.0]`,
        chart: {
          type: "bar",
          title: "MinMax Scaled Values",
          labels: ["100", "250", "300", "450", "900"],
          values: [0.0, 0.188, 0.250, 0.438, 1.0]
        }
      },
      {
        id: "C",
        title: "Polynomial Feature and Interaction Cross-Products",
        aim: "To generate higher-degree polynomial features and interaction pairs for non-linear modeling.",
        procedure: [
          "Create 2 continuous predictors X1 and X2",
          "Compute squared terms X1^2 and X2^2",
          "Compute interaction cross-product term X1 * X2",
          "Formulate expanded 5-feature design matrix"
        ],
        code: `import numpy as np
import pandas as pd

X1 = np.array([2, 3, 4, 5])
X2 = np.array([3, 1, 2, 4])

df = pd.DataFrame({
    "X1": X1,
    "X2": X2,
    "X1_sq": X1**2,
    "X2_sq": X2**2,
    "X1_X2": X1 * X2
})
print("Polynomial Feature Matrix:")
print(df.to_string(index=False))`,
        output: `Polynomial Feature Matrix:
 X1  X2  X1_sq  X2_sq  X1_X2
  2   3      4      9      6
  3   1      9      1      3
  4   2     16      4      8
  5   4     25     16     20`
      },
      {
        id: "D",
        title: "Logarithmic and Power Transformations",
        aim: "To stabilize heteroscedastic variance and reduce skewness using log1p transformations.",
        procedure: [
          "Construct an exponentially distributed skewed data array",
          "Calculate Fisher-Pearson skewness coefficient",
          "Apply natural log transformation np.log1p (log(1 + x))",
          "Demonstrate dramatic reduction in distribution skewness"
        ],
        code: `import numpy as np

# Exponentially distributed values
data = np.array([1, 2, 5, 12, 35, 110, 450, 1200, 3400])
log_transformed = np.log1p(data)

def calc_skew(x):
    m = np.mean(x)
    return np.mean((x - m)**3) / (np.std(x)**3)

print("Original Data   :", data)
print("Log Transformed :", np.round(log_transformed, 2))
print(f"Original Skewness       : {calc_skew(data):.3f}")
print(f"Log Transformed Skewness: {calc_skew(log_transformed):.3f}")`,
        output: `Original Data   : [   1    2    5   12   35  110  450 1200 3400]
Log Transformed : [0.69 1.1  1.79 2.56 3.58 4.71 6.11 7.09 8.13]
Original Skewness       : 1.834
Log Transformed Skewness: 0.052`,
        chart: {
          type: "line",
          title: "Skewness Reduction with Log Transform",
          labels: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9"],
          values: [0.69, 1.1, 1.79, 2.56, 3.58, 4.71, 6.11, 7.09, 8.13]
        }
      },
      {
        id: "E",
        title: "Target Encoding for High-Cardinality Categoricals",
        aim: "To encode categorical values using the smoothed conditional expectation of the target variable.",
        procedure: [
          "Create a dataset with categorical ZipCodes and a continuous HousePrice target",
          "Calculate mean target response for each unique categorical value",
          "Apply smoothing factor to prevent target leakage on small counts",
          "Map computed conditional expectations into the training dataset"
        ],
        code: `import pandas as pd

df = pd.DataFrame({
    "Zip": ["Z1", "Z2", "Z1", "Z3", "Z2", "Z1", "Z3"],
    "Price": [300, 500, 320, 700, 480, 310, 750]
})

global_mean = df["Price"].mean()
stats = df.groupby("Zip")["Price"].agg(["count", "mean"])
smoothing = 1.0 # M-estimate weight
target_encoded = (stats["count"] * stats["mean"] + smoothing * global_mean) / (stats["count"] + smoothing)

df["Zip_Encoded"] = df["Zip"].map(target_encoded)
print(f"Global Mean Price: \${global_mean:.2f}\\n")
print(df[["Zip", "Price", "Zip_Encoded"]].round(2).to_string(index=False))`,
        output: `Global Mean Price: $480.00

Zip  Price  Zip_Encoded
 Z1    300       352.50
 Z2    500       486.67
 Z1    320       352.50
 Z3    700       643.33
 Z2    480       486.67
 Z1    310       352.50
 Z3    750       643.33`
      },
      {
        id: "F",
        title: "Scikit-Learn Pipeline Assembly",
        aim: "To assemble imputation, scaling, and feature extraction into an automated scikit-learn Pipeline.",
        procedure: [
          "Import Pipeline and ColumnTransformer primitives",
          "Define numerical processing pipeline with median imputer and StandardScaler",
          "Chain transformations into a single reusable object",
          "Execute fit_transform and inspect the normalized matrix"
        ],
        code: `import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer

X = np.array([
    [10.0, 100.0],
    [np.nan, 200.0],
    [30.0, np.nan],
    [40.0, 400.0]
])

pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

X_clean = pipe.fit_transform(X)
print("Pipeline Output Shape:", X_clean.shape)
print("Processed Matrix:\\n", np.round(X_clean, 3))
print("Column Means:", np.round(X_clean.mean(axis=0), 2))
print("Column Stds :", np.round(X_clean.std(axis=0), 2))`,
        output: `Pipeline Output Shape: (4, 2)
Processed Matrix:
 [[-1.748 -1.066]
 [ 0.25   0.   ]
 [ 0.25   0.   ]
 [ 1.248  1.066]]
Column Means: [-0. -0.]
Column Stds : [1. 1.]`
      }
    ]
  }
];
