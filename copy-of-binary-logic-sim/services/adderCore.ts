import { Bit, FullAdderResult, HalfAdderResult, NBitResult, AdderStep } from '../types';

/**
 * Logic for a Half Adder.
 * Inputs: A, B
 * Logic: SUM = A XOR B, CARRY = A AND B
 */
export const halfAdder = (a: Bit, b: Bit): HalfAdderResult => {
  return {
    sum: (a ^ b) as Bit,
    carry: (a & b) as Bit,
  };
};

/**
 * Logic for a Full Adder.
 * Inputs: A, B, Carry-In
 * Logic: SUM = A XOR B XOR Cin, COUT = (A AND B) OR (Cin AND (A XOR B))
 */
export const fullAdder = (a: Bit, b: Bit, cin: Bit): FullAdderResult => {
  // First half adder stage
  const ha1 = halfAdder(a, b);
  // Second half adder stage
  const ha2 = halfAdder(ha1.sum, cin);
  
  return {
    sum: ha2.sum,
    // Carry out is true if either stage generated a carry
    cout: (ha1.carry | ha2.carry) as Bit,
  };
};

/**
 * Logic for an N-Bit Adder (Ripple Carry).
 * Adds two binary strings.
 */
export const nBitAdder = (binA: string, binB: string): NBitResult => {
  // 1. Sanitize inputs: remove non-binary chars
  const cleanA = binA.replace(/[^01]/g, '');
  const cleanB = binB.replace(/[^01]/g, '');

  // 2. Normalize length by padding with leading zeros
  const maxLength = Math.max(cleanA.length, cleanB.length);
  const padA = cleanA.padStart(maxLength, '0');
  const padB = cleanB.padStart(maxLength, '0');

  const steps: AdderStep[] = [];
  let currentCarry: Bit = 0;
  let resultBits: string[] = [];

  // 3. Iterate from right (LSB) to left (MSB)
  for (let i = maxLength - 1; i >= 0; i--) {
    const bitA = parseInt(padA[i], 10) as Bit;
    const bitB = parseInt(padB[i], 10) as Bit;

    const { sum, cout } = fullAdder(bitA, bitB, currentCarry);

    steps.push({
      index: maxLength - 1 - i, // 0 is LSB
      a: bitA,
      b: bitB,
      cin: currentCarry,
      sum,
      cout,
    });

    resultBits.unshift(sum.toString());
    currentCarry = cout;
  }

  // Check for final overflow if needed, though usually fixed-width keeps it or expands it.
  // We will simply prepend the final carry if it's 1 for the final result string
  // to show the full mathematical sum.
  if (currentCarry === 1) {
    resultBits.unshift('1');
  }

  return {
    binarySum: resultBits.join(''),
    steps: steps, // Steps are stored LSB first (index 0)
    overflow: currentCarry === 1
  };
};

// Helper to validate binary string
export const isValidBinary = (str: string): boolean => {
  return /^[01]*$/.test(str);
};