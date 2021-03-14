import {Minimum} from "@tsed/schema";

export class PostMoveItemToStore {
  @Minimum(1)
  quantityToMove: number;
}
