export type rawHttpRequestData = {
  headers: Record<string, string>;
  remoteAddress: string;
  method: string;
  url: string;
};

export type parsedHttpRequestData = {
  headers: Record<string, string>;
  remoteAddress: string;
  method: string;
  pathname: string;
  searchParams: URLSearchParams;
};
export type RequestResponse = {
  statusCode: number;
  body: string;
  headers: Record<string, string>;
};

export type User = {
  username: string;
  password: string;
};
