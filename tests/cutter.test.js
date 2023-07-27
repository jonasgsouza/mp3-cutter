const fs = require('fs');
const path = require('path');
const Duration = require('../lib/duration.js');
const MP3Cutter = require('../lib/index.js')

const files = [
    { name: 'sound1.mp3', duration: 121, start: 26, end: 46, newDuration: 20 },
    { name: 'sound2.mp3', duration: 242, start: 50, end: 85, newDuration: 35 }
];
const cuttedFilesDir = path.resolve('tests', 'files', 'cut');

beforeEach(() => {
    if (!fs.existsSync(cuttedFilesDir)) {
        fs.mkdirSync(cuttedFilesDir);
    }
})


describe('cutter', () => {
    test('after the cutting opeartion, the duration of the new files should be equal to the ones in the array', () => {
        files.forEach(f => {
            new MP3Cutter({
                input: path.resolve('tests', 'files', f.name),
                start: f.start,
                end: f.end
            }).toFile(path.resolve(cuttedFilesDir, f.name));

            const data = fs.readFileSync(path.resolve(cuttedFilesDir, f.name));
            const d = Duration.getDuration(data);
            expect(f.newDuration).toEqual(parseInt(d.duration));
        });
    });

    test('after the cutting opeartion, the duration of the new files should be equal to the ones in the array using stream', done => {
        expect.hasAssertions();

        files.forEach(f => {
            fs.createReadStream(path.resolve('tests', 'files', f.name))
                .pipe(new MP3Cutter({
                    start: f.start,
                    end: f.end
                }))
                .pipe(fs.createWriteStream(path.resolve(cuttedFilesDir, f.name)))
                .on('finish', () => {
                    const data = fs.readFileSync(path.resolve(cuttedFilesDir, f.name));
                    const d = Duration.getDuration(data);
                    expect(f.newDuration).toEqual(parseInt(d.duration));
                    done();
                })
                .on('error', error => {
                    done(error);
                })
        });
    });
});