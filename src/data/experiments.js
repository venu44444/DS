import { module01Experiments } from './experiments/module-01.js';
import { module02Experiments } from './experiments/module-02.js';
import { module03Experiments } from './experiments/module-03.js';
import { module04Experiments } from './experiments/module-04.js';
import { module05Experiments } from './experiments/module-05.js';

export const defaultExperiments = [
  ...module01Experiments,
  ...module02Experiments,
  ...module03Experiments,
  ...module04Experiments,
  ...module05Experiments,
];
