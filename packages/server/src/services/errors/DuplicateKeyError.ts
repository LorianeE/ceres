import {BadRequest} from "@tsed/exceptions";

export class DuplicateKeyError extends BadRequest {
  static from(mongooseError: any): DuplicateKeyError {
    return new DuplicateKeyError(mongooseError.errmsg, mongooseError);
  }
}
