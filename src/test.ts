import { tokenize } from "./helper/tokenize";
import { Add, Multiply, Sin } from './defaults/Operators';
import { createAbstractSyntaxTree, convertToTempASTNode } from "./helper/parser";
import { ASTNode } from "./structure/ASTNode";
import { NodeTypes } from "./types/NodeTypes";
import { MathParser } from "./MathParser";

const parser = new MathParser();
console.log(parser.solve('1+x^4.5*2/3+9-3', { x: 10 }));

// const custom = {
//   operators: [
//     {
//       name: '*',
//       node: Multiply,
//       precedence: 3,
//       associativity: 'left'
//     },
//     {
//       name: '+',
//       node: Add,
//       precedence: 2,
//       associativity: 'left'
//     }
//   ],
//   functions: [
//     {
//       name: 'sin',
//       node: Sin
//     }
//   ]
// } as NodeTypes;

// const token = tokenize(custom);

// console.log(createAbstractSyntaxTree(token('x+4.5+2+3+9'), custom));

// console.log(createAbstractSyntaxTree(tokenize({
//   operators: [
//     {
//       name: '|',
//       node: Add,
//       precedence: 3,
//       associativity: 'left'
//     }
//   ],
//   functions: []
// })('x|1')));


// console.log(new Add(new Add(1, 2), 3).evaluate());