import { NumberLike } from "./NumberLike";
import { Variable } from './Variable';

export class ASTNode {
  constructor(
    public args: NumberLike[],
    public solve: (...args: number[]) => number
  ) {}

  public evaluate(variableList?: { [name: string]: number }): number {
    const values = this.args.map(arg => {
      if (arg instanceof ASTNode) {
        return arg.evaluate(variableList);
      } else if (arg instanceof Variable) {
        if (!variableList || typeof variableList[arg.name] !== 'number') {
          throw new TypeError(`Value not provided for variable "${arg.name}"`);
        }
        return variableList[arg.name];
      }
      return arg; // Will be a number
    })
    return this.solve(...values);
  }

  public getVariableNames(): Set<string> {
    return this.args.reduce((set, arg) => {
      if (arg instanceof ASTNode) {
        return new Set([...set, ...arg.getVariableNames()])
      } else if (arg instanceof Variable) {
        return new Set([...set, arg.name]);
      }
      return set;
    }, new Set())
  }
}