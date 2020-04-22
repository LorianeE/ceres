import {BadRequest} from "ts-httpexceptions";

export class DuplicateKeyError extends BadRequest {
  static from(mongooseError: any) {
    return new DuplicateKeyError(
        mongooseError.errmsg,
        mongooseError
    );
  }
}
