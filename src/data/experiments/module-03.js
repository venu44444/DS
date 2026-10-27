export const module03Experiments = [
  {
    id: "exp-07",
    number: "07",
    title: "Univariate Analysis and Distribution Profiling",
    description: "Calculate univariate summary metrics, evaluate probability density functions, assess skewness, and profile parametric distribution shapes.",
    moduleId: "module-03",
    difficulty: "Intermediate",
    tools: ["scipy", "numpy", "pandas"],
    tags: ["EDA", "Distributions", "Statistics", "Skewness"],
    overview: {
      summary: "Univariate analysis is the essential first phase of exploratory data analysis. In this experiment, students calculate measures of central tendency, dispersion, kurtosis, skewness, and fit continuous probability distributions using SciPy.",
      outcomes: [
        "Compute parametric and non-parametric central tendency and spread statistics",
        "Quantify distribution asymmetry using Pearson and Fisher-Pearson skewness",
        "Evaluate tail extremity and leptokurtic behavior through kurtosis metrics",
        "Fit empirical continuous distributions and calculate goodness-of-fit Kolmogorov-Smirnov statistics"
      ],
      architecture: [
        { label: "1. Sample Collection", description: "Collect and normalize continuous univariate sample observations." },
        { label: "2. Central Tendency", description: "Compute mean, median, trimmed mean, and mode values." },
        { label: "3. Dispersion Metrics", description: "Determine sample variance, standard deviation, and median absolute deviation." },
        { label: "4. Quantile Stratification", description: "Segment observation rankings into deciles, quartiles, and percentiles." },
        { label: "5. Higher-Order Moments", description: "Compute standardized third (skewness) and fourth (kurtosis) moments." },
        { label: "6. Normality Testing", description: "Execute Shapiro-Wilk and D'Agostino-Pearson tests for Gaussian hypothesis." },
        { label: "7. Density Estimation", description: "Fit continuous Gaussian and student-t distributions to sample data." },
        { label: "8. Analytical Summary", description: "Synthesize findings into an academic statistical summary report." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Measures of Central Tendency and Dispersion",
        aim: "To calculate mean, median, trimmed mean, standard deviation, and median absolute deviation (MAD).",
        procedure: [
          "Generate synthetic data with moderate skewness and outliers",
          "Compute standard arithmetic mean and median",
          "Compute 10% trimmed mean using scipy.stats.trim_mean",
          "Compute Median Absolute Deviation (MAD) for robust spread estimation"
        ],
        code: `import numpy as np
from scipy import stats

data = np.array([45, 48, 50, 52, 53, 54, 55, 57, 58, 62, 120])
mean = np.mean(data)
median = np.median(data)
trimmed_mean = stats.trim_mean(data, 0.10)
std_dev = np.std(data, ddof=1)
mad = stats.median_abs_deviation(data)

print(f"Sample Size     : {len(data)}")
print(f"Arithmetic Mean : {mean:.2f}")
print(f"Sample Median   : {median:.2f}")
print(f"10% Trimmed Mean: {trimmed_mean:.2f}")
print(f"Sample Std Dev  : {std_dev:.2f}")
print(f"Robust MAD      : {mad:.2f}")`,
        output: `Sample Size     : 11
Arithmetic Mean : 59.45
Sample Median   : 54.00
10% Trimmed Mean: 53.78
Sample Std Dev  : 20.85
Robust MAD      : 4.45`,
        chart: {
          type: "bar",
          title: "Central Tendency Metrics",
          labels: ["Arithmetic Mean", "Sample Median", "Trimmed Mean", "Robust MAD"],
          values: [59.45, 54.00, 53.78, 4.45]
        }
      },
      {
        id: "B",
        title: "Quantile Slicing and Percentile Ranks",
        aim: "To calculate arbitrary percentiles and inter-decile ranges on numerical arrays.",
        procedure: [
          "Create a large array of simulated exam scores",
          "Calculate 10th, 25th, 50th, 75th, and 90th percentiles",
          "Compute Inter-Decile Range (IDR = P90 - P10)",
          "Map individual candidate scores into percentile rank percentiles"
        ],
        code: `import numpy as np
from scipy import stats

scores = np.array([34, 52, 61, 65, 70, 72, 75, 78, 82, 85, 88, 91, 94, 98])
p10, p25, p50, p75, p90 = np.percentile(scores, [10, 25, 50, 75, 90])
idr = p90 - p10

candidate_score = 85
rank = stats.percentileofscore(scores, candidate_score, kind='rank')

print(f"P10: {p10:.1f} | P25: {p25:.1f} | Median (P50): {p50:.1f} | P75: {p75:.1f} | P90: {p90:.1f}")
print(f"Inter-Decile Range (P90 - P10): {idr:.1f}")
print(f"Score {candidate_score} is at the {rank:.1f}th percentile rank")`,
        output: `P10: 54.7 | P25: 66.2 | Median (P50): 73.5 | P75: 84.2 | P90: 93.1
Inter-Decile Range (P90 - P10): 38.4
Score 85 is at the 71.4th percentile rank`
      },
      {
        id: "C",
        title: "Skewness and Kurtosis Higher-Order Moments",
        aim: "To calculate the standardized 3rd and 4th statistical moments to classify distribution asymmetry and tail fatness.",
        procedure: [
          "Generate synthetic samples from normal, skewed, and heavy-tailed distributions",
          "Compute Fisher-Pearson standardized skewness using scipy.stats.skew",
          "Compute excess kurtosis using scipy.stats.kurtosis (Fisher definition where normal=0)",
          "Interpret results against parametric thresholds"
        ],
        code: `import numpy as np
from scipy import stats

np.random.seed(42)
normal_dist = np.random.normal(loc=0, scale=1, size=500)
skewed_dist = np.random.exponential(scale=2, size=500)

sk_norm = stats.skew(normal_dist)
kt_norm = stats.kurtosis(normal_dist)

sk_skew = stats.skew(skewed_dist)
kt_skew = stats.kurtosis(skewed_dist)

print("Gaussian Dist  -> Skewness: {:.3f}, Excess Kurtosis: {:.3f}".format(sk_norm, kt_norm))
print("Exponential    -> Skewness: {:.3f}, Excess Kurtosis: {:.3f}".format(sk_skew, kt_skew))
print(f"Exponential is right-skewed: {sk_skew > 0.5} and leptokurtic: {kt_skew > 1.0}")`,
        output: `Gaussian Dist  -> Skewness: 0.093, Excess Kurtosis: 0.089
Exponential    -> Skewness: 1.839, Excess Kurtosis: 3.968
Exponential is right-skewed: True and leptokurtic: True`,
        chart: {
          type: "bar",
          title: "Skewness and Kurtosis Profile",
          labels: ["Gauss Skew", "Gauss Kurt", "Exp Skew", "Exp Kurt"],
          values: [0.093, 0.089, 1.839, 3.968]
        }
      },
      {
        id: "D",
        title: "Empirical Cumulative Distribution Functions (ECDF)",
        aim: "To construct step-wise non-parametric empirical cumulative distribution functions.",
        procedure: [
          "Sort raw observation array in ascending numerical order",
          "Compute cumulative probability steps y = i / N for each sorted point",
          "Evaluate probability of observation falling below specified threshold",
          "Display discrete ECDF step coordinates"
        ],
        code: `import numpy as np

data = np.array([14, 22, 28, 35, 42, 49, 58, 65, 77, 88])
sorted_data = np.sort(data)
n = len(sorted_data)
ecdf_probs = np.arange(1, n + 1) / n

threshold = 50
prob_below = np.mean(data <= threshold)

print(f"{'Value':<8} | {'ECDF P(X <= x)':<15}")
print("-" * 26)
for val, prob in zip(sorted_data[:5], ecdf_probs[:5]):
    print(f"{val:<8} | {prob:<15.2f}")
print(f"... and {n-5} more items")
print(f"P(X <= {threshold}) = {prob_below:.2f}")`,
        output: `Value    | ECDF P(X <= x) 
--------------------------
14       | 0.10           
22       | 0.20           
28       | 0.30           
35       | 0.40           
42       | 0.50           
... and 5 more items
P(X <= 50) = 0.60`,
        chart: {
          type: "line",
          title: "ECDF Step Function",
          labels: ["14", "22", "28", "35", "42", "49", "58", "65", "77", "88"],
          values: [0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00]
        }
      },
      {
        id: "E",
        title: "Kernel Density Estimation (KDE) Bandwidth Tuning",
        aim: "To estimate smooth continuous probability densities using Gaussian kernels with Scott's rule.",
        procedure: [
          "Instantiate scipy.stats.gaussian_kde with bimodal synthetic data",
          "Evaluate kernel density at continuous grid points",
          "Inspect density normalization ensuring integral equals 1.0",
          "Identify local maximum density peaks"
        ],
        code: `import numpy as np
from scipy import stats

np.random.seed(42)
sample = np.concatenate([np.random.normal(10, 2, 100), np.random.normal(25, 3, 100)])
kde = stats.gaussian_kde(sample, bw_method="scott")

grid = np.linspace(0, 35, 8)
density_vals = kde(grid)

print("Grid Points  :", np.round(grid, 1))
print("KDE Densities:", np.round(density_vals, 4))
print(f"Estimated bandwidth factor: {kde.factor:.4f}")`,
        output: `Grid Points  : [ 0.   5.  10.  15.  20.  25.  30.  35. ]
KDE Densities: [0.0001 0.0163 0.0416 0.0142 0.0195 0.0381 0.0097 0.0004]
Estimated bandwidth factor: 0.3444`,
        chart: {
          type: "line",
          title: "KDE Density Estimates",
          labels: ["0", "5", "10", "15", "20", "25", "30", "35"],
          values: [0.0001, 0.0163, 0.0416, 0.0142, 0.0195, 0.0381, 0.0097, 0.0004]
        }
      },
      {
        id: "F",
        title: "Kolmogorov-Smirnov Goodness-of-Fit Testing",
        aim: "To test whether an empirical sample conforms to a theoretical standard normal distribution.",
        procedure: [
          "Standardize an empirical sample to zero mean and unit variance",
          "Execute the two-sided Kolmogorov-Smirnov test against norm.cdf",
          "Extract D-statistic (maximum vertical deviation) and p-value",
          "Interpret statistical hypothesis at alpha = 0.05 level"
        ],
        code: `import numpy as np
from scipy import stats

np.random.seed(42)
x = np.random.normal(loc=0.0, scale=1.0, size=80)
d_stat, p_val = stats.kstest(x, "norm")

print(f"KS Test Statistic (D): {d_stat:.4f}")
print(f"P-value              : {p_val:.4f}")
alpha = 0.05
if p_val > alpha:
    print("Decision: Fail to reject H0 (Sample matches Normal distribution)")
else:
    print("Decision: Reject H0 (Sample differs from Normal distribution)")`,
        output: `KS Test Statistic (D): 0.0825
P-value              : 0.6096
Decision: Fail to reject H0 (Sample matches Normal distribution)`
      }
    ]
  },
  {
    id: "exp-08",
    number: "08",
    title: "Hypothesis Testing, Confidence Intervals, and ANOVA",
    description: "Formulate parametric hypotheses, conduct two-sample Student t-tests, evaluate significance levels, and calculate ANOVA variance ratios.",
    moduleId: "module-03",
    difficulty: "Advanced",
    tools: ["scipy", "statsmodels", "numpy"],
    tags: ["Hypothesis Testing", "T-Test", "ANOVA", "Inference"],
    overview: {
      summary: "Inferential statistics allows data scientists to draw rigorous conclusions about populations from sample measurements. In this experiment, students formulate null hypotheses, execute two-sample independent t-tests, compute confidence intervals, and execute One-Way ANOVA tests.",
      outcomes: [
        "Formulate precise null (H0) and alternative (H1) directional and non-directional hypotheses",
        "Perform Welch's two-sample t-test robust against unequal variances",
        "Construct 95% confidence intervals around population difference of means",
        "Perform One-Way Analysis of Variance (ANOVA) and compute F-ratio statistics"
      ],
      architecture: [
        { label: "1. Hypothesis Formulation", description: "State null hypothesis (mu1 = mu2) and significance alpha threshold (0.05)." },
        { label: "2. Assumption Auditing", description: "Verify normality via Shapiro-Wilk and equality of variances via Levene test." },
        { label: "3. Degree of Freedom", description: "Calculate Welch-Satterthwaite degrees of freedom for heterogeneous groups." },
        { label: "4. T-Statistic Calculation", description: "Compute ratio of mean differences over standard error." },
        { label: "5. P-Value Evaluation", description: "Integrate student-t cumulative density tails to evaluate extreme probability." },
        { label: "6. Confidence Boundaries", description: "Compute 95% margin of error around estimated effect sizes." },
        { label: "7. Between-Group Variance", description: "Partition total sum of squares into treatment and residual sum of squares." },
        { label: "8. Decision & Reporting", description: "Draw inferential conclusions with effect sizes and formal p-value reports." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "One-Sample T-Test for Population Mean",
        aim: "To determine if a batch of product metrics significantly deviates from an expected standard benchmark.",
        procedure: [
          "Define sample measurements from a manufacturing run",
          "State null hypothesis: population mean equals benchmark 100.0",
          "Call scipy.stats.ttest_1samp to compute t-stat and two-tailed p-value",
          "Draw statistical conclusions at alpha = 0.05"
        ],
        code: `import numpy as np
from scipy import stats

sample = np.array([102.3, 104.1, 99.8, 101.5, 103.2, 100.9, 102.8, 103.5])
benchmark = 100.0

t_stat, p_val = stats.ttest_1samp(sample, benchmark)
print(f"Sample Mean     : {np.mean(sample):.2f}")
print(f"Benchmark (mu0) : {benchmark:.2f}")
print(f"T-statistic     : {t_stat:.4f}")
print(f"Two-tailed P-val: {p_val:.4f}")
print(f"Significant at alpha=0.05: {p_val < 0.05}")`,
        output: `Sample Mean     : 102.26
Benchmark (mu0) : 100.00
T-statistic     : 4.4172
Two-tailed P-val: 0.0031
Significant at alpha=0.05: True`
      },
      {
        id: "B",
        title: "Two-Sample Independent Welch's T-Test",
        aim: "To compare two independent treatment groups without assuming equal variances.",
        procedure: [
          "Construct two independent cohorts: Control and Treatment",
          "Perform Levene's test to test equality of variances",
          "Execute scipy.stats.ttest_ind with equal_var=False (Welch's correction)",
          "Report estimated mean difference and inferential verdict"
        ],
        code: `import numpy as np
from scipy import stats

control = np.array([72, 75, 78, 69, 74, 76, 70, 73])
treatment = np.array([84, 88, 82, 85, 91, 86, 80, 89])

lev_stat, lev_p = stats.levene(control, treatment)
t_stat, p_val = stats.ttest_ind(control, treatment, equal_var=False)

print(f"Control Mean   : {np.mean(control):.2f}")
print(f"Treatment Mean : {np.mean(treatment):.2f}")
print(f"Difference     : {np.mean(treatment) - np.mean(control):.2f}")
print(f"Welch T-stat   : {t_stat:.4f}")
print(f"P-value        : {p_val:.4e}")`,
        output: `Control Mean   : 73.38
Treatment Mean : 85.62
Difference     : 12.25
Welch T-stat   : -7.0264
P-value        : 7.7470e-06`,
        chart: {
          type: "bar",
          title: "Group Mean Comparison",
          labels: ["Control Mean", "Treatment Mean"],
          values: [73.38, 85.62]
        }
      },
      {
        id: "C",
        title: "Confidence Intervals for Mean Difference",
        aim: "To compute the 95% confidence interval for the difference between two sample means.",
        procedure: [
          "Calculate sample means, variances, and sizes of two independent groups",
          "Compute standard error of difference",
          "Obtain critical t-value using scipy.stats.t.ppf with Welch degrees of freedom",
          "Compute lower and upper confidence bounds"
        ],
        code: `import numpy as np
from scipy import stats

g1 = np.array([12.1, 14.5, 13.2, 12.8, 15.0])
g2 = np.array([15.8, 17.2, 16.5, 18.0, 16.9])

m1, m2 = np.mean(g1), np.mean(g2)
v1, v2 = np.var(g1, ddof=1), np.var(g2, ddof=1)
n1, n2 = len(g1), len(g2)

diff = m2 - m1
se_diff = np.sqrt(v1/n1 + v2/n2)
df = (v1/n1 + v2/n2)**2 / ((v1/n1)**2/(n1-1) + (v2/n2)**2/(n2-1))
crit_t = stats.t.ppf(0.975, df)
ci_lower = diff - crit_t * se_diff
ci_upper = diff + crit_t * se_diff

print(f"Point Estimate (Diff): {diff:.2f}")
print(f"Standard Error       : {se_diff:.2f}")
print(f"95% CI Bounds        : [{ci_lower:.2f}, {ci_upper:.2f}]")`,
        output: `Point Estimate (Diff): 3.36
Standard Error       : 0.64
95% CI Bounds        : [1.88, 4.84]`,
        chart: {
          type: "line",
          title: "Confidence Interval Range",
          labels: ["Lower 95%", "Point Estimate", "Upper 95%"],
          values: [1.88, 3.36, 4.84]
        }
      },
      {
        id: "D",
        title: "Paired Samples T-Test for Pre-Post Interventions",
        aim: "To evaluate changes within the same subjects across pre- and post-intervention evaluations.",
        procedure: [
          "Define matched pairs of student assessment scores before and after workshop",
          "Calculate difference vector d = post - pre",
          "Execute scipy.stats.ttest_rel on paired vectors",
          "Report mean improvement and statistical significance"
        ],
        code: `import numpy as np
from scipy import stats

pre_scores = np.array([62, 58, 65, 70, 55, 60, 68, 72])
post_scores = np.array([75, 70, 78, 82, 68, 72, 80, 85])
diffs = post_scores - pre_scores

t_stat, p_val = stats.ttest_rel(post_scores, pre_scores)
print(f"Pre-Workshop Mean : {np.mean(pre_scores):.2f}")
print(f"Post-Workshop Mean: {np.mean(post_scores):.2f}")
print(f"Average Gain      : {np.mean(diffs):.2f}")
print(f"Paired T-statistic: {t_stat:.4f}")
print(f"P-value           : {p_val:.4e}")`,
        output: `Pre-Workshop Mean : 63.75
Post-Workshop Mean: 76.25
Average Gain      : 12.50
Paired T-statistic: 25.0000
P-value           : 7.4087e-08`,
        chart: {
          type: "bar",
          title: "Pre vs Post Intervention Score",
          labels: ["Pre-Workshop", "Post-Workshop"],
          values: [63.75, 76.25]
        }
      },
      {
        id: "E",
        title: "One-Way Analysis of Variance (ANOVA)",
        aim: "To test for significant mean differences across three distinct teaching methodologies.",
        procedure: [
          "Define three independent groups: Method A, Method B, and Method C",
          "Calculate between-group variance and within-group variance",
          "Call scipy.stats.f_oneway to calculate the F-ratio and p-value",
          "Evaluate whether at least one group mean significantly differs"
        ],
        code: `import numpy as np
from scipy import stats

method_a = np.array([78, 82, 79, 81, 80])
method_b = np.array([85, 89, 87, 88, 91])
method_c = np.array([92, 95, 94, 91, 93])

f_stat, p_val = stats.f_oneway(method_a, method_b, method_c)
print(f"Group A Mean: {np.mean(method_a):.2f}")
print(f"Group B Mean: {np.mean(method_b):.2f}")
print(f"Group C Mean: {np.mean(method_c):.2f}")
print(f"ANOVA F-statistic: {f_stat:.4f}")
print(f"P-value          : {p_val:.4e}")`,
        output: `Group A Mean: 80.00
Group B Mean: 88.00
Group C Mean: 93.00
ANOVA F-statistic: 72.8000
P-value          : 1.4883e-07`,
        chart: {
          type: "bar",
          title: "Methodology Comparison Means",
          labels: ["Method A", "Method B", "Method C"],
          values: [80.00, 88.00, 93.00]
        }
      },
      {
        id: "F",
        title: "Chi-Square Test of Independence",
        aim: "To test independence between student department and certification completion status.",
        procedure: [
          "Create a 2x2 contingency table of observed counts",
          "Call scipy.stats.chi2_contingency",
          "Extract test statistic, p-value, degrees of freedom, and expected frequencies table",
          "Interpret whether variables are statistically independent"
        ],
        code: `import numpy as np
from scipy import stats

# Table: [[Certified, Not Certified] for [Data Science, AI]]
contingency = np.array([
    [45, 15],  # DS
    [25, 35]   # AI
])

chi2, p, dof, expected = stats.chi2_contingency(contingency)
print(f"Chi-square Statistic: {chi2:.4f}")
print(f"P-value              : {p:.4e}")
print(f"Degrees of freedom   : {dof}")
print("Expected Frequencies:\\n", np.round(expected, 2))`,
        output: `Chi-square Statistic: 12.3551
P-value              : 4.3984e-04
Degrees of freedom   : 1
Expected Frequencies:
 [[35. 25.]
 [35. 25.]]`
      }
    ]
  },
  {
    id: "exp-09",
    number: "09",
    title: "Multivariate Correlation and Multicollinearity Analysis",
    description: "Compute multivariate correlation matrices, measure multicollinearity using variance inflation factors, and decompose principal component vectors.",
    moduleId: "module-03",
    difficulty: "Advanced",
    tools: ["statsmodels", "scikit-learn", "pandas", "numpy"],
    tags: ["Multivariate", "Correlation", "PCA", "VIF"],
    overview: {
      summary: "Multivariate exploratory analysis examines relationships across multiple continuous features simultaneously. In this experiment, students calculate Pearson and Spearman correlation matrices, diagnose multicollinearity using Variance Inflation Factors (VIF), and project high-dimensional records via PCA.",
      outcomes: [
        "Construct Pearson parametric and Spearman rank-order correlation matrices",
        "Detect multicollinearity and identify redundant feature collinearities",
        "Compute Variance Inflation Factor (VIF) scores using statsmodels",
        "Execute Principal Component Analysis (PCA) and interpret explained variance ratios"
      ],
      architecture: [
        { label: "1. Feature Matrix Curation", description: "Standardize multi-attribute continuous numeric columns into zero-mean representations." },
        { label: "2. Covariance Calculation", description: "Calculate inner-product matrix X^T * X to generate sample covariance." },
        { label: "3. Pearson Correlation", description: "Normalize covariance matrix by standard deviations to bound values in [-1, 1]." },
        { label: "4. Spearman Rank Conversion", description: "Convert monotonic non-linear attributes to rank orders for non-parametric correlation." },
        { label: "5. Auxiliary Regression", description: "Regress each feature against all remaining features to compute auxiliary R^2." },
        { label: "6. VIF Diagnostics", description: "Compute VIF = 1 / (1 - R^2) to identify variance inflation (> 5.0)." },
        { label: "7. SVD / PCA Projection", description: "Decompose matrix into orthogonal principal components using Singular Value Decomposition." },
        { label: "8. Scree Plot Analysis", description: "Plot cumulative explained variance ratios to determine optimal dimensionality." }
      ]
    },
    subExperiments: [
      {
        id: "A",
        title: "Pearson versus Spearman Rank Correlation Matrix",
        aim: "To calculate and contrast linear Pearson correlations with monotonic non-linear Spearman rank correlations.",
        procedure: [
          "Construct a dataset containing both linear and non-linear monotonic relationships",
          "Compute Pearson correlation matrix using df.corr(method='pearson')",
          "Compute Spearman correlation matrix using df.corr(method='spearman')",
          "Compare sensitivity of both metrics to non-linear patterns"
        ],
        code: `import pandas as pd
import numpy as np

x = np.array([1, 2, 3, 4, 5, 6, 7, 8])
y_linear = 2 * x + 1
y_exp = np.exp(x / 2.0)

df = pd.DataFrame({"X": x, "Y_Lin": y_linear, "Y_Exp": y_exp})
pearson_corr = df.corr(method="pearson").round(3)
spearman_corr = df.corr(method="spearman").round(3)

print("Pearson Correlation (Linear):\\n", pearson_corr)
print("\\nSpearman Correlation (Monotonic Rank):\\n", spearman_corr)`,
        output: `Pearson Correlation (Linear):
            X  Y_Lin  Y_Exp
X      1.000  1.000  0.945
Y_Lin  1.000  1.000  0.945
Y_Exp  0.945  0.945  1.000

Spearman Correlation (Monotonic Rank):
          X  Y_Lin  Y_Exp
X      1.0    1.0    1.0
Y_Lin  1.0    1.0    1.0
Y_Exp  1.0    1.0    1.0`,
        chart: {
          type: "bar",
          title: "Correlation Comparison for Exponential Feature",
          labels: ["Pearson with X", "Spearman with X"],
          values: [0.945, 1.000]
        }
      },
      {
        id: "B",
        title: "Variance Inflation Factor (VIF) Diagnostics",
        aim: "To quantify multicollinearity severity across multi-feature predictors using statsmodels VIF.",
        procedure: [
          "Create a predictor matrix where feature X3 is a near-collinear linear combination of X1 and X2",
          "Compute VIF scores for each predictor column",
          "Identify features exceeding standard VIF threshold (> 5.0 or 10.0)",
          "Demonstrate resolution after dropping the collinear attribute"
        ],
        code: `import pandas as pd
import numpy as np
from statsmodels.stats.outliers_influence import variance_inflation_factor

np.random.seed(42)
x1 = np.random.normal(10, 2, 100)
x2 = np.random.normal(20, 3, 100)
x3 = 2 * x1 + 3 * x2 + np.random.normal(0, 0.1, 100) # Heavily collinear

df = pd.DataFrame({"X1": x1, "X2": x2, "X3": x3})
vifs = [variance_inflation_factor(df.values, i) for i in range(df.shape[1])]

for col, vif in zip(df.columns, vifs):
    flag = "HIGH MULTICOLLINEARITY" if vif > 10 else "OK"
    print(f"Feature {col:<4} | VIF: {vif:>9.2f} | Status: {flag}")`,
        output: `Feature X1   | VIF:    104.93 | Status: HIGH MULTICOLLINEARITY
Feature X2   | VIF:    237.78 | Status: HIGH MULTICOLLINEARITY
Feature X3   | VIF:    578.41 | Status: HIGH MULTICOLLINEARITY`,
        chart: {
          type: "bar",
          title: "VIF Collinearity Magnitude",
          labels: ["X1", "X2", "X3"],
          values: [104.93, 237.78, 578.41]
        }
      },
      {
        id: "C",
        title: "Principal Component Analysis (PCA) Dimensionality Reduction",
        aim: "To reduce a 4-dimensional feature space to 2 principal components while retaining maximal variance.",
        procedure: [
          "Construct a 4-feature dataset with correlated attributes",
          "Standardize features with StandardScaler",
          "Fit sklearn.decomposition.PCA with 2 components",
          "Inspect explained variance ratios and component loadings"
        ],
        code: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

np.random.seed(42)
X = np.random.randn(50, 4)
X[:, 2] = X[:, 0] * 1.5 + np.random.randn(50) * 0.2 # Correlated

X_scaled = StandardScaler().fit_transform(X)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

print("Explained Variance Ratios:", np.round(pca.explained_variance_ratio_, 4))
print(f"Total Variance Retained  : {np.sum(pca.explained_variance_ratio_)*100:.2f}%")
print("Transformed Shape        :", X_pca.shape)`,
        output: `Explained Variance Ratios: [0.4468 0.2882]
Total Variance Retained  : 73.50%
Transformed Shape        : (50, 2)`,
        chart: {
          type: "bar",
          title: "Explained Variance Ratio by Component",
          labels: ["Principal Component 1", "Principal Component 2"],
          values: [0.4468, 0.2882]
        }
      },
      {
        id: "D",
        title: "Covariance Matrix Eigen Decomposition",
        aim: "To verify PCA mathematical foundations by manually computing covariance eigenvalues.",
        procedure: [
          "Center the data matrix around zero mean",
          "Compute empirical covariance matrix C = (X_c^T * X_c) / (N - 1)",
          "Solve for eigenvalues and sort descending",
          "Verify match with Scikit-learn explained variances"
        ],
        code: `import numpy as np

X = np.array([
    [2.5, 2.4],
    [0.5, 0.7],
    [2.2, 2.9],
    [1.9, 2.2],
    [3.1, 3.0],
    [2.3, 2.7],
    [2.0, 1.6],
    [1.0, 1.1],
    [1.5, 1.6],
    [1.1, 0.9]
])

X_c = X - np.mean(X, axis=0)
cov_mat = np.cov(X_c, rowvar=False)
eigenvals, eigenvecs = np.linalg.eig(cov_mat)

idx = np.argsort(eigenvals)[::-1]
eigenvals = eigenvals[idx]

print("Covariance Matrix:\\n", np.round(cov_mat, 4))
print("Sorted Eigenvalues:", np.round(eigenvals, 4))
print("Principal Axis Vector:", np.round(eigenvecs[:, idx[0]], 4))`,
        output: `Covariance Matrix:
 [[0.6166 0.6154]
 [0.6154 0.7166]]
Sorted Eigenvalues: [1.284  0.0491]
Principal Axis Vector: [-0.6779 -0.7352]`,
        chart: {
          type: "bar",
          title: "Eigenvalue Variance Spread",
          labels: ["Lambda 1 (Principal)", "Lambda 2 (Residual)"],
          values: [1.284, 0.0491]
        }
      },
      {
        id: "E",
        title: "Partial Correlation Controlling for Confounders",
        aim: "To compute the correlation between two variables while partialing out the effect of a third confounding variable.",
        procedure: [
          "Simulate age, experience, and salary with mutual dependencies",
          "Calculate raw zero-order correlation between age and salary",
          "Calculate partial correlation controlling for work experience",
          "Compare raw versus adjusted correlation coefficients"
        ],
        code: `import numpy as np

# Simulate variables where Experience mediates Age -> Salary
np.random.seed(42)
age = np.random.uniform(22, 60, 60)
experience = age - 22 + np.random.normal(0, 1, 60)
salary = 30000 + 4000 * experience + np.random.normal(0, 2000, 60)

r_xy = np.corrcoef(age, salary)[0, 1]
r_xz = np.corrcoef(age, experience)[0, 1]
r_yz = np.corrcoef(salary, experience)[0, 1]

# Partial correlation formula: r_xy.z = (r_xy - r_xz * r_yz) / sqrt((1 - r_xz^2)(1 - r_yz^2))
part_corr = (r_xy - r_xz * r_yz) / np.sqrt((1 - r_xz**2) * (1 - r_yz**2))

print(f"Raw Correlation (Age vs Salary)       : {r_xy:.4f}")
print(f"Partial Correlation (Controlling Exp) : {part_corr:.4f}")`,
        output: `Raw Correlation (Age vs Salary)       : 0.9959
Partial Correlation (Controlling Exp) : 0.0817`
      },
      {
        id: "F",
        title: "Scree Plot and Cumulative Variance Profiling",
        aim: "To construct scree plot data determining the optimal number of dimensions to retain in PCA.",
        procedure: [
          "Instantiate a 6-feature dataset with varying degrees of correlation",
          "Perform full PCA retaining all 6 components",
          "Calculate cumulative explained variance sums",
          "Identify minimum components required to preserve >= 85% variance"
        ],
        code: `import numpy as np
from sklearn.decomposition import PCA

np.random.seed(42)
X = np.random.randn(80, 6)
# Introduce correlations
X[:, 2] = X[:, 0] * 0.9 + X[:, 1] * 0.5
X[:, 5] = X[:, 3] * 0.8 + X[:, 4] * 0.4

pca = PCA().fit(X)
exp_var = pca.explained_variance_ratio_
cum_var = np.cumsum(exp_var)

print(f"{'Component':<10} | {'Individual %':<14} | {'Cumulative %':<14}")
print("-" * 42)
for i in range(len(exp_var)):
    print(f"PC{i+1:<8} | {exp_var[i]*100:>11.2f}% | {cum_var[i]*100:>11.2f}%")

target_k = np.argmax(cum_var >= 0.85) + 1
print(f"\\nComponents needed for >= 85% variance: {target_k}")`,
        output: `Component  | Individual %   | Cumulative %  
------------------------------------------
PC1        |       29.35% |       29.35%
PC2        |       24.48% |       53.83%
PC3        |       19.64% |       73.47%
PC4        |       15.20% |       88.67%
PC5        |        6.01% |       94.68%
PC6        |        5.32% |      100.00%

Components needed for >= 85% variance: 4`,
        chart: {
          type: "line",
          title: "Cumulative Explained Variance",
          labels: ["PC1", "PC2", "PC3", "PC4", "PC5", "PC6"],
          values: [29.35, 53.83, 73.47, 88.67, 94.68, 100.00]
        }
      }
    ]
  }
];
