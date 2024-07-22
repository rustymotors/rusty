import net from "node:net";
import type { NodeServer } from "./types.js";

export class WrappedServer implements NodeServer {
  constructor(private server: net.Server) {}

  /**
   * Starts the server and listens on the specified port.
   * @param port - The port number to listen on.
   * @returns A promise that resolves when the server has started listening.
   */
  async listen(port: number) {
    return new Promise<void>((resolve, reject) => {
      this.server.listen(port, "0.0.0.0", () => {
        if (this.server.listening) {
          resolve();
        }
        reject(new Error("Server failed to start listening"));
      });
    });
  }

  /**
   * Closes the server.
   * @returns A promise that resolves when the server is closed, or rejects with an error if an error occurs.
   */
  async close() {
    return new Promise<void>((resolve, reject) => {
      if (!this.server.listening) {
        resolve();
        return;
      }
      this.server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
