import EventEmitter from "node:events";
import { emitKeypressEvents } from "node:readline";
import type { KeypressEvent, TConsoleThread } from "./types.js";



/**
 * Console thread
 */
export class ConsoleThread extends EventEmitter implements TConsoleThread{
    name: string;
    loopInterval: number;
    timer: ReturnType<typeof setInterval> | null = null;

    /**
     * @param {object} options
     * @param {Gateway} options.parentThread The parent thread
     * @param {ServerLogger} options.log The logger
     */
    constructor() {
        super();
        this.name = "ReadInput";
        this.loopInterval = 100;
        this.init();
    }



    init() {
        this.emit("initialized");
        this.timer = setInterval(this.run.bind(this), this.loopInterval);
        emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        console.info("GatewayServer started");
        console.info("Press x to quit");

        process.stdin.resume();
        process.stdin.on("keypress", (str, key) => {
            if (key !== undefined) {
                this.handleKeypressEvent(key as KeypressEvent);
            }
        });

    }

    shutdown() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.emit("shutdownComplete");
    }

    handleKeypressEvent(key: KeypressEvent) {
        const keyString = key.sequence;

        if (keyString === "x") {
            this.emit("userExit");
        }

        if (keyString === "r") {
            this.emit("userRestart");
        }

        if (keyString === "?") {
            this.emit("userHelp");
        }
    }

    run() {
        // Intentionally left blank
    }

    stop() {
        // Remove all listeners from stdin, preventing further input
        process.stdin.removeAllListeners("keypress");
        process.stdin.pause();
        this.shutdown();
    }
}