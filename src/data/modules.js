export const defaultModules = [
  {
    id: "module-01",
    number: "01",
    title: "Python for Data Science",
    description: "Core programming paradigms, computational thinking, vectorization, and scientific computing data structures in modern Python.",
    topics: [
      "Pythonic idioms, list comprehensions, and generators",
      "NumPy multidimensional ndarrays and vectorization",
      "Broadcasting rules and memory layout",
      "Pandas Series, DataFrames, and indexing",
      "Data ingestion, CSV/JSON handling, and serialization",
      "Vectorized operations versus iterative loops"
    ],
    objectives: [
      "Master high-performance numeric arrays with NumPy",
      "Construct and manipulate tabular datasets in Pandas",
      "Implement efficient vectorized algorithmic workflows",
      "Evaluate algorithmic time complexity and memory overhead"
    ]
  },
  {
    id: "module-02",
    number: "02",
    title: "Data Collection and Preprocessing",
    description: "Techniques for ingesting heterogeneous data streams, handling missingness, outlier detection, and feature engineering transformations.",
    topics: [
      "API ingestion, JSON normalization, and Web scraping",
      "Missing data imputation (Mean, Median, KNN, MICE)",
      "Outlier detection using IQR, Z-score, and Isolation Forests",
      "Categorical encoding (One-Hot, Target, Ordinal)",
      "Feature scaling (StandardScaler, MinMaxScaler, RobustScaler)",
      "Relational merges, joins, and database queries"
    ],
    objectives: [
      "Synthesize pipelines for dirty and heterogeneous real-world data",
      "Formulate robust strategies for missing values and anomalies",
      "Transform raw categorical and numeric variables for algorithms",
      "Construct automated ETL pipelines for repeatable research"
    ]
  },
  {
    id: "module-03",
    number: "03",
    title: "Exploratory Data Analysis",
    description: "Descriptive statistics, distribution profiling, parametric and non-parametric hypothesis testing, and multivariate correlations.",
    topics: [
      "Summary statistics, skewness, and kurtosis",
      "Probability distributions and Kernel Density Estimation",
      "Pearson, Spearman, and Kendall correlation matrices",
      "Parametric hypothesis testing (T-tests, ANOVA)",
      "Non-parametric tests (Mann-Whitney U, Chi-square)",
      "Dimensionality reduction with Principal Component Analysis (PCA)"
    ],
    objectives: [
      "Uncover hidden patterns, trends, and anomalies through statistical rigor",
      "Validate structural assumptions before statistical modeling",
      "Execute rigorous hypothesis testing with confidence intervals",
      "Perform dimensionality reduction while preserving variance"
    ]
  },
  {
    id: "module-04",
    number: "04",
    title: "Data Visualization",
    description: "Visual encoding principles, publication-ready static charts, interactive exploratory dashboards, and high-dimensional plotting.",
    topics: [
      "Grammar of Graphics with Matplotlib and Seaborn",
      "Categorical, distribution, and relational plotting",
      "Interactive data visualizations with Plotly",
      "Multi-panel subplots and dashboard composition",
      "Geospatial mapping and coordinate projections",
      "Visual accessibility, color scales, and perceptual uniformity"
    ],
    objectives: [
      "Design publication-quality scientific charts and diagrams",
      "Build dynamic interactive charts that support drill-down inspection",
      "Communicate complex multidimensional patterns clearly and effectively",
      "Apply perceptual color principles for scientific integrity"
    ]
  },
  {
    id: "module-05",
    number: "05",
    title: "Machine Learning",
    description: "Supervised and unsupervised algorithms, rigorous cross-validation, regularization, hyperparameter optimization, and ensemble models.",
    topics: [
      "Linear and Logistic Regression with regularization (L1/L2)",
      "Decision Trees, Random Forests, and Gradient Boosting (XGBoost)",
      "Unsupervised clustering (K-Means, DBSCAN, Hierarchical)",
      "Cross-validation strategies and data leakage prevention",
      "Model evaluation metrics (ROC-AUC, Precision-Recall, F1-Score, RMSE)",
      "Hyperparameter tuning with GridSearchCV and Bayesian Search"
    ],
    objectives: [
      "Implement machine learning workflows from formulation to evaluation",
      "Prevent data leakage and overfitting using strict pipeline validation",
      "Tune hyperparameters systematically to optimize predictive performance",
      "Interpret model feature importances and decision boundaries"
    ]
  }
];
