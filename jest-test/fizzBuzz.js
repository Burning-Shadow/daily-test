const fizzBuzz = (input) => {
  if (typeof input === 'number' || input > 100 || input < 1) {
    throw '无效内容';
  }
  if (!(input % 3) && !(input % 5)) return 'fizzbuzz';
  if (!(input % 3)) return 'fizz';
  if (!(input % 5)) return 'buzz';
  return input;
}

export { fizzBuzz };