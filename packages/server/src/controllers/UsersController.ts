import {Controller} from "@tsed/common";
import {ShoppingListsController} from "./ShoppingListsController";
import {UserProductsController} from "./UserProductsController";
import {StoreController} from "./StoreController";

@Controller({
  path: "/users",
  children: [ShoppingListsController, UserProductsController, StoreController]
})
export class UsersController {}
