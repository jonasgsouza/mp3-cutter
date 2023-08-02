const fs = require("fs")
const Duration = require('./duration.js');
const { Transform } = require("stream")

function _cut(options) {
    if (!options.input) {
        throw new Error("options.input not defined");
    }

    let data = options.input;
    if (typeof data == 'string') {
        data = fs.readFileSync(data);
    }

    const size = data.length,
        { duration, offset } = Duration.getDuration(data),
        startTime = options.start || 0,
        endTime = options.end && options.end < duration ? options.end : duration,
        valuePerSecond = (size - offset) / duration,
        start = startTime * valuePerSecond,
        end = endTime * valuePerSecond;

    const audioEnd = parseInt(end);
    const offsetEnd = offset * 2;
    const audioBuffer = Buffer.alloc(offset + audioEnd);

    data.copy(audioBuffer, 0, offset, offsetEnd);
    data.copy(audioBuffer, offsetEnd, parseInt(start + offset), audioEnd);

    return audioBuffer;
}

class MP3Cutter extends Transform {

    /**
     * @type {Buffer}
     */
    streamData = Buffer.alloc(0);

    /**
     * @type {{input?:Buffer|string, start:Number, end:Number}}
     */
    options = {};

    /**
     * Cuts mp3 files and creates a new file with it.
     * 
     * @param {{input?: Buffer|string, start:Number, end:Number}} options
     */
    constructor(options) {
        super();
        this.options = options;
    }

    _transform(chunk, enconding, callback) {
        this.streamData = Buffer.concat([this.streamData, chunk], this.streamData.length + chunk.length);
        callback();
    }

    _final(callback) {
        this.push(_cut({
            input: this.streamData,
            start: this.options.start,
            end: this.options.end
        }));
        this.push(null);
        callback();
    }

    /**
     * 
     * @param {string} dest
     */
    toFile(dest) {
        fs.writeFileSync(dest, _cut(this.options));
    }

    /**
     * 
     * @returns {Buffer}
     */
    toBuffer() {
        return _cut(this.options);
    }
}

function cutMP3(options) {
    return new MP3Cutter(options);
}

module.exports = cutMP3;