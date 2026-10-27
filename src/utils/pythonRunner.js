/**
 * Python execution abstraction.
 * If VITE_PYTHON_API_URL is configured, executes code via REST backend.
 * Otherwise, performs honest local client-side validation in Demo Mode.
 */

export async function runPythonCode({ code, originalCode, expectedOutput }) {
  const apiUrl = import.meta.env.VITE_PYTHON_API_URL;

  // 1. If backend API URL is configured, POST to it
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        mode: 'backend',
        stdout: data.stdout || '',
        error: data.error || null,
        executionTime: data.executionTime || '0.12s',
      };
    } catch (err) {
      return {
        mode: 'backend',
        stdout: '',
        error: `Backend Connection Error: ${err.message}. Ensure backend is running at ${apiUrl}.`,
      };
    }
  }

  // 2. Demo Mode (No backend connected)
  const trimmed = code.trim();

  // Basic syntax check 1: Empty code
  if (!trimmed) {
    return {
      mode: 'demo',
      stdout: '',
      error: 'SyntaxError: unexpected EOF while parsing (empty code script)',
      isDemo: true,
      isEdited: false,
    };
  }

  // Basic syntax check 2: Unbalanced parentheses/brackets/quotes
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };
  let inString = false;
  let stringChar = '';

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if ((char === '"' || char === "'") && trimmed[i - 1] !== '\\') {
      if (inString && stringChar === char) {
        inString = false;
      } else if (!inString) {
        inString = true;
        stringChar = char;
      }
      continue;
    }

    if (!inString) {
      if (pairs[char]) {
        stack.push({ char, index: i });
      } else if (char === ')' || char === ']' || char === '}') {
        const last = stack.pop();
        if (!last || pairs[last.char] !== char) {
          return {
            mode: 'demo',
            stdout: '',
            error: `SyntaxError: unmatched '${char}' at character index ${i}`,
            isDemo: true,
            isEdited: true,
          };
        }
      }
    }
  }

  if (stack.length > 0) {
    const unclosed = stack.pop();
    return {
      mode: 'demo',
      stdout: '',
      error: `SyntaxError: unexpected EOF while parsing - unclosed '${unclosed.char}'`,
      isDemo: true,
      isEdited: true,
    };
  }

  // Check if code was modified from the original benchmark
  const normalize = (str) => (str || '').replace(/\r\n/g, '\n').trim();
  const isEdited = normalize(code) !== normalize(originalCode);

  if (isEdited) {
    return {
      mode: 'demo',
      stdout: '',
      error: 'Demo Mode Notice: Code edits were detected, but no Python backend server is connected. To execute custom code in real-time, configure VITE_PYTHON_API_URL or run a local Python microservice.',
      isDemo: true,
      isEdited: true,
    };
  }

  // Code unchanged: return genuine matching sample output
  return {
    mode: 'demo',
    stdout: expectedOutput || '>>> Execution completed with zero errors.',
    error: null,
    isDemo: true,
    isEdited: false,
  };
}
