declare module 'mp3-cutter' {
    class MP3Cutter {

        constructor(options: { input: Buffer | string, start: number, end: number });

        toFile(dest: string): void;

        toBuffer(): Buffer;
    }

    declare function cutMP3(options: { input: Buffer | string, start: number, end: number }): MP3Cutter;
}