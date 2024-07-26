export function headersToRecords(
  headers: import("node:http").IncomingHttpHeaders
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      result[key] = value.join(", ");
    } else if (typeof key === "string" && typeof value === "string") {
      result[key] = value;
    }
  }
  return result;
}
