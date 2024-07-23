export interface NodeServer {
  listen(port: number): Promise<void>;
  close(): Promise<void>;
}

export interface KeypressEvent {
    sequence: string;
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}

export type TConsoleThread = {
    handleKeypressEvent: (key: KeypressEvent) => void;
    init: () => void;
    run: () => void;
    stop: () => void;
    on: (event: string, callback: () => void) => void;
};
