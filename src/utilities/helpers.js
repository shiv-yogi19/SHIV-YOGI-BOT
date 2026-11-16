/**
 * SHIV YOGI AI BOT - Safe Helper Utilities
 * Includes a pure, sandbox-safe mathematical expression evaluator
 * (ZERO eval, ZERO Function constructor) and robust JSON parsing.
 */

export function safeJsonParse(str, fallback = null) {
  if (typeof str !== 'string') return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Pure Mathematical Expression Evaluator (Safe Shunting-Yard + RPN)
 * Supports +, -, *, /, %, ^, parentheses, sqrt, sin, cos, tan, log, abs, round, pi, e
 * NEVER executes arbitrary code or invokes eval().
 * 
 * @param {string} expr - Mathematical expression string
 * @returns {number} Result of evaluation
 */
export function safeCalculate(expr) {
  if (!expr || typeof expr !== 'string') {
    throw new Error('Empty expression');
  }

  // Clean expression and replace constants
  let clean = expr
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\bpi\b/g, Math.PI.toString())
    .replace(/\be\b/g, Math.E.toString());

  // Tokenize safely
  const tokens = [];
  const tokenRegex = /(\d+\.?\d*|\+|\-|\*|\/|\%|\^|\(|\)|sqrt|sin|cos|tan|log|abs|round|floor|ceil)/g;
  let match;
  let lastIndex = 0;

  while ((match = tokenRegex.exec(clean)) !== null) {
    if (match.index !== lastIndex) {
      throw new Error(`Invalid token at position ${lastIndex}`);
    }
    tokens.push(match[0]);
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex !== clean.length) {
    throw new Error('Invalid characters in mathematical expression');
  }

  // Shunting-Yard Algorithm to convert to Reverse Polish Notation (RPN)
  const outputQueue = [];
  const operatorStack = [];

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '%': 2,
    '^': 3
  };

  const isFunction = (t) => ['sqrt', 'sin', 'cos', 'tan', 'log', 'abs', 'round', 'floor', 'ceil'].includes(t);
  const isOperator = (t) => ['+', '-', '*', '/', '%', '^'].includes(t);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!isNaN(parseFloat(token))) {
      outputQueue.push(parseFloat(token));
    } else if (isFunction(token)) {
      operatorStack.push(token);
    } else if (token === '(') {
      operatorStack.push(token);
    } else if (token === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop());
      }
      if (operatorStack.length === 0) {
        throw new Error('Mismatched parentheses');
      }
      operatorStack.pop(); // pop '('
      if (operatorStack.length > 0 && isFunction(operatorStack[operatorStack.length - 1])) {
        outputQueue.push(operatorStack.pop());
      }
    } else if (isOperator(token)) {
      // Handle unary minus
      if (token === '-' && (i === 0 || tokens[i - 1] === '(' || isOperator(tokens[i - 1]))) {
        outputQueue.push(0); // 0 - x
      }
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== '(' &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.push(token);
    }
  }

  while (operatorStack.length > 0) {
    const op = operatorStack.pop();
    if (op === '(' || op === ')') {
      throw new Error('Mismatched parentheses');
    }
    outputQueue.push(op);
  }

  // Evaluate RPN
  const evalStack = [];
  for (const token of outputQueue) {
    if (typeof token === 'number') {
      evalStack.push(token);
    } else if (isFunction(token)) {
      if (evalStack.length < 1) throw new Error(`Not enough arguments for ${token}`);
      const val = evalStack.pop();
      switch (token) {
        case 'sqrt': evalStack.push(Math.sqrt(val)); break;
        case 'sin': evalStack.push(Math.sin(val)); break;
        case 'cos': evalStack.push(Math.cos(val)); break;
        case 'tan': evalStack.push(Math.tan(val)); break;
        case 'log': evalStack.push(Math.log(val)); break;
        case 'abs': evalStack.push(Math.abs(val)); break;
        case 'round': evalStack.push(Math.round(val)); break;
        case 'floor': evalStack.push(Math.floor(val)); break;
        case 'ceil': evalStack.push(Math.ceil(val)); break;
      }
    } else if (isOperator(token)) {
      if (evalStack.length < 2) throw new Error(`Not enough operands for ${token}`);
      const b = evalStack.pop();
      const a = evalStack.pop();
      switch (token) {
        case '+': evalStack.push(a + b); break;
        case '-': evalStack.push(a - b); break;
        case '*': evalStack.push(a * b); break;
        case '/':
          if (b === 0) throw new Error('Division by zero');
          evalStack.push(a / b);
          break;
        case '%': evalStack.push(a % b); break;
        case '^': evalStack.push(Math.pow(a, b)); break;
      }
    }
  }

  if (evalStack.length !== 1) {
    throw new Error('Invalid mathematical evaluation');
  }

  return evalStack[0];
}
