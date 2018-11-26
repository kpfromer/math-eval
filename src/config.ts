import { NodeTypes } from "./types/NodeTypes";
import { Add, Subtract, Multiply, Power, Sin, Cos, Tan } from "./defaults/Operators";

export const LITERAL = 'LITERAL';
export const OPERATOR = 'OPERATOR';
export const VARIABLE = 'VARIABLE';
export const FUNCTION = 'FUNCTION';
export const LEFT_PARENTHESIS = 'LEFT_PARENTHESIS';
export const RIGHT_PARENTHESIS = 'RIGHT_PARENTHESIS';
export const FUNCTION_ARGUMENT_SEPARATOR = 'FUNCTION_ARGUMENT_SEPARATOR';

export const config: {
  tokens: NodeTypes
} = {
  tokens: {
    operators: [
      {
        name: '+',
        node: Add,
        associativity: 'left',
        precedence: 4
      },
      {
        name: '-',
        node: Subtract,
        associativity: 'left',
        precedence: 4
      },
      {
        name: '*',
        node: Multiply,
        associativity: 'left',
        precedence: 4
      },
      {
        name: '^',
        node: Power,
        associativity: 'left',
        precedence: 4
      }
    ],
    functions: [
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
      }
    ]
  }
}