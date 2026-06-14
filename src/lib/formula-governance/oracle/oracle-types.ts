export class OracleValidationError extends Error {
  readonly code: string;

  constructor(code = "ORACLE_UNAVAILABLE", message = "Oracle unavailable during regeneration.") {
    super(message);
    this.name = "OracleValidationError";
    this.code = code;
  }
}
