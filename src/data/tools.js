export const defaultTools = [
  // Programming (3)
  {
    id: "python",
    name: "Python",
    category: "Programming",
    icon: "FileCode",
    description: "The primary high-level, interpreted programming language for modern data science and scientific computing.",
    overview: "Python combines readable syntax with a vast ecosystem of mathematical, analytical, and machine learning libraries, making it the industry standard for data science.",
    features: [
      "Dynamic typing with extensive standard library support",
      "Seamless integration with C/C++ compiled numerical routines",
      "Extensive package registry (PyPI) with over 400,000 packages",
      "First-class support for interactive computing environments"
    ],
    installation: "brew install python3  # macOS\nsudo apt install python3 python3-pip  # Ubuntu/Debian",
    usage: "python -m venv ds_env\nsource ds_env/bin/activate  # On Windows: ds_env\\Scripts\\activate\npython main.py",
    examples: [
      {
        title: "List Comprehension & Basic Math",
        code: "data = [12, 45, 67, 89, 34]\nsquares = [x**2 for x in data if x % 2 == 0]\nprint(f'Even squares: {squares}')"
      }
    ],
    docsUrl: "https://docs.python.org/3/",
    websiteUrl: "https://www.python.org/"
  },
  {
    id: "jupyter",
    name: "Jupyter Notebook",
    category: "Programming",
    icon: "Code2",
    description: "Web-based interactive development environment for notebooks, code execution, mathematical equations, and visualizations.",
    overview: "Jupyter Notebook provides a browser-based computational environment combining live code execution, rich formatted markdown, LaTeX equations, and graphical visualizations.",
    features: [
      "Cell-based interactive execution with immediate visual feedback",
      "Inline rendering of Matplotlib, Plotly, and Bokeh figures",
      "Markdown documentation integration with LaTeX equation rendering",
      "Export capabilities to PDF, HTML, Markdown, and slide decks"
    ],
    installation: "pip install jupyterlab notebook",
    usage: "jupyter lab --port=8888",
    examples: [
      {
        title: "Magic Commands in Jupyter",
        code: "%timeit [i**2 for i in range(10000)]\n%matplotlib inline"
      }
    ],
    docsUrl: "https://docs.jupyter.org/en/latest/",
    websiteUrl: "https://jupyter.org/"
  },
  {
    id: "colab",
    name: "Google Colab",
    category: "Programming",
    icon: "Cpu",
    description: "Hosted Jupyter notebook service providing free GPU/TPU compute resources and collaborative real-time editing.",
    overview: "Google Colaboratory is a cloud-hosted Jupyter notebook environment that requires zero local configuration, provides free access to GPUs, and enables seamless Google Drive integration.",
    features: [
      "Zero local installation and immediate cloud execution",
      "Free access to Nvidia T4/V100 GPUs and Google TPUs",
      "Seamless integration with Google Drive and GitHub repos",
      "Real-time multiplayer code sharing and comments"
    ],
    installation: "No local installation required. Open browser and visit colab.research.google.com",
    usage: "import torch\nprint('CUDA Available:', torch.cuda.is_available())\nprint('Device:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU')",
    examples: [
      {
        title: "Mounting Google Drive",
        code: "from google.colab import drive\ndrive.mount('/content/drive')\n!ls -la /content/drive/MyDrive"
      }
    ],
    docsUrl: "https://colab.research.google.com/notebooks/intro.ipynb",
    websiteUrl: "https://colab.research.google.com/"
  },

  // Data Processing (3)
  {
    id: "numpy",
    name: "NumPy",
    category: "Data Processing",
    icon: "Binary",
    description: "The fundamental package for scientific computing with Python, featuring N-dimensional arrays and fast vectorized operations.",
    overview: "NumPy provides multidimensional array objects, derived masked arrays and matrices, and an assortment of routines for fast operations on arrays including mathematical, logical, and linear algebra routines.",
    features: [
      "Homogeneous N-dimensional array object (ndarray)",
      "C-level vectorized operations eliminating explicit Python loops",
      "Broadcasting mechanism for element-wise operations across shapes",
      "Extensive linear algebra, Fourier transform, and random generators"
    ],
    installation: "pip install numpy",
    usage: "import numpy as np\narr = np.array([1, 2, 3, 4, 5])\nprint('Mean:', np.mean(arr))",
    examples: [
      {
        title: "Broadcasting and Matrix Multiplication",
        code: "import numpy as np\nA = np.random.randn(3, 4)\nB = np.random.randn(4, 2)\nC = np.dot(A, B)\nprint('Product shape:', C.shape)"
      }
    ],
    docsUrl: "https://numpy.org/doc/stable/",
    websiteUrl: "https://numpy.org/"
  },
  {
    id: "pandas",
    name: "Pandas",
    category: "Data Processing",
    icon: "Table",
    description: "Fast, powerful, flexible, and easy-to-use open source data analysis and data manipulation library.",
    overview: "Pandas provides rich data structures like DataFrame and Series designed for working with relational or labeled tabular data easily and intuitively.",
    features: [
      "DataFrame object for data manipulation with integrated indexing",
      "Tools for reading and writing data between in-memory data structures and different formats",
      "Intelligent data alignment and integrated handling of missing data",
      "Flexible reshaping and pivoting of datasets, hierarchical axis indexing"
    ],
    installation: "pip install pandas",
    usage: "import pandas as pd\ndf = pd.DataFrame({'id': [1, 2], 'score': [94, 88]})\nprint(df.describe())",
    examples: [
      {
        title: "Groupby and Aggregations",
        code: "import pandas as pd\ndf = pd.DataFrame({'Dept': ['DS', 'DS', 'AI'], 'Score': [90, 85, 92]})\nprint(df.groupby('Dept')['Score'].agg(['mean', 'count']))"
      }
    ],
    docsUrl: "https://pandas.pydata.org/docs/",
    websiteUrl: "https://pandas.pydata.org/"
  },
  {
    id: "polars",
    name: "Polars",
    category: "Data Processing",
    icon: "Sparkles",
    description: "Lightning-fast DataFrame library written in Rust and based on the Apache Arrow memory model.",
    overview: "Polars is an ultra-fast DataFrame library designed to exploit all available CPU cores, using query optimization and lazy execution to process multi-gigabyte datasets without memory overhead.",
    features: [
      "Multi-threaded execution engine built in pure Rust",
      "Apache Arrow columnar memory model with zero-copy operations",
      "Lazy query evaluation and predicate pushdown optimizations",
      "Strict data typing and out-of-core streaming support"
    ],
    installation: "pip install polars",
    usage: "import polars as pl\ndf = pl.DataFrame({'a': [1, 2, 3], 'b': [10.0, 20.0, 30.0]})\nprint(df.select(pl.col('a').sum()))",
    examples: [
      {
        title: "Lazy Execution Pipeline",
        code: "import polars as pl\nq = (pl.DataFrame({'x': range(5), 'y': range(5)})\n     .lazy()\n     .filter(pl.col('x') > 2)\n     .with_columns((pl.col('y') * 2).alias('y_doubled')))\nprint(q.collect())"
      }
    ],
    docsUrl: "https://docs.pola.rs/",
    websiteUrl: "https://pola.rs/"
  },

  // Statistics (2)
  {
    id: "scipy",
    name: "SciPy",
    category: "Statistics",
    icon: "Activity",
    description: "Fundamental algorithms for scientific computing in Python, including optimization, integration, and statistical distributions.",
    overview: "SciPy builds on NumPy to provide robust numerical routines for numerical integration, interpolation, optimization, linear algebra, and parametric probability distributions.",
    features: [
      "Subpackages for optimization (scipy.optimize) and interpolation",
      "Comprehensive continuous and discrete statistical distributions",
      "Signal processing and spatial distance computations",
      "Sparse matrix representations and solvers"
    ],
    installation: "pip install scipy",
    usage: "from scipy import stats\nres = stats.ttest_1samp([1.2, 1.4, 1.1, 1.5], popmean=1.0)\nprint('p-value:', res.pvalue)",
    examples: [
      {
        title: "Normal Distribution Fitting",
        code: "from scipy.stats import norm\nimport numpy as np\nsamples = norm.rvs(loc=5.0, scale=2.0, size=100, random_state=42)\nmu, std = norm.fit(samples)\nprint(f'Fitted Mean={mu:.3f}, Std={std:.3f}')"
      }
    ],
    docsUrl: "https://docs.scipy.org/doc/scipy/",
    websiteUrl: "https://scipy.org/"
  },
  {
    id: "statsmodels",
    name: "Statsmodels",
    category: "Statistics",
    icon: "LineChart",
    description: "Python module that provides classes and functions for the estimation of statistical models, hypothesis tests, and data exploration.",
    overview: "Statsmodels provides formal statistical modeling including ordinary least squares (OLS), generalized linear models (GLM), time series analysis (ARIMA), and comprehensive statistical summary tables.",
    features: [
      "Econometric and statistical linear regression with R-style formulas",
      "Comprehensive ANOVA, chi-square, and diagnostic goodness-of-fit tests",
      "Time-series modeling with ARIMA, SARIMAX, and VAR models",
      "Extensive diagnostic plots and publication-ready summary tables"
    ],
    installation: "pip install statsmodels",
    usage: "import statsmodels.api as sm\nX = sm.add_constant([1, 2, 3, 4])\ny = [2, 3.8, 6.1, 8.2]\nmodel = sm.OLS(y, X).fit()\nprint(model.summary())",
    examples: [
      {
        title: "OLS Regression Analysis",
        code: "import statsmodels.api as sm\nimport numpy as np\nx = np.linspace(0, 10, 50)\ny = 2.5 * x + np.random.normal(size=50)\nX = sm.add_constant(x)\nres = sm.OLS(y, X).fit()\nprint('R-squared:', res.rsquared)"
      }
    ],
    docsUrl: "https://www.statsmodels.org/stable/",
    websiteUrl: "https://www.statsmodels.org/"
  },

  // Visualization (3)
  {
    id: "matplotlib",
    name: "Matplotlib",
    category: "Visualization",
    icon: "BarChart3",
    description: "Comprehensive library for creating static, animated, and interactive visual representations in Python.",
    overview: "Matplotlib is the foundational visualization engine in Python, providing granular low-level control over every visual element of a plot from ticks and spines to colors and layouts.",
    features: [
      "Object-oriented API offering pixel-level control over plots",
      "Broad export format support including PNG, SVG, PDF, and EPS",
      "Subplot grids and complex dashboard arrangements",
      "Backend flexibility across interactive GUI toolkits and headless servers"
    ],
    installation: "pip install matplotlib",
    usage: "import matplotlib.pyplot as plt\nplt.plot([1, 2, 3], [4, 5, 6])\nplt.title('Line Plot')\nplt.savefig('plot.png')",
    examples: [
      {
        title: "Scatter Plot with Colormap",
        code: "import matplotlib.pyplot as plt\nimport numpy as np\nx = np.random.randn(50)\ny = np.random.randn(50)\nplt.scatter(x, y, c=x+y, cmap='viridis')\nplt.colorbar()\nplt.show()"
      }
    ],
    docsUrl: "https://matplotlib.org/stable/contents.html",
    websiteUrl: "https://matplotlib.org/"
  },
  {
    id: "seaborn",
    name: "Seaborn",
    category: "Visualization",
    icon: "PieChart",
    description: "Statistical data visualization library based on Matplotlib that provides a high-level interface for attractive charts.",
    overview: "Seaborn simplifies statistical plotting by integrating directly with Pandas DataFrames and automating statistical aggregations, error bands, and color palettes.",
    features: [
      "Built-in statistical estimation and confidence interval calculations",
      "Specialized plots for categorical, bivariate, and multivariate distributions",
      "Multi-plot grid frameworks (FacetGrid, PairGrid, JointGrid)",
      "Sophisticated color palettes optimized for visual acuity"
    ],
    installation: "pip install seaborn",
    usage: "import seaborn as sns\nimport matplotlib.pyplot as plt\ntips = sns.load_dataset('tips')\nsns.boxplot(x='day', y='total_bill', data=tips)\nplt.show()",
    examples: [
      {
        title: "Pairplot Correlation Matrix",
        code: "import seaborn as sns\nimport matplotlib.pyplot as plt\niris = sns.load_dataset('iris')\nsns.pairplot(iris, hue='species')\nplt.show()"
      }
    ],
    docsUrl: "https://seaborn.pydata.org/",
    websiteUrl: "https://seaborn.pydata.org/"
  },
  {
    id: "plotly",
    name: "Plotly",
    category: "Visualization",
    icon: "Compass",
    description: "Interactive graphing library for building publication-quality web charts with zoom, hover, and panning.",
    overview: "Plotly enables data scientists to create interactive web-ready charts using Python, rendering seamlessly in browsers and standalone HTML files without web engineering overhead.",
    features: [
      "Full interactivity out-of-the-box: zoom, hover tooltips, filter, and pan",
      "Extensive 3D plots, geospatial maps, and financial candlestick charts",
      "Clean declarative Python syntax via Plotly Express (px)",
      "Native HTML and JSON export capabilities"
    ],
    installation: "pip install plotly",
    usage: "import plotly.express as px\nfig = px.scatter(x=[1, 2, 3], y=[3, 1, 6], title='Interactive')\nfig.show()",
    examples: [
      {
        title: "Plotly Express Scatter Matrix",
        code: "import plotly.express as px\ndf = px.data.iris()\nfig = px.scatter_3d(df, x='sepal_length', y='sepal_width', z='petal_width', color='species')\nfig.show()"
      }
    ],
    docsUrl: "https://plotly.com/python/",
    websiteUrl: "https://plotly.com/"
  },

  // Machine Learning (2)
  {
    id: "scikit-learn",
    name: "Scikit-learn",
    category: "Machine Learning",
    icon: "BrainCircuit",
    description: "Simple and efficient tools for predictive data analysis and machine learning built on NumPy, SciPy, and matplotlib.",
    overview: "Scikit-learn is the quintessential machine learning library in Python, providing uniform interfaces for classification, regression, clustering, preprocessing, and model selection.",
    features: [
      "Consistent fit/predict and fit/transform API conventions",
      "Extensive algorithms: SVMs, Random Forests, K-Means, Ridge, Lasso",
      "Pipelines for chaining transformers and estimators cleanly",
      "Comprehensive evaluation metrics and cross-validation splitting tools"
    ],
    installation: "pip install scikit-learn",
    usage: "from sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier().fit(X_train, y_train)\npreds = clf.predict(X_test)",
    examples: [
      {
        title: "Train-Test Split and Classification Pipeline",
        code: "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\npipe = make_pipeline(StandardScaler(), LogisticRegression())\npipe.fit([[0, 0], [1, 1]], [0, 1])"
      }
    ],
    docsUrl: "https://scikit-learn.org/stable/",
    websiteUrl: "https://scikit-learn.org/"
  },
  {
    id: "xgboost",
    name: "XGBoost",
    category: "Machine Learning",
    icon: "Workflow",
    description: "Optimized distributed gradient boosting library designed to be highly efficient, flexible, and portable.",
    overview: "XGBoost implements gradient-boosted decision trees designed for speed and tabular accuracy, widely dominating competitive data science tournaments and industry production systems.",
    features: [
      "Parallel tree boosting algorithms maximizing CPU multi-core efficiency",
      "Built-in handling of missing values with sparsity-aware splitting",
      "Regularization terms (L1/L2) on objective function to prevent overfitting",
      "Custom objective functions and evaluation metrics support"
    ],
    installation: "pip install xgboost",
    usage: "import xgboost as xgb\nmodel = xgb.XGBClassifier(n_estimators=100, learning_rate=0.05)\nmodel.fit(X_train, y_train)",
    examples: [
      {
        title: "XGBoost Regression Model",
        code: "import xgboost as xgb\nfrom sklearn.datasets import make_regression\nX, y = make_regression(n_samples=100, n_features=4, random_state=42)\nreg = xgb.XGBRegressor(n_estimators=50).fit(X, y)\nprint('Score:', reg.score(X, y))"
      }
    ],
    docsUrl: "https://xgboost.readthedocs.io/en/stable/",
    websiteUrl: "https://xgboost.ai/"
  },

  // Deep Learning (3)
  {
    id: "tensorflow",
    name: "TensorFlow",
    category: "Deep Learning",
    icon: "Layers",
    description: "End-to-end open source platform for machine learning, deep neural networks, and scalable production deployment.",
    overview: "Developed by Google, TensorFlow provides an extensive ecosystem of tools, libraries, and community resources to build and deploy ML-powered applications at scale.",
    features: [
      "Robust hardware acceleration across GPUs, TPUs, and mobile devices",
      "TensorFlow Serving for high-throughput microservice deployment",
      "TensorFlow Lite and TF.js for edge and browser-based inference",
      "TensorBoard for model architecture inspection and real-time training telemetry"
    ],
    installation: "pip install tensorflow",
    usage: "import tensorflow as tf\nprint('TensorFlow version:', tf.__version__)\nprint('GPU available:', tf.config.list_physical_devices('GPU'))",
    examples: [
      {
        title: "Simple Dense Layer Inference",
        code: "import tensorflow as tf\nlayer = tf.keras.layers.Dense(units=4, activation='relu')\nx = tf.random.normal([2, 5])\nout = layer(x)\nprint('Layer output shape:', out.shape)"
      }
    ],
    docsUrl: "https://www.tensorflow.org/api_docs",
    websiteUrl: "https://www.tensorflow.org/"
  },
  {
    id: "keras",
    name: "Keras",
    category: "Deep Learning",
    icon: "Boxes",
    description: "High-level neural networks API designed for human beings, running on top of TensorFlow, PyTorch, or JAX.",
    overview: "Keras 3 provides a clean, unified high-level abstraction for building deep neural networks with effortless switching between PyTorch, TensorFlow, and JAX backends.",
    features: [
      "Consistent, human-centric APIs minimizing cognitive load",
      "Multi-backend engine: write once, run on TensorFlow, PyTorch, or JAX",
      "Sequential and Functional model building patterns",
      "Extensive pre-trained models for computer vision and NLP"
    ],
    installation: "pip install keras",
    usage: "import keras\nmodel = keras.Sequential([\n    keras.layers.Dense(64, activation='relu'),\n    keras.layers.Dense(10, activation='softmax')\n])",
    examples: [
      {
        title: "Multi-Layer Perceptron Definition",
        code: "import keras\nfrom keras import layers\nmodel = keras.Sequential([\n    layers.Input(shape=(32,)),\n    layers.Dense(16, activation='relu'),\n    layers.Dense(1, activation='sigmoid')\n])\nmodel.compile(optimizer='adam', loss='binary_crossentropy')"
      }
    ],
    docsUrl: "https://keras.io/api/",
    websiteUrl: "https://keras.io/"
  },
  {
    id: "pytorch",
    name: "PyTorch",
    category: "Deep Learning",
    icon: "Cpu",
    description: "Open source machine learning framework that accelerates the path from research prototyping to production deployment.",
    overview: "PyTorch offers dynamic computational graphs (autograd) and native Pythonic idioms, making it the premier framework for deep learning research and modern generative AI models.",
    features: [
      "Dynamic computational graphs providing flexible execution and debugging",
      "TorchScript for serializing models for C++ production environments",
      "Distributed training with DistributedDataParallel (DDP)",
      "Massive ecosystem powering Hugging Face Transformers and modern LLMs"
    ],
    installation: "pip install torch torchvision torchaudio",
    usage: "import torch\nx = torch.tensor([1.0, 2.0, 3.0], requires_grad=True)\ny = (x ** 2).sum()\ny.backward()\nprint('Gradients:', x.grad)",
    examples: [
      {
        title: "Defining a Custom PyTorch Module",
        code: "import torch\nimport torch.nn as nn\nclass TinyNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc = nn.Linear(10, 2)\n    def forward(self, x):\n        return self.fc(x)\nnet = TinyNet()\nprint(net(torch.randn(3, 10)))"
      }
    ],
    docsUrl: "https://pytorch.org/docs/stable/index.html",
    websiteUrl: "https://pytorch.org/"
  },

  // Databases (3)
  {
    id: "mysql",
    name: "MySQL",
    category: "Databases",
    icon: "Database",
    description: "The world's most popular open-source relational database management system (RDBMS) for structured data storage.",
    overview: "MySQL provides robust relational schema definitions, ACID transactions, and rich SQL syntax, serving as the storage foundation for enterprise applications.",
    features: [
      "ACID compliance ensuring dependable transactional integrity",
      "Declarative SQL querying with subqueries, joins, and indexing",
      "Pluggable storage engine architecture (InnoDB, MyISAM)",
      "High availability clustering and master-slave replication"
    ],
    installation: "sudo apt install mysql-server  # Linux\nbrew install mysql  # macOS",
    usage: "CREATE TABLE experiments (\n    id VARCHAR(16) PRIMARY KEY,\n    title VARCHAR(255) NOT NULL,\n    module_id VARCHAR(16)\n);",
    examples: [
      {
        title: "Python MySQL Connector Query",
        code: "import mysql.connector\n# conn = mysql.connector.connect(user='root', password='', host='127.0.0.1', database='ds_portal')\n# cursor = conn.cursor()\n# cursor.execute('SELECT * FROM students')\n# print(cursor.fetchall())"
      }
    ],
    docsUrl: "https://dev.mysql.com/doc/",
    websiteUrl: "https://www.mysql.com/"
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "Databases",
    icon: "Server",
    description: "Document-oriented NoSQL database that stores data in flexible, JSON-like documents with dynamic schemas.",
    overview: "MongoDB is built for modern data engineering that requires horizontal scaling, flexible document schemas, and rapid iteration across unstructured or semi-structured data.",
    features: [
      "Document-oriented storage using BSON (binary JSON format)",
      "Rich expressive query language with aggregation pipelines",
      "Horizontal scale-out architecture using automatic sharding",
      "Flexible schema evolution without manual table migrations"
    ],
    installation: "brew tap mongodb/brew && brew install mongodb-community  # macOS",
    usage: "from pymongo import MongoClient\nclient = MongoClient('mongodb://localhost:27017/')\ndb = client['ds_learning']\ndb.experiments.insert_one({'title': 'Exploratory Data Analysis', 'status': 'completed'})",
    examples: [
      {
        title: "MongoDB Aggregation Pipeline",
        code: "pipeline = [\n    {'$match': {'difficulty': 'Advanced'}},\n    {'$group': {'_id': '$moduleId', 'count': {'$sum': 1}}}\n]\n# results = db.experiments.aggregate(pipeline)"
      }
    ],
    docsUrl: "https://www.mongodb.com/docs/",
    websiteUrl: "https://www.mongodb.com/"
  },
  {
    id: "sqlite",
    name: "SQLite",
    category: "Databases",
    icon: "HardDrive",
    description: "Self-contained, serverless, zero-configuration, transactional SQL database engine built into Python.",
    overview: "SQLite writes data directly to ordinary disk files, requiring zero daemon processes or server setups, making it the perfect engine for local experimentation and embedded systems.",
    features: [
      "Zero-configuration: no server process to install, configure, or administer",
      "Single ordinary disk file storage with cross-platform portability",
      "Full ACID compliance supporting concurrent read access",
      "Standard library integration in Python with the `sqlite3` module"
    ],
    installation: "Pre-installed with standard Python distributions (no install needed).",
    usage: "import sqlite3\nconn = sqlite3.connect('local_portal.db')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE IF NOT EXISTS metrics (name TEXT, val REAL)')",
    examples: [
      {
        title: "Creating In-Memory SQLite Table",
        code: "import sqlite3\nconn = sqlite3.connect(':memory:')\nconn.execute('CREATE TABLE tags (name TEXT)')\nconn.execute('INSERT INTO tags VALUES (\"Python\"), (\"Pandas\")')\nfor row in conn.execute('SELECT * FROM tags'):\n    print(row[0])"
      }
    ],
    docsUrl: "https://www.sqlite.org/docs.html",
    websiteUrl: "https://www.sqlite.org/"
  },

  // Big Data and Apps (2)
  {
    id: "pyspark",
    name: "PySpark",
    category: "Big Data and Apps",
    icon: "Share2",
    description: "The Python API for Apache Spark, enabling distributed data processing and large-scale big data analytics.",
    overview: "PySpark enables scalable parallel data engineering, machine learning pipelines, and graph processing across distributed clusters of compute nodes.",
    features: [
      "Resilient Distributed Datasets (RDDs) and Spark DataFrames",
      "In-memory processing delivering up to 100x faster execution than MapReduce",
      "Spark SQL engine for structured queries over big data",
      "Spark MLlib for distributed scalable machine learning algorithms"
    ],
    installation: "pip install pyspark",
    usage: "from pyspark.sql import SparkSession\nspark = SparkSession.builder.appName('MBUPortal').getOrCreate()\ndf = spark.createDataFrame([(1, 'MBU'), (2, 'DataScience')], ['id', 'name'])\ndf.show()",
    examples: [
      {
        title: "PySpark Aggregation Query",
        code: "from pyspark.sql import functions as F\n# df.groupBy('category').agg(F.avg('score').alias('avg_score')).show()"
      }
    ],
    docsUrl: "https://spark.apache.org/docs/latest/api/python/",
    websiteUrl: "https://spark.apache.org/"
  },
  {
    id: "streamlit",
    name: "Streamlit",
    category: "Big Data and Apps",
    icon: "LineChart",
    description: "Open-source Python framework for rapidly building and sharing beautiful, custom web apps for machine learning and data science.",
    overview: "Streamlit turns data scripts into shareable web applications in minutes, requiring zero front-end development, HTML, CSS, or JavaScript experience.",
    features: [
      "Pure Python UI declarations with instant live-reload on save",
      "Built-in widgets: sliders, file uploaders, buttons, and date pickers",
      "Native rendering of Pandas DataFrames, Matplotlib, and Plotly charts",
      "Caching primitives (@st.cache_data) for responsive interactive performance"
    ],
    installation: "pip install streamlit",
    usage: "streamlit run app.py",
    examples: [
      {
        title: "Interactive Streamlit App Code",
        code: "import streamlit as st\nimport pandas as pd\nst.title('MBU Experiment Visualizer')\nslider_val = st.slider('Sample Size', 10, 1000, 100)\nst.write(f'Selected sample size: {slider_val}')"
      }
    ],
    docsUrl: "https://docs.streamlit.io/",
    websiteUrl: "https://streamlit.io/"
  },

  // Development (3)
  {
    id: "git",
    name: "Git",
    category: "Development",
    icon: "GitBranch",
    description: "Distributed version control system designed to handle everything from small to large data science projects with speed.",
    overview: "Git tracks project history, enables reproducible experiment branching, and coordinates collaborative software engineering and model tracking.",
    features: [
      "Distributed architecture with full local repository history",
      "Fast, lightweight branch creation and intelligent merging",
      "Cryptographic integrity with SHA-1/SHA-256 commit hashes",
      "Staging area for precise curation of committed changes"
    ],
    installation: "sudo apt install git  # Linux\nbrew install git  # macOS",
    usage: "git init\ngit add .\ngit commit -m 'Initial commit of data science lab'\ngit branch -M main",
    examples: [
      {
        title: "Branching and Stashing Workflow",
        code: "git checkout -b feature/model-optimization\ngit status\ngit stash\ngit checkout main"
      }
    ],
    docsUrl: "https://git-scm.com/doc",
    websiteUrl: "https://git-scm.com/"
  },
  {
    id: "github",
    name: "GitHub",
    category: "Development",
    icon: "FolderGit2",
    description: "Cloud-based hosting platform for software development and version control using Git, featuring actions and collaboration tools.",
    overview: "GitHub provides central repository hosting, automated CI/CD workflows, pull request reviews, and public portfolio showcases for data science projects.",
    features: [
      "Pull requests with code reviews and inline commenting",
      "GitHub Actions for automated model testing, linting, and deployment",
      "GitHub Pages for hosting documentation and interactive portals",
      "Issue tracking and project kanban boards for milestone planning"
    ],
    installation: "brew install gh  # GitHub CLI\nsudo apt install gh",
    usage: "gh auth login\ngh repo create my-ds-lab --public --source=. --remote=origin --push",
    examples: [
      {
        title: "GitHub Actions CI Workflow YAML",
        code: "name: Python CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - name: Set up Python\n      uses: actions/setup-python@v4\n      with:\n        python-version: '3.11'\n    - run: pytest"
      }
    ],
    docsUrl: "https://docs.github.com/en",
    websiteUrl: "https://github.com/"
  },
  {
    id: "vscode",
    name: "Visual Studio Code",
    category: "Development",
    icon: "Terminal",
    description: "Extensible, lightweight source-code editor with exceptional Python, Jupyter, Git, and debugging support.",
    overview: "VS Code offers a versatile development environment with rich extensions for Python language servers, interactive notebooks, remote SSH development, and integrated terminals.",
    features: [
      "Rich Python extension with Pylance intelligence and type checking",
      "Native interactive Jupyter notebook editor inside the IDE",
      "Integrated visual debugger with breakpoints and variable inspection",
      "Built-in Git source control GUI and merge conflict resolver"
    ],
    installation: "Download installer from https://code.visualstudio.com/Download",
    usage: "code .\ncode --install-extension ms-python.python\ncode --install-extension ms-toolsai.jupyter",
    examples: [
      {
        title: "VS Code settings.json for Data Science",
        code: "{\n  \"python.analysis.typeCheckingMode\": \"basic\",\n  \"notebook.lineNumbers\": \"on\",\n  \"editor.formatOnSave\": true\n}"
      }
    ],
    docsUrl: "https://code.visualstudio.com/docs",
    websiteUrl: "https://code.visualstudio.com/"
  }
];
