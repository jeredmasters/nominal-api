export enum ERROR_TYPE {
  NOT_FOUND = "NOT_FOUND",
  BAD_INPUT = "BAD_INPUT",
  NOT_ALLOWED = "NOT_ALLOWED",
  NOT_AUTHORIZED = "NOT_AUTHORIZED",
  UNKOWN = "UNKOWN"
}

export enum ERROR_PATTERN {
  PERMENANT = 'PERMENANT',
  TEMPORARY = 'TEMPORARY'
}

export interface IInternalError {
  func: string;
  code: string;
  type: ERROR_TYPE;
  pattern?: ERROR_PATTERN;
  context?: string;
  meta?: any;
  inner?: any;
}

export class InternalError implements IInternalError {
  func: string;
  code: string;
  type: ERROR_TYPE;
  pattern: ERROR_PATTERN;
  context?: string;
  meta?: any;
  inner?: any;

  constructor(data: IInternalError) {
    this.pattern = ERROR_PATTERN.PERMENANT;
    for (const k of Object.keys(data)) {
      this[k] = data[k];
    }
  }
}
