import { ASTNode } from '../structure/ASTNode';

export type MathOperator = {
  name: string,
  node: new (...args) => ASTNode,
  associativity: 'left' | 'right' | null,
  precedence: number
}

export type MathFunction = {
  name: string,
  node: new (...args) => ASTNode
}

export type NodeTypes = {
  operators: MathOperator[],
  functions: MathFunction[]
}