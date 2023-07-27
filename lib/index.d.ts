declare class MP3Cutter {

    constructor(options: { input: Buffer | string, start: number, end: number });

    toFile(dest: string): void;

    toBuffer(): Buffer;
}

declare module 'mp3-cutter' {
    export = MP3Cutter
}