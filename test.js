const fs = require("fs")
const path = require("path")
const MP3Cutter = require("./lib/cutter")

function testOffset() {
    const buffer = Buffer.alloc(20).fill("!")
    const anotherBuffer = Buffer.alloc(10)
    const offset = 10
    buffer.copy(anotherBuffer, 0, offset, offset * 2)
    console.log("buffer", buffer.length)
    console.log("anotherBuffer", anotherBuffer.length)
    console.log(anotherBuffer.toString())
}

function testMp3CutterFile(start, end) {
    new MP3Cutter({
        input: path.resolve("so-no-cut.mp3"),
        start,
        end
    }).toFile(path.resolve("cut.mp3"))
}

function testMp3CutterStream(start, end) {
    fs.createReadStream(path.resolve("so-no-cut.mp3"))
        .pipe(new MP3Cutter({
            input: path.resolve("so-no-cut.mp3"),
            start,
            end
        }))
        .pipe(fs.createWriteStream(path.resolve("cut.mp3")))
}

// testMp3CutterFile(0, 4)
// testMp3CutterFile(2, 4)
// testMp3CutterFile(6, 8)
// testMp3CutterFile(0, 2)
testMp3CutterStream(0, 4)