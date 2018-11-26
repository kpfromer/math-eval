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

  addFunction(func: MathFunction) {
    this.mathFunctions.push(func);
  }

  addOperator(operator: MathOperator) {
    this.mathOperators.push(operator);
  }

  solve(expression: string, variableList: { [name: string]: number } = {}): number {
    const config = {
      functions: this.mathFunctions,
      operators: this.mathOperators
    } as NodeTypes;
    const value = createAbstractSyntaxTree(tokenize(config)(expression), config);
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