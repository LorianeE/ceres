import {
  Enum,
  Required
} from "@tsed/common";

export class Product {
  @Required()
  id: string;

  @Required()
  label: string;

  @Required()
  @Enum("cold", "drinks", "produce")
  shelf: string;

  constructor(id: string, label: string, shelf: string) {
    this.id = id;
    this.label = label;
    this.shelf = shelf;
  }
}
