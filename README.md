### This is a fork from the original [project](https://github.com/cevadtokatli/mp3-cutter) created by cevadtokatli

# MP3 Cutter
MP3 Cutter is a JavaScript library and a NodeJS module that allows you to cut your MP3 files by seconds.

## Usage

```
const { cutMP3 } = require('mp3-cutter');

cutMP3({
    input: 'source.mp3',
    start: 25,
    end: 70 
}).toFile('target.mp3');
```
It's possible to pass and receive a Buffer directly:

```
const { MP3Cutter } = require('mp3-cutter');
const fs = require('fs);

const buffer = cutMP3({
    input: fs.readFileSync('source.mp3'),
    start: 25,
    end: 70 
}).toBuffer();
```

And use it with streams. It's useful when your source it's not a file
```
const { MP3Cutter } = require('mp3-cutter');
const fs = require('fs);

fs.createReadStream('source.mp3')
    .pipe(cutMP3({
        start,
        end
    }))
    .pipe(fs.createWriteStream('target.mp3'))
    .on('finish', () => console.log('finished!'))
    .on('error', error => console.error('Error!'))
```

### Reference
##### ```constructor(options: Options)```

#### Options

##### ```input: Buffer|string```
Path to the file to be cut or a Buffer.

##### ```start: Number```
Start position in seconds.

##### ```end: Number```
End position in seconds.

### Methods
#### ```toFile(dest: string)```
Write the output to a file

#### ```toBuffer()```
Return the output Buffer

## License
MP3 Cutter is provided under the [MIT License](https://opensource.org/licenses/MIT).