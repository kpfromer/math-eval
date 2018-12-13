import { MathFunction, MathOperator, NodeTypes } from "./types/NodeTypes";
import { tokenize } from "./helper/tokenize";
import { createAbstractSyntaxTree } from "./helper/parser";
import { ASTNode } from "./structure/ASTNode";
import { Variable } from './structure/Variable';
import { Power, Multiply, Divide, Add, Subtract, Sin, Cos, Tan } from "./defaults/Operators";

export class MathParser {

  constructor(
    private mathFunctions: MathFunction[] = [],
    private mathOperators: MathOperator[] = []
  ) {
    this.mathOperators = [
      {
        name: '^',
        node: Power,
        precedence: 4,
        associativity: 'right'
      },
      {
        name: '*',
        node: Multiply,
        precedence: 3,
        associativity: 'left'
      },
      {
        name: '/',
        node: Divide,
        precedence: 3,
        associativity: 'left'
      },
      {
        name: '+',
        node: Add,
        precedence: 2,
        associativity: 'left'
      },
      {
        name: '-',
        node: Subtract,
        precedence: 2,
        associativity: 'left'
      },
      ...this.mathOperators
    ] as MathOperator[];

    this.mathFunctions = [
      {
        name: 'sin',
        node: Sin
      },
      {
        name: 'cos',
        node: Cos
      },
      {
        name: 'tan',
        node: Tan
      },
      ...this.mathFunctions
    ] as MathFunction[];
  }

  config() {
    return {
      functions: this.mathFunctions,
      operators: this.mathOperators
    } as NodeTypes;
  }

  addFunction(func: MathFunction) {
    this.mathFunctions.push(func);
  }

  addOperator(operator: MathOperator) {
    this.mathOperators.push(operator);
  }

  hasVariables(expression: string): boolean | string[] {
    const value = createAbstractSyntaxTree(tokenize(this.config())(expression), this.config());
    if (value instanceof ASTNode) {
      const variables = [...value.getVariableNames()];
      if (variables.length > 0) {
        return variables;
      }
    }
    return false;
  }

  solve(expression: string, variableList: { [name: string]: number } = {}): number {
    const value = createAbstractSyntaxTree(tokenize(this.config())(expression), this.config());
    if (value instanceof ASTNode) {
      return value.evaluate(variableList);
    } else if (value instanceof Variable) {
      const varVal = variableList[value.name];
      if (varVal === undefined) {
        throw new TypeError(`Did not find value for variable "${value.name}"`)
      }
      return varVal;
    }
    return value;
  }
  
}