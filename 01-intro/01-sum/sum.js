function sum(a, b) {
  console.log(a,b);
  if (typeof a === 'number' && typeof b === 'number' && isFinite(a) && isFinite(b)) {
    return a + b;
  }
  throw new TypeError();
}

module.exports = sum;
