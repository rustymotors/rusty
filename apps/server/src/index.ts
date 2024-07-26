// IMPORTANT: Make sure to import `instrument.js` at the top of your file.
// If you're using ECMAScript Modules (ESM) syntax, use `import "./instrument.js";`
void import ("./instrument.js");

// All other imports below
import * as Sentry from "@sentry/node";
import { ServerController } from "./ServerController.js";

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    Sentry.captureException(reason as Error);
    process.exit(1);
    })

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception thrown", error);
    Sentry.captureException(error);
    process.exit(1);
    })  

function main() {
    const serverController = new ServerController();
    void serverController.start();
}

main();

