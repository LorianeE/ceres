import {BodyParams, Controller, Get, PathParams, Put, Status} from "@tsed/common";
import {ShoppingList} from "../models/ShoppingList";
import {Product} from "../models/Product";
import {ShoppingItem} from "../models/ShoppingItem";

const shoppingList = new ShoppingList(
  "1",
  [
    new ShoppingItem(
      new Product("baconStrips", "Lardons", "cold"),
      2
    ),
    new ShoppingItem(
      new Product("cider", "Cidre", "drinks"),
      1
    ),
    new ShoppingItem(
      new Product("apple", "Pommes", "produce"),
      4
    ),
    new ShoppingItem(
      new Product("pear", "Poires", "produce"),
      3
    ),
    new ShoppingItem(
      new Product("pineapple", "Ananas", "produce"),
      1
    ),
    new ShoppingItem(
      new Product("bigCreamJar", "Gros pot de crème", "cold"),
      1
    ),
    new ShoppingItem(
      new Product("smokedHam-4", "Jambon fumé - 4 tranches", "cold"),
      1
    )
  ]
);

// const shoppingList = [
//   {
//     "id": "baconStrips",
//     "label": "Lardons",
//     "quantity": 2,
//     "shelf": "cold"
//   },
//   {
//     "id": "cider",
//     "label": "Cidre",
//     "quantity": 1,
//     "shelf": "drinks"
//   },
//   {
//     "id": "apple",
//     "label": "Pommes",
//     "quantity": 4,
//     "shelf": "produce"
//   },
//   {
//     "id": "pear",
//     "label": "Poires",
//     "quantity": 3,
//     "shelf": "produce"
//   },
//   {
//     "id": "pineapple",
//     "label": "Ananas",
//     "quantity": 1,
//     "shelf": "produce"
//   },
//   {
//     "id": "bigCreamJar",
//     "label": "Gros pot de crème",
//     "quantity": 1,
//     "shelf": "cold"
//   },
//   {
//     "id": "smokedHam-4",
//     "label": "Jambon fumé - 4 tranches",
//     "quantity": 1,
//     "shelf": "cold"
//   }
// ];

@Controller("/shoppingLists")
export class ProductsController {
  @Get("/:id")
  async get(@PathParams("id") id: string): Promise<ShoppingList> {
    if (id === "1") {
      return shoppingList;
    }

    return shoppingList;
  }
  @Put("/:id")
  @Status(204)
  update(@PathParams("id") id: string, @BodyParams() body: ShoppingList): void {
    console.log(body);
  }
}
