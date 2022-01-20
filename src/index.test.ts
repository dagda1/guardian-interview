import { describe, it, expect } from '@jest/globals';
import { add } from '.';

describe('add', () => {
  it('should add up', () => {
    expect(add(1, 2)).toBe(3);
  });
});
