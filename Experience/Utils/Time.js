import { EventEmitter } from "events";

export default class Time extends EventEmitter{
    // Variaveis
    constructor() {
        super();
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;

        this.update();
    }

    // Functions or Methods
    update() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        // console.log(this.delta);
        this.emit("update");
        window.requestAnimationFrame(() => this.update());
    }
}