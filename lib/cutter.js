const fs = require('fs');
const Duration = require('./duration.js');

class MP3Cutter {
    /**
     * Cuts mp3 files and creates a new file with it.
     * 
     * @param {{data:Buffer, start:Number, end:Number}} options
     * @returns {Buffer}
     */
    static cut(options = {}) {
        const data = options.data,
            size = options.data.length,
            { duration, offset } = Duration.getDuration(data),
            startTime = options.start || 0,
            endTime = options.end || duration,
            valuePerSecond = (size - offset) / duration,
            start = startTime * valuePerSecond,
            end = endTime * valuePerSecond;

        const audioLength = end - start
        const offsetEnd = offset * 2
        const resultBuffer = Buffer.alloc(offset + audioLength)

        data.copy(resultBuffer, 0, offset, offsetEnd)
        data.copy(resultBuffer, offsetEnd + 1, start + offset, audioLength)

        return resultBuffer

        // const offsetBuffer = Buffer.alloc(offset);
        // data.copy(offsetBuffer, 0, offset, parseInt(offset * 2))

        // const audioBuffer = Buffer.alloc(end - start)
        // data.copy(audioBuffer, 0, parseInt(start + offset), audioBuffer.length)

        // return Buffer.concat([offsetBuffer, audioBuffer], offsetBuffer.length + audioBuffer.length)
    }
}

module.exports = MP3Cutter;