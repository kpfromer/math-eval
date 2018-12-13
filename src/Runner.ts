import { MathParser } from "./MathParser";
import chalk from 'chalk';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const read = (message): Promise<string> => new Promise(resolve => rl.question(message, resolve));

const prompt = async () => {
  const parser = new MathParser();
  
  const expression = await read(chalk.cyan('Enter Math Expression: '));
  if (expression === 'exit') {
    process.exit();
  }
  const hasVars = parser.hasVariables(expression);

  const variables = {};

  if (Array.isArray(hasVars)) {
    for (let variableName of hasVars) {
      const val = await read(chalk.cyan('Variable value for ') + chalk.red(variableName) + ': ');
      if (isNaN(Number(val))) {
        throw new Error(`Value: "${val}" must be a number!`);
      }
      variables[variableName] = Number(val);
    }
  }

  console.log(chalk.cyan('Result: ') + parser.solve(expression, variables));
}

const run = async () => {
  console.log(chalk.redBright('Enter "exit" to stop program.'));
  while (true) {
    await prompt();
  }
}

run();