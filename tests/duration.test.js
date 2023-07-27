const fs = require('fs');
const path = require('path');
const Duration = require('../lib/duration.js');

const files = [
    { name: 'sound1.mp3', duration: 121, start: 26, end: 46, newDuration: 20 },
    { name: 'sound2.mp3', duration: 242, start: 50, end: 85, newDuration: 35 }
];

describe('duration', () => {
    test("values returning from the 'getDuration' method should be equal to the ones in the array", () => {
        files.forEach(f => {
            const data = fs.readFileSync(path.resolve('tests', 'files', f.name))
            const d = Duration.getDuration(data);
            expect(f.duration).toEqual(parseInt(d.duration));
        });
    })
});