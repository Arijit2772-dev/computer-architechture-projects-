export type Bit = 0 | 1;

export interface HalfAdderResult {
  sum: Bit;
  carry: Bit;
}

export interface FullAdderResult {
  sum: Bit;
  cout: Bit;
}

export interface AdderStep {
  index: number;
  a: Bit;
  b: Bit;
  cin: Bit;
  sum: Bit;
  cout: Bit;
}

export interface NBitResult {
  binarySum: string;
  steps: AdderStep[];
  overflow: boolean;
}

export enum ViewState {
  HOME = 'HOME',
  HALF_ADDER = 'HALF_ADDER',
  FULL_ADDER = 'FULL_ADDER',
  N_BIT_ADDER = 'N_BIT_ADDER',
  DOCS = 'DOCS',
}