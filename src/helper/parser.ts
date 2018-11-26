import { LEFT_PARENTHESIS, FUNCTION_ARGUMENT_SEPARATOR, VARIABLE, LITERAL, OPERATOR, RIGHT_PARENTHESIS, FUNCTION } from '../config';
import { Token } from '../structure/Token';
import { Stack } from '../structure/Stack';
import { ASTNode } from '../structure/ASTNode';
import { Variable } from '../structure/Variable';
import { tokenize } from './tokenize';
import { NodeTypes, MathFunction, MathOperator } from '../types/NodeTypes';
import { NumberLike } from '../structure/NumberLike';
import { isNumber } from './isNumber';

class TempASTNode {
  constructor(
    public token: Token,
    public left: TempASTNode | null,
    public right: TempASTNode | null
  ) {}
}

export const convertToTempASTNode = (tokens: Token[]) => {
  const out = new Stack<TempASTNode>();
  const ops = new Stack<Token>();

  const addNode = (operator: Token) => {
    const rightChild = out.pop() as TempASTNode;
    const leftChild = out.pop() as TempASTNode;
    out.push(new TempASTNode(operator, leftChild, rightChild));
  }

  tokens.forEach(token => {
    const { type, value, associativity, precedence } = token;

    if (type === LITERAL || type === VARIABLE) {
      out.push(new TempASTNode(token, null, null));
    } else if (type === FUNCTION) {
      ops.push(token);
    } else if (type === FUNCTION_ARGUMENT_SEPARATOR) {
      while (ops.isNext() && (ops.peek() as Token).type !== LEFT_PARENTHESIS) {
        addNode(ops.pop() as Token)
      }
    } else if (type === OPERATOR) {
      while(
        (ops.isNext() && (ops.peek() as Token).type === OPERATOR) &&
        (
          associativity === 'left' && (precedence as number) <= ((ops.peek() as Token).precedence as number) ||
          associativity === 'right' && (precedence as number) < ((ops.peek() as Token).precedence as number)
        )
      ) {
        addNode(ops.pop() as Token);
      }
      ops.push(token);
    } else if (type === LEFT_PARENTHESIS) {
      ops.push(token);
    } else if (type === RIGHT_PARENTHESIS) {
      while (ops.isNext() && (ops.peek() as Token).type !== LEFT_PARENTHESIS) {
        addNode(ops.pop() as Token);
      }
      ops.pop();
      if (ops.isNext() && (ops.peek() as Token).type === FUNCTION) {
        addNode(ops.pop() as Token);
      }
    }
  });
  while(ops.isNext()) {
    addNode(ops.pop() as Token);
  }

  return out.pop() as TempASTNode;
}

export const evaluateTempASTNode = (node: TempASTNode, custom: NodeTypes): ASTNode | Variable | number => {
  if (node.token.type === VARIABLE) {
    return new Variable(node.token.value);
  } else if (node.token.type === LITERAL) {
    return parseFloat(node.token.value);
  }

  const name = node.token.value;

  const foundFunction = custom.functions.find(func => func.name === name);
  const foundOperator = custom.operators.find(func => func.name === name);

  const left = node.left instanceof TempASTNode ? evaluateTempASTNode(node.left, custom) : node.left;
  const right = node.right instanceof TempASTNode ? evaluateTempASTNode(node.right, custom) : node.right;

  const args = [left, right].filter(arg => arg !== null);

  
  // if (foundFunction === undefined && foundOperator === undefined) { // Must be a variable or number
  //   return c;
  // }
  
  if (foundFunction !== undefined) {
    return new foundFunction.node(...args.reverse());
  }
  return new (foundOperator as MathOperator).node(...args)

  // const nodeToCreate = foundFunction !== undefined ? foundFunction.node : (foundOperator as MathOperator).node;
  // console.log(nodeToCreate);
  // // if (nodeToCreate.constructor.name === 'Sin') {
  //   console.log({ args });
  // // }?
  // return new nodeToCreate(...args);
}

// export const evaluateASTNode = (node: TempASTNode): ASTNode | Variable | number => {
//   const { type, value } = node.token;
//   const left = !node.left ? null : evaluateASTNode(node.left);
//   const right = !node.right ? null : evaluateASTNode(node.right);
//   return mapping[type](value, left, right);
// }

export const createAbstractSyntaxTree = (tokens: Token[], custom: NodeTypes): NumberLike => {
  const tempNode = convertToTempASTNode(tokens);

  return evaluateTempASTNode(tempNode, custom);
}

// export const parse = (string: string): ASTNode | Variable | number => {
//   // checkForErrors(string);
//   const value = evaluateASTNode(createAbstractSyntaxTree(tokenize(string)));
//   if (!(value instanceof ASTNode)) { // if value is a number or string (just a symbol)
//     return value as Variable | number;
//   }
//   return value as ASTNode;
// }