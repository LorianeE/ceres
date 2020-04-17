import {BodyParams, Controller, Get, PathParams, Put, Status} from "@tsed/common";
import {ShoppingList} from "../models/ShoppingList";
import {Product} from "../models/Product";
import {ShoppingItem} from "../models/ShoppingItem";
import {ShoppingListService} from "../services/ShoppingListService";

const shoppingList = new ShoppingList(
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

@Controller("/shoppingLists")
export class ProductsController {
  constructor(private shoppingListService: ShoppingListService) {
  }

  @Get("/:id")
  async get(@PathParams("id") id: string): Promise<ShoppingList> {
    const shoppingList = await this.shoppingListService.find(id);
    if (!shoppingList) {
      throw Error("Could not find shopping list");
    }

    return shoppingList;
  }

  @Put("/:id")
  @Status(204)
  async update(@PathParams("id") id: string, @BodyParams() shoppingList: ShoppingList) {
    shoppingList = {
      _id: id,
      ...shoppingList
    };

    try {
      await this.shoppingListService.save(shoppingList);
    } catch (e) {
      console.log(e);
    }
  }
}
