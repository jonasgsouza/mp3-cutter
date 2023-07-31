class MP3Cutter {

    constructor(options: { input: Buffer | string, start: number, end: number });

    toFile(dest: string): void;

    toBuffer(): Buffer;
}

declare module 'mp3-cutter' {
    declare function cutMP3(options: { input: Buffer | string, start: number, end: number }): MP3Cutter;
}