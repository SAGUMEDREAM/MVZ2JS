export class EventConstructor {
    fn;
    constructor(fn) {
        this.fn = fn;
    }
    addTask(l,fn) {
        l.add(fn);
    }
    run(l) {
        this.fn(l);
    }
}