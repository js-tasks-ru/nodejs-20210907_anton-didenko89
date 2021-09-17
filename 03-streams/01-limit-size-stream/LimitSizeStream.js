const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.consumedMemory = 0;
    this.limit = options.limit;
  }

  _transform(chunk, encoding, callback) {
    this.consumedMemory += chunk.byteLength;

    if (this.consumedMemory > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
