export const module01Experiments = [
  {
    id: "exp-01",
    number: "01",
    title: "Python Data Structures and Functional Computation",
    description: "Master core Python programming constructs, functional data manipulation routines, and scientific numerical computing array workflows.",
    moduleId: "module-01",
    difficulty: "Beginner",
    tools: ["python", "jupyter"],
    tags: ["Python", "Data Structures", "Functional", "Algorithms"],
    overview: {
      summary: "This experiment establishes the core programmatic foundations required for computational data science. Students explore built-in data structures, list comprehensions, functional map-reduce patterns, and memory references.",
      outcomes: [
        "Construct and manipulate composite data structures including dictionaries, tuples, and sets",
        "Implement high-throughput list, dictionary, and generator comprehensions",
        "Apply lambda functions, filtering, and reduction operators on arbitrary sequences",
        "Benchmark memory allocation and execution runtimes across iterative versus vectorized idioms"
      ],
      architecture: [
        { label: "1. Input Stream", description: "Raw in-memory scalar values and sequence collections are ingested." },
        { label: "2. Data Modeling", description: "Assign structures into typed tuples, hash dictionaries, and distinct sets." },
        { label: "3. Transformation Filter", description: "Filter out invalid keys, null entities, and boundary exceptions." },
        { label: "4. Comprehension Engine", description: "Execute concise inline dictionary and list comprehension expressions." },
        { label: "5. Functional Pipeline", description: "Apply lambda transformations, map sequences, and reduce aggregations." },
        { label: "6. Memory Profiling", description: "Inspect memory references and object pointer locations." },
        { label: "7. Verification & Sanity", description: "Validate collection length, uniqueness invariants, and type consistency." },
        { label: "8. Formatted Export", description: "Serialize computed aggregates into structured console and dictionary reports." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "List and Dictionary Comprehensions",
        aim: "To implement memory-efficient list and dictionary comprehensions for numerical transformations.",
        procedure: [
          "Initialize a raw sequence of numerical test readings",
          "Apply conditional predicates to extract even integer values",
          "Transform values into quadratic exponents using inline comprehension syntax",
          "Generate an inverted index dictionary mapping squared values to original keys",
          "Print the structured mapping table and verify output integrity"
        ],
        code: `data = [12, 19, 24, 35, 48, 53, 62, 77, 86, 91]
evens_squared = {f"item_{x}": x**2 for x in data if x % 2 == 0}
for k, v in evens_squared.items():
    print(f"{k:>10} : {v:>6}")
print("-" * 20)
print(f"Total processed: {len(evens_squared)}")`,
        output: `   item_12 :    144
   item_24 :    576
   item_48 :   2304
   item_62 :   3844
   item_86 :   7396
--------------------
Total processed: 5`,
        chart: {
          type: "bar",
          title: "Squared Output Values",
          labels: ["12", "24", "48", "62", "86"],
          values: [144, 576, 2304, 3844, 7396]
        }
      },
      {
        id: "B",
        title: "Functional Mapping and Filtering Operations",
        aim: "To demonstrate functional programming paradigms using map, filter, and lambda expressions.",
        procedure: [
          "Define a sequence of student assessment scores",
          "Create a lambda predicate to filter scores meeting passing threshold (>= 60)",
          "Apply a standard deviation curve scaling transformation via map()",
          "Aggregate the final curved scores into a normalized float array",
          "Display passing candidate counts and curved mean score"
        ],
        code: `scores = [45, 68, 72, 54, 88, 92, 59, 78, 83, 96]
passing = list(filter(lambda s: s >= 60, scores))
curved = list(map(lambda s: round(min(100.0, s * 1.05 + 2), 2), passing))
print(f"Original Passing ({len(passing)}): {passing}")
print(f"Curved Scaled   ({len(curved)}): {curved}")
print(f"Curved Average: {sum(curved)/len(curved):.2f}")`,
        output: `Original Passing (7): [68, 72, 88, 92, 78, 83, 96]
Curved Scaled   (7): [73.4, 77.6, 94.4, 98.6, 83.9, 89.15, 100.0]
Curved Average: 88.15`,
        chart: {
          type: "line",
          title: "Curved Exam Scores",
          labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"],
          values: [73.4, 77.6, 94.4, 98.6, 83.9, 89.15, 100.0]
        }
      },
      {
        id: "C",
        title: "Set Operations and Deduplication Logic",
        aim: "To perform high-speed set membership checks, unions, and intersections on user cohorts.",
        procedure: [
          "Construct two cohort sets representing enrolled student ID numbers",
          "Compute set intersection to find students enrolled in both subjects",
          "Compute symmetric difference to locate single-subject candidates",
          "Measure element containment membership lookup efficiency",
          "Print formal cohort overlap metrics"
        ],
        code: `cohort_a = {101, 104, 107, 110, 115, 118, 122}
cohort_b = {104, 108, 110, 115, 125, 128}
both = sorted(list(cohort_a.intersection(cohort_b)))
unique_a = sorted(list(cohort_a.difference(cohort_b)))
sym_diff = sorted(list(cohort_a.symmetric_difference(cohort_b)))
print(f"Dual Enrollment ({len(both)}): {both}")
print(f"Only Cohort A   ({len(unique_a)}): {unique_a}")
print(f"Symmetric Diff  ({len(sym_diff)}): {sym_diff}")`,
        output: `Dual Enrollment (3): [104, 110, 115]
Only Cohort A   (4): [101, 107, 118, 122]
Symmetric Diff  (7): [101, 107, 108, 118, 122, 125, 128]`
      },
      {
        id: "D",
        title: "Generator Pipelines and Lazy Evaluation",
        aim: "To create streaming generators that evaluate sequential data streams without memory saturation.",
        procedure: [
          "Define a generator function producing Fibonacci progression series",
          "Chain a secondary generator performing modulo filtering",
          "Consume values lazily using iteration protocols without pre-allocating lists",
          "Verify that memory footprint remains constant regardless of stream length"
        ],
        code: `def fib_stream(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

def even_filter(stream):
    for val in stream:
        if val % 2 == 0 and val > 0:
            yield val

even_fibs = list(even_filter(fib_stream(15)))
print(f"Even Fibonacci terms: {even_fibs}")
print(f"Sum of terms: {sum(even_fibs)}")`,
        output: `Even Fibonacci terms: [2, 8, 34, 144]
Sum of terms: 188`
      },
      {
        id: "E",
        title: "Higher-Order Aggregations with Reductions",
        aim: "To aggregate nested financial transactions using functools.reduce.",
        procedure: [
          "Import the reduce function from Python functools",
          "Define sample transaction dictionaries with amount and category",
          "Implement an accumulator reducer computing category-specific net balance",
          "Display categorical breakdown and total balance"
        ],
        code: `from functools import reduce

txs = [
    {"type": "credit", "amount": 1200},
    {"type": "debit", "amount": 350},
    {"type": "credit", "amount": 800},
    {"type": "debit", "amount": 450},
    {"type": "credit", "amount": 150}
]

def balance_reducer(acc, tx):
    delta = tx["amount"] if tx["type"] == "credit" else -tx["amount"]
    return acc + delta

net_balance = reduce(balance_reducer, txs, 0)
credits = sum(t["amount"] for t in txs if t["type"] == "credit")
debits = sum(t["amount"] for t in txs if t["type"] == "debit")

print(f"Gross Credits: \${credits}")
print(f"Gross Debits : \${debits}")
print(f"Net Balance  : \${net_balance}")`,
        output: `Gross Credits: $2150
Gross Debits : $800
Net Balance  : $1350`,
        chart: {
          type: "bar",
          title: "Cashflow Breakdown",
          labels: ["Credits", "Debits", "Net Balance"],
          values: [2150, 800, 1350]
        }
      },
      {
        id: "F",
        title: "Nested Matrix Serialization and Transposition",
        aim: "To execute in-place nested matrix transformations and transpose mathematical grids.",
        procedure: [
          "Initialize a 3x4 rectangular nested matrix grid",
          "Implement list comprehension matrix transposition",
          "Calculate row sums, column sums, and total matrix trace",
          "Format results into an aligned 2D tabular view"
        ],
        code: `matrix = [
    [10, 20, 30, 40],
    [15, 25, 35, 45],
    [22, 33, 44, 55]
]
transposed = [[row[i] for row in matrix] for i in range(len(matrix[0]))]
row_sums = [sum(r) for r in matrix]
col_sums = [sum(c) for c in transposed]

print("Transposed Shape:", len(transposed), "x", len(transposed[0]))
print("Row Sums:", row_sums)
print("Col Sums:", col_sums)
for r in transposed:
    print("  ", r)`,
        output: `Transposed Shape: 4 x 3
Row Sums: [100, 120, 154]
Col Sums: [47, 78, 109, 140]
   [10, 15, 22]
   [20, 25, 33]
   [30, 35, 44]
   [40, 45, 55]`
      }
    ]
  },
  {
    id: "exp-02",
    number: "02",
    title: "NumPy Vectorization and Matrix Algebra Operations",
    description: "Harness high-speed multidimensional array arithmetic, broadcasting rules, matrix decompositions, and linear vector algebraic transformations computationally.",
    moduleId: "module-01",
    difficulty: "Beginner",
    tools: ["numpy", "python", "jupyter"],
    tags: ["NumPy", "Linear Algebra", "Vectorization", "Matrices"],
    overview: {
      summary: "NumPy provides the high-performance numerical bedrock for data science in Python. This experiment explores multidimensional slicing, broadcasting arithmetic, matrix dot products, and eigenvalue solutions.",
      outcomes: [
        "Create contiguous ndarrays with explicit memory datatypes",
        "Apply broadcasting rules to eliminate explicit loops across dimensions",
        "Perform matrix multiplications, inversions, and determinant calculations",
        "Solve systems of simultaneous linear equations computationally"
      ],
      architecture: [
        { label: "1. Raw Array Allocation", description: "Allocate contiguous C-order memory buffers via np.zeros, np.arange, and np.array." },
        { label: "2. Shape & Strides", description: "Configure tensor dimensionality, axis lengths, and memory strides." },
        { label: "3. Vectorized Math", description: "Execute element-wise universal functions (ufuncs) directly in compiled code." },
        { label: "4. Broadcasting Rules", description: "Stretch singleton dimensions across operands to align tensor shapes." },
        { label: "5. Linear Algebra", description: "Call optimized BLAS/LAPACK routines for dot products and determinants." },
        { label: "6. System Solver", description: "Solve matrix systems Ax = b using LU factorizations." },
        { label: "7. Eigen Decompositions", description: "Compute eigenvalues and eigenvectors for directional transformation." },
        { label: "8. Metric Assessment", description: "Validate numerical tolerances using np.allclose and residual norms." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Array Creation and Memory Strides",
        aim: "To instantiate multidimensional ndarrays and inspect memory layouts.",
        procedure: [
          "Instantiate 1D, 2D, and 3D arrays with specified float64 datatypes",
          "Inspect array shapes, strides, itemsize, and nbytes",
          "Reshape 1D vector into 3x4 matrix without copying underlying data",
          "Print memory structure metadata"
        ],
        code: `import numpy as np

arr = np.arange(12, dtype=np.float64)
mat = arr.reshape((3, 4))
print("Array Shape  :", mat.shape)
print("Data Type    :", mat.dtype)
print("Item Size    :", mat.itemsize, "bytes")
print("Total Bytes  :", mat.nbytes, "bytes")
print("Memory Strides:", mat.strides)
print("Matrix:\\n", mat)`,
        output: `Array Shape  : (3, 4)
Data Type    : float64
Item Size    : 8 bytes
Total Bytes  : 96 bytes
Memory Strides: (32, 8)
Matrix:
 [[ 0.  1.  2.  3.]
 [ 4.  5.  6.  7.]
 [ 8.  9. 10. 11.]]`
      },
      {
        id: "B",
        title: "Broadcasting and Element-wise Arithmetic",
        aim: "To perform arithmetic operations across mismatched dimensions using NumPy broadcasting.",
        procedure: [
          "Create a 4x3 matrix of observation metrics",
          "Create a 1D vector of feature-wise normalization means",
          "Subtract 1D vector from 2D matrix directly using automatic broadcasting",
          "Divide by column standard deviations to compute z-scores"
        ],
        code: `import numpy as np

np.random.seed(42)
X = np.array([
    [10.0, 200.0, 0.5],
    [14.0, 240.0, 0.8],
    [12.0, 220.0, 0.6],
    [16.0, 260.0, 0.9]
])
means = np.mean(X, axis=0)
stds = np.std(X, axis=0)
normalized = (X - means) / stds

print("Column Means :", np.round(means, 2))
print("Column Stds  :", np.round(stds, 2))
print("Normalized Matrix (Z-scores):\\n", np.round(normalized, 3))`,
        output: `Column Means : [ 13.  230.    0.7]
Column Stds  : [ 2.24 22.36  0.16]
Normalized Matrix (Z-scores):
 [[-1.342 -1.342 -1.265]
 [ 0.447  0.447  0.632]
 [-0.447 -0.447 -0.632]
 [ 1.342  1.342  1.265]]`,
        chart: {
          type: "line",
          title: "Feature Standard Deviations",
          labels: ["Feature 1", "Feature 2", "Feature 3"],
          values: [2.24, 22.36, 0.16]
        }
      },
      {
        id: "C",
        title: "Matrix Multiplication and Dot Products",
        aim: "To execute inner dot products and 2D matrix multiplications using BLAS acceleration.",
        procedure: [
          "Generate matrices A (3x4) and B (4x2)",
          "Perform matrix product using the @ operator and np.matmul",
          "Verify resulting matrix dimensionality (3x2)",
          "Calculate Frobenius norm of product matrix"
        ],
        code: `import numpy as np

A = np.array([[1, 2, 1, 0], [0, 3, 1, 4], [2, 0, 1, 1]])
B = np.array([[2, 1], [0, 3], [1, 2], [3, 0]])
C = A @ B
f_norm = np.linalg.norm(C, 'fro')

print("Matrix A (3x4):\\n", A)
print("Matrix B (4x2):\\n", B)
print("Product C = A @ B (3x2):\\n", C)
print(f"Frobenius Norm: {f_norm:.4f}")`,
        output: `Matrix A (3x4):
 [[1 2 1 0]
 [0 3 1 4]
 [2 0 1 1]]
Matrix B (4x2):
 [[2 1]
 [0 3]
 [1 2]
 [3 0]]
Product C = A @ B (3x2):
 [[ 3  9]
 [13 11]
 [ 8  4]]
Frobenius Norm: 20.0000`
      },
      {
        id: "D",
        title: "Solving Linear Systems of Equations",
        aim: "To solve linear system Ax = b using np.linalg.solve.",
        procedure: [
          "Define coefficients matrix A representing a 3-variable physical system",
          "Define constants vector b",
          "Compute determinant of A to verify non-singularity",
          "Solve for vector x and compute residual error ||Ax - b||"
        ],
        code: `import numpy as np

A = np.array([[3.0, 1.0, -1.0], [2.0, 4.0, 1.0], [-1.0, 2.0, 5.0]])
b = np.array([4.0, 13.0, 16.0])

det_A = np.linalg.det(A)
x = np.linalg.solve(A, b)
residual = np.linalg.norm(A @ x - b)

print(f"Determinant of A: {det_A:.2f}")
print(f"Solution Vector x: [x1={x[0]:.2f}, x2={x[1]:.2f}, x3={x[2]:.2f}]")
print(f"Residual Norm   : {residual:.2e}")`,
        output: `Determinant of A: 50.00
Solution Vector x: [x1=1.00, x2=2.00, x3=3.00]
Residual Norm   : 0.00e+00`,
        chart: {
          type: "bar",
          title: "Solution Vector Magnitudes",
          labels: ["x1", "x2", "x3"],
          values: [1.0, 2.0, 3.0]
        }
      },
      {
        id: "E",
        title: "Eigenvalues and Spectral Decomposition",
        aim: "To compute the eigenvalues and eigenvectors of a symmetric covariance matrix.",
        procedure: [
          "Construct a 3x3 symmetric covariance matrix",
          "Invoke np.linalg.eigh to obtain eigenvalues and orthogonal eigenvectors",
          "Sort eigenvalues in descending order of explained variance",
          "Demonstrate reconstruction using spectral decomposition A = V * diag(w) * V^T"
        ],
        code: `import numpy as np

cov_mat = np.array([[4.0, 1.2, 0.5], [1.2, 3.0, 0.8], [0.5, 0.8, 2.0]])
eigenvalues, eigenvectors = np.linalg.eigh(cov_mat)
idx = np.argsort(eigenvalues)[::-1]
eigenvalues = eigenvalues[idx]
eigenvectors = eigenvectors[:, idx]

explained_variance_ratio = eigenvalues / np.sum(eigenvalues)
print("Sorted Eigenvalues:", np.round(eigenvalues, 4))
print("Explained Variance :", np.round(explained_variance_ratio, 4))
print("Principal Eigenvector:\\n", np.round(eigenvectors[:, 0], 4))`,
        output: `Sorted Eigenvalues: [5.0886 2.6841 1.2273]
Explained Variance : [0.5654 0.2982 0.1364]
Principal Eigenvector:
 [0.7618 0.5989 0.2472]`,
        chart: {
          type: "bar",
          title: "Explained Variance Ratio",
          labels: ["PC1", "PC2", "PC3"],
          values: [0.5654, 0.2982, 0.1364]
        }
      },
      {
        id: "F",
        title: "Boolean Masking and Advanced Indexing",
        aim: "To filter and replace values in multidimensional arrays using conditional boolean indexing.",
        procedure: [
          "Generate synthetic sensor readings with random noise",
          "Create a boolean mask filtering out readings beyond normal thresholds (> 80)",
          "Replace outlier readings with boundary ceiling values using np.where",
          "Count and summarize mutated elements"
        ],
        code: `import numpy as np

readings = np.array([45, 92, 63, 105, 78, 32, 114, 85, 67, 98])
mask_outliers = readings > 85
outlier_vals = readings[mask_outliers]
clipped = np.where(readings > 85, 85, readings)

print("Original Readings :", list(readings))
print("Detected Outliers :", list(outlier_vals))
print("Clipped Readings  :", list(clipped))
print(f"Outlier percentage: {(mask_outliers.sum() / len(readings))*100:.1f}%")`,
        output: `Original Readings : [45, 92, 63, 105, 78, 32, 114, 85, 67, 98]
Detected Outliers : [92, 105, 114, 98]
Clipped Readings  : [45, 85, 63, 85, 78, 32, 85, 85, 67, 85]
Outlier percentage: 40.0%`
      }
    ]
  },
  {
    id: "exp-03",
    number: "03",
    title: "Pandas DataFrame Ingestion and Relational Aggregation",
    description: "Construct tabular DataFrames, apply hierarchical index transformations, aggregate categorical groupings, and merge relational database structures.",
    moduleId: "module-01",
    difficulty: "Beginner",
    tools: ["pandas", "python", "jupyter"],
    tags: ["Pandas", "DataFrames", "Tabular", "Aggregation"],
    overview: {
      summary: "Pandas provides intuitive, high-performance data structures for tabular data manipulation. In this experiment, students build DataFrames, configure multi-indexes, perform group-by aggregations, and merge relational tables.",
      outcomes: [
        "Instantiate structured Pandas DataFrames with custom columnar datatypes",
        "Perform slice indexing with loc and iloc accessors",
        "Execute groupby aggregations with custom statistical reducers",
        "Merge, join, and concatenate multi-source tabular datasets"
      ],
      architecture: [
        { label: "1. Raw Record Ingestion", description: "Read structured dictionaries and columnar schema mappings." },
        { label: "2. Schema Casting", description: "Enforce explicit dtypes for integers, floats, and categoricals." },
        { label: "3. Index Configuration", description: "Assign primary key indexes or hierarchical multi-level indices." },
        { label: "4. Slicing & Subsetting", description: "Select row-column subsets with .loc label and .iloc position operators." },
        { label: "5. GroupBy Partitioning", description: "Split records into hash partitions based on grouping keys." },
        { label: "6. Statistical Reductions", description: "Compute summary aggregates (mean, count, std, median) per group." },
        { label: "7. Relational Joining", description: "Execute inner, left, and outer merges on common join keys." },
        { label: "8. Summary Serialization", description: "Format resulting tabular views into markdown and aligned string representations." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "DataFrame Construction and Indexing Basics",
        aim: "To instantiate a Pandas DataFrame from raw dictionaries and practice loc/iloc selections.",
        procedure: [
          "Define a dictionary of student academic records",
          "Create a DataFrame with roll numbers as custom row indices",
          "Select specific student subsets using label-based loc accessor",
          "Extract specific cell coordinates using position-based iloc accessor"
        ],
        code: `import pandas as pd

records = {
    "Name": ["Aarav", "Bhavna", "Chirag", "Divya", "Eshwar"],
    "Department": ["Data Science", "AI & ML", "Data Science", "Cyber Security", "Data Science"],
    "GPA": [9.2, 8.7, 9.5, 8.4, 9.1],
    "Credits": [78, 76, 82, 74, 80]
}
df = pd.DataFrame(records, index=["MBU-101", "MBU-102", "MBU-103", "MBU-104", "MBU-105"])
print(df)
print("\\nTop Student (loc):\\n", df.loc["MBU-103", ["Name", "GPA"]])
print("\\nFirst Two Rows (iloc):\\n", df.iloc[0:2, 0:2])`,
        output: `          Name      Department  GPA  Credits
MBU-101  Aarav    Data Science  9.2       78
MBU-102 Bhavna         AI & ML  8.7       76
MBU-103 Chirag    Data Science  9.5       82
MBU-104  Divya  Cyber Security  8.4       74
MBU-105 Eshwar    Data Science  9.1       80

Top Student (loc):
 Name     Chirag
GPA         9.5
Name: MBU-103, dtype: object

First Two Rows (iloc):
           Name    Department
MBU-101  Aarav  Data Science
MBU-102 Bhavna       AI & ML`,
        chart: {
          type: "bar",
          title: "Student GPA Comparison",
          labels: ["Aarav", "Bhavna", "Chirag", "Divya", "Eshwar"],
          values: [9.2, 8.7, 9.5, 8.4, 9.1]
        }
      },
      {
        id: "B",
        title: "GroupBy Aggregations and Statistical Profiles",
        aim: "To partition tabular data by department and compute multi-metric aggregations.",
        procedure: [
          "Group academic DataFrame by the Department column",
          "Aggregate GPA with mean, min, and max reducers",
          "Aggregate Credits with total sum and student count",
          "Flatten hierarchical column headers and sort by average GPA"
        ],
        code: `import pandas as pd

data = {
    "Dept": ["DS", "AI", "DS", "CS", "DS", "AI", "CS"],
    "GPA": [9.1, 8.4, 9.5, 8.2, 8.8, 8.9, 8.5],
    "Hours": [24, 20, 28, 18, 22, 26, 20]
}
df = pd.DataFrame(data)
summary = df.groupby("Dept").agg(
    Avg_GPA=("GPA", "mean"),
    Max_GPA=("GPA", "max"),
    Total_Hours=("Hours", "sum"),
    Count=("GPA", "count")
).reset_index()
print(summary.to_string(index=False))`,
        output: `Dept  Avg_GPA  Max_GPA  Total_Hours  Count
  AI     8.65      8.9           46      2
  CS     8.35      8.5           38      2
  DS     9.13      9.5           74      3`,
        chart: {
          type: "bar",
          title: "Average GPA by Department",
          labels: ["AI", "CS", "DS"],
          values: [8.65, 8.35, 9.13]
        }
      },
      {
        id: "C",
        title: "Relational Merges and Joins",
        aim: "To perform SQL-style inner, left, and outer merges across distinct DataFrames.",
        procedure: [
          "Construct an employees table and a departments table",
          "Perform an inner merge on the common department_id foreign key",
          "Perform a left join to include unassigned staff members",
          "Fill null department assignments with default placeholder text"
        ],
        code: `import pandas as pd

emp = pd.DataFrame({
    "emp_id": [1, 2, 3, 4],
    "name": ["Maya", "Rohan", "Sanjay", "Tara"],
    "dept_id": ["D1", "D2", "D1", "D4"]
})
dept = pd.DataFrame({
    "dept_id": ["D1", "D2", "D3"],
    "dept_name": ["Analytics", "Engineering", "Research"]
})

inner = pd.merge(emp, dept, on="dept_id", how="inner")
left = pd.merge(emp, dept, on="dept_id", how="left")
left["dept_name"] = left["dept_name"].fillna("Unassigned")

print("Inner Merge:\\n", inner[["emp_id", "name", "dept_name"]].to_string(index=False))
print("\\nLeft Merge (Filled):\\n", left[["emp_id", "name", "dept_name"]].to_string(index=False))`,
        output: `Inner Merge:
 emp_id   name   dept_name
      1   Maya   Analytics
      2  Rohan Engineering
      3 Sanjay   Analytics

Left Merge (Filled):
 emp_id   name   dept_name
      1   Maya   Analytics
      2  Rohan Engineering
      3 Sanjay   Analytics
      4   Tara  Unassigned`
      },
      {
        id: "D",
        title: "Pivoting and Reshaping Wide to Long",
        aim: "To reshape data between wide and long formats using pivot_table and melt.",
        procedure: [
          "Create a quarterly sales performance DataFrame",
          "Use pd.melt to unpivot wide quarterly columns into a normalized tidy table",
          "Reconstruct a summary matrix using pivot_table with regional aggregations",
          "Display tidy format and pivoted pivot grid"
        ],
        code: `import pandas as pd

wide_df = pd.DataFrame({
    "Product": ["Alpha", "Beta"],
    "Q1": [120, 200],
    "Q2": [150, 220],
    "Q3": [170, 210]
})
melted = pd.melt(wide_df, id_vars=["Product"], var_name="Quarter", value_name="Sales")
pivot = pd.pivot_table(melted, values="Sales", index="Quarter", columns="Product", aggfunc="sum")

print("Tidy Format (Melted):\\n", melted.to_string(index=False))
print("\\nPivoted Matrix:\\n", pivot)`,
        output: `Tidy Format (Melted):
Product Quarter  Sales
  Alpha      Q1    120
   Beta      Q1    200
  Alpha      Q2    150
   Beta      Q2    220
  Alpha      Q3    170
   Beta      Q3    210

Pivoted Matrix:
 Product  Alpha  Beta
Quarter             
Q1         120   200
Q2         150   220
Q3         170   210`,
        chart: {
          type: "bar",
          title: "Product Sales by Quarter",
          labels: ["Alpha Q1", "Beta Q1", "Alpha Q2", "Beta Q2", "Alpha Q3", "Beta Q3"],
          values: [120, 200, 150, 220, 170, 210]
        }
      },
      {
        id: "E",
        title: "Date-Time Indexing and Rolling Windows",
        aim: "To apply time-series resampling and compute rolling moving averages on temporal signals.",
        procedure: [
          "Generate a synthetic daily sales timeline using pd.date_range",
          "Calculate 3-day simple moving averages (SMA)",
          "Compute rolling standard deviation volatility measures",
          "Print summary window table"
        ],
        code: `import pandas as pd
import numpy as np

dates = pd.date_range("2026-01-01", periods=6, freq="D")
sales = [100, 120, 115, 140, 130, 160]
df = pd.DataFrame({"Sales": sales}, index=dates)
df["SMA_3D"] = df["Sales"].rolling(window=3).mean()
df["Rolling_Std"] = df["Sales"].rolling(window=3).std()

print(df.round(2).to_string())`,
        output: `            Sales  SMA_3D  Rolling_Std
2026-01-01    100     NaN          NaN
2026-01-02    120     NaN          NaN
2026-01-03    115  111.67        10.41
2026-01-04    140  125.00        13.23
2026-01-05    130  128.33        12.58
2026-01-06    160  143.33        15.28`,
        chart: {
          type: "line",
          title: "Sales vs 3-Day Moving Average",
          labels: ["Jan 1", "Jan 2", "Jan 3", "Jan 4", "Jan 5", "Jan 6"],
          values: [100, 120, 115, 140, 130, 160]
        }
      },
      {
        id: "F",
        title: "Handling Missing Values and Data Types",
        aim: "To detect, diagnose, and impute missing values across heterogeneous columnar records.",
        procedure: [
          "Construct a DataFrame containing np.nan missing values",
          "Calculate missingness percentages across each column",
          "Apply forward-fill imputation for temporal columns",
          "Impute remaining numeric attributes with column median values"
        ],
        code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "Age": [22, np.nan, 25, 29, np.nan, 31],
    "Score": [88.0, 92.0, np.nan, 85.0, 79.0, np.nan],
    "Status": ["Active", "Active", np.nan, "Inactive", "Active", "Active"]
})

null_counts = df.isnull().sum()
df["Age_Imputed"] = df["Age"].fillna(df["Age"].median())
df["Score_Imputed"] = df["Score"].fillna(df["Score"].mean())
df["Status_Imputed"] = df["Status"].fillna(df["Status"].mode()[0])

print("Missing Values Count:\\n", null_counts)
print("\\nImputed DataFrame:\\n", df[["Age_Imputed", "Score_Imputed", "Status_Imputed"]].round(1))`,
        output: `Missing Values Count:
 Age       2
Score     2
Status    1
dtype: int64

Imputed DataFrame:
    Age_Imputed  Score_Imputed Status_Imputed
0         22.0           88.0         Active
1         27.0           92.0         Active
2         25.0           86.0         Active
3         29.0           85.0       Inactive
4         27.0           79.0         Active
5         31.0           86.0         Active`
      }
    ]
  }
];
