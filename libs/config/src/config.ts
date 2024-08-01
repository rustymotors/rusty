export function getServerURL(): string {
  const serverURL = process.env.SERVER_URL ?? "https://rusty-motors.com";
  return serverURL;
}
