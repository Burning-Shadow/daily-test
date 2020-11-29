import {
  fizzBuzz
} from './fizzBuzz.js';

test('test fizz buzz', () => {
  expect(fizzBuzz(1)).toBe(1);
  expect(fizzBuzz(2)).toBe(2);
  expect(fizzBuzz(15)).toBe('fizzbuzz');
  expect(fizzBuzz(5)).toBe('buzz');
});