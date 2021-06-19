import fs from 'fs';

export class CronStringStore {
    private readonly file: string = "cron.json";

    public init(): void {
        if (!fs.existsSync(this.file)) {
            this.writeCronStrings([]);
        }
    }

    public writeCronStrings(cronStrings: string[]): void {
        const data = JSON.stringify(cronStrings);
        fs.writeFileSync(this.file, data);
    }

    public getCronStrings(): string[] {
        const data = fs.readFileSync(this.file);
        return JSON.parse(data.toString());
    }
}