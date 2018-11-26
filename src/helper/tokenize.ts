import { NodeTypes, MathOperator, MathFunction } from "../types/NodeTypes";
import { Token } from "../structure/Token";
import { LITERAL, VARIABLE, OPERATOR, FUNCTION, LEFT_PARENTHESIS, RIGHT_PARENTHESIS, FUNCTION_ARGUMENT_SEPARATOR, config } from '../config';

const isComma = (char: string) => char === ',';
const isDigit = (char: string) => !isNaN(parseInt(char)); 
const isLetter = (char: string) => char.match(/[a-z]/i);
const isLeftParenthesis = (char: string) => char === '('; 
const isRightParenthesis = (char: string) => char === ')'; 

export const tokenize = (custom: NodeTypes) => (string: string) => {
  const data = string.split('')

  const result: Token[] = [];
  let letterBuffer: string[] = [];
  let numberBuffer: string[] = [];

  const createToken = (type, value): Token => {
    let assoc: 'left' | 'right' | null = null;
    let prec: number | null = null;
    if (type === FUNCTION) {
      const found = custom.functions.find(({ name }) => name === value);
      if (!found) {
        throw new Error(`Function ${value} is not found!`);
      }
    } else if (type === OPERATOR) {
      const found = custom.operators.find(({ name }) => name === value);
      if (!found) {
        throw new Error(`Function ${value} is not found!`);
      }
      assoc = found.associativity;
      prec = found.precedence;
    }
    return new Token(type, value, assoc, prec);
  }

  // const assembledOperators: MathOperator[] = [
  //   ...custom.operators,
  //   ...config.tokens.operators
  // ]

  // const assembledFunctions: MathFunction[] = [
  //   ...custom.functions,
  //   ...config.tokens.functions
  // ]

  const checkIsInList = (value: string, list: { name: string }[]) => {
    return list.map(v => v.name).includes(value);
  }

  const emptyNumberBufferAsLiteral = () => {
    if (numberBuffer.length > 0) {
      result.push(createToken(LITERAL, numberBuffer.join('')));
      numberBuffer = [];
    }
  }

  const emptyLetterBufferAsVariables = () => {
    if (letterBuffer.length > 0) {
      letterBuffer.forEach((letter, index) => {
        result.push(createToken(VARIABLE, letter));
        if(index < letterBuffer.length - 1) { //there are more Variables left
          result.push(createToken(OPERATOR, "*"));
        }
      });
      letterBuffer = [];
    }
  }

  data.forEach(value => {
    if (isDigit(value) || value === '.') {
      numberBuffer.push(value);
    } else if (isLetter(value)) {
      if (numberBuffer.length > 0) {
        emptyNumberBufferAsLiteral();
        result.push(createToken(OPERATOR, '*'));
      }
      letterBuffer.push(value);
    } else if (checkIsInList(value, custom.operators)) { // Is operator
      emptyNumberBufferAsLiteral();
      emptyLetterBufferAsVariables();
      if (result.length > 0) {
        const lastValue = result[result.length - 1];
        if (lastValue.type === OPERATOR && value === '-') {
          numberBuffer.push('-');
        } else {
          result.push(createToken(OPERATOR, value));
        }
      } else { // adding a negative at the beginning of string
        numberBuffer.push('-');
      }
      
    } else if (isLeftParenthesis(value)) {
      if(letterBuffer.length > 0) {
				result.push(createToken(FUNCTION, letterBuffer.join("")));
				letterBuffer = [];
			} else if (numberBuffer.length > 0) { // If it is just parentheses
        emptyNumberBufferAsLiteral();
        result.push(createToken(OPERATOR, '*'));
      }
      result.push(createToken(LEFT_PARENTHESIS, value))
    } else if (isRightParenthesis(value)) {
      emptyLetterBufferAsVariables();
			emptyNumberBufferAsLiteral();
			result.push(createToken(RIGHT_PARENTHESIS, value));
    } else if (isComma(value)) {
			emptyNumberBufferAsLiteral();
			emptyLetterBufferAsVariables();
			result.push(createToken(FUNCTION_ARGUMENT_SEPARATOR, value));
		} else {
      throw new TypeError(`Invalid input "${value}"`)
    }
  });
  if (numberBuffer.length > 0) {
		emptyNumberBufferAsLiteral();
	}
	if(letterBuffer.length > 0) {
		emptyLetterBufferAsVariables();
	}
	return result;
}