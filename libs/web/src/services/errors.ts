export class ErrorMissingCredentials extends Error {
  name = "ErrorMissingCredentials";

  constructor(message: string) {
    super(message);
    this.name = "ErrorMissingCredentials";
  }
}

export class ErrorUserExists extends Error {
  name = "ErrorUserExists";

  constructor(message: string) {
    super(message);
    this.name = "ErrorUserExists";
  }
}

export class ErrorUserNotFound extends Error {
  name = "ErrorUserNotFound";
}
