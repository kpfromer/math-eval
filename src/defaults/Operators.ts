import { ASTNode } from "../structure/ASTNode";
import { NumberLike } from "../structure/NumberLike";

export class Add extends ASTNode {
  constructor(a: NumberLike, b: NumberLike) {
    super([a, b], (a, b) => a + b);
  }
}
export class Subtract extends ASTNode {
  constructor(a: NumberLike, b: NumberLike) {
    super([a, b], (a, b) => a - b);
  }
}
export class Divide extends ASTNode {
  constructor(a: NumberLike, b: NumberLike) {
    super([a, b], (a, b) => a / b);
  }
}
export class Multiply extends ASTNode {
  constructor(a: NumberLike, b: NumberLike) {
    super([a, b], (a, b) => a * b);
  }
}
export class Power extends ASTNode {
  constructor(a: NumberLike, b: NumberLike) {
    super([a, b], (a, b) => Math.pow(a, b));
  }
}
export class Sin extends ASTNode {
  constructor(a: NumberLike) {
    super([a], a => Math.sin(a));
  }
}
export class Cos extends ASTNode {
  constructor(a: NumberLike) {
    super([a], a => Math.cos(a));
  }
}
export class Tan extends ASTNode {
  constructor(a: NumberLike) {
    super([a], a => Math.tan(a));
  }
}