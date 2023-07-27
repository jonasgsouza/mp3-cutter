const fs = require("fs")
const Duration = require('./duration.js');
const { Duplex } = require("stream")

class Cutter {

    /**
     * @param {{input?:Buffer|string, start:Number, end:Number}} options
     * @returns {Buffer}
     */
    static cut(options) {
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
}

class MP3Cutter extends Duplex {

    /**
     * @type {Buffer}
     */
    streamData = Buffer.alloc(0);

    /**
     * @type {{input?:Buffer|string, start:Number, end:Number}}
     */
    options = {};

    /**
     * @type {Buffer}
     */
    audioBuffer;

    /**
     * Cuts mp3 files and creates a new file with it.
     * 
     * @param {{input?: Buffer|string, start:Number, end:Number}} options
     */
    constructor(options) {
        super();
        this.options = options;
    }

    _read(size) { }

    _write(chunk, enconding, callback) {
        this.streamData = Buffer.concat([this.streamData, chunk], this.streamData.length + chunk.length);
        callback();
    }

    _final(callback) {
        this.push(Cutter.cut({
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
        fs.writeFileSync(dest, Cutter.cut(this.options));
    }

    /**
     * 
     * @returns {Buffer}
     */
    toBuffer() {
        return Cutter.cut(this.options);
    }
}

module.exports = MP3Cutter;