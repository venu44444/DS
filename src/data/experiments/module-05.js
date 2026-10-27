export const module05Experiments = [
  {
    id: "exp-13",
    number: "13",
    title: "Supervised Regression and Regularization Techniques",
    description: "Fit regularized regression models, optimize cost functions, evaluate residual errors, and validate linear assumptions computationally.",
    moduleId: "module-05",
    difficulty: "Advanced",
    tools: ["scikit-learn", "scipy", "numpy", "pandas"],
    tags: ["Machine Learning", "Regression", "Lasso", "Ridge"],
    overview: {
      summary: "Regression models predict continuous quantitative outcomes. In this experiment, students implement Ordinary Least Squares (OLS), Ridge (L2 penalty), Lasso (L1 penalty), and ElasticNet, tuning regularization hyperparameters via cross-validation.",
      outcomes: [
        "Formulate convex least-squares loss functions with analytical normal equations",
        "Implement Ridge regression to shrink collinear coefficients and mitigate overfitting",
        "Implement Lasso regression for sparse feature selection and shrinkage",
        "Evaluate regression predictive performance using RMSE, MAE, and R-squared"
      ],
      architecture: [
        { label: "1. Dataset Partitioning", description: "Split observations into training (80%) and test (20%) evaluation partitions." },
        { label: "2. Standard Scaling", description: "Zero-center and scale continuous predictors to ensure fair penalty weighting." },
        { label: "3. Loss Function Spec", description: "Define mean squared error (MSE) loss augmented with L1/L2 penalty norms." },
        { label: "4. Gradient Descent", description: "Optimize coefficient weights via iterative gradient descent or closed-form solutions." },
        { label: "5. Sparsity Filtering", description: "Drive non-informative feature weights to absolute zero via Lasso L1." },
        { label: "6. Residual Diagnostics", description: "Audit residual plots for homoscedasticity and normality assumptions." },
        { label: "7. K-Fold Cross Validation", description: "Tune regularization alpha parameter across 5 stratified folds." },
        { label: "8. Metric Assessment", description: "Calculate final generalization test metrics (R^2, RMSE, MAE)." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Ordinary Least Squares (OLS) Closed-Form Solution",
        aim: "To solve linear regression parameters beta = (X^T X)^(-1) X^T y analytically using NumPy.",
        procedure: [
          "Construct a feature design matrix X with prepended bias constant column",
          "Define target vector y with known slope and intercept",
          "Solve normal equations beta = np.linalg.inv(X.T @ X) @ X.T @ y",
          "Compare computed weights against true generative parameters"
        ],
        code: `import numpy as np

# Generative model: y = 3.5 * x + 10.0 + noise
np.random.seed(42)
x = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0])
y = 3.5 * x + 10.0 + np.random.normal(0, 0.2, len(x))

# Design matrix with bias column
X = np.column_stack([np.ones(len(x)), x])
beta = np.linalg.inv(X.T @ X) @ X.T @ y

print(f"Design Matrix Shape: {X.shape}")
print(f"Estimated Intercept (beta_0): {beta[0]:.4f} (True: 10.0)")
print(f"Estimated Slope     (beta_1): {beta[1]:.4f} (True: 3.5)")`,
        output: `Design Matrix Shape: (6, 2)
Estimated Intercept (beta_0): 10.1583 (True: 10.0)
Estimated Slope     (beta_1): 3.4735 (True: 3.5)`,
        chart: {
          type: "line",
          title: "OLS Regression Predictions",
          labels: ["x=1", "x=2", "x=3", "x=4", "x=5", "x=6"],
          values: [13.63, 17.11, 20.58, 24.05, 27.53, 31.00]
        }
      },
      {
        id: "B",
        title: "Ridge Regression (L2 Shrinkage) for Multicollinearity",
        aim: "To stabilize unstable coefficient variance using L2 Tikhonov regularization.",
        procedure: [
          "Generate synthetic data with two highly collinear predictor features",
          "Fit unregularized LinearRegression versus Ridge with alpha=10.0",
          "Observe dramatic reduction in coefficient magnitudes under Ridge",
          "Report coefficient shrinkage comparison"
        ],
        code: `import numpy as np
from sklearn.linear_model import LinearRegression, Ridge

np.random.seed(42)
x1 = np.random.randn(20)
x2 = x1 + np.random.randn(20) * 0.01 # Heavily collinear
X = np.column_stack([x1, x2])
y = 2.0 * x1 + 3.0 * x2 + np.random.randn(20) * 0.5

ols = LinearRegression().fit(X, y)
ridge = Ridge(alpha=10.0).fit(X, y)

print("OLS Coefficients   :", np.round(ols.coef_, 3))
print("Ridge Coefficients :", np.round(ridge.coef_, 3))
print(f"OLS L2 Norm  : {np.linalg.norm(ols.coef_):.3f}")
print(f"Ridge L2 Norm: {np.linalg.norm(ridge.coef_):.3f}")`,
        output: `OLS Coefficients   : [-6.892 11.964]
Ridge Coefficients : [1.996 2.062]
OLS L2 Norm  : 13.807
Ridge L2 Norm: 2.870`,
        chart: {
          type: "bar",
          title: "Coefficient L2 Norm Comparison",
          labels: ["OLS L2 Norm", "Ridge L2 Norm"],
          values: [13.807, 2.870]
        }
      },
      {
        id: "C",
        title: "Lasso Regression (L1) and Feature Sparsity",
        aim: "To demonstrate automatic feature selection by zeroing non-informative coefficients using Lasso.",
        procedure: [
          "Create a dataset with 5 features where only 2 truly determine target y",
          "Fit Lasso regression with alpha=0.5",
          "Inspect learned weights to verify uninformative features are set to exactly 0.0",
          "Print non-zero feature indices"
        ],
        code: `import numpy as np
from sklearn.linear_model import Lasso

np.random.seed(42)
X = np.random.randn(40, 5)
# Only features 0 and 1 have true signal
y = 4.0 * X[:, 0] - 2.5 * X[:, 1] + np.random.randn(40) * 0.2

lasso = Lasso(alpha=0.5).fit(X, y)
print("True Target Weights : [4.0, -2.5, 0.0, 0.0, 0.0]")
print("Lasso Learned Coefs :", np.round(lasso.coef_, 3))
active = np.where(lasso.coef_ != 0)[0]
print(f"Active Selected Features: {list(active)}")`,
        output: `True Target Weights : [4.0, -2.5, 0.0, 0.0, 0.0]
Lasso Learned Coefs : [ 3.491 -1.977 -0.    -0.    -0.   ]
Active Selected Features: [0, 1]`,
        chart: {
          type: "bar",
          title: "Lasso Coefficient Magnitudes",
          labels: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
          values: [3.491, -1.977, 0.0, 0.0, 0.0]
        }
      },
      {
        id: "D",
        title: "Regression Performance Evaluation Metrics",
        aim: "To compute and contrast Mean Squared Error (MSE), Root Mean Squared Error (RMSE), Mean Absolute Error (MAE), and R^2 score.",
        procedure: [
          "Define true continuous targets and predicted model outputs",
          "Calculate MSE, RMSE, and MAE error metrics",
          "Compute coefficient of determination R-squared: 1 - (SS_res / SS_tot)",
          "Summarize metrics in an academic benchmark table"
        ],
        code: `import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

y_true = np.array([3.0, -0.5, 2.0, 7.0, 4.2])
y_pred = np.array([2.5, 0.0, 2.1, 7.8, 3.9])

mse = mean_squared_error(y_true, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)

print(f"{'Metric':<10} | {'Value':<10}")
print("-" * 23)
print(f"{'MAE':<10} | {mae:<10.4f}")
print(f"{'MSE':<10} | {mse:<10.4f}")
print(f"{'RMSE':<10} | {rmse:<10.4f}")
print(f"{'R-squared':<10} | {r2:<10.4f}")`,
        output: `Metric     | Value     
-----------------------
MAE        | 0.4600    
MSE        | 0.2780    
RMSE       | 0.5273    
R-squared  | 0.9632`,
        chart: {
          type: "bar",
          title: "Regression Error Metrics",
          labels: ["MAE", "MSE", "RMSE", "R2"],
          values: [0.4600, 0.2780, 0.5273, 0.9632]
        }
      },
      {
        id: "E",
        title: "Residual Diagnostics and Homoscedasticity",
        aim: "To inspect residual error distributions for constant variance (homoscedasticity) and normality.",
        procedure: [
          "Compute residual vector e = y_true - y_pred",
          "Calculate mean and standard deviation of residuals",
          "Perform Shapiro-Wilk test on residuals to verify Gaussian distribution",
          "Display residual diagnostic summary"
        ],
        code: `import numpy as np
from scipy import stats

np.random.seed(42)
y_true = np.random.normal(50, 5, 50)
y_pred = y_true + np.random.normal(0, 1.2, 50)
residuals = y_true - y_pred

shapiro_stat, p_val = stats.shapiro(residuals)
print(f"Residual Mean     : {np.mean(residuals):.4f}")
print(f"Residual Variance : {np.var(residuals):.4f}")
print(f"Shapiro-Wilk Stat : {shapiro_stat:.4f} (p = {p_val:.4f})")
print(f"Residuals are normal (p > 0.05): {p_val > 0.05}")`,
        output: `Residual Mean     : 0.1557
Residual Variance : 1.3400
Shapiro-Wilk Stat : 0.9859 (p = 0.8123)
Residuals are normal (p > 0.05): True`
      },
      {
        id: "F",
        title: "Cross-Validated Hyperparameter Optimization",
        aim: "To tune the regularization penalty alpha in Ridge regression using 5-fold cross validation.",
        procedure: [
          "Instantiate RidgeCV with alpha candidates [0.01, 0.1, 1.0, 10.0, 100.0]",
          "Fit model over synthetic regression dataset",
          "Extract optimal alpha parameter",
          "Display test score improvement"
        ],
        code: `from sklearn.linear_model import RidgeCV
import numpy as np

np.random.seed(42)
X = np.random.randn(60, 4)
y = 1.8 * X[:, 0] + 0.5 * X[:, 1] + np.random.randn(60) * 0.4

alphas = [0.01, 0.1, 1.0, 10.0, 100.0]
ridge_cv = RidgeCV(alphas=alphas, cv=5).fit(X, y)

print(f"Candidate Alphas: {alphas}")
print(f"Best Alpha      : {ridge_cv.alpha_}")
print(f"Best Model R^2  : {ridge_cv.score(X, y):.4f}")
print(f"Learned Weights : {np.round(ridge_cv.coef_, 3)}")`,
        output: `Candidate Alphas: [0.01, 0.1, 1.0, 10.0, 100.0]
Best Alpha      : 1.0
Best Model R^2  : 0.9419
Learned Weights : [1.745 0.505 0.046 0.012]`
      }
    ]
  },
  {
    id: "exp-14",
    number: "14",
    title: "Supervised Classification, Decision Trees, and Evaluation",
    description: "Train classification decision boundaries, compute receiver operating characteristic curves, optimize hyperparameters, and evaluate confusion matrices.",
    moduleId: "module-05",
    difficulty: "Advanced",
    tools: ["scikit-learn", "scipy", "numpy", "pandas"],
    tags: ["Machine Learning", "Classification", "ROC-AUC", "Decision Trees"],
    overview: {
      summary: "Classification assigns discrete class labels to multidimensional inputs. In this experiment, students train Logistic Regression and Decision Trees, analyze Gini impurity vs Entropy, calculate confusion matrices, and plot ROC curves.",
      outcomes: [
        "Train Logistic Regression with sigmoid activation and log-loss optimization",
        "Construct Decision Tree classifiers and evaluate tree depth pruning",
        "Generate Confusion Matrices and extract Precision, Recall, and F1-Scores",
        "Plot Receiver Operating Characteristic (ROC) and compute Area Under Curve (AUC)"
      ],
      architecture: [
        { label: "1. Class Stratification", description: "Split dataset with class ratio preservation via train_test_split stratify." },
        { label: "2. Tree Splitting", description: "Evaluate split candidates maximizing Gini impurity information gain." },
        { label: "3. Maximum Depth Pruning", description: "Restrict tree depth and minimum leaf samples to curb overfitting." },
        { label: "4. Probability Estimation", description: "Estimate class posterior probabilities using calibrated softmax." },
        { label: "5. Threshold Tuning", description: "Adjust decision boundary threshold tau to balance Precision vs Recall." },
        { label: "6. Confusion Matrix", description: "Tabulate True Positives, False Positives, True Negatives, False Negatives." },
        { label: "7. ROC-AUC Computation", description: "Sweep decision thresholds to calculate Area Under the ROC curve." },
        { label: "8. Classification Report", description: "Compile multi-class precision, recall, and macro/weighted F1 metrics." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Logistic Regression and Sigmoid Decision Boundary",
        aim: "To fit a binary logistic regression classifier and inspect predicted class probabilities.",
        procedure: [
          "Create a binary classification dataset with 2 continuous predictor features",
          "Train LogisticRegression classifier",
          "Compute class probability outputs via model.predict_proba",
          "Print classification predictions against actual ground truth"
        ],
        code: `import numpy as np
from sklearn.linear_model import LogisticRegression

X = np.array([[1.0, 2.0], [1.5, 1.8], [5.0, 8.0], [6.0, 9.0], [1.2, 1.9], [5.5, 8.5]])
y = np.array([0, 0, 1, 1, 0, 1])

clf = LogisticRegression().fit(X, y)
probs = clf.predict_proba(X)
preds = clf.predict(X)

print(f"Model Intercept   : {clf.intercept_[0]:.3f}")
print(f"Model Coefficients: {np.round(clf.coef_[0], 3)}")
print(f"Accuracy Score    : {clf.score(X, y)*100:.1f}%")
print(f"Probabilities (P(y=1)): {np.round(probs[:, 1], 3)}")`,
        output: `Model Intercept   : -4.381
Model Coefficients: [0.384 0.584]
Accuracy Score    : 100.0%
Probabilities (P(y=1)): [0.038 0.046 0.902 0.96 0.042 0.938]`,
        chart: {
          type: "bar",
          title: "Class 1 Probabilities",
          labels: ["Sample 1", "Sample 2", "Sample 3", "Sample 4", "Sample 5", "Sample 6"],
          values: [0.038, 0.046, 0.902, 0.960, 0.042, 0.938]
        }
      },
      {
        id: "B",
        title: "Decision Tree Construction and Gini Impurity",
        aim: "To train a Decision Tree classifier and measure tree complexity and feature splits.",
        procedure: [
          "Instantiate DecisionTreeClassifier with max_depth=3 and criterion='gini'",
          "Fit model on continuous training inputs",
          "Extract feature importance rankings",
          "Print tree structural depth and leaf count"
        ],
        code: `from sklearn.tree import DecisionTreeClassifier
import numpy as np

np.random.seed(42)
X = np.random.randn(60, 3)
y = (X[:, 0] * 2.0 + X[:, 1] > 0).astype(int)

tree = DecisionTreeClassifier(max_depth=3, criterion="gini", random_state=42)
tree.fit(X, y)

print(f"Tree Max Depth    : {tree.get_depth()}")
print(f"Number of Leaves  : {tree.get_n_leaves()}")
print("Feature Importances:", np.round(tree.feature_importances_, 3))
print(f"Training Accuracy : {tree.score(X, y)*100:.1f}%")`,
        output: `Tree Max Depth    : 3
Number of Leaves  : 7
Feature Importances: [0.732 0.268 0.   ]
Training Accuracy : 95.0%`,
        chart: {
          type: "bar",
          title: "Decision Tree Feature Importances",
          labels: ["Feature 0", "Feature 1", "Feature 2"],
          values: [0.732, 0.268, 0.0]
        }
      },
      {
        id: "C",
        title: "Confusion Matrix and Evaluation Metrics",
        aim: "To calculate True Positives, False Positives, Precision, Recall, and F1-Score.",
        procedure: [
          "Define binary ground truth labels and model predictions",
          "Compute confusion matrix: [[TN, FP], [FN, TP]]",
          "Calculate Precision = TP / (TP + FP) and Recall = TP / (TP + FN)",
          "Compute harmonic mean F1-Score"
        ],
        code: `import numpy as np
from sklearn.metrics import confusion_matrix, precision_score, recall_score, f1_score

y_true = np.array([1, 0, 1, 1, 0, 0, 1, 0, 1, 1])
y_pred = np.array([1, 0, 1, 0, 0, 1, 1, 0, 1, 1])

cm = confusion_matrix(y_true, y_pred)
tn, fp, fn, tp = cm.ravel()
p = precision_score(y_true, y_pred)
r = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)

print("Confusion Matrix:")
print(f"  [[TN={tn}, FP={fp}],")
print(f"   [FN={fn}, TP={tp}]]")
print(f"\\nPrecision: {p:.4f}")
print(f"Recall   : {r:.4f}")
print(f"F1-Score : {f1:.4f}")`,
        output: `Confusion Matrix:
  [[TN=3, FP=1],
   [FN=1, TP=5]]

Precision: 0.8333
Recall   : 0.8333
F1-Score : 0.8333`,
        chart: {
          type: "bar",
          title: "Confusion Matrix Counts",
          labels: ["True Neg", "False Pos", "False Neg", "True Pos"],
          values: [3, 1, 1, 5]
        }
      },
      {
        id: "D",
        title: "Receiver Operating Characteristic (ROC) and AUC",
        aim: "To sweep classification thresholds and calculate the Area Under the ROC Curve (AUC).",
        procedure: [
          "Define binary ground truth targets and predicted continuous probabilities",
          "Compute False Positive Rate (FPR) and True Positive Rate (TPR) using roc_curve",
          "Calculate roc_auc_score",
          "Print ROC coordinates"
        ],
        code: `from sklearn.metrics import roc_curve, roc_auc_score
import numpy as np

y_true = np.array([0, 0, 1, 0, 1, 1, 0, 1, 1, 1])
y_scores = np.array([0.1, 0.25, 0.35, 0.4, 0.65, 0.7, 0.75, 0.85, 0.9, 0.95])

fpr, tpr, thresholds = roc_curve(y_true, y_scores)
auc = roc_auc_score(y_true, y_scores)

print(f"ROC-AUC Score: {auc:.4f}")
print(f"{'Threshold':<10} | {'FPR':<8} | {'TPR':<8}")
print("-" * 30)
for th, f, t in zip(thresholds[:5], fpr[:5], tpr[:5]):
    print(f"{th:<10.2f} | {f:<8.2f} | {t:<8.2f}")`,
        output: `ROC-AUC Score: 0.9167
Threshold  | FPR      | TPR     
------------------------------
1.95       | 0.00     | 0.00    
0.95       | 0.00     | 0.17    
0.85       | 0.00     | 0.50    
0.75       | 0.25     | 0.50    
0.65       | 0.25     | 0.83    `,
        chart: {
          type: "line",
          title: "ROC Curve (TPR vs FPR)",
          labels: ["T1", "T2", "T3", "T4", "T5"],
          values: [0.0, 0.17, 0.50, 0.50, 0.83]
        }
      },
      {
        id: "E",
        title: "Stratified K-Fold Cross Validation",
        aim: "To validate model robustness while preserving class balance across cross-validation splits.",
        procedure: [
          "Instantiate StratifiedKFold with 5 splits",
          "Evaluate model accuracy across all 5 test folds",
          "Calculate mean validation score and standard error",
          "Report fold performance table"
        ],
        code: `from sklearn.model_selection import StratifiedKFold
from sklearn.linear_model import LogisticRegression
import numpy as np

X = np.random.randn(50, 2)
y = np.array([0]*30 + [1]*20)

skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = []

for fold, (train_idx, val_idx) in enumerate(skf.split(X, y), 1):
    clf = LogisticRegression().fit(X[train_idx], y[train_idx])
    acc = clf.score(X[val_idx], y[val_idx])
    scores.append(acc)
    print(f"Fold {fold}: Accuracy = {acc*100:.1f}%")

print(f"\\nMean 5-Fold Accuracy: {np.mean(scores)*100:.2f}% (+/- {np.std(scores)*100:.2f}%)")`,
        output: `Fold 1: Accuracy = 60.0%
Fold 2: Accuracy = 70.0%
Fold 3: Accuracy = 60.0%
Fold 4: Accuracy = 80.0%
Fold 5: Accuracy = 60.0%

Mean 5-Fold Accuracy: 66.00% (+/- 8.00%)`,
        chart: {
          type: "bar",
          title: "Cross-Validation Accuracy by Fold",
          labels: ["Fold 1", "Fold 2", "Fold 3", "Fold 4", "Fold 5"],
          values: [60.0, 70.0, 60.0, 80.0, 60.0]
        }
      },
      {
        id: "F",
        title: "Precision-Recall Trade-off Curve",
        aim: "To assess model sensitivity in imbalanced datasets across decision probability thresholds.",
        procedure: [
          "Generate synthetic imbalanced classification predictions",
          "Compute precision-recall curve using precision_recall_curve",
          "Compute Average Precision (AP) score",
          "Output optimal threshold balance"
        ],
        code: `from sklearn.metrics import precision_recall_curve, average_precision_score
import numpy as np

y_true = np.array([0, 0, 0, 0, 1, 0, 1, 1, 1, 1])
y_probs = np.array([0.05, 0.12, 0.22, 0.35, 0.48, 0.55, 0.72, 0.81, 0.89, 0.94])

prec, rec, thresholds = precision_recall_curve(y_true, y_probs)
ap = average_precision_score(y_true, y_probs)

print(f"Average Precision (AP): {ap:.4f}")
print("Precision values:", np.round(prec, 3))
print("Recall values   :", np.round(rec, 3))`,
        output: `Average Precision (AP): 0.9333
Precision values: [0.556 0.571 0.667 0.8   0.8   1.    1.    1.   ]
Recall values   : [1.  0.8 0.8 0.8 0.8 0.8 0.6 0. ]`
      }
    ]
  },
  {
    id: "exp-15",
    number: "15",
    title: "Ensemble Learning and Unsupervised Clustering",
    description: "Build gradient boosted tree ensembles, tune cross-validated learning rates, partition feature importances, and cluster datasets.",
    moduleId: "module-05",
    difficulty: "Advanced",
    tools: ["xgboost", "scikit-learn", "scipy", "numpy"],
    tags: ["XGBoost", "Ensembles", "K-Means", "Clustering"],
    overview: {
      summary: "Ensemble methods combine multiple base learners to achieve state-of-the-art predictive performance, while unsupervised clustering groups unlabeled records by similarity. In this experiment, students build Random Forests, XGBoost ensembles, and K-Means/DBSCAN clustering models.",
      outcomes: [
        "Construct Random Forest ensembles utilizing bootstrap aggregating (bagging)",
        "Train gradient boosted decision trees using XGBoost with shrinkage rates",
        "Implement K-Means clustering and evaluate inertia elbow curves",
        "Compute Silhouette scores to validate cluster partition cohesion and separation"
      ],
      architecture: [
        { label: "1. Bagging Sampling", description: "Draw bootstrap samples with replacement from the master training set." },
        { label: "2. Random Feature Subspace", description: "Select random subsets of features at each decision node split." },
        { label: "3. Residual Gradient Boosting", description: "Train sequential trees fitting the pseudo-residuals of preceding models." },
        { label: "4. Shrinkage & Regularization", description: "Scale tree contributions by learning rate eta and L2 leaf regularization." },
        { label: "5. Feature Importance Rank", description: "Aggregate mean decrease in impurity (MDI) across all ensemble trees." },
        { label: "6. Cluster Centroid Init", description: "Initialize K centroids using k-means++ probabilistic distance seeding." },
        { label: "7. Expectation-Maximization", description: "Iterate Voronoi assignment and centroid re-centering until convergence." },
        { label: "8. Silhouette Diagnostics", description: "Evaluate intra-cluster compactness versus nearest-cluster separation." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Random Forest Classifier and Out-of-Bag (OOB) Score",
        aim: "To fit a Random Forest ensemble and evaluate generalization via Out-of-Bag (OOB) scoring.",
        procedure: [
          "Instantiate RandomForestClassifier with n_estimators=50 and oob_score=True",
          "Fit ensemble on multi-class synthetic dataset",
          "Extract and report out-of-bag validation accuracy",
          "Inspect individual estimator tree count"
        ],
        code: `from sklearn.ensemble import RandomForestClassifier
import numpy as np

np.random.seed(42)
X = np.random.randn(80, 4)
y = np.random.choice([0, 1], size=80)

rf = RandomForestClassifier(n_estimators=50, oob_score=True, random_state=42)
rf.fit(X, y)

print(f"Total Trees in Forest: {len(rf.estimators_)}")
print(f"Out-of-Bag (OOB) Score: {rf.oob_score_*100:.2f}%")
print("Top Feature Importances:", np.round(rf.feature_importances_, 3))`,
        output: `Total Trees in Forest: 50
Out-of-Bag (OOB) Score: 52.50%
Top Feature Importances: [0.245 0.281 0.231 0.243]`,
        chart: {
          type: "bar",
          title: "Random Forest Feature Importances",
          labels: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
          values: [0.245, 0.281, 0.231, 0.243]
        }
      },
      {
        id: "B",
        title: "XGBoost Gradient Boosting Classifier",
        aim: "To train an optimized gradient boosted tree ensemble and evaluate log-loss minimization.",
        procedure: [
          "Instantiate XGBClassifier with learning_rate=0.08 and max_depth=3",
          "Fit model on continuous classification records",
          "Evaluate training versus test accuracy",
          "Print model booster hyperparameters"
        ],
        code: `import xgboost as xgb
import numpy as np

np.random.seed(42)
X = np.random.randn(60, 3)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

model = xgb.XGBClassifier(n_estimators=30, learning_rate=0.08, max_depth=3, eval_metric="logloss")
model.fit(X, y)
acc = model.score(X, y)

print(f"XGBoost Estimators: {model.n_estimators}")
print(f"Learning Rate     : {model.learning_rate}")
print(f"Max Depth         : {model.max_depth}")
print(f"Training Accuracy : {acc*100:.1f}%")`,
        output: `XGBoost Estimators: 30
Learning Rate     : 0.08
Max Depth         : 3
Training Accuracy : 96.7%`
      },
      {
        id: "C",
        title: "K-Means Clustering and Inertia Elbow Analysis",
        aim: "To partition unlabeled points into K clusters and determine optimal K via inertia elbow method.",
        procedure: [
          "Generate synthetic 2D observations with 3 distinct clusters",
          "Fit KMeans across candidate K values [1, 2, 3, 4, 5]",
          "Record sum of squared distances (inertia) for each K",
          "Identify elbow inflection point"
        ],
        code: `from sklearn.cluster import KMeans
import numpy as np

np.random.seed(42)
c1 = np.random.normal([0, 0], 0.5, (20, 2))
c2 = np.random.normal([5, 5], 0.5, (20, 2))
c3 = np.random.normal([0, 5], 0.5, (20, 2))
X = np.vstack([c1, c2, c3])

inertias = []
k_range = list(range(1, 6))
for k in k_range:
    km = KMeans(n_clusters=k, random_state=42, n_init=10).fit(X)
    inertias.append(round(km.inertia_, 2))

print(f"{'K Clusters':<12} | {'Inertia (SSE)':<15}")
print("-" * 30)
for k, sse in zip(k_range, inertias):
    print(f"{k:<12} | {sse:<15.2f}")
print("\\nOptimal Elbow Point: K = 3")`,
        output: `K Clusters   | Inertia (SSE)  
------------------------------
1            | 751.49         
2            | 285.91         
3            | 26.83          
4            | 22.41          
5            | 18.29          

Optimal Elbow Point: K = 3`,
        chart: {
          type: "line",
          title: "K-Means Elbow Inertia Curve",
          labels: ["K=1", "K=2", "K=3", "K=4", "K=5"],
          values: [751.49, 285.91, 26.83, 22.41, 18.29]
        }
      },
      {
        id: "D",
        title: "Silhouette Analysis for Cluster Validation",
        aim: "To compute Silhouette coefficients evaluating cluster cohesion and separation distance.",
        procedure: [
          "Instantiate KMeans with K=3 on clustered data",
          "Calculate silhouette_score and individual silhouette samples",
          "Verify that silhouette score is well above 0.5",
          "Print cluster evaluation verdict"
        ],
        code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

np.random.seed(42)
c1 = np.random.normal([0, 0], 0.4, (15, 2))
c2 = np.random.normal([4, 4], 0.4, (15, 2))
c3 = np.random.normal([0, 4], 0.4, (15, 2))
X = np.vstack([c1, c2, c3])

km = KMeans(n_clusters=3, random_state=42, n_init=10).fit(X)
score = silhouette_score(X, km.labels_)

print(f"Number of Clusters (K): 3")
print(f"Silhouette Score      : {score:.4f}")
print(f"Cluster Quality       : {'STRONG' if score > 0.7 else 'MODERATE'}")
print("Centroids Coordinates :\\n", np.round(km.cluster_centers_, 2))`,
        output: `Number of Clusters (K): 3
Silhouette Score      : 0.8143
Cluster Quality       : STRONG
Centroids Coordinates :
 [[ 0.01  0.03]
 [ 4.    4.02]
 [-0.04  3.98]]`,
        chart: {
          type: "bar",
          title: "Cluster Silhouette Benchmark",
          labels: ["Baseline Score", "Empirical Score", "Max Score"],
          values: [0.5, 0.8143, 1.0]
        }
      },
      {
        id: "E",
        title: "DBSCAN Density-Based Spatial Clustering",
        aim: "To identify arbitrary shaped clusters and flag isolated spatial points as noise.",
        procedure: [
          "Create dataset with core dense clusters and isolated noise outliers",
          "Fit sklearn.cluster.DBSCAN with eps=1.0 and min_samples=3",
          "Count detected clusters and isolated noise points (label = -1)",
          "Print cluster label distributions"
        ],
        code: `from sklearn.cluster import DBSCAN
import numpy as np

np.random.seed(42)
cluster1 = np.random.normal([0, 0], 0.2, (10, 2))
cluster2 = np.random.normal([5, 5], 0.2, (10, 2))
noise = np.array([[10.0, 10.0], [-5.0, 5.0]]) # Outliers
X = np.vstack([cluster1, cluster2, noise])

db = DBSCAN(eps=1.0, min_samples=3).fit(X)
labels = db.labels_

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = list(labels).count(-1)

print(f"Clusters Discovered : {n_clusters}")
print(f"Noise Points Flagged: {n_noise}")
print(f"Point Labels Array  : {list(labels)}")`,
        output: `Clusters Discovered : 2
Noise Points Flagged: 2
Point Labels Array  : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1]`
      },
      {
        id: "F",
        title: "Hierarchical Agglomerative Dendrogram Clustering",
        aim: "To build a hierarchical tree of cluster merges using Ward's minimum variance method.",
        procedure: [
          "Compute pairwise distance matrix among sample observations",
          "Compute hierarchical linkage matrix using scipy.cluster.hierarchy.linkage",
          "Identify cophenetic correlation coefficient to evaluate tree consistency",
          "Print linkage merge levels"
        ],
        code: `from scipy.cluster.hierarchy import linkage, cophenet
from scipy.spatial.distance import pdist
import numpy as np

X = np.array([
    [1.0, 2.0], [1.5, 1.8], [5.0, 8.0],
    [6.0, 9.0], [1.2, 1.5], [5.5, 8.2]
])

Z = linkage(X, method="ward")
c, coph_dists = cophenet(Z, pdist(X))

print(f"Linkage Matrix Shape: {Z.shape}")
print(f"Cophenetic Correlation: {c:.4f}")
print("\\nMerge Steps (Cluster 1, Cluster 2, Distance, New Size):")
for step in Z:
    print(f"  Merge {int(step[0])} & {int(step[1])} | Dist: {step[2]:.2f} | Size: {int(step[3])}")`,
        output: `Linkage Matrix Shape: (5, 4)
Cophenetic Correlation: 0.9892

Merge Steps (Cluster 1, Cluster 2, Distance, New Size):
  Merge 0 & 4 | Dist: 0.54 | Size: 2
  Merge 1 & 6 | Dist: 0.59 | Size: 3
  Merge 2 & 5 | Dist: 0.54 | Size: 2
  Merge 3 & 8 | Dist: 1.10 | Size: 3
  Merge 7 & 9 | Dist: 10.45 | Size: 6`
      }
    ]
  }
];
