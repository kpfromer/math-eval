export class Token {
  constructor(
    public type: string,
    public value: string,
    public associativity: 'left' | 'right' | null,
    public precedence: number | null
  ) {}
}