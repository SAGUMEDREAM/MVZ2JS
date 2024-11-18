export class Events {
    static events = {};
    static {}
    static getEvent(event) {
        if(Events.events[event] != null) {
            return Events.events[event];
        } else {
            return () => {}
        }
    }
}