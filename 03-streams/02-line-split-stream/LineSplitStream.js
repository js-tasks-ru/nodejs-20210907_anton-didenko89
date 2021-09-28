const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options.encoding;
    this.accumulator = null;
    this.prevLine = '';
  }

  _transform(chunk, encoding, callback) {
    function splitterByLines(string) {
      if (string.includes(os.EOL)) {
        if (this.prevLine !== '') {
          this.prevLine +=  string.slice(0, string.indexOf(os.EOL));
          this.push(this.prevLine);
          this.prevLine = '';

          this.accumulator = string.slice(string.indexOf(os.EOL) + 1);
          splitterByLines.call(this,this.accumulator);
        } else {
          this.push(string.slice(0, string.indexOf(os.EOL)));
          this.accumulator = string.slice(string.indexOf(os.EOL) + 1);
          splitterByLines.call(this,this.accumulator);
        }
      } else {
        if (this.prevLine !== '') {
          this.prevLine += string;
        } else {
          this.prevLine = string;
        }
      }
    }

    splitterByLines.call(this, chunk.toString(this.encoding));

    callback(null);
  }

  _flush(callback) {
    callback(null, this.prevLine);
    this.prevLine = '';
  }
}

module.exports = LineSplitStream;
