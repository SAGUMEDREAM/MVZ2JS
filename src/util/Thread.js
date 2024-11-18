export class Thread {
    constructor() {
    }
    async createPromise() {
        return await this.run();
    }
    async run() {
        return {};
    }
}