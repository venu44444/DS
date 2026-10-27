const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public/pdfs');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createSimplePdf(title, subtitle, moduleName, pageCount = 8) {
  // Simple multi-page valid PDF-1.4 generator
  const objects = [];
  
  function addObject(content) {
    objects.push(content);
    return objects.length; // 1-based object number
  }

  // 1: Catalog (will point to Pages)
  // 2: Pages object
  // Then pairs of (Page, Content)
  // Font object
  const fontObjNum = 3 + pageCount * 2;

  const pageObjNums = [];
  for (let i = 0; i < pageCount; i++) {
    const pageNum = i + 1;
    const pageIndex = 3 + i * 2;
    const contentIndex = pageIndex + 1;
    pageObjNums.push(pageIndex);
  }

  // Obj 1: Catalog
  objects.push(`<< /Type /Catalog /Pages 2 0 R >>`);

  // Obj 2: Pages
  const kidsStr = pageObjNums.map(n => `${n} 0 R`).join(' ');
  objects.push(`<< /Type /Pages /Kids [ ${kidsStr} ] /Count ${pageCount} >>`);

  // Add pages and contents
  for (let i = 0; i < pageCount; i++) {
    const pageNum = i + 1;
    const streamContent = `BT
/F1 22 Tf
50 720 Td
(${title}) Tj
/F1 14 Tf
0 -30 Td
(${subtitle} - Page ${pageNum} of ${pageCount}) Tj
/F1 11 Tf
0 -40 Td
(Mohan Babu University - Department of Data Science) Tj
0 -20 Td
(Module: ${moduleName}) Tj
0 -30 Td
(--------------------------------------------------------------------------------------------------) Tj
0 -30 Td
(Official Laboratory Manual & Study Material Guide) Tj
0 -20 Td
(This document serves as an interactive reference material for coursework experiments.) Tj
0 -20 Td
(Topics covered include theoretical foundations, implementation guidelines, and best practices.) Tj
0 -40 Td
(Section ${pageNum}.1: Core Methodologies & Mathematical Formulations) Tj
0 -20 Td
(Detailed code snippets, architecture diagrams, and algorithm proofs are provided.) Tj
0 -20 Td
(Students should refer to the experimental sandbox to replicate all demonstrated procedures.) Tj
0 -60 Td
(Notice: You can replace this placeholder PDF with the university curriculum syllabus in public/pdfs.) Tj
ET`;

    const streamLength = Buffer.byteLength(streamContent, 'utf8');

    // Page Object
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${objects.length + 2} 0 R /Resources << /Font << /F1 ${fontObjNum} 0 R >> >> >>`);

    // Content Object
    objects.push(`<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream`);
  }

  // Font Object
  objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);

  // Assemble full PDF with xref table
  let pdf = `%PDF-1.4\n`;
  const offsets = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

const materialsList = [
  // Module 1
  { id: 'mat-01', filename: 'python-basics-guide.pdf', title: 'Python for Data Science - Complete Guide', module: 'Python for Data Science', pages: 12 },
  { id: 'mat-02', filename: 'numpy-pandas-cheatsheet.pdf', title: 'NumPy & Pandas Quick Reference', module: 'Python for Data Science', pages: 8 },
  { id: 'mat-03', filename: 'data-structures-algorithms.pdf', title: 'Data Structures & Algorithms in Python', module: 'Python for Data Science', pages: 16 },
  { id: 'mat-04', filename: 'functional-python-ds.pdf', title: 'Vectorization & Functional Programming in Python', module: 'Python for Data Science', pages: 10 },
  
  // Module 2
  { id: 'mat-05', filename: 'data-collection-techniques.pdf', title: 'Data Ingestion & Web Scraping Manual', module: 'Data Collection & Preprocessing', pages: 14 },
  { id: 'mat-06', filename: 'data-cleaning-handbook.pdf', title: 'Missing Value Imputation & Outlier Handling', module: 'Data Collection & Preprocessing', pages: 10 },
  { id: 'mat-07', filename: 'feature-engineering-guide.pdf', title: 'Feature Scaling & Transformation Techniques', module: 'Data Collection & Preprocessing', pages: 12 },
  { id: 'mat-08', filename: 'sql-nosql-data-prep.pdf', title: 'Relational & NoSQL Data Pipelines', module: 'Data Collection & Preprocessing', pages: 9 },

  // Module 3
  { id: 'mat-09', filename: 'eda-statistical-methods.pdf', title: 'Exploratory Data Analysis Statistical Handbook', module: 'Exploratory Data Analysis', pages: 15 },
  { id: 'mat-10', filename: 'hypothesis-testing-manual.pdf', title: 'Parametric & Non-Parametric Hypothesis Testing', module: 'Exploratory Data Analysis', pages: 11 },
  { id: 'mat-11', filename: 'correlation-covariance-study.pdf', title: 'Correlation & Multicollinearity Analysis', module: 'Exploratory Data Analysis', pages: 8 },
  { id: 'mat-12', filename: 'multivariate-eda-guide.pdf', title: 'Multivariate Distribution & PCA Guide', module: 'Exploratory Data Analysis', pages: 14 },

  // Module 4
  { id: 'mat-13', filename: 'data-viz-principles.pdf', title: 'Information Aesthetics & Visual Encoding', module: 'Data Visualization', pages: 12 },
  { id: 'mat-14', filename: 'matplotlib-seaborn-mastery.pdf', title: 'Matplotlib & Seaborn Advanced Charting', module: 'Data Visualization', pages: 16 },
  { id: 'mat-15', filename: 'interactive-dashboards-plotly.pdf', title: 'Interactive Plotly & Dashboard Architecture', module: 'Data Visualization', pages: 10 },
  { id: 'mat-16', filename: 'spatial-temporal-viz.pdf', title: 'Geospatial & Time-Series Visualizations', module: 'Data Visualization', pages: 9 },

  // Module 5
  { id: 'mat-17', filename: 'ml-algorithms-foundations.pdf', title: 'Supervised & Unsupervised Learning Theory', module: 'Machine Learning', pages: 20 },
  { id: 'mat-18', filename: 'model-evaluation-metrics.pdf', title: 'Classification & Regression Evaluation Metrics', module: 'Machine Learning', pages: 12 },
  { id: 'mat-19', filename: 'hyperparameter-tuning-guide.pdf', title: 'GridSearch, Cross-Validation & Optimization', module: 'Machine Learning', pages: 11 },
  { id: 'mat-20', filename: 'ensemble-methods-xgboost.pdf', title: 'Random Forests, Bagging & Gradient Boosting', module: 'Machine Learning', pages: 15 },
];

console.log('Generating 20 placeholder PDFs for study materials...');
for (const mat of materialsList) {
  const filePath = path.join(outputDir, mat.filename);
  const pdfBytes = createSimplePdf(mat.title, `Study Material ID: ${mat.id}`, mat.module, mat.pages);
  fs.writeFileSync(filePath, pdfBytes);
  console.log(`Created ${mat.filename} (${mat.pages} pages)`);
}
console.log('All placeholder PDFs successfully generated.');
